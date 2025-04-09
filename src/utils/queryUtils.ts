import type { Metric, Dimension, TableRow, Filter } from "../types"
export function generateSqlQuery(
  tableName: string,
  aggregation: string,
  selectedMetrics: Metric[],
  selectedDimensions: Dimension[] = [],
  filters: Filter[] = []
): string {
  if (selectedMetrics.length === 0 && selectedDimensions.length === 0) {
    return "-- Select metrics or dimensions to generate a query"
  }

  let query = "SELECT "

  // Always include id field first
  query += "id, "

  if (selectedDimensions.length > 0) {
    const dimensionFields = selectedDimensions.map((dim) => dim.value).join(", ")
    query += dimensionFields
    if (selectedMetrics.length > 0) {
      query += ", "
    }
  }

  if (selectedMetrics.length > 0) {
    const metricFields = selectedMetrics
      .map((metric) => `${aggregation}(${metric.value}) AS ${metric.value}`)
      .join(", ")
    query += metricFields
  }

  query += `\nFROM ${tableName}`

  // Add WHERE clause if filters exist
  if (filters.length > 0) {
    const filterClauses = filters.map(filter => {
      if (filter.operator === 'LIKE') {
        return `${filter.field} LIKE '${filter.value}'`;
      }
      return `${filter.field} ${filter.operator} '${filter.value}'`;
    });
    
    query += `\nWHERE ${filterClauses.join('\nAND ')}`;
  }

  // Add GROUP BY clause if dimensions are selected
  if (selectedDimensions.length > 0) {
    query += `\nGROUP BY ${selectedDimensions.map((dim) => dim.value).join(", ")}`;
  }

  return query;
}

export function filterTableData(
  data: TableRow[],
  selectedMetrics: Metric[],
  selectedDimensions: Dimension[] = [],
): TableRow[] {
  if (selectedMetrics.length === 0 && selectedDimensions.length === 0) {
    return []
  }

  return data.filter((row) => {
    // Check if row has at least one of the selected metrics
    const metricsMatch =
      selectedMetrics.length === 0 ||
      selectedMetrics.some((metric) => row[metric.value as keyof typeof row] !== undefined)

    // Check if row has all of the selected dimensions
    const dimensionsMatch =
      selectedDimensions.length === 0 ||
      selectedDimensions.every((dimension) => row[dimension.value as keyof typeof row] !== undefined)

    return metricsMatch && dimensionsMatch
  })
}

// Add SQL query parser and executor
export function parseSQLQuery(query: string) {
  const queryParts = {
    select: [] as string[],
    from: '',
    where: [] as Array<{field: string, operator: string, value: string}>,
    groupBy: [] as string[],
    aggregations: [] as Array<{field: string, func: string, alias: string}>
  };

  // Parse SELECT clause
  const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
  if (selectMatch) {
    const selectFields = selectMatch[1].split(',').map(f => f.trim());
    selectFields.forEach(field => {
      // Check for aggregations like MAX(field) AS alias
      const aggMatch = field.match(/(\w+)\((.*?)\)(?:\s+AS\s+(\w+))?/i);
      if (aggMatch) {
        queryParts.aggregations.push({
          func: aggMatch[1].toLowerCase(),
          field: aggMatch[2].trim(),
          alias: aggMatch[3] || aggMatch[2].trim()
        });
      } else {
        queryParts.select.push(field);
      }
    });
  }

  // Parse FROM clause
  const fromMatch = query.match(/FROM\s+(\w+)/i);
  if (fromMatch) {
    queryParts.from = fromMatch[1];
  }

  // Parse WHERE clause
  const whereMatch = query.match(/WHERE\s+(.*?)(?:\s+GROUP BY|$)/i);
  if (whereMatch) {
    const conditions = whereMatch[1].split(/\s+AND\s+/i);
    conditions.forEach(condition => {
      const [field, operator, ...valueParts] = condition.trim().split(/\s+/);
      const value = valueParts.join(' ').replace(/['"]/g, '');
      queryParts.where.push({ field, operator, value });
    });
  }

  // Parse GROUP BY clause
  const groupByMatch = query.match(/GROUP BY\s+(.*?)$/i);
  if (groupByMatch) {
    queryParts.groupBy = groupByMatch[1].split(',').map(f => f.trim());
  }

  return queryParts;
}

export function executeQuery(query: string, data: TableRow[]): TableRow[] {
  const parsedQuery = parseSQLQuery(query);
  let result = [...data];

  // Map old field names to new ones
  const fieldMapping: { [key: string]: string } = {
    'sales': 'revenue'
  };

  // Apply field mapping to aggregations
  parsedQuery.aggregations = parsedQuery.aggregations.map(agg => ({
    ...agg,
    field: fieldMapping[agg.field] || agg.field
  }));

  // Apply WHERE filters
  if (parsedQuery.where.length > 0) {
    result = result.filter(row => {
      return parsedQuery.where.every(condition => {
        const fieldValue = String(row[condition.field as keyof TableRow] || '');
        const compareValue = condition.value;

        switch (condition.operator.toUpperCase()) {
          case '=':
            return fieldValue === compareValue;
          case '>':
            return Number(fieldValue) > Number(compareValue);
          case '<':
            return Number(fieldValue) < Number(compareValue);
          case 'LIKE':
            const pattern = compareValue.replace(/%/g, '.*');
            return new RegExp(pattern).test(fieldValue);
          default:
            return true;
        }
      });
    });
  }

  // Apply GROUP BY and aggregations
  // When creating the grouped result
  if (parsedQuery.groupBy.length > 0) {
    const grouped = new Map<string, any>();
    
    result.forEach(row => {
      const groupKey = parsedQuery.groupBy.map(field => row[field as keyof TableRow]).join('|');
      
      if (!grouped.has(groupKey)) {
        const newRow: any = {
          id: row.id  // Always include id
        };
        // Add group by fields
        parsedQuery.groupBy.forEach(field => {
          newRow[field] = row[field as keyof TableRow];
        });
        // Initialize aggregations
        parsedQuery.aggregations.forEach(agg => {
          const fieldName = fieldMapping[agg.field] || agg.field;
          newRow[agg.alias] = row[fieldName as keyof TableRow];
        });
        grouped.set(groupKey, newRow);
      } else {
        const existingRow = grouped.get(groupKey);
        // Apply aggregations
        parsedQuery.aggregations.forEach(agg => {
          const fieldName = fieldMapping[agg.field] || agg.field;
          const value = row[fieldName as keyof TableRow];
          switch (agg.func) {
            case 'max':
              existingRow[agg.alias] = Math.max(existingRow[agg.alias], value);
              break;
            case 'min':
              existingRow[agg.alias] = Math.min(existingRow[agg.alias], value);
              break;
            case 'sum':
              existingRow[agg.alias] = (existingRow[agg.alias] || 0) + value;
              break;
            case 'count':
              existingRow[agg.alias] = (existingRow[agg.alias] || 0) + 1;
              break;
            case 'avg':
              if (!existingRow[`${agg.alias}_sum`]) {
                existingRow[`${agg.alias}_sum`] = value;
                existingRow[`${agg.alias}_count`] = 1;
              } else {
                existingRow[`${agg.alias}_sum`] += value;
                existingRow[`${agg.alias}_count`] += 1;
              }
              existingRow[agg.alias] = existingRow[`${agg.alias}_sum`] / existingRow[`${agg.alias}_count`];
              break;
          }
        });
      }
    });

    result = Array.from(grouped.values());
  }

  return result;
}

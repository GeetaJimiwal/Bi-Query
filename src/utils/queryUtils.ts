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

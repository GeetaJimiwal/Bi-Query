// import { Dimension, TableRow } from '../types';

// export const filterTableData = (data: TableRow[], metrics: Dimension[], dimensions: Dimension[]): TableRow[] => {
//   try {
//     if (!data || !data.length) return [];
    
//     // Base columns that should always be included
//     const baseColumns = ['id', 'month', 'product', 'region'];
    
//     // Get fields based on active selection
//     const selectedFields = metrics.length > 0 ? metrics : dimensions;
//     const keepFields = [...baseColumns, ...selectedFields.map(field => field.value)];
    
//     // Return data with only selected fields
//     return data.map(row => {
//       const filteredRow: TableRow = {} as TableRow;
//       keepFields.forEach(field => {
//         if (field in row) {
//           filteredRow[field] = row[field];
//         }
//       });
//       return filteredRow;
//     });
//   } catch (error) {
//     console.error('Error filtering data:', error);
//     return [];
//   }
// };
import type { Metric, Dimension, TableRow } from "../types"

/**
 * Generates a SQL query string based on selected metrics and dimensions
 */
export function generateSqlQuery(
  tableName: string,
  aggregation: string,
  selectedMetrics: Metric[],
  selectedDimensions: Dimension[] = [],
): string {
  if (selectedMetrics.length === 0) {
    return "-- Select metrics to generate a query"
  }

  const metricFields = selectedMetrics.map((metric) => `${aggregation}(${metric.value}) AS ${metric.value}`).join(", ")

  let query = `SELECT ${metricFields}`

  if (selectedDimensions.length > 0) {
    const dimensionFields = selectedDimensions.map((dim) => dim.value).join(", ")
    query += `, ${dimensionFields}`
  }

  query += `\nFROM ${tableName}`

  if (selectedDimensions.length > 0) {
    query += `\nGROUP BY ${selectedDimensions.map((dim) => dim.value).join(", ")}`
  }

  return query
}

/**
 * Filters table data based on selected metrics and dimensions
 */
export function filterTableData(
  data: TableRow[],
  selectedMetrics: Metric[],
  selectedDimensions: Dimension[] = [],
): TableRow[] {
  if (selectedMetrics.length === 0) {
    return []
  }

  return data
}

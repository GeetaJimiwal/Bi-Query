export type TableOption = {
  value: string
  label: string
}

export type AggregationOption = {
  value: string
  label: string
}

export type Metric = {
  value: string
  label: string
  type: string
}

export type Dimension = {
  value: string
  label: string
  type?: string
}

export type TableRow = {
  id: number
  [key: string]: any
}

// Add these new types
export type FilterOperator = '=' | '>' | '<' | '>=' | '<=' | 'LIKE';

export interface Filter {
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface SavedQuery {
    id: number
    query: string
    metrics: Metric[]
    dimensions: Dimension[]
    timestamp: string
    tableName: string
    aggregation: string
}

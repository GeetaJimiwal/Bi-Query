import type { TableOption, AggregationOption, Metric, TableRow } from "../types"

// Table options for dropdown
export const tableOptions: TableOption[] = [
  { value: "sales", label: "Sales" },
  { value: "inventory", label: "Inventory" },
  { value: "customers", label: "Customers" },
]

// Aggregation options for dropdown
export const aggregationOptions: AggregationOption[] = [
  { value: "sum", label: "SUM" },
  { value: "avg", label: "AVG" },
  { value: "count", label: "COUNT" },
  { value: "min", label: "MIN" },
  { value: "max", label: "MAX" },
]

// Metrics options for checkboxes
export const metricsOptions: Metric[] = [
  { value: "revenue", label: "Revenue", type: "currency" },
  { value: "profit", label: "Profit", type: "currency" },
  { value: "quantity", label: "Quantity", type: "number" },
  { value: "discount", label: "Discount", type: "percentage" },
]

// Dimensions options
export const dimensionsOptions = [
  { value: "product", label: "Product" },
  { value: "region", label: "Region" },
  { value: "month", label: "Month" },
  { value: "category", label: "Category" },
]

// Mock data for the results table
export const mockData: TableRow[] = [
  { id: 1, month: "Apr", product: "Product B", region: "East", sales: 8783.0, profit: 189.0, quantity: 47 },
  { id: 2, month: "Jun", product: "Product C", region: "South", sales: 367.0, profit: 3074.0, quantity: 2 },
  { id: 3, month: "Sep", product: "Product B", region: "South", sales: 7485.0, profit: 496.0, quantity: 18 },
  { id: 4, month: "Apr", product: "Product A", region: "North", sales: 8675.0, profit: 4825.0, quantity: 58 },
  { id: 5, month: "Sep", product: "Product C", region: "North", sales: 3342.0, profit: 3550.0, quantity: 91 },
  { id: 6, month: "Jun", product: "Product A", region: "West", sales: 7607.0, profit: 2198.0, quantity: 45 },
  { id: 7, month: "Jun", product: "Product B", region: "North", sales: 8457.0, profit: 550.0, quantity: 94 },
  { id: 8, month: "Dec", product: "Product C", region: "North", sales: 9962.0, profit: 4594.0, quantity: 63 },
]

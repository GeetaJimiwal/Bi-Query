import type { TableOption, AggregationOption, Metric, TableRow } from "../types"

// Table options for dropdown
export const tableOptions: TableOption[] = [
  { value: "sales", label: "Sales" },
  { value: "inventory", label: "Inventory" },
]

// Aggregation options for dropdown
export const aggregationOptions: AggregationOption[] = [
  { value: "sum", label: "SUM" },
  { value: "avg", label: "AVG" },
  { value: "count", label: "COUNT" },
  { value: "min", label: "MIN" },
  { value: "max", label: "MAX" },
]

// Common metrics for all tables
export const metricsOptions: Metric[] = [
  { value: "revenue", label: "Revenue", type: "currency" },
  { value: "profit", label: "Profit", type: "currency" },
  { value: "quantity", label: "Quantity", type: "number" },
  { value: "discount", label: "Discount", type: "percentage" },
]

// Common dimensions for all tables
export const dimensionsOptions = [
  { value: "product", label: "Product" },
  { value: "region", label: "Region" },
  { value: "month", label: "Month" },
  { value: "category", label: "Category" },
]

// Mock data for the results table - Sales data
export const salesData: TableRow[] = [
  {
    id: 1,
    month: "Apr",
    product: "rrrsB",
    region: "East",
    revenue: 8783.0,
    profit: 189.0,
    quantity: 47,
    discount: 10  // Add discount field
  },
  {
    id: 2,
    month: "Jun",
    product: "Product C",
    region: "South",
    revenue: 367.0,
    profit: 3074.0,
    quantity: 2,
    
  },
  {
    id: 3,
    month: "Sep",
    product: "Product B",
    region: "South",
    revenue: 7485.0,
    profit: 496.0,
    quantity: 18, 
  },
  {
    id: 4,
    month: "Apr",
    product: "Product A",
    region: "North",
    revenue: 8675.0,
    profit: 4825.0,
    quantity: 58,
     
  },
  {
    id: 5,
    month: "Sep",
    product: "Product C",
    region: "North",
    revenue: 3342.0,
    profit: 3550.0,
    quantity: 91,
     
  },
  {
    id: 6,
    month: "Jun",
    product: "Product A",
    region: "West",
    revenue: 7607.0,
    profit: 2198.0,
    quantity: 45,
    
  },
  {
    id: 7,
    month: "Jun",
    product: "Product B",
    region: "North",
    revenue: 8457.0,
    profit: 550.0,
    quantity: 94,
     
  },
  {
    id: 8,
    month: "Dec",
    product: "Product C",
    region: "North",
    revenue: 9962.0,
    profit: 4594.0,
    quantity: 63,
  },
  {
    id: 1,
    month: "Apr",
    product: "Product B",
    region: "East",
    revenue: 8783.0,
    profit: 189.0,
    quantity: 47,
 
  },
  {
    id: 2,
    month: "Jun",
    product: "Product C",
    region: "South",
    revenue: 367.0,
    profit: 3074.0,
    quantity: 2,
    
  },
  {
    id: 3,
    month: "Sep",
    product: "Product B",
    region: "South",
    revenue: 7485.0,
    profit: 496.0,
    quantity: 18, 
  },
  {
    id: 4,
    month: "Apr",
    product: "Product A",
    region: "North",
    revenue: 8675.0,
    profit: 4825.0,
    quantity: 58,
     
  },
  {
    id: 5,
    month: "Sep",
    product: "Product C",
    region: "North",
    revenue: 3342.0,
    profit: 3550.0,
    quantity: 91,
     
  },
  {
    id: 6,
    month: "Jun",
    product: "Product A",
    region: "West",
    revenue: 7607.0,
    profit: 2198.0,
    quantity: 45,
    
  },
  {
    id: 7,
    month: "Jun",
    product: "Product B",
    region: "North",
    revenue: 8457.0,
    profit: 550.0,
    quantity: 94,
     
  },
  {
    id: 8,
    month: "Dec",
    product: "Product C",
    region: "North",
    revenue: 9962.0,
    profit: 4594.0,
    quantity: 63,
  },
  {
    id: 1,
    month: "Apr",
    product: "eeeProduct B",
    region: "East",
    revenue: 8783.0,
    profit: 189.0,
    quantity: 47,
 
  },
  {
    id: 2,
    month: "Jun",
    product: "Product C",
    region: "South",
    revenue: 367.0,
    profit: 3074.0,
    quantity: 2,
    
  },
  {
    id: 3,
    month: "Sep",
    product: "Product B",
    region: "South",
    revenue: 7485.0,
    profit: 496.0,
    quantity: 18, 
  },
  {
    id: 4,
    month: "Apr",
    product: "Product A",
    region: "North",
    revenue: 8675.0,
    profit: 4825.0,
    quantity: 58,
     
  },
  {
    id: 5,
    month: "Sep",
    product: "Product C",
    region: "North",
    revenue: 3342.0,
    profit: 3550.0,
    quantity: 91,
     
  },
  {
    id: 6,
    month: "Jun",
    product: "Product A",
    region: "West",
    revenue: 7607.0,
    profit: 2198.0,
    quantity: 45,
    
  },
  {
    id: 7,
    month: "Jun",
    product: "Product B",
    region: "North",
    revenue: 8457.0,
    profit: 550.0,
    quantity: 94,
     
  },
  {
    id: 8,
    month: "Dec",
    product: "Product C",
    region: "North",
    revenue: 9962.0,
    profit: 4594.0,
    quantity: 63,
  },
]

// Mock data for inventory
export const inventoryData = [
  {
    id: 1,
    month: "Apr",
    product: "Product B",
    region: "East",
    revenue: 8783.0,
    profit: 189.0,
    quantity: 47,
 
  },
  {
    id: 2,
    month: "Jun",
    product: "Product C",
    region: "South",
    revenue: 367.0,
    profit: 3074.0,
    quantity: 2,
    
  },
  {
    id: 3,
    month: "Sep",
    product: "Product B",
    region: "South",
    revenue: 7485.0,
    profit: 496.0,
    quantity: 18, 
  },
  {
    id: 4,
    month: "Apr",
    product: "Product A",
    region: "North",
    revenue: 8675.0,
    profit: 4825.0,
    quantity: 58,
     
  },
  {
    id: 5,
    month: "Sep",
    product: "Product C",
    region: "North",
    revenue: 3342.0,
    profit: 3550.0,
    quantity: 91,
     
  },
  {
    id: 6,
    month: "Jun",
    product: "Product A",
    region: "West",
    revenue: 7607.0,
    profit: 2198.0,
    quantity: 45,
    
  },
  {
    id: 7,
    month: "Jun",
    product: "Product B",
    region: "North",
    revenue: 8457.0,
    profit: 550.0,
    quantity: 94,
     
  },
  {
    id: 8,
    month: "Dec",
    product: "Product C",
    region: "North",
    revenue: 9962.0,
    profit: 4594.0,
    quantity: 63,
  },
]

// Add pagination configuration
export const ITEMS_PER_PAGE = 10;

// Update revenueData and inventoryData structure
export interface PaginatedData {
  data: TableRow[];
  totalPages: number;
  currentPage: number;
}

// Add pagination helper function
export const getPaginatedData = (data: TableRow[], page: number): PaginatedData => {
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  return {
    data: data.slice(startIndex, endIndex),
    totalPages: Math.ceil(data.length / ITEMS_PER_PAGE),
    currentPage: page
  };
};

export const tableSpecificOptions = {
    sales: {
        metrics: [
            { value: "revenue", label: "Revenue", type: "currency" },
            { value: "profit", label: "Profit", type: "currency" },
            { value: "quantity", label: "Quantity", type: "number" },
            { value: "discount", label: "Discount", type: "percentage" }
        ],
        dimensions: [
            { value: "product", label: "Product" },
            { value: "region", label: "Region" },
            { value: "month", label: "Month" },
            { value: "category", label: "Category" }
        ]
    },
    inventory: {
        metrics: [
            { value: "quantity", label: "Stock Quantity", type: "number" },
            { value: "reorder_point", label: "Reorder Point", type: "number" },
            { value: "unit_cost", label: "Unit Cost", type: "currency" }
        ],
        dimensions: [
            { value: "product", label: "Product" },
            { value: "warehouse", label: "Warehouse" },
            { value: "category", label: "Category" }
        ]
    }
};

export const mockDataByTable = {
  sales: salesData,
  inventory: inventoryData,
};

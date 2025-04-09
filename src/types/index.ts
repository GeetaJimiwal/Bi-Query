

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
  }
  
  export type TableRow = {
    id: number
    month: string
    product: string
    region: string
    sales: number
    profit: number
    quantity: number
    [key: string]: any
  }
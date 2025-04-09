

"use client"

import { useState } from "react"

const ChevronDownIcon = () => (
    <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
        />
    </svg>
)
import type { Metric, Dimension } from "../types"
import { tableOptions, aggregationOptions, metricsOptions, dimensionsOptions, mockData } from "../data/mockData"
import { generateSqlQuery } from "../utils/queryUtils"
import { cn } from "../../lib/utils"

// Add new state for search
export default function QueryBuilder() {
    const [selectedTable, setSelectedTable] = useState<string>("Sales")
    const [selectedAggregation, setSelectedAggregation] = useState<string>("SUM")
    const [activeTab, setActiveTab] = useState<"metrics" | "dimensions">("metrics")
    // Change the initial state of selectedMetrics to empty array
    const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([])

    // Change the initial state of displayedTableData to empty array
    const [displayedTableData, setDisplayedTableData] = useState<typeof mockData>([])
    const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([])
    const [sqlQuery, setSqlQuery] = useState<string>("-- Select metrics to generate a query")
    const [viewMode, setViewMode] = useState<"table" | "chart">("table")
    const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false)
    const [isAggregationDropdownOpen, setIsAggregationDropdownOpen] = useState(false)
    const [metricSearch, setMetricSearch] = useState("")
    const [dimensionSearch, setDimensionSearch] = useState("")
    const [isMetricsDropdownOpen, setIsMetricsDropdownOpen] = useState(false)
    const [isDimensionsDropdownOpen, setIsDimensionsDropdownOpen] = useState(false)
    // Add these filter functions
    const filteredMetrics = metricsOptions.filter(metric =>
        metric.label.toLowerCase().includes(metricSearch.toLowerCase())
    )

    const filteredDimensions = dimensionsOptions.filter(dimension =>
        dimension.label.toLowerCase().includes(dimensionSearch.toLowerCase())
    )

    const filteredTableData = mockData.filter(row => {
        const metricsMatch = selectedMetrics.length === 0 ||
            selectedMetrics.some(metric => row[metric.value as keyof typeof row] !== undefined)

        const dimensionsMatch = selectedDimensions.length === 0 ||
            selectedDimensions.some(dimension => row[dimension.value as keyof typeof row] !== undefined)

        return metricsMatch && dimensionsMatch
    })

    // Modify the toggleMetric function
    const toggleMetric = (metric: Metric) => {
        let newMetrics;
        if (selectedMetrics.some((m) => m.value === metric.value)) {
            newMetrics = selectedMetrics.filter((m) => m.value !== metric.value);
        } else {
            newMetrics = [...selectedMetrics, metric];
        }
        setSelectedMetrics(newMetrics);

        // Update SQL query immediately
        const newQuery = generateSqlQuery(
            "sales",
            selectedAggregation.toLowerCase(),
            newMetrics,
            selectedDimensions
        );
        setSqlQuery(newQuery);
    }

    // Modify aggregation dropdown click handler
    {
        aggregationOptions.map((option) => (
            <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedAggregation === option.label ? 'bg-gray-50' : ''
                    }`}
                onClick={() => {
                    setSelectedAggregation(option.label);
                    setIsAggregationDropdownOpen(false);

                    const newQuery = generateSqlQuery(
                        "sales",
                        option.label.toLowerCase(),
                        selectedMetrics,
                        selectedDimensions
                    );
                    setSqlQuery(newQuery);
                }}
            >
                <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {selectedAggregation === option.label && (
                        <span className="text-blue-500">✓</span>
                    )}
                </div>
            </div>
        ))
    }
    // Modify the toggleDimension function
    const toggleDimension = (dimension: Dimension) => {
        let newDimensions;
        if (selectedDimensions.some((d) => d.value === dimension.value)) {
            newDimensions = selectedDimensions.filter((d) => d.value !== dimension.value);
        } else {
            newDimensions = [...selectedDimensions, dimension];
        }
        setSelectedDimensions(newDimensions);
    
        // Update SQL query immediately with new dimensions
        const newQuery = generateSqlQuery(
            "sales",
            selectedAggregation.toLowerCase(),
            selectedMetrics,
            newDimensions
        );
        setSqlQuery(newQuery);
    }
    
    // Update the generateSqlQuery function in utils/queryUtils.ts to include GROUP BY
    const generateSqlQuery = (
        table: string,
        aggregation: string,
        metrics: Metric[],
        dimensions: Dimension[]
    ) => {
        if (metrics.length === 0 && dimensions.length === 0) {
            return "-- Select metrics or dimensions to generate a query";
        }
    
        const dimensionCols = dimensions.map(d => d.value).join(", ");
        const metricCols = metrics
            .map(m => `${aggregation}(${m.value}) AS ${m.value}`)
            .join(", ");
    
        let query = `SELECT ${dimensionCols}`;
        if (dimensionCols && metricCols) query += ", ";
        if (metricCols) query += metricCols;
        query += `\nFROM ${table}`;
        
        // Add GROUP BY clause if dimensions are selected
        if (dimensions.length > 0) {
            query += `\nGROUP BY ${dimensionCols}`;
        }
    
        return query;
    }

    const removeMetric = (metric: Metric) => {
        setSelectedMetrics(selectedMetrics.filter((m) => m.value !== metric.value))
    }

    // Add new state for displayed table data
    // const [displayedTableData, setDisplayedTableData] = useState(mockData)

    // Modify the executeQuery function
    const executeQuery = () => {
        if (selectedMetrics.length === 0 && selectedDimensions.length === 0) {
            setSqlQuery("-- Select metrics to generate a query")
            setDisplayedTableData([])
            return
        }

        const query = generateSqlQuery(
            "sales",
            selectedAggregation.toLowerCase(),
            selectedMetrics,
            selectedDimensions
        )
        setSqlQuery(query)

        // Update table data based on active tab selections
        const newFilteredData = mockData.filter(row => {
            if (activeTab === "metrics") {
                return selectedMetrics.length === 0 ||
                    selectedMetrics.some(metric => row[metric.value as keyof typeof row] !== undefined)
            } else {
                return selectedDimensions.length === 0 ||
                    selectedDimensions.some(dimension => row[dimension.value as keyof typeof row] !== undefined)
            }
        })
        setDisplayedTableData(newFilteredData)
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2 font-medium">
                    <span>BI Query Builder</span>
                </div>
                <button onClick={executeQuery} className="bg-black text-white px-4 py-2 rounded font-medium">
                    Execute Query
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Panel */}
                <div className="w-[520px] border-r border-gray-200 p-6">
                    <h2 className="text-lg font-medium mb-6">Build Your Query</h2>

                    <div className="space-y-6">
                        {/* Table Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Table</label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
                                    className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
                                >
                                    <span>{selectedTable}</span>
                                    <ChevronDownIcon />
                                </button>
                                {isTableDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                        {tableOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedTable === option.label ? 'bg-gray-50' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedTable(option.label)
                                                    setIsTableDropdownOpen(false)
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {selectedTable === option.label && (
                                                        <span className="text-blue-500">✓</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Aggregation */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Aggregation</label>
                            <div className="relative">
                                <button
                                    onClick={() => setIsAggregationDropdownOpen(!isAggregationDropdownOpen)}
                                    className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
                                >
                                    <span>{selectedAggregation}</span>
                                    <ChevronDownIcon />
                                </button>
                                {isAggregationDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                        {aggregationOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedAggregation === option.label ? 'bg-gray-50' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedAggregation(option.label)
                                                    setIsAggregationDropdownOpen(false)
                                                    const newQuery = generateSqlQuery(
                                                        "sales",
                                                        option.label.toLowerCase(),
                                                        selectedMetrics,
                                                        selectedDimensions
                                                    )
                                                    setSqlQuery(newQuery)
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {selectedAggregation === option.label && (
                                                        <span className="text-blue-500">✓</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metrics/Dimensions Tabs */}
                        <div>
                            <div className="flex mb-4">
                                <button
                                    onClick={() => setActiveTab("metrics")}
                                    className={cn(
                                        "flex-1 py-2 text-center",
                                        activeTab === "metrics" ? "bg-gray-100 font-medium" : "bg-white",
                                    )}
                                >
                                    Metrics
                                </button>
                                <button
                                    onClick={() => setActiveTab("dimensions")}
                                    className={cn(
                                        "flex-1 py-2 text-center",
                                        activeTab === "dimensions" ? "bg-gray-100 font-medium" : "bg-white",
                                    )}
                                >
                                    Dimensions
                                </button>
                            </div>

                            {/* Metrics Options */}
                            {activeTab === "metrics" && (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsMetricsDropdownOpen(!isMetricsDropdownOpen)}
                                            className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
                                        >
                                            <span className="truncate">
                                                {selectedMetrics.length ? selectedMetrics.map(m => m.label).join(', ') : 'Select metrics'}
                                            </span>
                                            <ChevronDownIcon />
                                        </button>
                                        {isMetricsDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                                {metricsOptions.map((metric) => (
                                                    <div
                                                        key={metric.value}
                                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedMetrics.some((m) => m.value === metric.value) ? 'bg-gray-50' : ''
                                                            }`}
                                                        onClick={() => toggleMetric(metric)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="text-sm">{metric.label}</span>
                                                                <span className="ml-2 text-xs text-gray-500">({metric.type})</span>
                                                            </div>
                                                            {selectedMetrics.some((m) => m.value === metric.value) && (
                                                                <span className="text-blue-500">✓</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* {selectedMetrics.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedMetrics.map((metric) => (
                                                <div key={metric.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                                    <span className="text-sm">{metric.label}</span>
                                                    <button onClick={() => removeMetric(metric)} className="ml-1 text-gray-500 hover:text-gray-700">
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )} */}
                                </div>
                            )}

                            {/* Dimensions Options */}
                            {activeTab === "dimensions" && (
                                <div className="space-y-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsDimensionsDropdownOpen(!isDimensionsDropdownOpen)}
                                            className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
                                        >
                                            <span className="truncate">
                                                {selectedDimensions.length ? selectedDimensions.map(d => d.label).join(', ') : 'Select dimensions'}
                                            </span>
                                            <ChevronDownIcon />
                                        </button>
                                        {isDimensionsDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                                {dimensionsOptions.map((dimension) => (
                                                    <div
                                                        key={dimension.value}
                                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedDimensions.some((d) => d.value === dimension.value) ? 'bg-gray-50' : ''
                                                            }`}
                                                        onClick={() => toggleDimension(dimension)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm">{dimension.label}</span>
                                                            {selectedDimensions.some((d) => d.value === dimension.value) && (
                                                                <span className="text-blue-500">✓</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {/* {selectedDimensions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedDimensions.map((dimension) => (
                                                <div key={dimension.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                                    <span className="text-sm">{dimension.label}</span>
                                                    <button onClick={() => toggleDimension(dimension)} className="ml-1 text-gray-500 hover:text-gray-700">
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )} */}
                                </div>
                            )}
                        </div>

                        {/* Selected Items Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">
                                {activeTab === "metrics" ? "Selected Metrics:" : "Selected Dimensions:"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {activeTab === "metrics" ? (
                                    selectedMetrics.map((metric) => (
                                        <div key={metric.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                            <span className="text-sm">{metric.label}</span>
                                            <button onClick={() => removeMetric(metric)} className="ml-1 text-gray-500 hover:text-gray-700">
                                                ×
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    selectedDimensions.map((dimension) => (
                                        <div key={dimension.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                            <span className="text-sm">{dimension.label}</span>
                                            <button onClick={() => toggleDimension(dimension)} className="ml-1 text-gray-500 hover:text-gray-700">
                                                ×
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Filters</span>
                            <button className="text-sm text-black hover:underline">Add Filter</button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 p-6">
                    {/* SQL Query Display */}
                    <div className="mb-6 p-4 bg-gray-50 rounded">
                        <pre className="whitespace-pre-wrap font-mono text-sm">{sqlQuery}</pre>
                    </div>

                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Results</h2>
                        <div className="flex border border-gray-200 rounded">
                            <button
                                className={cn("px-4 py-1", viewMode === "table" ? "bg-gray-50 font-medium" : "")}
                                onClick={() => setViewMode("table")}
                            >
                                Table
                            </button>
                            <button
                                className={cn("px-4 py-1", viewMode === "chart" ? "bg-gray-50 font-medium" : "")}
                                onClick={() => setViewMode("chart")}
                            >
                                Chart
                            </button>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {displayedTableData.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{row.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{row.month}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{row.product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{row.region}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">${row.sales.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">${row.profit.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{row.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}


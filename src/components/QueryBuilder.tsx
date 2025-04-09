"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Metric, Dimension, TableRow, Filter, FilterOperator } from "../types"
import { filterTableData, generateSqlQuery } from "../utils/queryUtils"
import { tableOptions, aggregationOptions, mockDataByTable } from "../data/mockData"
import { ChevronDown, Search } from "lucide-react"
import ChartView from './ChartView'
import { getPaginatedData, ITEMS_PER_PAGE } from '../data/mockData';
import Pagination from './Pagination';
const tableSpecificOptions = {
    sales: {
        metrics: [
            { value: "revenue", label: "Revenue", type: "currency" },
            { value: "profit", label: "Profit", type: "currency" },
            { value: "quantity", label: "Quantity", type: "number" },
            { value: "discount", label: "Discount", type: "percentage" },
        ],
        dimensions: [
            { value: "product", label: "Product" },
            { value: "region", label: "Region" },
            { value: "month", label: "Month" },
            { value: "category", label: "Category" },
        ],
    },
    inventory: {
        metrics: [
            { value: "stock_level", label: "Stock Level", type: "number" },
            { value: "reorder_point", label: "Reorder Point", type: "number" },
            { value: "days_of_supply", label: "Days of Supply", type: "number" },
        ],
        dimensions: [
            { value: "product", label: "Product", type: "string" },
            { value: "warehouse", label: "Warehouse", type: "string" },
            { value: "supplier", label: "Supplier", type: "string" },
        ],
    },
}

export default function QueryBuilder() {
    const [selectedTable, setSelectedTable] = useState<string>("sales")
    const [selectedAggregation, setSelectedAggregation] = useState<string>("SUM")
    const [activeTab, setActiveTab] = useState<"metrics" | "dimensions">("metrics")
    const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([])
    const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([])
    const [displayedTableData, setDisplayedTableData] = useState<TableRow[]>([])
    const [sqlQuery, setSqlQuery] = useState<string>("-- SQL query will appear here --")
    const [viewMode, setViewMode] = useState<"table" | "chart">("table")

    // Dropdown states
    const [isTableDropdownOpen, setIsTableDropdownOpen] = useState(false)
    const [isAggregationDropdownOpen, setIsAggregationDropdownOpen] = useState(false)
    const [isMetricsDropdownOpen, setIsMetricsDropdownOpen] = useState(false)
    const [isDimensionsDropdownOpen, setIsDimensionsDropdownOpen] = useState(false)

    // Search states
    const [metricSearch, setMetricSearch] = useState("")
    const [dimensionSearch, setDimensionSearch] = useState("")

    const [availableMetrics, setAvailableMetrics] = useState<Metric[]>([])
    const [availableDimensions, setAvailableDimensions] = useState<Dimension[]>([])


    useEffect(() => {
        // Reset selections when table changes
        setSelectedMetrics([])
        setSelectedDimensions([])
        // Reset filters when table changes
        setFilters([])

        // Get table-specific options
        const tableKey = selectedTable.toLowerCase() as keyof typeof tableSpecificOptions
        if (tableSpecificOptions[tableKey]) {
            setAvailableMetrics(tableSpecificOptions[tableKey].metrics)
            setAvailableDimensions(tableSpecificOptions[tableKey].dimensions)
        } else {
            setAvailableMetrics([])
            setAvailableDimensions([])
        }

        // Reset SQL query
        setSqlQuery("-- SQL query will appear here --")
        setDisplayedTableData([])
    }, [selectedTable])

    // Filter metrics based on search
    const filteredMetrics = availableMetrics.filter((metric) =>
        metric.label.toLowerCase().includes(metricSearch.toLowerCase()),
    )

    // Filter dimensions based on search
    const filteredDimensions = availableDimensions.filter((dimension) =>
        dimension.label.toLowerCase().includes(dimensionSearch.toLowerCase()),
    )

    // Toggle metric selection
    const toggleMetric = (metric: Metric) => {
        let newMetrics
        if (selectedMetrics.some((m) => m.value === metric.value)) {
            newMetrics = selectedMetrics.filter((m) => m.value !== metric.value)
        } else {
            newMetrics = [...selectedMetrics, metric]
        }
        setSelectedMetrics(newMetrics)

        // Update SQL query
        updateSqlQuery(newMetrics, selectedDimensions)
    }

    // Toggle dimension selection
    const toggleDimension = (dimension: Dimension) => {
        let newDimensions
        if (selectedDimensions.some((d) => d.value === dimension.value)) {
            newDimensions = selectedDimensions.filter((d) => d.value !== dimension.value)
        } else {
            newDimensions = [...selectedDimensions, dimension]
        }
        setSelectedDimensions(newDimensions)

        // Update SQL query
        updateSqlQuery(selectedMetrics, newDimensions)
    }

    // Remove metric
    const removeMetric = (metric: Metric) => {
        const newMetrics = selectedMetrics.filter((m) => m.value !== metric.value)
        setSelectedMetrics(newMetrics)
        updateSqlQuery(newMetrics, selectedDimensions)
    }

    // Remove dimension
    const removeDimension = (dimension: Dimension) => {
        const newDimensions = selectedDimensions.filter((d) => d.value !== dimension.value)
        setSelectedDimensions(newDimensions)
        updateSqlQuery(selectedMetrics, newDimensions)
    }

    // Update SQL query
    const updateSqlQuery = (metrics: Metric[], dimensions: Dimension[]) => {
        const query = generateSqlQuery(selectedTable.toLowerCase(), selectedAggregation, metrics, dimensions)
        setSqlQuery(query)
    }

    // Execute query
    const executeQuery = () => {
        if (selectedMetrics.length === 0 && selectedDimensions.length === 0) {
            setSqlQuery("-- Select metrics or dimensions to generate a query")
            setDisplayedTableData([])
            return
        }

        // Update SQL query with filters
        const query = generateSqlQuery(
            selectedTable.toLowerCase(),
            selectedAggregation,
            selectedMetrics,
            selectedDimensions,
            filters  // Add filters here
        )
        setSqlQuery(query)

        // Get data for the selected table
        const tableData = mockDataByTable[selectedTable.toLowerCase() as keyof typeof mockDataByTable] || []

        // Set the displayed table data
        setDisplayedTableData(tableData)
    }

    const getColumnHeaders = () => {
        const tableKey = selectedTable.toLowerCase() as keyof typeof mockDataByTable;
        if (!mockDataByTable[tableKey] || mockDataByTable[tableKey].length === 0) {
            return [];
        }

        const firstRow = mockDataByTable[tableKey][0];
        return Object.keys(firstRow).map(key => ({
            key: key.toLowerCase(),
            label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
        }));
    };


    // Replace the static filterFields with a dynamic getter
    const getFilterFields = () => {
        const tableKey = selectedTable.toLowerCase() as keyof typeof tableSpecificOptions;
        if (!tableSpecificOptions[tableKey]) return [];

        // Combine metrics and dimensions from the selected table
        const metrics = tableSpecificOptions[tableKey].metrics;
        const dimensions = tableSpecificOptions[tableKey].dimensions;

        return [...metrics, ...dimensions].map(field => ({
            value: field.value,
            label: field.label
        }));
    };

    const [filters, setFilters] = useState<Filter[]>([]);

    // Keep only this version of addFilter and remove the other one
    const addFilter = () => {
        const availableFields = getFilterFields();
        if (availableFields.length > 0) {
            setFilters([...filters, {
                field: availableFields[0].value,
                operator: "=",
                value: ""
            }]);
        }
    };

    // In the filters mapping section, update to use getFilterFields() instead of filterFields
    {
        filters.map((filter, index) => (
            <div key={index} className="flex gap-2 items-center">
                <select
                    value={filter.field}
                    onChange={(e) => updateFilter(index, e.target.value, filter.operator, filter.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                    {getFilterFields().map((field) => (
                        <option key={field.value} value={field.value}>
                            {field.label}
                        </option>
                    ))}
                </select>
                {/* ... rest of the filter controls ... */}
            </div>
        ))
    }
    const filterOperators: { value: FilterOperator; label: string }[] = [
        { value: "=", label: "=" },
        { value: ">", label: ">" },
        { value: "<", label: "<" },
        { value: ">=", label: ">=" },
        { value: "<=", label: "<=" },
        { value: "LIKE", label: "LIKE" },
    ];



    const updateFilter = (index: number, field: string, operator: FilterOperator, value: string) => {
        const newFilters = [...filters];
        newFilters[index] = { field, operator, value };
        setFilters(newFilters);

        // Update SQL query with new filters
        const query = generateSqlQuery(
            selectedTable.toLowerCase(),
            selectedAggregation,
            selectedMetrics,
            selectedDimensions,
            newFilters
        );
        setSqlQuery(query);
    };

    const removeFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);

        // Update SQL query without removed filter
        const query = generateSqlQuery(
            selectedTable.toLowerCase(),
            selectedAggregation,
            selectedMetrics,
            selectedDimensions,
            newFilters
        );
        setSqlQuery(query);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedTableData, setPaginatedTableData] = useState<TableRow[]>([]);

    // Add this useEffect to handle pagination when displayedTableData changes
    useEffect(() => {
        const paginatedData = getPaginatedData(displayedTableData, currentPage);
        setPaginatedTableData(paginatedData.data);
    }, [displayedTableData, currentPage]);

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2 font-medium">
                    <span className="text-xl font-bold text-bold-600">BI Query Builder</span>
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
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {isTableDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                        {tableOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedTable === option.label ? "bg-gray-50" : ""
                                                    }`}
                                                onClick={() => {
                                                    setSelectedTable(option.label)
                                                    setIsTableDropdownOpen(false)
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {selectedTable === option.label && <span className="text-blue-500">✓</span>}
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
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                                {isAggregationDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                                        {aggregationOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedAggregation === option.label ? "bg-gray-50" : ""
                                                    }`}
                                                onClick={() => {
                                                    setSelectedAggregation(option.label)
                                                    setIsAggregationDropdownOpen(false)
                                                    // Immediately update SQL query with new aggregation
                                                    const query = generateSqlQuery(
                                                        selectedTable.toLowerCase(),
                                                        option.label,  // Use the new aggregation value directly
                                                        selectedMetrics,
                                                        selectedDimensions
                                                    )
                                                    setSqlQuery(query)
                                                }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option.label}</span>
                                                    {selectedAggregation === option.label && <span className="text-blue-500">✓</span>}
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
                                                {selectedMetrics.length ? selectedMetrics.map((m) => m.label).join(", ") : "Select metrics"}
                                            </span>
                                            <ChevronDown className="h-4 w-4" />
                                        </button>
                                        {isMetricsDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                                <div className="p-2 border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search metrics..."
                                                            className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-sm"
                                                            value={metricSearch}
                                                            onChange={(e) => setMetricSearch(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {filteredMetrics.length > 0 ? (
                                                    filteredMetrics.map((metric) => (
                                                        <div
                                                            key={metric.value}
                                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedMetrics.some((m) => m.value === metric.value) ? "bg-gray-50" : ""
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
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">No metrics found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                                {selectedDimensions.length
                                                    ? selectedDimensions.map((d) => d.label).join(", ")
                                                    : "Select dimensions"}
                                            </span>
                                            <ChevronDown className="h-4 w-4" />
                                        </button>
                                        {isDimensionsDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                                                <div className="p-2 border-b">
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search dimensions..."
                                                            className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded text-sm"
                                                            value={dimensionSearch}
                                                            onChange={(e) => setDimensionSearch(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                {filteredDimensions.length > 0 ? (
                                                    filteredDimensions.map((dimension) => (
                                                        <div
                                                            key={dimension.value}
                                                            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${selectedDimensions.some((d) => d.value === dimension.value) ? "bg-gray-50" : ""
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
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">No dimensions found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                    selectedMetrics.length > 0 ? (
                                        selectedMetrics.map((metric) => (
                                            <div key={metric.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                                <span className="text-sm">{metric.label}</span>
                                                <button onClick={() => removeMetric(metric)} className="ml-1 text-gray-500 hover:text-gray-700">
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">No metrics selected</span>
                                    )
                                ) : selectedDimensions.length > 0 ? (
                                    selectedDimensions.map((dimension) => (
                                        <div key={dimension.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                            <span className="text-sm">{dimension.label}</span>
                                            <button
                                                onClick={() => removeDimension(dimension)}
                                                className="ml-1 text-gray-500 hover:text-gray-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500">No dimensions selected</span>
                                )}
                            </div>
                        </div>



                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Filters</span>
                                <button
                                    onClick={addFilter}
                                    className="text-sm text-black hover:underline"
                                >
                                    Add Filter
                                </button>
                            </div>

                            {/* Only show filters if they exist */}
                            {filters.length > 0 && filters.map((filter, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <select
                                        value={filter.field}
                                        onChange={(e) => updateFilter(index, e.target.value, filter.operator, filter.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                        {getFilterFields().map((field) => (
                                            <option key={field.value} value={field.value}>
                                                {field.label}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={filter.operator}
                                        onChange={(e) => updateFilter(index, filter.field, e.target.value as FilterOperator, filter.value)}
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                        {filterOperators.map((op) => (
                                            <option key={op.value} value={op.value}>
                                                {op.label}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="text"
                                        value={filter.value}
                                        onChange={(e) => updateFilter(index, filter.field, filter.operator, e.target.value)}
                                        placeholder="Value"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    />

                                    <button
                                        onClick={() => removeFilter(index)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 p-6">
                    <div className="mb-6 p-4 bg-gray-50 rounded">
                        <pre className="whitespace-pre-wrap font-mono text-sm">{sqlQuery}</pre>
                    </div>

                    {displayedTableData.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium">Results</h2>
                                <div className="flex border border-gray-200 rounded">
                                    <button
                                        className={cn("px-4 py-1",
                                            viewMode === "table"
                                                ? "bg-white font-medium"
                                                : "bg-gray-100"
                                        )}
                                        onClick={() => setViewMode("table")}
                                    >
                                        Table
                                    </button>
                                    <button
                                        className={cn("px-4 py-1", viewMode === "chart"
                                            ? "bg-white font-medium"
                                            : "bg-gray-100"
                                        )}
                                        onClick={() => setViewMode("chart")}
                                    >
                                        Chart
                                    </button>
                                </div>
                            </div>
                            {viewMode === "table" ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                {/* ... existing thead code ... */}
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedTableData.map((row) => (
                                                    <tr key={row.id}>
                                                        {getColumnHeaders().map((header) => (
                                                            <td key={`${row.id}-${header.key}`} className="px-6 py-4 whitespace-nowrap text-sm">
                                                                {row[header.key]}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(displayedTableData.length / ITEMS_PER_PAGE)}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            ) : (
                                <ChartView
                                    data={displayedTableData}
                                    xAxis={selectedDimensions[0]?.value || ""}
                                    yAxis={selectedMetrics[0]?.value || ""}
                                />
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-500 mt-8">
                            Execute a query to see results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


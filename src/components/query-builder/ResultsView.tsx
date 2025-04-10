import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ChartView from "../ChartView"
import Pagination from "../Pagination"
import { Dimension, Metric, TableRow } from "@/src/types"
 

interface ResultsViewProps {
    sqlQuery: string
    displayedTableData: TableRow[]
    selectedMetrics: Metric[]
    selectedDimensions: Dimension[]
    currentPage: number
    setCurrentPage: (page: number) => void
}

export function ResultsView({
    sqlQuery,
    displayedTableData,
    selectedMetrics,
    selectedDimensions,
    currentPage,
    setCurrentPage
}: ResultsViewProps) {
    const [viewMode, setViewMode] = useState<"table" | "chart">("table")
    const ITEMS_PER_PAGE = 10
    const [showSaveSuccess, setShowSaveSuccess] = useState(false)

    // Enable save button when there's a query and at least one metric or dimension selected
    const isQueryValid = sqlQuery && 
                        !sqlQuery.startsWith('--') && 
                        (selectedMetrics.length > 0 || selectedDimensions.length > 0)

    const handleSaveQuery = () => {
        if (!isQueryValid) return;

        const savedQueries = JSON.parse(localStorage.getItem('savedQueries') || '[]')
        const newQuery = {
            id: Date.now(),
            query: sqlQuery,
            metrics: selectedMetrics,
            dimensions: selectedDimensions,
            timestamp: new Date().toISOString()
        }
        savedQueries.push(newQuery)
        localStorage.setItem('savedQueries', JSON.stringify(savedQueries))
        
        setShowSaveSuccess(true)
        setTimeout(() => setShowSaveSuccess(false), 3000)
    }

    const getColumnHeaders = () => {
        if (!displayedTableData.length) return [];
        
        // Return fixed columns
        return [
            { key: 'id', label: 'Id' },
            { key: 'month', label: 'Month' },
            { key: 'product', label: 'Product' },
            { key: 'region', label: 'Region' },
            { key: 'revenue', label: 'Sales' },
            { key: 'profit', label: 'Profit' },
            { key: 'quantity', label: 'Quantity' }
        ];
    }

    return (
        <div className="flex-1 p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-start">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{sqlQuery}</pre>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSaveQuery}
                                disabled={!isQueryValid}
                                className={cn(
                                    "px-4 py-2 rounded",
                                    isQueryValid 
                                        ? "bg-blue-500 text-white hover:bg-blue-600" 
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                )}
                            >
                                Save Query
                            </button>
                            <Link 
                                href="/saved-queries"
                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                            >
                                View Saved Queries
                            </Link>
                        </div>
                        {showSaveSuccess && (
                            <span className="text-green-600 text-sm">Query saved!</span>
                        )}
                    </div>
                </div>
            </div>

            {displayedTableData.length > 0 && (selectedMetrics.length > 0 || selectedDimensions.length > 0) ? (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Results</h2>
                        <div className="flex border border-gray-200 rounded">
                            <button
                                className={cn("px-4 py-1",
                                    viewMode === "table" ? "bg-white font-medium" : "bg-gray-100"
                                )}
                                onClick={() => setViewMode("table")}
                            >
                                Table
                            </button>
                            <button
                                className={cn("px-4 py-1",
                                    viewMode === "chart" ? "bg-white font-medium" : "bg-gray-100"
                                )}
                                onClick={() => setViewMode("chart")}
                            >
                                Chart
                            </button>
                        </div>
                    </div>

                    {viewMode === "table" ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        {getColumnHeaders().map((header) => (
                                            <th key={header.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                                                {header.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {displayedTableData.map((row, idx) => (
                                        <tr key={idx}>
                                            {getColumnHeaders().map((header) => (
                                                <td key={`${idx}-${header.key}`} className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {row[header.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(displayedTableData.length / ITEMS_PER_PAGE)}
                                onPageChange={setCurrentPage}
                            />
                        </div>
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
    )
}
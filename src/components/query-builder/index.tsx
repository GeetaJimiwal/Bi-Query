import { useQueryBuilder } from "@/src/hooks/useQueryBuilder"
import { TableSelector } from "./TableSelector"
import { AggregationSelector } from "./AggregationSelector"
import { MetricsDimensionsSelector } from "./MetricsDimensionsSelector"
import { FiltersSection } from "./FiltersSection"
import { ResultsView } from "./ResultsView"

 

export default function QueryBuilder() {
    const {
        selectedTable,
        setSelectedTable,
        selectedAggregation,
        setSelectedAggregation,
        pendingMetrics,
        setPendingMetrics,
        pendingDimensions,
        setPendingDimensions,
        selectedMetrics,
        selectedDimensions,
        filters,
        setFilters,
        sqlQuery,
        displayedTableData,
        currentPage,
        setCurrentPage,
        executeQuery,
        updateSqlQuery
    } = useQueryBuilder()

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-xl font-bold">BI Query Builder</span>
                <button 
                    onClick={executeQuery} 
                    className="bg-black text-white px-4 py-2 rounded font-medium"
                >
                    Execute Query
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Panel */}
                <div className="w-[520px] border-r border-gray-200 p-6">
                    <h2 className="text-lg font-medium mb-6">Build Your Query</h2>
                    
                    <div className="space-y-6 border border-gray-200 rounded-lg p-4 bg-white">
                        <TableSelector 
                            selectedTable={selectedTable}
                            onTableChange={setSelectedTable}
                        />
                        
                        <AggregationSelector
                            selectedAggregation={selectedAggregation}
                            onAggregationChange={setSelectedAggregation}
                            onExecuteQuery={executeQuery}  // Add this prop
                        />
                        
                        <MetricsDimensionsSelector 
                            pendingMetrics={pendingMetrics}
                            setPendingMetrics={setPendingMetrics}
                            pendingDimensions={pendingDimensions}
                            setPendingDimensions={setPendingDimensions}
                            selectedTable={selectedTable}
                            updateSqlQuery={updateSqlQuery}
                        />
                        
                        <FiltersSection 
                            filters={filters}
                            setFilters={setFilters}
                            selectedTable={selectedTable}
                            updateSqlQuery={updateSqlQuery}
                        />
                    </div>
                </div>

                {/* Right Panel */}
                <ResultsView 
                    sqlQuery={sqlQuery}
                    displayedTableData={displayedTableData}
                    selectedMetrics={selectedMetrics}
                    selectedDimensions={selectedDimensions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    )
}
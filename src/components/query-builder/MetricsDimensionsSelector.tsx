import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dimension, Metric } from "@/src/types"
import { tableSpecificOptions } from "@/src/data/mockData"
import { MetricsDropdown } from "./components/MetricsDropdown"
import { DimensionsDropdown } from "./components/DimensionsDropdown"
import { SelectedItems } from "./components/SelectedItems"


interface MetricsDimensionsSelectorProps {
    pendingMetrics: Metric[]
    setPendingMetrics: (metrics: Metric[]) => void
    pendingDimensions: Dimension[]
    setPendingDimensions: (dimensions: Dimension[]) => void
    selectedTable: string
    updateSqlQuery: (metrics: Metric[], dimensions: Dimension[]) => void
}

export function MetricsDimensionsSelector({
    pendingMetrics,
    setPendingMetrics,
    pendingDimensions,
    setPendingDimensions,
    selectedTable,
    updateSqlQuery
}: MetricsDimensionsSelectorProps) {
    const [activeTab, setActiveTab] = useState<"metrics" | "dimensions">("metrics")
    const [isMetricsDropdownOpen, setIsMetricsDropdownOpen] = useState(false)
    const [isDimensionsDropdownOpen, setIsDimensionsDropdownOpen] = useState(false)
    const [metricSearch, setMetricSearch] = useState("")
    const [dimensionSearch, setDimensionSearch] = useState("")

    const tableKey = selectedTable.toLowerCase() as keyof typeof tableSpecificOptions
    const availableMetrics = tableSpecificOptions[tableKey]?.metrics || []
    const availableDimensions = tableSpecificOptions[tableKey]?.dimensions || []

    const filteredMetrics = availableMetrics.filter((metric) =>
        metric.label.toLowerCase().includes(metricSearch.toLowerCase())
    )

    const filteredDimensions = availableDimensions.filter((dimension) =>
        dimension.label.toLowerCase().includes(dimensionSearch.toLowerCase())
    )

    const toggleMetric = (metric: Metric) => {
        const newPendingMetrics = pendingMetrics.some(m => m.value === metric.value)
            ? pendingMetrics.filter(m => m.value !== metric.value)
            : [...pendingMetrics, metric];
        setPendingMetrics(newPendingMetrics);
        updateSqlQuery(newPendingMetrics, pendingDimensions);
    };

    const toggleDimension = (dimension: Dimension) => {
        const newPendingDimensions = pendingDimensions.some(d => d.value === dimension.value)
            ? pendingDimensions.filter(d => d.value !== dimension.value)
            : [...pendingDimensions, dimension];
        setPendingDimensions(newPendingDimensions);
        updateSqlQuery(pendingMetrics, newPendingDimensions);
    };

    // Add selected items display below dropdowns
    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex mb-4 bg-gray-100">
                <button
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium",
                        activeTab === "metrics" 
                            ? "bg-white" 
                            : "bg-gray-100"
                    )}
                    onClick={() => setActiveTab("metrics")}
                >
                    Metrics
                </button>
                <button
                    className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium",
                        activeTab === "dimensions" 
                            ? "bg-white" 
                            : "bg-gray-100"
                    )}
                    onClick={() => setActiveTab("dimensions")}
                >
                    Dimensions
                </button>
            </div>
                
            {/* Dropdowns with border */}
            <div className="border border-gray-600 rounded">
                {activeTab === "metrics" ? (
                    <MetricsDropdown
                        isOpen={isMetricsDropdownOpen}
                        setIsOpen={setIsMetricsDropdownOpen}
                        metrics={filteredMetrics}
                        selectedMetrics={pendingMetrics}
                        onToggle={toggleMetric}
                        searchValue={metricSearch}
                        onSearchChange={setMetricSearch}
                    />
                ) : (
                    <DimensionsDropdown
                        isOpen={isDimensionsDropdownOpen}
                        setIsOpen={setIsDimensionsDropdownOpen}
                        dimensions={filteredDimensions}
                        selectedDimensions={pendingDimensions}
                        onToggle={toggleDimension}
                        searchValue={dimensionSearch}
                        onSearchChange={setDimensionSearch}
                    />
                )}
            </div>
            <SelectedItems
                activeTab={activeTab}
                metrics={pendingMetrics}
                dimensions={pendingDimensions}
                onRemoveMetric={toggleMetric}
                onRemoveDimension={toggleDimension}
            />
        </div>
    )
}
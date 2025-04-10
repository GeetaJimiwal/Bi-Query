import type { Metric, Dimension } from "@/src/types"

interface SelectedItemsProps {
    activeTab: "metrics" | "dimensions"
    metrics: Metric[]
    dimensions: Dimension[]
    onRemoveMetric: (metric: Metric) => void
    onRemoveDimension: (dimension: Dimension) => void
}

export function SelectedItems({
    activeTab,
    metrics,
    dimensions,
    onRemoveMetric,
    onRemoveDimension
}: SelectedItemsProps) {
    return (
        <div>
            <h3 className="text-sm font-medium mb-2 mt-5">
                {activeTab === "metrics" ? "Selected Metrics:" : "Selected Dimensions:"}
            </h3>
            <div className="flex flex-wrap gap-2">
                {activeTab === "metrics" ? (
                    metrics.length > 0 ? (
                        metrics.map((metric) => (
                            <div key={metric.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                                <span className="text-sm">{metric.label}</span>
                                <button onClick={() => onRemoveMetric(metric)} className="ml-1 text-gray-500 hover:text-gray-700">
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500">No metrics selected</span>
                    )
                ) : dimensions.length > 0 ? (
                    dimensions.map((dimension) => (
                        <div key={dimension.value} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-sm">
                            <span className="text-sm">{dimension.label}</span>
                            <button onClick={() => onRemoveDimension(dimension)} className="ml-1 text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <span className="text-sm text-gray-500">No dimensions selected</span>
                )}
            </div>
        </div>
    )
}
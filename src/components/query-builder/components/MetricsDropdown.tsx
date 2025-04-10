import { ChevronDown, Search } from "lucide-react"
import type { Metric } from "@/src/types"

interface MetricsDropdownProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    metrics: Metric[]
    selectedMetrics: Metric[]
    onToggle: (metric: Metric) => void
    searchValue: string
    onSearchChange: (value: string) => void
}

export function MetricsDropdown({
    isOpen,
    setIsOpen,
    metrics,
    selectedMetrics,
    onToggle,
    searchValue,
    onSearchChange
}: MetricsDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
            >
                <span>
                    {selectedMetrics.length > 0 
                        ? `Selected Metrics (${selectedMetrics.length})`
                        : "Select metrics"}
                </span>
                <ChevronDown className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    <div className="p-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search metrics..."
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm"
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-auto">
                        {metrics.map((metric) => {
                            const isSelected = selectedMetrics.some(m => m.value === metric.value);
                            return (
                                <div
                                    key={metric.value}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}
                                    onClick={() => onToggle(metric)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{metric.label}</span>
                                        {isSelected && (
                                            <span className="text-blue-500">✓</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
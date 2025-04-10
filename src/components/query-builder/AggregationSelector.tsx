import { useState } from "react"
import { ChevronDown } from "lucide-react"

// Define the AggregationOption type
type AggregationOption = {
    value: string;
    label: string;
}

// Define aggregation options with uppercase values
const aggregationOptions: AggregationOption[] = [
    { value: "SUM", label: "Sum" },
    { value: "COUNT", label: "Count" },
    { value: "AVG", label: "Average" },
    { value: "MIN", label: "Minimum" },
    { value: "MAX", label: "Maximum" }
]

interface AggregationSelectorProps {
    selectedAggregation: string;
    onAggregationChange: (aggregation: string) => void;
    onExecuteQuery?: () => void;  // Add this prop
}

export function AggregationSelector({
    selectedAggregation,
    onAggregationChange,
    onExecuteQuery
}: AggregationSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    // Find the label for the selected value
    const selectedLabel = aggregationOptions.find(opt => opt.value === selectedAggregation)?.label || selectedAggregation

    const handleAggregationChange = (value: string) => {
        onAggregationChange(value)
        setIsOpen(false)
        // Execute query after aggregation changes
        if (onExecuteQuery) {
            onExecuteQuery()
        }
    }

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Aggregation</label>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
                >
                    <span>{selectedLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>
                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                        {aggregationOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                    selectedAggregation === option.value ? "bg-blue-50" : ""
                                }`}
                                onClick={() => handleAggregationChange(option.value)}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{option.label}</span>
                                    {selectedAggregation === option.value && (
                                        <span className="text-blue-500">✓</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
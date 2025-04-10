import { ChevronDown, Search } from "lucide-react"
import type { Dimension } from "@/src/types"

interface DimensionsDropdownProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    dimensions: Dimension[]
    selectedDimensions: Dimension[]
    onToggle: (dimension: Dimension) => void
    searchValue: string
    onSearchChange: (value: string) => void
}

export function DimensionsDropdown({
    isOpen,
    setIsOpen,
    dimensions,
    selectedDimensions,
    onToggle,
    searchValue,
    onSearchChange
}: DimensionsDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
            >
                <span>
                    {selectedDimensions.length > 0 
                        ? `Selected Dimensions (${selectedDimensions.length})`
                        : "Select dimensions"}
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
                                placeholder="Search dimensions..."
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm"
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-auto">
                        {dimensions.map((dimension) => {
                            const isSelected = selectedDimensions.some(d => d.value === dimension.value);
                            return (
                                <div
                                    key={dimension.value}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50' : ''}`}
                                    onClick={() => onToggle(dimension)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{dimension.label}</span>
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
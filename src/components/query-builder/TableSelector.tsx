import { tableOptions } from "@/src/data/mockData"
import { ChevronDown } from "lucide-react"
 
import { useState } from "react"

interface TableSelectorProps {
    selectedTable: string
    onTableChange: (table: string) => void
}

export function TableSelector({ selectedTable, onTableChange }: TableSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <label className="block text-sm font-medium mb-2">Select Table</label>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-2 bg-white"
                >
                    <span>{selectedTable}</span>
                    <ChevronDown className="h-4 w-4" />
                </button>
                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                        {tableOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                    selectedTable === option.label ? "bg-gray-50" : ""
                                }`}
                                onClick={() => {
                                    onTableChange(option.label)
                                    setIsOpen(false)
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
    )
}
import { tableSpecificOptions } from "@/src/data/mockData"
import { Filter, FilterOperator } from "@/src/types"
import { useState } from "react"
 

interface FiltersSectionProps {
    filters: Filter[]
    setFilters: (filters: Filter[]) => void
    selectedTable: string
    updateSqlQuery: (metrics: any[], dimensions: any[]) => void
}

export function FiltersSection({
    filters,
    setFilters,
    selectedTable,
    updateSqlQuery
}: FiltersSectionProps) {
    const addFilter = () => {
        const availableFields = getFilterFields()
        if (availableFields.length > 0) {
            const newFilters = [...filters, {
                field: availableFields[0].value,
                operator: "=" as FilterOperator, // Cast the operator to FilterOperator
                value: ""
            }]
            setFilters(newFilters)
            updateSqlQuery([], []) // Pass empty arrays as required arguments
        }
    }

    const updateFilter = (index: number, field: string, operator: FilterOperator, value: string) => {
        const newFilters = [...filters]
        newFilters[index] = { field, operator, value }
        setFilters(newFilters)
        updateSqlQuery([], []) // Pass empty arrays as required arguments
    }

    const removeFilter = (index: number) => {
        const newFilters = filters.filter((_, i) => i !== index)
        setFilters(newFilters)
        updateSqlQuery([], []) // Pass empty arrays as required arguments
    }

    const getFilterFields = () => {
        const tableKey = selectedTable.toLowerCase() as keyof typeof tableSpecificOptions
        if (!tableSpecificOptions[tableKey]) return []

        const metrics = tableSpecificOptions[tableKey].metrics
        const dimensions = tableSpecificOptions[tableKey].dimensions

        return [...metrics, ...dimensions].map(field => ({
            value: field.value,
            label: field.label
        }))
    }

    const filterOperators: { value: FilterOperator; label: string }[] = [
        { value: "=", label: "=" },
        { value: ">", label: ">" },
        { value: "<", label: "<" },
        { value: ">=", label: ">=" },
        { value: "<=", label: "<=" },
        { value: "LIKE", label: "LIKE" },
    ]

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Filters</span>
                <button onClick={addFilter} className="text-sm text-black hover:underline">
                    Add Filter
                </button>
            </div>

            {filters.map((filter, index) => (
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
                        placeholder="Enter value..."
                        className="flex-1 px-2 py-1 border rounded text-sm"
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
    )
}
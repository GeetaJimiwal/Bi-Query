import { useState, useEffect } from "react"
import { Dimension, Filter, Metric, TableRow } from "../types"
import { mockDataByTable, tableSpecificOptions } from "../data/mockData"
import { generateSqlQuery, executeQuery as executeSqlQuery } from "../utils/queryUtils"
 

export function useQueryBuilder() {
    const [selectedTable, setSelectedTable] = useState<string>("sales")
    const [selectedAggregation, setSelectedAggregation] = useState<string>("SUM")
    const [pendingMetrics, setPendingMetrics] = useState<Metric[]>([])
    const [pendingDimensions, setPendingDimensions] = useState<Dimension[]>([])
    const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>([])
    const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([])
    const [filters, setFilters] = useState<Filter[]>([])
    const [sqlQuery, setSqlQuery] = useState<string>("-- SQL query will appear here --")
    const [displayedTableData, setDisplayedTableData] = useState<TableRow[]>([])
    const [currentPage, setCurrentPage] = useState(1)

    // Handle table change
    useEffect(() => {
        setPendingMetrics([])
        setPendingDimensions([])
        setSelectedMetrics([])
        setSelectedDimensions([])
        setFilters([])
    }, [selectedTable])

    // Handle metrics change
    useEffect(() => {
        setSelectedMetrics(pendingMetrics)
        updateSqlQuery(pendingMetrics, pendingDimensions)
    }, [pendingMetrics])

    // Handle dimensions change
    useEffect(() => {
        setSelectedDimensions(pendingDimensions)
        updateSqlQuery(pendingMetrics, pendingDimensions)
    }, [pendingDimensions])

    const executeQuery = () => {
        if (!sqlQuery || sqlQuery.startsWith('--')) {
            setDisplayedTableData([])
            return
        }

        try {
            const tableData = mockDataByTable[selectedTable.toLowerCase() as keyof typeof mockDataByTable] || []
            
            // Apply filters before executing query
            let filteredData = tableData
            if (filters.length > 0) {
                filteredData = tableData.filter(row => {
                    return filters.every(filter => {
                        const fieldValue = String(row[filter.field]).toLowerCase()
                        const filterValue = filter.value.toLowerCase()
                        
                        switch (filter.operator) {
                            case '=':
                                return fieldValue === filterValue
                            case '>':
                                return Number(fieldValue) > Number(filterValue)
                            case '<':
                                return Number(fieldValue) < Number(filterValue)
                            case '>=':
                                return Number(fieldValue) >= Number(filterValue)
                            case '<=':
                                return Number(fieldValue) <= Number(filterValue)
                            case 'LIKE':
                                return fieldValue.includes(filterValue)
                            default:
                                return true
                        }
                    })
                })
            }

            const queryResult = executeSqlQuery(sqlQuery, filteredData)
            setDisplayedTableData(queryResult)
            setCurrentPage(1)
        } catch (error) {
            console.error('Error executing query:', error)
            setDisplayedTableData([])
        }
    }

    const updateSqlQuery = (metrics: Metric[], dimensions: Dimension[]) => {
        const query = generateSqlQuery(
            selectedTable.toLowerCase(),
            selectedAggregation,
            metrics,
            dimensions,
            filters
        )
        setSqlQuery(query)
    }

    // Update SQL query whenever aggregation changes
    useEffect(() => {
        updateSqlQuery(pendingMetrics, pendingDimensions)
    }, [selectedAggregation])

    // Update SQL query whenever filters change
    useEffect(() => {
        updateSqlQuery(pendingMetrics, pendingDimensions)
    }, [filters])

    return {
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
    }
}
'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { SavedQuery, TableRow } from "@/src/types";
import { mockDataByTable } from "@/src/data/mockData";
import { executeQuery as executeSqlQuery } from "@/src/utils/queryUtils";

// Add type assertion for mockDataByTable
const tableData: { [key: string]: TableRow[] } = mockDataByTable as { [key: string]: TableRow[] };

export default function SavedQueriesPage() {
    const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
    const [currentResults, setCurrentResults] = useState<TableRow[]>([]);
    const [currentQuery, setCurrentQuery] = useState<SavedQuery | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        // Load saved queries from localStorage
        const queries = JSON.parse(localStorage.getItem('savedQueries') || '[]');
        
        // Remove duplicates based on query string
        const uniqueQueries = queries.reduce((acc: SavedQuery[], current: SavedQuery) => {
            const isDuplicate = acc.some(item => item.query === current.query);
            if (!isDuplicate) {
                acc.push(current);
            }
            return acc;
        }, []);

        // Update localStorage with deduplicated queries
        if (uniqueQueries.length !== queries.length) {
            localStorage.setItem('savedQueries', JSON.stringify(uniqueQueries));
        }
        
        setSavedQueries(uniqueQueries);
    }, []);

    const handleExecuteQuery = (query: SavedQuery) => {
        // Get the table name from the query
        const tableNameMatch = query.query.match(/FROM\s+(\w+)/i);
        const tableName = tableNameMatch ? tableNameMatch[1].toLowerCase() : 'sales';
        
        // Execute the query directly
        const result = executeSqlQuery(query.query, tableData[tableName]);
        
        // Update the current results and query
        setCurrentResults(result);
        setCurrentQuery(query);
        setCurrentPage(1); // Reset to first page
    };

    const handleDeleteQuery = (id: number) => {
        // Filter out the query with the matching id
        const updatedQueries = savedQueries.filter(query => query.id !== id);
        
        // Update localStorage and state
        localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
        setSavedQueries(updatedQueries);
        
        // Clear results if the deleted query was being displayed
        if (currentQuery && currentQuery.id === id) {
            setCurrentResults([]);
            setCurrentQuery(null);
        }
    };

    // Helper function to get column headers for the result table
    const getColumnHeaders = () => {
        if (!currentResults.length) return [];
        
        return [
            { key: 'id', label: 'Id' },
            { key: 'month', label: 'Month' },
            { key: 'product', label: 'Product' },
            { key: 'region', label: 'Region' },
            { key: 'revenue', label: 'Sales' },
            { key: 'profit', label: 'Profit' },
            { key: 'quantity', label: 'Quantity' }
        ];
    };

    // const getColumnHeaders = () => {
    //     if (!currentResults.length || !currentQuery) return [];
        
    //     const headers = [];
        
    //     // Add headers only for selected dimensions
    //     if (currentQuery.dimensions && currentQuery.dimensions.length > 0) {
    //         headers.push(...currentQuery.dimensions.map(d => ({
    //             key: d.value,
    //             label: d.label
    //         })));
    //     }
        
    //     // Add headers only for selected metrics
    //     if (currentQuery.metrics && currentQuery.metrics.length > 0) {
    //         headers.push(...currentQuery.metrics.map(m => ({
    //             key: m.value,
    //             label: m.label
    //         })));
    //     }
        
    //     return headers;
    // };

    // Calculate pagination details
    const totalPages = Math.ceil(currentResults.length / ITEMS_PER_PAGE);
    const paginatedResults = currentResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Format the timestamp for display
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-xl font-bold">Saved Queries</span>
                <Link 
                    href="/"
                    className="px-4 py-2 rounded bg-black text-white font-medium"
                >
                    Back to Query Builder
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Left Panel - Saved Queries List */}
                <div className="w-1/2 border-r border-gray-200 p-6 overflow-y-auto">
                    <h2 className="text-lg font-medium mb-4">Your Saved Queries</h2>
                    
                    {savedQueries.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                            No saved queries found
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {savedQueries.map((query) => (
                                <div 
                                    key={query.id}
                                    className={`border rounded p-4 ${
                                        currentQuery && currentQuery.id === query.id 
                                            ? 'border-blue-500 bg-blue-50' 
                                            : 'border-gray-200'
                                    }`}
                                >
                                    <pre className="whitespace-pre-wrap font-mono text-sm mb-2">{query.query}</pre>
                                    <div className="text-sm text-gray-500 mb-3">
                                        Saved on: {formatTimestamp(query.timestamp)}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleExecuteQuery(query)}
                                            className="px-4 py-2 rounded bg-black text-white font-medium"
                                        >
                                            Execute
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuery(query.id)}
                                            className="px-4 py-2 rounded bg-red-500 text-white font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel - Results View */}
                <div className="w-1/2 p-6 overflow-y-auto">
                    <h2 className="text-lg font-medium mb-4">Results</h2>
                    
                    {currentResults.length > 0 ? (
                        <div>
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
                                        {paginatedResults.map((row, idx) => (
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
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4">
                                    <nav className="flex items-center">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 rounded-l border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <div className="px-4 py-1 border-t border-b border-gray-300 bg-white text-sm text-gray-700">
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 rounded-r border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-8">
                            Execute a query to see results
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
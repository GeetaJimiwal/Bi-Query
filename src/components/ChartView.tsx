import React from 'react';
import {
    BarChart,
    Bar as RechartsBar,
    PieChart,
    Pie as RechartsPie,
    Cell,
    LineChart,
    XAxis as RechartsXAxis,
    YAxis as RechartsYAxis,
    Line as RechartsLine,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
    CartesianGrid as RechartsCartesianGrid,
    ResponsiveContainer
} from 'recharts';

// Cast components to any to fix TypeScript errors
const XAxis = RechartsXAxis as any;
const YAxis = RechartsYAxis as any;
const Bar = RechartsBar as any;
const Pie = RechartsPie as any;
const Line = RechartsLine as any;
const Tooltip = RechartsTooltip as any;
const Legend = RechartsLegend as any;
const CartesianGrid = RechartsCartesianGrid as any;
import { useState } from 'react';

interface ChartViewProps {
    data: any[];
    xAxis: string;
    yAxis: string;
}

const ChartView: React.FC<ChartViewProps> = ({ data, xAxis, yAxis }) => {
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
    const [selectedXAxis, setSelectedXAxis] = useState(xAxis);
    const [selectedYAxis, setSelectedYAxis] = useState(yAxis);

    const getAxesOptions = () => {
        if (data.length === 0) return [];
        return Object.keys(data[0]).map(key => ({
            value: key,
            label: key
        }));
    };
    const pieColors = [
        '#FFB800', // May (yellow)
        '#FF9D5C', // Jul (orange)
        '#82ca9d', // Oct (green)
        '#8884d8', // Sep (purple)
        '#0088FE', // Nov (blue)
        '#FF6B6B', // Jun (red)
        '#FFCD56', // Aug (light yellow)
        '#4BC0C0', // Jan (teal)
        '#36A2EB', // Apr (light blue)
        '#9966FF', // Dec (purple)
    ];

    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey={selectedXAxis}
                                tick={{ fontSize: 12 }}
                                interval={0}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                domain={[0, 'auto']}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey={selectedYAxis}
                                fill="#000000"
                                name={selectedYAxis}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={selectedXAxis} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={selectedYAxis} stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey={selectedYAxis}
                                    nameKey={selectedXAxis}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    label={(entry: any) => `${entry.name}: ${entry.value}%`}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between gap-8">
                <div className="w-1/3">
                    <label className="block text-sm font-medium mb-2">Chart Type</label>
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="pie">Pie Chart</option>
                    </select>
                </div>

                <div className="w-1/3">
                    <label className="block text-sm font-medium mb-2">X Axis / Category</label>
                    <select
                        value={selectedXAxis}
                        onChange={(e) => setSelectedXAxis(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        {getAxesOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-1/3">
                    <label className="block text-sm font-medium mb-2">Y Axis / Value</label>
                    <select
                        value={selectedYAxis}
                        onChange={(e) => setSelectedYAxis(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        {getAxesOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {renderChart()}
        </div>
    );
};

export default ChartView;

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
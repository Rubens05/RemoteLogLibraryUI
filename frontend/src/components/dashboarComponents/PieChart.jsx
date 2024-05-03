import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const MyBarChart = ({ logs }) => {
    // Procesamiento de datos igual que antes
    const data = logs.reduce((acc, log) => {
        const { level } = log;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    // Preparación de los datos para el BarChart
    const barChartData = Object.keys(data).map(level => ({
        name: level,
        count: data[level],
        color: getColorForLevel(level)
    }));

    return (
        <BarChart
            width={1400}
            height={250}
            margin={{ top: 20 }}
            data={barChartData}
        >
            <CartesianGrid strokeDasharray="6" />
            <XAxis dataKey="name" stroke='white' strokeDasharray="6" />
            <YAxis strokeDasharray="6" stroke='white' />
            <Tooltip />
            <Bar dataKey="count" label={{ position: 'top' }}>
                {
                    barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                }
            </Bar>
        </BarChart>
    );
};

const getColorForLevel = (level) => {
    const colors = {
        ERROR: 'red',
        WARNING: 'yellow',
        INFO: 'green',
        DEBUG: 'peru',
        CRITICAL: 'violet'
    };
    return colors[level] || '#808080';
};

export default MyBarChart;

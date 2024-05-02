import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MyPieChart = ({ logs }) => {
    const data = logs.reduce((acc, log) => {
        const { level } = log;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const pieChartData = Object.keys(data).map(level => ({
        name: level,
        value: data[level],
        color: getColorForLevel(level)
    }));

    return (
        <PieChart width={400} height={400}>
            <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieChartData}
                cx={150}
                cy={170}
                outerRadius={120}
                label
            >
                {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
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

export default MyPieChart;

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyBarChart = ({ logs }) => {
    const data = logs.reduce((acc, log) => {
        const { topic } = log;
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
    }, {});

    const barChartData = Object.keys(data).map(topic => ({
        name: topic,
        count: data[topic]
    }));

    return (
        <BarChart width={500} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    );
};

export default MyBarChart;

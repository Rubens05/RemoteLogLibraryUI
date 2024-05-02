import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
        <BarChart width={1400} height={250} data={barChartData}>
            <CartesianGrid strokeDasharray="6" stroke='white' />
            <XAxis dataKey="name" stroke='white' strokeDasharray="6" />
            <YAxis strokeDasharray="6" stroke='white' />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    );
};

export default MyBarChart;

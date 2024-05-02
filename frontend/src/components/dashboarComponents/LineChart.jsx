import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyLineChart = ({ logs }) => {
    const data = logs.reduce((acc, log) => {
        const { idSender } = log;
        acc[idSender] = (acc[idSender] || 0) + 1;
        return acc;
    }, {});

    const lineChartData = Object.keys(data).sort().map(idSender => ({
        name: idSender,
        count: data[idSender]
    }));

    return (
        <LineChart width={1500} height={350} data={lineChartData}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
    );
};

export default MyLineChart;

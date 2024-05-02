import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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
        <LineChart width={1400} height={250} data={lineChartData}>
            <CartesianGrid strokeDasharray="6" stroke='white' />
            <XAxis dataKey="name" stroke='white' />
            <YAxis stroke="white" strokeDasharray="6" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth="3" fill='white' />
        </LineChart>
    );
};

export default MyLineChart;

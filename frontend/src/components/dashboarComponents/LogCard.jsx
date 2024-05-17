import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../App.css';


const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '').replace('.webp', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../../boardImages', false, /\.(webp|jpg)$/));

const getImageUrl = (boardName) => {
    console.log("Board name:", boardName);
    console.log("Images:", images);
    return images[boardName + ".jpg"] || images['defaultBoard.jpg']; // Retorna una imagen por defecto si el nombre no coincide
};



const LogCard = ({ logs, boardName }) => {
    // Preprocesar los datos para la gráfica
    const levels = ['ERROR', 'WARNING', 'INFO', 'DEBUG', 'CRITICAL'];
    const data = [];

    logs.forEach(log => {
        const date = new Date(log.timestamp);
        const hour = date.toISOString().substring(0, 13) + ":00"; // Agrupar por horas
        let dataPoint = data.find(d => d.time === hour);

        if (!dataPoint) {
            dataPoint = { time: hour };
            levels.forEach(level => dataPoint[level] = 0);
            data.push(dataPoint);
        }

        dataPoint[log.level] += 1;
    });

    // Ordenar los datos por tiempo
    data.sort((a, b) => new Date(a.time) - new Date(b.time));

    return (
        <div className="log-card">
            <div className="image-container">
                <img src={getImageUrl(boardName)} alt={boardName} className="log-card-image" />
                <h1>{boardName}</h1>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={650}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {levels.map(level => (
                            <Line
                                key={level}
                                type="monotone"
                                dataKey={level}
                                stroke={getColorForLevel(level)}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
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

export default LogCard;

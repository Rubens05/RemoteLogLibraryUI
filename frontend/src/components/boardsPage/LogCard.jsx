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
    return images[boardName + ".jpg"] || images['defaultBoard.jpg']; // Retorna una imagen por defecto si el nombre no coincide
};

const getColorForLevel = (level) => {
    const colors = {
        ERROR: 'red',
        WARNING: 'orange',
        INFO: 'green',
        DEBUG: 'blue',
        CRITICAL: 'violet'
    };
    return colors[level] || '#808080';
};



const LogCard = ({ logs, boardName, filterStartDate, filterEndDate, filterInterval }) => {
    // Preprocesar los datos para la gráfica
    const levels = ['ERROR', 'WARNING', 'INFO', 'DEBUG', 'CRITICAL'];
    let data = [];
    let interval;

    if (logs.length === 0) return null;

    if (filterInterval) {
        console.log("Intervalo elegido: " + filterInterval)
        interval = filterInterval;
    } else {

        // If no filter dates are set, filter by day
        if (!filterStartDate || !filterEndDate) {

            if (logs.length < 100) {
                interval = 'minute';
            }
            else if (logs.length > 100 && logs.length < 1500) {
                interval = 'hour';
            }
            else {
                interval = 'day';
            }

        }

        // If both filter dates are set and are the same, filter by hour
        if ((filterStartDate && filterEndDate) && (filterStartDate === filterEndDate)) {
            if (logs.length > 100) {
                interval = 'hour';
            } else {
                interval = 'minute';
            }
        }

        // If both filter dates are set and are different, choose the interval in function of the time difference
        if ((filterStartDate && filterEndDate) && (filterStartDate !== filterEndDate)) {

            if (logs.length < 100) {
                interval = 'minute';
            }
            else if (logs.length > 500 && logs.length < 1500) {
                interval = 'hour';
            }
            else {
                interval = 'day';
            }

        }
    }

    const getTimeKey = (date) => {
        if (interval === 'minute') {
            return date.toISOString().substring(0, 16) + ":00";
        } else if (interval === 'day') {
            return date.toISOString().substring(0, 10);
        } else {
            return date.toISOString().substring(0, 13) + ":00";
        }
    };

    // Set begin and end date
    let beginDate = new Date(logs[logs.length - 1].timestamp);
    let endDate = new Date(logs[0].timestamp);

    // Add the initial point
    let initialPoint = { time: getTimeKey(beginDate) };
    levels.forEach(level => initialPoint[level] = 0);
    data.push(initialPoint);

    logs.forEach(log => {
        const date = new Date(log.timestamp);

        let time = "";

        if (interval === 'minute') {
            time = date.toISOString().substring(0, 16) + ":00";
        } else if (interval === 'day') {
            time = date.toISOString().substring(0, 10);
        } else {
            time = date.toISOString().substring(0, 13) + ":00";
        }


        let dataPoint = data.find(d => d.time === time);

        if (!dataPoint) {
            dataPoint = { time: time };
            levels.forEach(level => dataPoint[level] = 0);
            data.push(dataPoint);
        }

        dataPoint[log.level] += 1;
    });
    // Add the final point
    let finalPoint = { time: getTimeKey(endDate) };
    levels.forEach(level => finalPoint[level] = 0);
    data.push(finalPoint);

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


export default LogCard;

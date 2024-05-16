const express = require('express');
const mongoose = require('mongoose');
const app = express();



require("dotenv").config();

// Database connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
    console.log("Latest log:");
    Log.find().sort({ timestamp: -1 }).limit(1).then(logs => console.log(logs)).catch(err => console.error(err));
});


// Define the schema and the model
const logSchema = new mongoose.Schema({
    level: String,
    message: String,
    idSender: String,
    topic: String,
    timestamp: { type: Date }
});
const Log = mongoose.model('Log', logSchema, "LogRegistry");

// Endpoint for fetching logs
app.get('/api', async (req, res) => {
    const { startDate, endDate, level, senderID, topic, message, hourStart, hourEnd, lastTimestamp, autoRefresh } = req.query;
    console.log("Query params:", req.query);
    try {
        const query = {};

        if ((startDate !== 'null' && startDate !== '') && (endDate === 'null' || endDate === '')) {
            const start = new Date(startDate);
            start.setUTCDate(start.getUTCDate());
            query.timestamp = { $gte: start };
            console.log("Querying logs greaters than", start.toUTCString());

        }
        if ((startDate === 'null' || startDate === '') && (endDate !== 'null' && endDate !== '')) {
            const end = new Date(endDate);
            end.setUTCHours(23, 59, 59, 999);
            query.timestamp = { $lte: end };
            console.log("Querying logs lowers than", end.toUTCString());
        }
        if ((startDate !== 'null' && startDate !== '') && (endDate !== 'null' && endDate !== '')) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            console.log("Start date:", start.toString());
            console.log("End date:", end.toString());

            start.setUTCDate(start.getUTCDate());
            end.setUTCDate(end.getUTCDate());
            end.setUTCHours(23, 59, 59, 999);

            console.log("Start date:", start.toUTCString());
            console.log("End date:", end.toUTCString());

            query.timestamp = { $gte: start, $lte: end };

            console.log("Querying logs between", start.toUTCString(), "and", end.toUTCString());

        }

        if (level !== '') {
            query.level = level;
            console.log("Querying logs with level", level);
        }
        if (senderID !== '') {
            query.idSender = senderID;
            console.log("Querying logs with senderID", senderID);
        }
        if (topic !== '') {
            query.topic = topic;
            console.log("Querying logs with topic", topic);
        }
        if (message !== '') {
            query.message = { $regex: message, $options: 'i' };
            console.log("Querying logs with message containing", message);
        }

        if ((lastTimestamp !== 'null' && lastTimestamp !== '') && autoRefresh === "true") {
            console.log("Querying logs greater than", lastTimestamp);
            query.timestamp = { $gt: new Date(lastTimestamp) };
        }

        let logs = await Log.find(query).sort({ timestamp: -1 })/*.limit(2)*/; //Adjust logs limit

        if (hourStart && hourEnd && (hourStart !== '00:00' || hourEnd !== '23:59')) {
            console.log("Filtering logs by hour");
            logs = logs.filter(log => {
                const logDate = new Date(log.timestamp);
                console.log("Log date:", logDate);

                // Create start date object using the log date and hourStart
                const startDate = new Date(logDate);
                startDate.setUTCHours(parseInt(hourStart.split(":")[0]), parseInt(hourStart.split(":")[1]), 0, 0);

                // Create end date object using the log date and hourEnd
                const endDate = new Date(logDate);
                endDate.setUTCHours(parseInt(hourEnd.split(":")[0]), parseInt(hourEnd.split(":")[1]), 0, 0);

                console.log("Start date:", startDate);
                console.log("End date:", endDate);
                console.log(":::::::::::::::::::.");

                // Check if logDate is within the start and end time
                if (logDate >= startDate && logDate < endDate) {
                    console.log("Log is within the specified hour range");
                    return true;
                } else {
                    console.log("Log is outside the specified hour range");
                    return false;
                }
            });
        }
        console.log("Logs:", logs);

        res.json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: error.message });
    }
});

// Endpoint for fetching new logs
app.get('/api/new', async (req, res) => {
    const { lastTimestamp, hourEnd, hourStart } = req.query;
    console.log("Query params:", req.query);
    try {
        const date = new Date(lastTimestamp);
        date.setUTCDate(date.getUTCDate());
        console.log("Querying logs greater than", date.toUTCString());
        const query = { timestamp: { $gt: date } };
        let logs = await Log.find(query).sort({ timestamp: -1 });

        if (hourStart && hourEnd && (hourStart !== '00:00' || hourEnd !== '23:59')) {
            console.log("Filtering logs by hour");
            logs = logs.filter(log => {
                const logDate = new Date(log.timestamp);
                console.log("Log date:", logDate);

                // Create start date object using the log date and hourStart
                const startDate = new Date(logDate);
                startDate.setUTCHours(parseInt(hourStart.split(":")[0]), parseInt(hourStart.split(":")[1]), 0, 0);

                // Create end date object using the log date and hourEnd
                const endDate = new Date(logDate);
                endDate.setUTCHours(parseInt(hourEnd.split(":")[0]), parseInt(hourEnd.split(":")[1]), 0, 0);

                console.log("Start date:", startDate);
                console.log("End date:", endDate);
                console.log(":::::::::::::::::::.");

                // Check if logDate is within the start and end time
                if (logDate >= startDate && logDate < endDate) {
                    console.log("Log is within the specified hour range");
                    return true;
                } else {
                    console.log("Log is outside the specified hour range");
                    return false;
                }
            });
        }

        res.json({ logs });
    } catch (error) {
        console.error("Error fetching new logs:", error);
        res.status(500).json({ message: error.message });
    }
});


// Endpoint for fetching level, senderID and topic options
app.get('/api/filters', async (req, res) => {
    try {
        const levels = await Log.distinct("level");
        const senderIDs = await Log.distinct("idSender");
        const topics = await Log.distinct("topic");

        res.json({
            levelOptions: levels,
            senderOptions: senderIDs,
            topicOptions: topics
        });
    } catch (error) {
        console.error("Error fetching filter options:", error);
        res.status(500).json({ message: "Error fetching filter options" });
    }
});



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
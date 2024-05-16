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
                console.log("Log date::::::::::::::::::::::::::::::::::::::", logDate);

                // Create date object using the hourStart and hourEnd
                /* use hourStart to create a date object */
                console.log("Year log:", logDate.getUTCFullYear());
                console.log("Month log:", logDate.getMonth());
                console.log("Date log:", logDate.getUTCDate());
                const stringDate = logDate.getUTCFullYear() + "-" + (logDate.getMonth() + 1).toString().padStart(2, '0') + "-" + logDate.getUTCDate();

                const startDate = new Date(stringDate);
                startDate.setUTCDate(startDate.getUTCDate());
                startDate.setUTCHours(hourStart.split(":")[0], hourStart.split(":")[1]);



                console.log("Start date:", startDate);

                const endDate = startDate;

                endDate.setUTCHours(hourEnd.split(":")[0], hourEnd.split(":")[1]);
                console.log("End date:", endDate);
                console.log(":::::::::::::::::::.");


                if (startDate.getUTCDate() <= logDate.getUTCDate() && logDate.getUTCDate() <= endDate.getUTCDate()) {
                    console.log("Lo sacaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
                }


                return (startDate.getUTCDate() <= logDate.getUTCDate() && logDate.getUTCDate() <= endDate.getUTCDate());


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
    const { lastTimestamp } = req.query;
    console.log("Query params:", req.query);
    try {
        const date = new Date(lastTimestamp);
        date.setUTCDate(date.getUTCDate());
        console.log("Querying logs greater than", date.toUTCString());
        const query = { timestamp: { $gt: date } };
        let logs = await Log.find(query).sort({ timestamp: -1 });
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
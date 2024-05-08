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
    const { startDate, endDate, level, senderID, topic, message, hourStart, hourEnd } = req.query;
    console.log("Query params:", req.query);
    try {
        const query = {};
        if (startDate && endDate) {
            let start = new Date(startDate);
            let end = new Date(endDate);
            start.setDate(start.getDate() + 1);
            end.setDate(end.getDate() + 2);
            console.log("Start date:", start);
            console.log("End date:", end);

            if ((startDate === endDate) && (hourStart !== '0' || hourEnd != '23')) {
                console.log("Setting hours");
                console.log("Hour start:", hourStart);
                console.log("Hour end:", hourEnd);
                start.setHours(hourStart, 0, 0, 0);
                end.setHours(hourEnd, 59, 59, 999);

                console.log("Start date with hours:", start);
                console.log("End date with hours:", end);
            }

            query.timestamp = { $gte: start, $lte: end };
            console.log("Querying logs between", start, "and", end);
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


        const logs = await Log.find(query).sort({ timestamp: -1 })/*.limit(500)*/; //Adjust logs limit
        console.log("logs", logs)
        res.json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);
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
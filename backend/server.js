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
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setDate(start.getDate()); //fix the timezone issue
            end.setDate(end.getDate()); //fix the timezone issue
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


        // TODO Iplement the hour range filter
        // if (hourStart !== 0 || hourEnd != 23) {
        //     query.timestamp = { ...query.timestamp, $gte: new Date(0, 0, 0, hourStart), $lte: new Date(0, 0, 0, hourEnd) };
        //     console.log("Querying logs between ", startDate, "and", endDate, " and the range in hours", hourStart, "and", hourEnd);
        // }




        const logs = await Log.find(query).sort({ timestamp: -1 })/*.limit(500)*/; //Fix limit
        console.log("logs", logs)
        res.json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: error.message });
    }
});



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
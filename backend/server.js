const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const app = express();

// Conexión a la base de datos
const uri = process.env.MONGO_URI;
async function connect() {
    try {
        await mongoose.connect(uri);
        console.log('Database connected!');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

connect();

app.get('/api', (req, res) => {
    res.json({
        "logs": [
            { "level": "DEBUG", "message": "Debug en la placa del usuario", "idSender": "defaultIdBoard", "topic": "defaultTopic", "timestamp": "April 10 2024 18:28:04" },
            { "level": "WARNING", "message": "Advertencia en la placa del usuario", "idSender": "defaultIdBoard", "topic": "defaultTopic", "timestamp": "April 10 2024 18:28:05" },
            { "level": "ERROR", "message": "Error en la placa del usuario", "idSender": "defaultIdBoard", "topic": "defaultTopic", "timestamp": "April 10 2024 18:28:06" }]
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


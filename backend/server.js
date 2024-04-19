const express = require('express');
const mongoose = require('mongoose');
const app = express();
// const cors = require('cors');
// app.use(cors());


require("dotenv").config();

// Conexión a la base de datos
const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
    console.log("Latest log:");
    Log.find().sort({ timestamp: -1 }).limit(1).then(logs => console.log(logs)).catch(err => console.error(err));
});


// Definir el esquema del documento y el modelo
const logSchema = new mongoose.Schema({
    level: String,
    message: String,
    idSender: String,
    topic: String,
    timestamp: { type: Date }
});
const Log = mongoose.model('Log', logSchema, "LogRegistry"); // 'Log' es el nombre del modelo y se corresponderá con una colección 'logs'

// Endpoint para obtener los logs
app.get('/api', async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const query = {};
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            start.setDate(start.getDate()); // Incluir todo el día de la fecha inicial
            end.setDate(end.getDate() + 1); // Incluir todo el día de la fecha final
            query.timestamp = { $gte: start, $lte: end };
            console.log("Querying logs between", start, "and", end);
        }
        const logs = await Log.find(query).sort({ timestamp: -1 }).limit(500);
        console.log("logs", logs)
        res.json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: error.message });
    }
});



app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto 5000');
});
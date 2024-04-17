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
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(500);
        console.log("Logs fetched:", logs);  // Debug: Imprimir los logs obtenidos
        res.json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);  // Debug: Imprimir cualquier error
        res.status(500).json({ message: error.message });
    }
});

app.listen(5000, () => {
    console.log('Servidor en ejecución en el puerto 5000');
});


// // Función para insertar un nuevo registro en la base de datos
// async function insertLog(level, message, idSender, topic, timestamp) {
//     try {
//         // Crear una nueva instancia del modelo Log con los datos proporcionados
//         const newLog = new Log({ level, message, idSender, topic, timestamp });

//         // Guardar el nuevo registro en la base de datos
//         await newLog.save();
//         console.log('Registro insertado correctamente:', newLog);

//         return newLog; // Devolver el nuevo registro insertado
//     } catch (error) {
//         console.error('Error al insertar el registro:', error);
//         throw error; // Propagar el error para manejarlo en otro lugar si es necesario
//     }
// }

// // Llamar a la función insertLog para insertar un nuevo registro
// insertLog("DEBUG", "Debug en la placa del usuario", "defaultIdBoard", "defaultTopic", newDate("2024-04-17T14:32:00Z");


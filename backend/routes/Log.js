var express = require("express");
var router = express.Router();

var LogRegistry = require("../models/Log");

// Ruta para obtener todos los registros de autobus
router.get("/", async function (req, res) {
    const logs = await LogRegistry.find()
        .then((logs) => res.status(200).json(logs))
        .catch((err) => res.status(500).send(err));
});

module.exports = router;
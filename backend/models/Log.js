var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LogRegistrySchema = new Schema({
    level: String,
    message: String,
    idSender: String,
    topic: String,
    timestamp: String
});

module.exports = mongoose.model(
    "LogRegistry",
    LogRegistrySchema,
    "Log"
);
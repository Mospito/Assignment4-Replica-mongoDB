const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String
});

module.exports = mongoose.model("Model", modelSchema);
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    message: String,
    canceled: Boolean
});

module.exports = mongoose.model('Note', noteSchema);
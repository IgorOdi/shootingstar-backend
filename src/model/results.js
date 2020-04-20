const mongoose = require('../database');

const resultsSchema = new mongoose.Schema({

    starName: {
        type: String,
        required: true,
    },
    starIndex: {
        type: Number,
    },
    wishesReceived: {
        type: Number,
    },
    starSurvived: {
        type: Boolean,
        required: true,
    },
});

const results = mongoose.model('results', resultsSchema);
module.exports = results;
const mongoose = require('../database');

const resultsSchema = new mongoose.Schema({

    starIndex: {
        type: Number,
        required: true,
    },
    starSurvived: {
        type: Boolean,
        required: true,
    }
});

const results = mongoose.model('results', resultsSchema);
module.exports = results;
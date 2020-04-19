const mongoose = require('../database');

const ConfigSchema = new mongoose.Schema({

    starInterval: {
        type: Number,
        required: true
    },
    wishesNeeded: {
        type: Number,
        default: 10,
    },
    lastStarSurvived: {
        type: Boolean,
        required: true
    }
});

const configs = mongoose.model('configs', ConfigSchema);
module.exports = configs;
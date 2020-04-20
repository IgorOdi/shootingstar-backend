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
});

const configs = mongoose.model('configs', ConfigSchema);
module.exports = configs;
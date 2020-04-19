const mongoose = require('../database');

const currentStarsSchema = new mongoose.Schema({

    starName: {
        type: String,
        required: true,
    },
    starProperty: {
        type: String,
        required: true
    },
    wishesReceived: {
        type: Number,
        default: 0
    },
    endTime: {
        type: Number,
    },
    starIndex: {
        type: Number,
    },
    starMessage: {
        type: String,
        default: "I have nothing to say"
    }
});

const currentStars = mongoose.model('currentStars', currentStarsSchema);
module.exports = currentStars;
const mongoose = require('../database');

const StarSchema = new mongoose.Schema({

    starName: {
        type: String,
        required: true,
    },
    starProperty: {
        type: String,
        required: true
    },
    starMessage: {
        type: String,
        default: "I have nothing to say"
    }
});

const star = mongoose.model('star', StarSchema);
module.exports = star;
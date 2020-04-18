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
    isCurrent: {
        type: Boolean,
        default: false
    }
});

const star = mongoose.model('star', StarSchema);
module.exports = star;
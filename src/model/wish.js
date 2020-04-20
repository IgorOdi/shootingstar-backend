const mongoose = require('../database');

const WishSchema = new mongoose.Schema({

    text: {
        type: String,
        required: true,
    },
    starIndex: {
        type: Number,
        required: true,
    }
});

const wish = mongoose.model('wish', WishSchema);
module.exports = wish;
const mongoose = require('../database');

const WishSchema = new mongoose.Schema({

    text: {
        type: String,
        require: true,
    }
});

const wish = mongoose.model('wish', WishSchema);
module.exports = wish;
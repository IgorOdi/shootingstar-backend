const mongoose = require('mongoose');

const db_uri = 'mongodb+srv://admin:abissal-peixe-brabo@shootingstar-beixj.mongodb.net/shooting-star?retryWrites=true&w=majority';
mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.Promise = global.Promise;
console.log("Conectado ao MongoDB")

module.exports = mongoose;
const express = require('express');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controller/wishController')(app);
require('./controller/starController')(app);

console.log("Backend Iniciado");

app.listen(process.env.PORT || 3000);
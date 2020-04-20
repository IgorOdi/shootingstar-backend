const express = require('express');
const configs = require('../model/configs')

const router = express.Router();
const configUrl = '/config'

router.get(configUrl, async (req, res) => {

    configs.findOne({}, (err, doc) => {

        res = setHeaders(res);
        res.json(doc);
    });
});

function setHeaders(res) {

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res;
}

module.exports = app => app.use('', router);
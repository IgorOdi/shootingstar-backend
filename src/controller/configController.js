const express = require('express');
const configs = require('../model/configs')

const router = express.Router();
const configUrl = '/config'

router.get(configUrl, async (req, res) => {

    configs.findOne({}, (err, doc) => {

        res.json(doc);
    });
});

module.exports = app => app.use('', router);
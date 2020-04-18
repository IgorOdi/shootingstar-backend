const express = require('express');
const wish = require('../model/wish');

const router = express.Router();
const wishUrl = '/wish'

router.post(wishUrl, async (req, res) => {

    try {

        const newWish = await wish.create(req.body);
        return res.send({ newWish });
    } catch (err) {

        return res.status(400).send({ error: 'Failed to make a wish' });
    }
});

router.delete(wishUrl, async (req, res) => {

    wish.deleteMany({}, function (err) {

        if (err) res.status(400).send({ error: 'Failed to delete all wishes' });
        else res.send({
            'status': 'Sucess'
        })
    });
});

router.get(wishUrl, async (req, res) => {

    wish.find({}, 'text', function (err, texts) {

        if (err) console.log("Error");
        res.json(texts);
    })
});

module.exports = app => app.use('', router);
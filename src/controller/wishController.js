const express = require('express');
const wish = require('../model/wish');
const currentStars = require('../model/currentStars');

const router = express.Router();
const wishUrl = '/wish'

router.post(wishUrl, async (req, res) => {

    try {

        const newWish = await wish.create(req.body);
        console.log("New wish received with text: " + req.body.text);

        currentStars.findOne({}, (err, current) => {

            const newWishNumber = current.wishesReceived + 1;
            console.log("Atualizando o número de desejos para: " + newWishNumber);
            currentStars.findOneAndUpdate({}, { 'wishesReceived': newWishNumber }, (err, doc) => { });
        });

        res = setHeaders(res);
        return res.send({ newWish });
    } catch (err) {

        res = setHeaders(res);
        return res.status(400).send({ error: 'Failed to make a wish' });
    }
});

router.delete(wishUrl, async (req, res) => {

    wish.deleteMany({}, function (err) {

        if (err) res.status(400).send({ error: 'Failed to delete all wishes' });
        else {

            console.log("Deletou todos os desejos com sucesso");
            res = setHeaders(res);
            res.send({ 'status': 'Sucess' });
        }
    });
});

router.get(wishUrl, async (req, res) => {

    wish.find({}, 'text', function (err, texts) {

        if (err) console.log("Error");
        console.log("Retornando desejos " + texts);
        res = setHeaders(res);
        res.json(texts);
    })
});

router.get(wishUrl + '/:index', async (req, res) => {

    const index = parseInt(req.params.index);
    console.log("Buscando desejos de index " + index);
    wish.find({ 'starIndex': index }, (err, wishes) => {

        res = setHeaders(res);
        res.send(wishes);
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
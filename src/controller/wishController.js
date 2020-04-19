const express = require('express');
const wish = require('../model/wish');
const currentStars = require('../model/currentStars');

const router = express.Router();
const wishUrl = '/wish'

router.post(wishUrl, async (req, res) => {

    try {

        console.log("New wish received with text: " + req.body.text);
        const newWish = await wish.create(req.body);

        currentStars.findOne({}, (err, current) => {

            const newWishNumber = current.wishesReceived + 1;
            console.log("Atualizando o número de desejos para: " + newWishNumber);
            currentStars.findOneAndUpdate({}, { 'wishesReceived': newWishNumber }, (err, doc) => { });
        });


        return res.send({ newWish });
    } catch (err) {

        return res.status(400).send({ error: 'Failed to make a wish' });
    }
});

router.delete(wishUrl, async (req, res) => {

    wish.deleteMany({}, function (err) {

        if (err) res.status(400).send({ error: 'Failed to delete all wishes' });
        else {

            console.log("Deletou todos os desejos com sucesso");
            res.send({ 'status': 'Sucess' });
        }
    });
});

router.get(wishUrl, async (req, res) => {

    wish.find({}, 'text', function (err, texts) {

        if (err) console.log("Error");
        console.log("Retornando desejos " + texts);
        res.json(texts);
    })
});

module.exports = app => app.use('', router);
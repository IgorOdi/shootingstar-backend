const express = require('express');
const cron = require('node-cron');
const star = require('../model/star');
const configs = require('../model/configs')
const results = require('../model/results')
const currentStars = require('../model/currentStars');
const configController = require('./configController');

const router = express.Router();
const starUrl = '/star'
const createStarUrl = '/star/create'

var lastIndex = 0

console.log("Iniciando troca de estrela por tempo");
set_new_star();

async function set_new_star(req, res) {

    star.find({}, async function (err, stars) {

        if (!err) {

            let previousStar = 0;
            let starIndex = 0;
            currentStars.findOne({}, async (err, prevStar) => {

                if (prevStar) {

                    previousStar = prevStar;
                    starIndex = prevStar.starIndex + 1;
                }

                var nextStarIndex = lastIndex;

                while (nextStarIndex == lastIndex) {
                    nextStarIndex = Math.floor(Math.random() * stars.length);
                    console.log('Random star returned ' + nextStarIndex);
                }

                lastIndex = nextStarIndex;
                console.log("Next Star index is: " + nextStarIndex);
                console.log("Next Star is: " + stars[nextStarIndex].starName);

                configs.findOne({}, async (err, doc) => {

                    wishesNeeded = doc.wishesNeeded;
                    interval = doc.starInterval;

                    let interval = 0;
                    let wishesNeeded = 0;
                    let result = null;
                    if (prevStar) {
                        console.log("A última estrela precisava de: " + wishesNeeded + " desejos");
                        console.log("E recebeu: " + previousStar.wishesReceived + " desejos");
                        const survived = previousStar.wishesReceived >= wishesNeeded;
                        console.log(survived ? "The Last Star Survived" : "The Last Star Perished");

                        result = await results.create({
                            'starName': previousStar.starName,
                            'wishesReceived': previousStar.wishesReceived,
                            'starIndex': prevStar.starIndex,
                            'starSurvived': survived
                        });
                    }

                    let actualTime = new Date(new Date().toUTCString()).valueOf();
                    const nextTime = actualTime + interval * 1000;
                    currentStars.findOneAndUpdate({}, {
                        'starName': stars[nextStarIndex].starName,
                        'starProperty': stars[nextStarIndex].starProperty,
                        'wishesReceived': 0,
                        'endTime': nextTime,
                        'starIndex': starIndex,
                        'starMessage': stars[nextStarIndex].starMessage
                    }, async function (err, newStar, r) {

                        setTimeout(function () { set_new_star() }, interval * 1000);

                        if (res) {

                            res = setHeaders(res);
                            res.send({ newStar });
                            if (prevStar) res.send({ result });
                        }
                    });
                });
            });

        } else {

            if (res) {
                res = setHeaders(res);
                res.status(400).send({ error: 'There is no star in the list' });
            }
        }
    });
}

router.post(starUrl, async (req, res) => {

    set_new_star(req, res);
});

router.get(starUrl + '/:param', async (req, res) => {

    if (req.params.param == 'list') {

        star.find({}, function (err, stars) {

            if (err) res.status(400).send({ error: 'There is no star in the list' });
            else res.json(stars);
        });

    } else if (req.params.param == 'current') {

        currentStars.findOne({}, (err, newStar) => {

            res = setHeaders(res);
            res.send(newStar);
        });
    } else {

        return res.status(400).send({ error: 'Parameter not recognized' });
    }
});


router.get(starUrl + '/:param/:index', async (req, res) => {

    if (req.params.param == 'survive') {

        const index = req.params.index;
        results.findOne({ 'starIndex': index }, (err, result) => {

            if (!result) res.status(400).send({ error: 'Failed to get result for index ' + index });
            else {
                res = setHeaders(res);
                res.send(result);
            }
        });
    } else {
        res.status(400).send({ error: 'Parameter not recognized' });
    }
});

router.delete(starUrl, async (req, res) => {

    results.deleteMany({}, function (err) {

        if (err) res.status(400).send({ error: 'Failed to delete all results' });
        else {

            currentStars.findOneAndUpdate({}, { 'starIndex': 0 }, (err, doc, res) => { });
            console.log("Deletou todos os resultados com sucesso");
            res = setHeaders(res);
            res.send({ 'status': 'Sucess' });
        }
    });
});

router.post(createStarUrl, async (req, res) => {

    try {

        const newStar = await star.create(req.body);
        res = setHeaders(res);
        return res.send({ newStar });
    } catch (err) {

        res = setHeaders(res);
        return res.status(400).send({ error: 'Failed to create a new Shooting Star' });
    }
});

function setHeaders(res) {

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Accept, X-Access-Token, X-Application-Name, X-Request-Sent-Time");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res;
}

module.exports = app => app.use('', router);
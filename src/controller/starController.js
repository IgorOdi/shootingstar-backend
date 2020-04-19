const express = require('express');
const cron = require('node-cron');
const star = require('../model/star');
const configs = require('../model/configs')
const currentStars = require('../model/currentStars');
const configController = require('./configController');

const router = express.Router();
const starUrl = '/star'
const createStarUrl = '/star/create'

var lastIndex = 0

console.log("Iniciando troca de estrela por tempo");
set_new_star();

async function set_new_star(req, res) {

    star.find({}, function (err, stars) {

        if (!err) {

            let previousStar = star;
            let starIndex = 0;
            currentStars.findOne({}, (err, prevStar) => {

                previousStar = prevStar;
                starIndex = prevStar.starIndex + 1;
                console.log(starIndex);

                var nextStarIndex = lastIndex;

                while (nextStarIndex == lastIndex) {
                    nextStarIndex = Math.floor(Math.random() * stars.length);
                    console.log('Random star returned ' + nextStarIndex);
                }

                lastIndex = nextStarIndex;
                console.log("Next Star index is: " + nextStarIndex);
                console.log("Next Star is: " + stars[nextStarIndex].starName);

                let interval = 0;
                let wishesNeeded = 10;
                configs.findOne({}, (err, doc) => {

                    wishesNeeded = doc.wishesNeeded;
                    interval = doc.starInterval;
                });

                let actualTime = new Date(new Date().toUTCString()).valueOf();
                const nextTime = actualTime + interval * 1000;
                currentStars.findOneAndUpdate({}, {
                    'starName': stars[nextStarIndex].starName,
                    'starProperty': stars[nextStarIndex].starProperty,
                    'wishesReceived': 0,
                    'endTime': nextTime,
                    'starIndex': starIndex,
                    'starMessage': stars[nextStarIndex].starMessage
                }, function (err, newStar, r) {

                    setTimeout(function () { set_new_star() }, interval * 1000);
                    const survived = previousStar.wishesReceived >= wishesNeeded;
                    console.log(survived ? "The Last Star Survived" : "The Last Star Perished");
                    configs.findOneAndUpdate({}, {

                        'lastStarSurvived': survived
                    });
                    if (res)
                        res.send({ newStar, 'lastStarSurvived': survived });
                });
            });

        } else {

            if (res)
                res.status(400).send({ error: 'There is no star in the list' });
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

            res.send(newStar);
        });
    } else {

        return res.status(400).send({ error: 'Parameter not recognized' });
    }
});

router.post(createStarUrl, async (req, res) => {

    try {

        const newStar = await star.create(req.body);
        return res.send({ newStar });
    } catch (err) {

        return res.status(400).send({ error: 'Failed to create a new Shooting Star' });
    }
});

module.exports = app => app.use('', router);
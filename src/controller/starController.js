const express = require('express');
const star = require('../model/star');

const router = express.Router();
const starUrl = '/star'
const createStarUrl = '/star/create'

var lastIndex = 0

router.post(starUrl, async (req, res) => {

    star.find({}, function (err, stars) {

        if (!err) {

            var nextStarIndex = lastIndex;
            star.findOne({ 'isCurrent': true }, function (err, star) {

                while (nextStarIndex == lastIndex) {
                    nextStarIndex = Math.floor(Math.random() * stars.length);
                    console.log('Random star returned ' + nextStarIndex);
                }

                lastIndex = nextStarIndex;
                console.log('Next star index is: ' + nextStarIndex);
            });

            star.updateOne({ 'isCurrent': true }, { 'isCurrent': false }, function (err) {

                console.log('The current star is not the current anymore');
                star.updateOne({ 'starName': stars[nextStarIndex].starName }, { 'isCurrent': true }, function (err) {

                    console.log('The star ' + stars[nextStarIndex].starName + ' is now the current star in the sky');
                    res.send({
                        '_id': stars[nextStarIndex]._id,
                        'starName': stars[nextStarIndex].starName,
                        'starProperty': stars[nextStarIndex].starProperty
                    })
                });
            });

        } else {
            res.status(400).send({ error: 'There is no star in the list' });
        }
    });
});

router.get(starUrl + '/:param', async (req, res) => {

    if (req.params.param == 'list') {

        star.find({}, function (err, stars) {

            if (err) res.status(400).send({ error: 'There is no star in the list' });
            else res.json(stars);
        });

    } else if (req.params.param == 'current') {

        star.find({ 'isCurrent': true }, function (err, stars) {

            if (!err) {

                if (stars == '')
                    res.send({ error: 'There is no current star' });
                res.json(stars);
            } else {
                res.status(400).send({ error: 'There is no star in the list' });
            }
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
'use strict';

var express = require('express');
var router = express.Router();
var locations = require('../location');

var eatPoint = require('../models/eatPoint');

router.get('/', function (err, res, next) {

    var monthNames = [
        "Januar", "Februar", "März",
        "April", "Mai", "Juni", "Juli",
        "August", "September", "October",
        "November", "Dezember"
    ];

    var date = new Date();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var dateformated = day + " " + monthNames[monthIndex] + " " + year

    locations.getAll(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var names = []
            for (var index in result) {
                if (result[index].name.length > 0) {
                    names.push(result[index].name);
                }
            }
            res.render('index', {
                'actDate': dateformated,
                'eatPoints': names
            });
        }
    })
})

module.exports = router;

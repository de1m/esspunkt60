'use strict';

var Mongoose = require('mongoose');

var eatPointSchema = new Mongoose.Schema({
    name: String,
    beste: String,
    img: {
        name: String,
        uploaded: Boolean,
        path: String
    },
    doc: {
        name: String,
        uploaded: Boolean,
        path: String
    },
    tag: Array,
    addrr: {
        str: String,
        plz: String,
        tel: String,
        ort: String,
        mapurl: String,
        menulink: String
    }
});

var eatDaySchema = new Mongoose.Schema({
    name: String,
    created_on: Date,
    location: {
        point: String,
        time: String,
        beste: String
    },
    members: Array,
    comments: Array
});

var userSchema = new Mongoose.Schema({
    name: String,
    finger: String,
    rating: {
        location: Array
    }
})

var eatPoint    = Mongoose.model('points', eatPointSchema);
var eatDay      = Mongoose.model('days', eatDaySchema);
var userMod     = Mongoose.model('users', userSchema);

module.exports = {eatPoint, eatDay, userMod};

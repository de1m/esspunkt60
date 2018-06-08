'use strict';

var Mongoose = require('mongoose');

var userSchema = new Mongoose.Schema({
    username: String,
    fprint: String,
    hash: String,
    stars: Number
})

var userModel     = Mongoose.model('users', userSchema);

module.exports = {userModel};
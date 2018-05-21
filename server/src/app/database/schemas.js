'use strict';

var Mongoose = require('mongoose');

var userSchema = new Mongoose.Schema({
    name: String,
    finger: String
})

var userModel     = Mongoose.model('users', userSchema);

module.exports = {userModel};
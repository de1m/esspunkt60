'use strict';

var Mongoose = require('mongoose');
var auth = process.env.AUTH || 'false';
var mongoAddr = process.env.MONGOADDR || 'localhost';
var mongoPort = process.env.MONGOPORT || '27017';
var mongoDb = process.env.MONGODB || 'esspunkt60';
var mongoUser = process.env.MONGOUSER || 'essen';
var mongoPass = process.env.MONGOPASS || 'essen6003';

if(auth === true){
    var dbURI = 'mongodb://' +
    mongoUser + ":" +
    mongoPass + "@" +
    mongoAddr + ":" +
    mongoPort + "/" +
    mongoDb;
} else {
    var dbURI = 'mongodb://' +
    mongoAddr + ":" +
    mongoPort + "/" +
    mongoDb;
}

Mongoose.connect(dbURI, { useMongoClient: true });

// Throw an error if the connection fails
Mongoose.connection.on('error', function (err) {
    if(err){
        console.log("DB ERR: " + err);
        process.exit(1);
    }
});

// Use native promises
Mongoose.Promise = global.Promise;

module.exports = {
    Mongoose,
    models: {
        eatPoint: require('./schemas').eatPoint,
        eatDay: require('./schemas').eatDay,
        user: require('./schemas').userMod
    }
}

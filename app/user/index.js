'use strict';

var eatPoint = require('../models/eatPoint');
var dailyPoint = require('../models/eatDay');
var userModel = require('../models/users');

function findPrint(fingerPrint, callback){
    userModel.findPrint(fingerPrint, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

function saveUser(userObj, callback){
    userModel.saveUser(userObj, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

function delUserFinger(userObj, callback){
    userModel.deleteUser(userObj, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

function updateRatedLoc(locName, userObj, callback){
    //userObj = { name: 'awalker', finger: '70827ec210b70137548b076d296f841b' }
    userModel.findPrint(userObj.finger, function(err, userFound){
        if(err){
            return callback(err, null);
        } else{
            var ratedLocArr = userFound[0].rating.location;
            ratedLocArr.contains(locName, function(found){
                if(found){
                    eatPoint.findNamed(locName, function(err, loc){
                        if(err){
                            return callback(err, null);
                        } else {
                            return callback(null, {'state': false, 'location': loc[0]})
                        }
                    })
                } else {
                    ratedLocArr.push(locName);
                    userModel.saveRatedLocation(userObj,ratedLocArr, function(err, savedLocStat){
                        if(err){
                            return callback(err, null);
                        } else {
                            return callback(null, savedLocStat);
                        }
                    })
                }
            })

        }
    })
}

Array.prototype.contains = function (k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }

        if (self[i] === k) {
            return callback(true);
        }

        return process.nextTick(check.bind(null, i + 1));
    }(0));
}

module.exports = {
    findPrint,
    saveUser,
    updateRatedLoc,
    delUserFinger
}

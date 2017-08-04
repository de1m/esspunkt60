'use strict';

var usersMod = require('../database').models.user;

var findPrint = function (fingerPrint, callback){
    usersMod.find({'finger': fingerPrint}, function(err, userStat){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, userStat);
        }
    })
}

var saveUser = function(userObj, callback){
    //userObj= { name: 'adfsdf', finger: '70827ec210b70137548b076d296f841b' }
    var newUser = new usersMod(userObj);
    findPrint(userObj.finger, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            if(result.length <= 0){
                newUser.save(function(err, saveState){
                    if(err){
                        return callback(err, null);
                    } else {
                        return callback(null, saveState);
                    }
                });
            } else {
                return callback(null, result);
            }
        }
    })
}

var deleteUser = function(userObj, callback){
    usersMod.remove({'name': userObj.name, 'finger': userObj.finger}, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

var saveRatedLocation = function(userObj, ratedArray, callback){
    //userObj = { name: 'awalker', finger: '70827ec210b70137548b076d296f841b' }
    usersMod.update({ 'finger': userObj.finger },{ $set: {'rating.location': ratedArray} }, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, {'state': true, 'output': result});
        }
    })
}

module.exports = {
    findPrint,
    saveUser,
    deleteUser,
    saveRatedLocation
};

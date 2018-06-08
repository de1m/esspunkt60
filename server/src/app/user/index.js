'use strict'
var usersMod = require('../database').models.user;
var crypto = require('crypto');

var salt = 'Lkmslkjjj0023mA';

var getUserFromDB = function (userInfo, callback) {
  let userModel = new usersMod(userInfo);
  usersMod.find({ 'hash': userInfo.hash }, function (err, dataUser) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, dataUser);
    }
  })
}

var saveUserToDB = function (userInfo, callback) {
  let userModel = new usersMod(userInfo);
  userModel.save(function (err, saveOutput) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, saveOutput);
    }
  })
}

var createNewUser = function (userInfo, callback) {
  userInfo.stars = 0;
  userInfo.hash = crypto.createHash('md5').update(userInfo.username + userInfo.fprint + salt).digest("hex");

  getUserFromDB(userInfo, function (err, output) {
    if (err) {
      callback(err, null);
    } else {
      if (output.length > 0) {
        callback(null, {
          userExist: true,
          auth: true,
          hash: userInfo.hash,
          stars: output[0].stars
        })
      } else {
        saveUserToDB(userInfo, function (err, saveresult) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, {
              userExis: false,
              auth: true,
              hash: saveresult.hash,
              stars: saveresult.stars
            })
          }
        })
      }
    }
  })
}

var getUser = function (getuserInfo, callback) {
  getuserInfo.hash = crypto.createHash('md5').update(getuserInfo.username + getuserInfo.fprint + salt).digest("hex");
  getUserFromDB({ 'hash': getuserInfo.hash }, function (err, dataUser) {
    if (err) {
      callback(err, null);
    } else {
      if (dataUser.length > 0) {
        callback(null, {
          userExist: true,
          auth: true,
          hash: getuserInfo.hash,
          stars: dataUser[0].stars
        })
      } else {
        callback(null, {
          userExis: false,
          auth: false
        })
      }
    }
  })
}

var deleteUser = function (userInfo, callback) {
  let userModel = new usersMod(userInfo);
  userInfo.hash = crypto.createHash('md5').update(userInfo.username + userInfo.fprint + salt).digest("hex");
  usersMod.deleteOne({'hash': userInfo.hash}, function (err, delUserRes) {
    if (err){
      callback(err, null);
    } else {
      callback(null, delUserRes)
    }
  })
}

module.exports = {
  createNewUser,
  getUser,
  deleteUser
};
'use strict'

var user = require('../user');

module.exports = {
  start: function (io) {
    io.on('connection', function (socket) {
      socket.on('user_login_data', function (userData) {
        // console.log('user_login_data', userData)
        user.getUser(userData, function (err, result) {
          if (err) {
            socket.emit('userBackData', {
              err: true,
              errMess: err,
              user: userData.username,
              auth: false,
              stars: result.stars
            })
        } else {
          if (result.auth === false){
            socket.emit('userBackData', {
              err: true,
              errMess: 'User not exist',
              username: userData.username,
              auth: false,
              hash: result.hash,
              stars: result.stars
            })
          } else {
            socket.emit('userBackData', {
              err: false,
              username: userData.username,
              auth: true,
              hash: result.hash,
              stars: result.stars
            })
          }
        }
        })
      })
      
      socket.on('user_login_create', function (userData) {
        user.createNewUser(userData, function (err, result) {
          if (err) {
            socket.emit('userBackDataCreate', {
              err: true,
              errMess: err,
              user: userData.username,
              auth: false,
              stars: result.stars
            })
          } else {
            socket.emit('userBackDataCreate', {
              err: false,
              username: userData.username,
              auth: true,
              hash: result.hash,
              stars: result.stars
            })
          }
        })
      })

      socket.on('user_delete_data', function(userToDel){
        user.deleteUser(userToDel, function (err, delUserRes){
          let retObj = {}
          if (err) {
            retObj = {
              err: true,
              auth: false,
              errMess: err
            }
          } else {
            retObj = {
              err: false,
              auth: false,
              output: delUserRes
            }
          }
          socket.emit('user_delete_data_back', retObj)
        })
      })
    })
  }
}
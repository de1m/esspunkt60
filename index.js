var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs');

var appPort = process.env.APPPORT || "5000"

app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

server.listen(appPort, function () {
  console.log('Server listening at port %d', appPort);
});

//App components
var routes = require('./app/routes');

app.use('/', routes);

io.attach(server);

var socket = require('./app/socket');
socket.start(io);

checkDirectory(__dirname + '/public/upload', function (err, uploadDir) {
  if (err) {
    console.log(err);
  } else {
    checkDirectory(__dirname + '/public/upload/doc', function (err, docDir) {
      if (err) {
        console.log(err);
      }
    })
    checkDirectory(__dirname + '/public/upload/images', function (err, docDir) {
      if (err) {
        console.log(err);
      }
    })
  }
});

function checkDirectory(directory, callback) {
  fs.exists(directory, function (err, stat) {
    if (err) {
      return callback(err, null);
    } else {
      if (!stat) {
        fs.mkdir(directory, function (err, result) {
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        })
      }
    }
  })
}
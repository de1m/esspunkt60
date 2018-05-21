var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var appPort = process.env.APPPORT || "8081"

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
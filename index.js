var express         = require('express');
var app             = express();
var server          = require('http').createServer(app);
var io              = require('socket.io')(server);
var fs              = require('fs');

var appPort = process.env.APPPORT || "5000"

app.set('views', __dirname + '/app/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

server.listen(appPort, function () {
  console.log('Server listening at port %d', appPort);
});

//App components
var routes      = require('./app/routes');

app.use('/', routes);

io.attach(server);

var socket = require('./app/socket');
socket.start(io);

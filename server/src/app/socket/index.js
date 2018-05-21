'use strict'

module.exports = {
    start: function(io){
        io.on('connection', function (socket) {
            // console.log('client connected');
            socket.on('emit_met', function(val){
                console.log(val);
                socket.emit('data', 'da');
            })
            socket.on('user_login_data', function (userData){
                socket.emit('userBackData', {
                    auth: true,
                    user: 'de1m'
                })
            })
        })
    }
}
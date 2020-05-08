const express = require('express'),
      router  = express.Router();

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport, io, moment) => {
    const chat = io
        .of('/chat')
        .on('connection', (socket) => {
            socket.on('message', (data) => {
                /* TODO: limit the throughput
                    > set a limit for 3000 characters so as not to clog the server
                */
                socket.broadcast.emit('message', data)
            });

            socket.on('disconnect', () => {
                /* TODO: add disconnected user message emission
                    > need to emit message of which exact user disconnected
                 */
                // socket.broadcast.emit('message', JSON.stringify({
                //     sender: 'System',
                //     time: moment().format('HH:mm'),
                //     message: [`Пользователь отключился`]
                // }));
            });
        });

    return router;
};
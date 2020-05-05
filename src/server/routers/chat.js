const express = require('express'),
      router  = express.Router();

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport, io, moment) => {
    const chat = io
        .of('/chat')
        .on('connection', (socket) => {
            console.log('[+] a user connected to chat');
            socket.broadcast.emit('message', JSON.stringify({
                sender: 'System',
                time: moment().format('HH:mm'),
                message: [`Пользователь подключился`]
            }));

            socket.on('message', (data) => {
                socket.broadcast.emit('message', data)
            });

            socket.on('disconnect', () => {
                console.log('[-] a user disconnected from chat');
                socket.broadcast.emit('message', JSON.stringify({
                    sender: 'System',
                    time: moment().format('HH:mm'),
                    message: [`Пользователь отключился`]
                }));
            });
        });

    return router;
};
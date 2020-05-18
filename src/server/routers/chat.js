const express = require('express'),
      router  = express.Router();

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport, io, moment) => {
    function listUsers() {
        let logins = [];
        for (let a in users) {
            logins.push(users[a].login)
        }
        chat.emit('list', JSON.stringify(logins));
    }

    let users = {};
    /* TODO: add random color codes to newly joined users

     */

    /* TODO: add chat logging
        > log everything in chat and send it upon entering it
        > perhaps i should use Vue list loader component from here:
            URL: https://github.com/IvanSafonov/vue-list-scroller
     */
    const chat = io
        .of('/chat')
        .on('connection', (socket) => {
            socket.on('login', data => {
                data = JSON.parse(data);
                users[data.id] = {
                    socket: socket,
                    login: data.login
                };
                chat.emit('message', JSON.stringify({
                    sender: 'Система',
                    time: moment().format('HH:mm'),
                    message: [`Пользователь ${data.login} подключился`]
                }));
                listUsers();
            });

            socket.on('message', data => {
                /* TODO: limit the throughput
                    > set a limit for 3000 characters so as not to clog the server
                */
                socket.broadcast.emit('message', data)
            });

            socket.on('disconnect', () => {
                for (let n in users) {
                    if (users[n].socket.disconnected) {
                        chat.emit('message', JSON.stringify({
                            sender: 'Система',
                            time: moment().format('HH:mm'),
                            message: [`Пользователь ${users[n].login} отключился`]
                        }));
                        delete users[n];
                    }
                }
                listUsers();
            });
        });

    return router;
};
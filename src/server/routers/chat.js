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
    const history = [];
    /* TODO: add random color codes to newly joined users
            > or not :shrug:
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
                history.forEach(unit => {
                    chat.to(socket.id).emit('message',JSON.stringify(unit));
                });
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
                let oData = JSON.parse(data);
                if (history.length) {
                    if (history[history.length-1].sender === oData.sender) {
                        oData.message.forEach((entry) => {
                            history[history.length-1].message.push(entry)
                        })
                    } else {
                        history.push(oData)
                    }
                } else {
                    history.push(oData)
                }
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
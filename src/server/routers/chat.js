const express = require('express'),
      router  = express.Router();

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport, io, moment) => {
        /*
            This function extracts user logins from the users Object
            and emits the list to clients connected to chat via 'list' event
            that updates clients' Connected users table
         */
    function listUsers() {
        let logins = [];
        for (let a in users) {
            logins.push(users[a].login)
        }
        chat.emit('list', JSON.stringify(logins));
    }

        /*
            users{} stores connected sockets
            history[] stores messages log
         */
    let users = {};
    const history = [];

    const chat = io
        .of('/chat')
        .on('connection', (socket) => {
            /*
                Mere connection to the socket is not enough
                user must be logged in so as to use this app
                so when user enters chat AND is logged in, 'login' event is triggered
                that stores the freshly connected user socket and login in users{} object
                where the key to said user is user's account passport ID

                then it emits stored messages to said user catching him up with the chat
                lastly emits a message that said user is now connected
                and updates clients' connected users table
             */
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

            /*
                on 'message' event this function checks if message data exceeds maximum character length
                and if not, it appends it to message history[] and then broadcasts to connected users
                except for the sender, as he appends it on his side automatically
             */
            socket.on('message', data => {
                let oData = JSON.parse(data);
                if (oData.message[0].length > 3000) return false;
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

            /*
                on user disconnect function checks users{} object for sockets with a .disconnected status
                upon finding one, it emits a message saying that the said user left the chat
                deletes the socket from users{} object and updates clients' connected users table
             */
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
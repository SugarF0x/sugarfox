const express = require('express');
const router = express.Router();

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport) => {
    router.get('/appendMessage', (req, res) => {
        if (!req.user) {
            res.status(401).json({
                result: 0,
                msg: 'Отказано в доступе: войдите в свой профиль для продолжения'
            });
        } else {
            // TODO: chat append handler with socket.io and shit
        }
    });

    return router;
};
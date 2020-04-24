const express = require('express');
const fs = require('fs');
const router = express.Router();

/* TODO:
    > Add a check for whether the user is logged in or not in order to be entitled to receiving quotes
 */

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = (passport) => {
    router.get('/', (req, res) => {
        if (!req.user) {
            res.status(401).send('Отказано в доступе: войдите в свой профиль для продолжения');
        } else {
            fs.readFile('dist/server/db/quotes.txt', 'utf8', (err, data) => {
                if(err){
                    res.status(404).json({result: 0, text: err});
                } else {
                    res.send(data.split('\n').join('<br>'));
                }
            })
        }
    });

    router.get('/random', (req, res) => {
        if (!req.user) {
            res.status(401).json({
                result: 0,
                quote: 'Цитаты только для зарегистрированных пользователей',
                id: 0,
                max: 0
            })
        } else {
            fs.readFile('dist/server/db/quotes.txt', 'utf8', (err, data) => {
                if(err){
                    res.status(404).json({
                        result: 0,
                        text: err
                    });
                } else {
                    let quotes = data.split(/\r?\n/);
                    let id = Math.floor(Math.random() * quotes.length);
                    res.json({
                        result: 1,
                        quote: quotes[id],
                        id: id+1,
                        max: quotes.length
                    });
                }
            })
        }
    });

    /* TODO: standardise error responses to same json structure */

    router.get('/:id', (req, res) => {
        if (!req.user) {
            res.status(401).json({
                result: 0,
                quote: 'Цитаты только для зарегистрированных пользователей'
            })
        } else {
            fs.readFile('dist/server/db/quotes.txt', 'utf8', (err, data) => {
                if(err){
                    res.status(404).json({
                        result: 0,
                        msg: err
                    });
                } else {
                    let id = req.params.id;
                    let quotes = data.split(/\r?\n/);
                    if (!isNaN(id)) {
                        id = +id;
                        if (id > 0 && id <= quotes.length) {
                            res.json({
                                result: 1,
                                quote: quotes[id-1],
                                id: id,
                                max: quotes.length
                            });
                        } else {
                            res.status(404).json({
                                result: 0,
                                msg: 'ERR: No quote with such ID'
                            });
                        }
                    } else {
                        res.status(404).json({
                            result: 0,
                            msg: `ERR: No '${req.params.id}' request defined`
                        });
                    }
                }
            })
        }
    });

    return router;
};
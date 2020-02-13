const express = require('express');
const fs = require('fs');
const router = express.Router();

/* TODO:
    > Make JSON instead of txt file for quotes
        make it an array of objects each having three attributes
            quote: quote itself
            lore: the origin of a quote or some shit
            source: link to the source if any
 */

router.get('/', (req, res) => {
    fs.readFile('dist/server/db/quotes.txt', 'utf8', (err, data) => {
        if(err){
            res.status(404).json({result: 0, text: err});
        } else {
            res.json({
                quotes: data.split(/\r?\n/)
            });
        }
    })
});

router.get('/random', (req, res) => {
    fs.readFile('dist/server/db/quotes.txt', 'utf8', (err, data) => {
        if(err){
            res.status(404).json({result: 0, text: err});
        } else {
            let quotes = data.split(/\r?\n/);
            let id = Math.floor(Math.random() * quotes.length);
            res.json({
                quote: quotes[id],
                id: id+1,
                max: quotes.length
            });
        }
    })
});

router.get('/:id', (req, res) => {
    fs.readFile('dist/server/db/quotes.txt', 'utf8', (err, data) => {
        if(err){
            res.status(404).json({result: 0, msg: err});
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
                    res.status(404).json({result: 0, msg: 'ERR: No quote with such ID'});
                }
            } else {
                res.status(404).json({result: 0, msg: `ERR: No '${req.params.id}' request defined`});
            }
        }
    })
});

module.exports = router;
const express = require('express'),
      fs      = require('fs'),
      router  = express.Router();

// ---------- ---------- ---------- ---------- ---------- \\

module.exports = () => {
    /*
        this GET request returns minecraft data JSON
     */
    router.get('/', (req, res) => {
        fs.readFile('dist/server/db/minecraft.json', 'utf8', (err, data) => {
            if(err){
                res.status(404).json({result: 0, text: err});
            } else {
                let json = JSON.parse(data);
                res.json({
                    result: 1,
                    data: json
                });
            }
        });
    });

    /* TODO: make the following POST PUT DELETE requests
        > the functionality is listed in corresponding comments
     */

    /*
        this POST request adds modpack to the data file
     */
    router.post('/add', (req, res) => {
        res.send('under construction');
    });

    /*
        this PUT request edits existing modpack
     */
    router.put('/edit', (req, res) => {
        res.send('under construction');
    });

    /*
        this DELETE request deletes modpack completely
     */
    router.delete('/delete', (req,res) => {
        res.send('under construction');
    });

    return router;
};
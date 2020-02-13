const express = require('express');
const app = express();
const routerQuotes = require('./routers/quotes');
const moment = require('moment');

app.use(express.json());
app.use('/', express.static('dist/public'));
app.use('/api/quotes', routerQuotes);

app.listen(3000, () => {
    console.log('--------------------------------------');
    console.log(`[${moment().format('HH:mm:ss')}] Server started at Port 3000\n`);
});
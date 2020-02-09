const express = require('express');
const app = express();

app.use(express.json());
app.use('/', express.static('dist/public'));

app.listen(3000, () => console.log('Listen on port 3000...'));
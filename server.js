const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3030);
console.log('Server listening at http://localhost:3030/');

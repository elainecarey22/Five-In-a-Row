const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

port = 3080;

app.use(bodyParser.json());

// get game endpoints from routes file
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log(`Server listening on the port:${port}`);
});
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const table = require('table');

app.use(cors());
app.use(bodyParser.json());

port = 3080;
gameState = { ready: false, users: [] };

tableData = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
]

// Creating column width configuration 
config = {
    columns: {
        0: {
            width: 1   // Columns of width 1 
        },
        1: {
            width: 1
        },
        2: {
            width: 1
        },
        3: {
            width: 1
        },
        4: {
            width: 1
        },
        5: {
            width: 1
        },
        6: {
            width: 1
        },
        7: {
            width: 1
        },
        8: {
            width: 1
        }
    }
};
let board = table.table(tableData, config);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/api/user', (req, res) => {
    // console.log(req.body.user);
    const user = req.body.user;
    if (gameState.users.length === 2) {
        res.send('Game is full');
    } else {
        gameState.users.push(user);
        if (gameState.users.length === 1) {
            res.send(gameState);
        }
        if (gameState.users.length === 2) {
            gameState.ready = true;
            res.send(gameState);
        }
    }
    console.log(gameState.users);
});

app.get('/api/game', (req, res) => {
    res.send(gameState);
});

app.get('/api/board', (req, res) => {
    // change this back to BOARD when figured out
    res.send(tableData);
});

// takes user input and puts it in 6th position of first array
// TODO: have user input go to column (array) specified
app.post('/api/board', (req, res) => {
    const move = req.body.user;
    console.log(move);
    tableData[0].splice(6, 1, move);
    console.log(tableData);
    res.send(tableData);
});

app.listen(port, () => {
    console.log(`Server listening on the port:${port}`);
});
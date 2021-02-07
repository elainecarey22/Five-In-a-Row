const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

port = 3080;
const gameTable = [[],[],[], [], [], [], [], [], []];
gameState = { ready: false, users: [], playerTurn: null, table: gameTable };


function gameMove(column, value) {
    gameState.table[column].push(value);
}

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/api/user', (req, res) => {

    const user = req.body.user;
    //TODO: handle this differently
    // if (gameState.users.length === 2) {
    //     res.send('Game is full');
    // } else {

        if (gameState.users.length === 0) {
            p1 = { user, id: 1 }
            gameState.users.push(p1);
            res.send(p1);
        }
        else if (gameState.users.length === 1) {
            p2 = { user, id: 2 };
            gameState.users.push(p2);
            gameState.playerTurn = 1;
            gameState.ready = true;
            res.send(p2);
        }
        else {
            res.send("Game is full");
        }
  //  }
});

app.get('/api/game', (req, res) => {
    res.send(gameState);
});

app.get('/api/board', (req, res) => {
    res.send(gameState);
});

app.post('/api/board', (req, res) => {
    const playerMove = req.body;

    if (playerMove.playerId == 1) {
        gameMove(playerMove.column - 1, "X");
        gameState.playerTurn = 2;
    } else {
        gameMove(playerMove.column - 1, "O");
        gameState.playerTurn = 1;
    }

    res.send(gameState);
});

app.listen(port, () => {
    console.log(`Server listening on the port:${port}`);
});
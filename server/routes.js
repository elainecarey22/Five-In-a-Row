const router = require('express').Router();
const gameTable = [[], [], [], [], [], [], [], [], []];

module.exports = router;
gameState = { ready: false, users: [], playerTurn: null, table: gameTable, winner: null };


function gameMove(column, value) {
    gameState.table[column].push(value);
}

/*
** Check first cell has a value,
** then check that the next four cells have the same value
*/ 
function checkLine(a, b, c, d, e) {
    return ((a != null) && (a == b) && (a == c) && (a == d) && (a == e));
}

/* 
** checks current state of table for five in a row
** outer loop goes through columns
** inner loop goes through rows
*/
function checkWinner(t) {
    // Check across - half of the columns, all of the rows
    for (c = 0; c < 5; c++)
        for (r = 0; r < 7; r++)
            if (checkLine(t[c][r], t[c + 1][r], t[c + 2][r], t[c + 3][r], t[c + 4][r])) {
                let winner = t[c][r];
                alertWinner(winner);
                return winner;
            }

    // Check down - half of the rows, all of the columns
    for (c = 0; c < 9; c++)
        for (r = 0; r < 3; r++)
            if (checkLine(t[c][r], t[c][r + 1], t[c][r + 2], t[c][r + 3], t[c][r + 4])) {
                let winner = t[c][r];
                alertWinner(winner);
                return winner;
            }

    // Check diagonal right - half of the columns, all of the rows
    for (c = 0; c < 5; c++)
        for (r = 0; r < 7; r++)
            if (checkLine(t[c][r], t[c + 1][r + 1], t[c + 2][r + 2], t[c + 3][r + 3], t[c + 4][r + 4])) {
                let winner = t[c][r];
                alertWinner(winner);
                return winner;
            }

    // Check diagonal left
    for (c = 4; c < 9; c++)
        for (r = 0; r < 4; r++)
            if (checkLine(t[c][r], t[c - 1][r + 1], t[c - 2][r + 2], t[c - 3][r + 3], t[c - 4][r + 4])) {
                let winner = t[c][r];
                alertWinner(winner);
                return winner;
            }

    return 0;
}

function alertWinner(winner) {
    if (winner == 'X') {
        gameState.winner = gameState.users[0];
    }
    else {
        gameState.winner = gameState.users[1];
    }
    // call end game function here?
}

router.post('/user', (req, res) => {

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

router.get('/game', (req, res) => {
    res.send(gameState);
});

router.post('/game', (req, res) => {
    const playerMove = req.body;

    if (playerMove.playerId == 1) {
        gameMove(playerMove.column - 1, "X");
        gameState.playerTurn = 2;
    } else {
        gameMove(playerMove.column - 1, "O");
        gameState.playerTurn = 1;
    }
    checkWinner(gameState.table);
    res.send(gameState);
});
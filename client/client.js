const request = require('request');
const readline = require('readline');

let baseUrl = 'http://localhost:3080';

let gameState;
let move;
let playerId;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const startGame = () => {
    return new Promise((resolve, reject) => {

        rl.question('Welcome to Five in a Row! Please enter your name: ', (name) => {
            var player = { user: name };
            request.post({
                headers: { 'content-type': 'application/json' },
                url: `${baseUrl}/api/user`,
                body: JSON.stringify(player)
            },
                function (error, response, body) {
                    playerId = JSON.parse(body).id;
                    // Continuous request to check state of game
                    const requestLoop = setInterval(function () {
                        request.get({
                            url: `${baseUrl}/api/game`
                        },
                            function (error, response, body) {
                                gameState = JSON.parse(body);
                                if (gameState.ready === false) {
                                    console.log('Waiting on another player to join...');
                                } else {
                                    // TODO: fix logic to stop the below message from displaying when more than 2 players have joined
                                    if (gameState.users.length === 2) {
                                        console.log('An opponent has joined the game! Ready to play Five in a Row');
                                        clearInterval(requestLoop);
                                        resolve()
                                    }
                                }
                            });
                    }, 5000);
                });
        });
    })
}

const game = () => {
    const requestLoop = setInterval(function () {
        request.get({
            url: `${baseUrl}/api/game`
        },
            function (error, response, body) {
                gameState = JSON.parse(body);
                if (gameState.winner) {
                    printTable(gameState.table);
                    getWinner(gameState.winner);
                    clearInterval(requestLoop);
                }
                else if (gameState.playerTurn == playerId) {
                    console.log('Your turn');
                    printTable(gameState.table);
                    playerMove();
                    clearInterval(requestLoop);
                } else {
                    console.log('Other players turn...');
                }

            });
    }, 3000);
}

const playerMove = () => {
    rl.question('Enter a column 1-9 \n', (column) => {
        move = { playerId, column }
        //TODO: make sure input is only 1-9
        request.post({
            headers: { 'content-type': 'application/json' },
            url: `${baseUrl}/api/game`,
            body: JSON.stringify(move)
        },
            function (error, response, body) {
                let gameState = JSON.parse(body);
                if (gameState.winner) {
                    printTable(gameState.table);
                    getWinner(gameState.winner);
                }
                else {
                    printTable(gameState.table);
                    game();
                }
            })
    });
}

const printTable = (table) => {
    const rowCount = 6;
    const columnCount = table.length;

    for (let r = 0; r < rowCount; r++) {
        let rowStr = '';

        for (let c = 0; c < columnCount; c++) {
            const tableColPos = rowCount - (r + 1);

            const val = table[c][tableColPos]

            if (val) {
                rowStr += '[' + val + ']';
            } else {
                rowStr += '[ ]';
            }
        }
        console.log(rowStr);
    }
}

const getWinner = (winner) => {
    if(winner.id == 1) {
        console.log(`FIVE IN A ROW!\nPlayer 1, ${winner.user}, is the winner!\nBetter luck next time Player 2.`);
    } else {
        console.log(`FIVE IN A ROW!\nPlayer 2, ${winner.user}, is the winner!\n Better luck next time Player 1.`);
    }
}

const main = async () => {
    await startGame()
    game();
}

main()
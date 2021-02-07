const request = require('request');
const readline = require('readline');

let gameState;
let move;
let playerId;
let baseUrl = 'http://localhost:3080/';

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
                url: `${baseUrl}api/user`,
                body: JSON.stringify(player)
            },
                function (error, response, body) {
                    playerId = JSON.parse(body).id;
                    // Continuous request to check state of game
                    const requestLoop = setInterval(function () {
                        request.get({
                            url: `${baseUrl}api/game`
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
            // rl.close();
        });
    })
}

const game = () => {
    const requestLoop = setInterval(function () {
        request.get({
            url: `${baseUrl}api/game`
        },
            function (error, response, body) {
                gameState = JSON.parse(body);
                if (gameState.playerTurn == playerId) {
                    console.log('Your turn');
                    printTable(gameState.table);
                    playerMove();
                    clearInterval(requestLoop);
                } else {
                    console.log('Other players turn');
                }

            });
    }, 5000);
}

const playerMove = () => {
    rl.question('Enter a column 1-9 \n', (column) => {
        move = { playerId, column }
        //TODO: make sure input is only 1-9
        request.post({
            headers: { 'content-type': 'application/json' },
            url: `${baseUrl}api/board`,
            body: JSON.stringify(move)
        },
            function (error, response, body) {
                let gameState = JSON.parse(body);
                printTable(gameState.table);
                game();
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
        console.log(rowStr)
    }
}

const main = async () => {
    await startGame()
    game();
    // rl.close()
}

main()

// TODO: use below SIGINT event to listen for player who wants to exit
// rl.on('SIGINT', () => {
//     rl.question('Are you sure you want to exit? ', (answer) => {
//         if (answer.match(/^y(es)?$/i)) rl.pause();
//     });
// });

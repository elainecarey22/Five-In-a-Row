const request = require('request');
const readline = require('readline');

let gameState;
let move;

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
                url: 'http://localhost:3080/api/user',
                body: JSON.stringify(player)
            },
                function (error, response, body) {
                    gameState = body;
                    // Continuous request to check state of game
                    const requestLoop = setInterval(function () {
                        request.get({
                            url: 'http://localhost:3080/api/game'
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
                    }, 2000);
                });
            // rl.close();
        });
    })
}

const showBoard = () => {
    return new Promise((resolve, reject) => {
        request.get({
            url: 'http://localhost:3080/api/board'
        },
        function(error, response, body) {
            console.log(body);
        })
    resolve()
    })
}

const playerMove = () => {
    return new Promise((resolve, reject) => {
        rl.question('Enter a column 1-9 \n', (column) => {
            move = {user: column}
            request.post({
                headers: { 'content-type': 'application/json' },
                url: 'http://localhost:3080/api/board',
                body: JSON.stringify(move)
            },
            function (error, response, body) {
                newMove = JSON.parse(body);
                // prints all of tableData as it is in server.js
                showBoard();
            })
        })
    });
}

const main = async () => {
    await startGame()
    await showBoard()
    await playerMove()
    // await makeMove()
    rl.close()
}

main()

    // TODO: use below SIGINT event to listen for player who wants to exit
    // rl.on('SIGINT', () => {
    //     rl.question('Are you sure you want to exit? ', (answer) => {
    //       if (answer.match(/^y(es)?$/i)) rl.pause();
    //     });
    //   });

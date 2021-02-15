# Five-In-a-Row
A text-based game of Five in a Row, played in the CLI. Backend is written with Node.JS and uses Express as its server engine. The client and server communicate over HTTP.

## Prerequisites
Global install of npm:
'npm install -g npm'

## Installation
1. Clone this repository
2. Open terminal window and navigate to Five-In-a-Row/server
3. Run 'npm install'
4. Start server with the command 'node server.js'
5. Open a separate terminal window and navigate to Five-In-a-Row/client
6. Run 'npm install'
7. Start first client with the command 'node client.js'
8. Start second client in another terminal window to allow the game to start.

## Tests
Jest is the testing framework used for unit tests.
To run these tests, navigate to the server folder and run 'npm test'.

### To do
More robust validation for user input needs to be added, in order to handle adverse events eg:
* More than 2 users enter the game
* Characters other than 1-9 are entered by the user when prompted to submit move

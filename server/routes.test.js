const { gameMove, checkWinner, checkLine, alertWinner } = require('./routes');

test('token inserts into specified column', () => {
    expect(gameMove(2, 'x')).toEqual([[], [], ['x'], [], [], [], [], [], []]);
});

test('check five values in a row', () => {
    a = b = c = d = e = 'x';
    expect(checkLine(a, b, c, d, e)).toBeTruthy();
});

test('check game board for five in a row down', () => {
    board = [[], [], ['o', 'o', 'o', 'o', 'o'], [], [], [], [], [], []];
    expect(checkWinner(board)).toBe('o');
});

test('check game board for five in a row across', () => {
    board = [['o'], ['o'], ['o'], ['o'], ['o'], [], [], [], []];
    expect(checkWinner(board)).toBe('o');
});

test('check game board for five in a row diagonal right', () => {
    board = [
        ['x'],
        ['O', 'x'],
        ['O', 'O', 'x'],
        ['x', 'O', 'x', 'x'],
        ['O', 'O', 'x', 'O', 'x'],
        [],
        [],
        [],
        []
    ];
    expect(checkWinner(board)).toBe('x');
});

test('check game board for five in a row diagonal left', () => {
    board = [
        [],
        [],
        [],
        [],
        ['o', 'o', 'x', 'o', 'o'],
        ['o', 'o', 'x', 'o'],
        ['o', 'x', 'o'],
        ['x', 'o'],
        ['o']
    ];
    expect(checkWinner(board)).toBe('o');
});

test('check game board returns 0 when there is no winner', () => {
    board = [
        [],
        [],
        [],
        [],
        [],
        [],
        ['o', 'x', 'o'],
        ['x', 'o'],
        ['o']
    ];
    expect(checkWinner(board)).toBe(0);
});

// test('winner is assigned to user based on their game token', () => {
//     winner = { id: 2, user: 'test' };
//     expect(alertWinner('O')).toEqual(winner);
// })
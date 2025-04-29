//Denton Barrow Napier University
//Web Tech
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let player1Name = '';
let player2Name = 'Computer';
let difficulty = 'basic'; // Default difficulty Level
let player1Score = 0;
let player2Score = 0;

document.getElementById('startBtn').addEventListener('click', startGame);
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', makeMove);
});

// Start the game when Player 1 enters their name and selects a difficulty
function startGame() {
    player1Name = document.getElementById('player1').value;
    difficulty = document.getElementById('difficulty').value;
    if (!player1Name) {
        alert('Please enter Player 1 name!');
        return;
    }
    document.getElementById('currentPlayer').textContent = `${player1Name} (X) starts!`;
    document.getElementById('gameStatus').textContent = '';
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = 'X';
    updateBoard();
}

// Make a move for Player 1 or Player 2 (computer)
function makeMove(e) {
    if (gameOver) return;

    let cellIndex = parseInt(e.target.id.replace('cell-', ''));

    if (board[cellIndex] !== '') return;

    board[cellIndex] = currentPlayer;
    updateBoard();

    if (checkWinner()) {
        gameOver = true;
        if (currentPlayer === 'X') {
            player1Score++;
        } else {
            player2Score++;
        }
        updateScoreboard();
        document.getElementById('gameStatus').textContent = `${currentPlayer === 'X' ? player1Name : player2Name} wins!`;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('currentPlayer').textContent = currentPlayer === 'X' ? `${player1Name} (X)` : `${player2Name} (O)`;

    if (currentPlayer === 'O' && !gameOver) {
        setTimeout(computerMove, 500);
    }
}

// Update the board
function updateBoard() {
    board.forEach((value, index) => {
        document.getElementById(`cell-${index}`).textContent = value;
    });
}

// Check if the current player has won
function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Update the scoreboard
function updateScoreboard() {
    document.getElementById('player1Score').textContent = `Player 1 (X): ${player1Score}`;
    document.getElementById('player2Score').textContent = `Computer (O): ${player2Score}`;
}

//Random move
function basic() {
    let availableCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    let randomMove = availableCells[Math.floor(Math.random() * availableCells.length)];
    return randomMove;
}

//Block Player 1's winning move (Defensive)
function extreme() {
    let availableCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);

    // Check if Player 1 can win and block them
    for (let i = 0; i < availableCells.length; i++) {
        let testBoard = [...board];
        testBoard[availableCells[i]] = 'X';
        if (checkWinner()) {
            return availableCells[i]; // Block Player 1 from winning
        }
    }

    // If no blocking move, make a random move
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}

// Elite - Minimax algorithm for optimal move
function minimax(board, depth, isMaximizing) {
    if (checkWinner()) return isMaximizing ? -1 : 1;
    if (board.every(cell => cell !== '')) return 0;

    let bestMove;
    let bestScore = isMaximizing ? -Infinity : Infinity;
    let availableCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);

    for (let i = 0; i < availableCells.length; i++) {
        let move = availableCells[i];
        board[move] = isMaximizing ? 'O' : 'X';

        let score = minimax(board, depth + 1, !isMaximizing);
        board[move] = '';

        if (isMaximizing && score > bestScore || !isMaximizing && score < bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

function elite() {
    let availableCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    let bestMove = minimax(board, 0, true);
    return bestMove;
}

function computerMove() {
    let move;
    if (difficulty === 'basic') {
        move = basic();
    } else if (difficulty === 'extreme') {
        move = extreme();
    } else if (difficulty === 'elite') {
        move = elite();
    }

    board[move] = 'O';
    updateBoard();

    if (checkWinner()) {
        gameOver = true;
        player2Score++;
        updateScoreboard();
        document.getElementById('gameStatus').textContent = `Computer wins!`;
        return;
    }

    currentPlayer = 'X';
    document.getElementById('currentPlayer').textContent = `${player1Name} (X) starts!`;
}

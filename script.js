const game = document.getElementById('game');
const winnerDiv = document.getElementById('winner');
const resetButton = document.getElementById('reset');
const humanModeButton = document.getElementById('humanMode');
const aiModeButton = document.getElementById('aiMode');
const modeSelection = document.getElementById('modeSelection');
const modeInfo = document.getElementById('modeInfo');
const noteDiv = document.getElementById('note');
let board = Array(9).fill('');
let currentPlayer = 'X';
let isGameActive = true;
let mode = '';

function initializeBoard() {
    game.innerHTML = board.map((_, i) => 
        `<div class="cell" data-index="${i}">${board[i]}</div>`
    ).join('');
    game.addEventListener('click', handleCellClick);
}

function handleCellClick(e) {
    const index = e.target.dataset.index;

    if (!index || board[index] || !isGameActive || (currentPlayer === 'O' && mode === 'ai')) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkForWinner()) {
        winnerDiv.textContent = getWinMessage(currentPlayer);
        winnerDiv.style.display = 'block';
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        winnerDiv.textContent = "It's a Draw!";
        winnerDiv.style.display = 'block';
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O' && mode === 'ai') {
        setTimeout(aiMove, 500);
    }
}

function getWinMessage(player) {
    return mode === 'human'
        ? player === 'X' ? 'Player 1 (X) Wins!' : 'Player 2 (O) Wins!'
        : player === 'X' ? 'Player (X) Wins!' : 'AI (O) Wins!';
}

function checkForWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function aiMove() {
    let availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[move] = 'O';
    document.querySelector(`.cell[data-index="${move}"]`).textContent = 'O';

    if (checkForWinner()) {
        winnerDiv.textContent = getWinMessage('O');
        winnerDiv.style.display = 'block';
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        winnerDiv.textContent = "It's a Draw!";
        winnerDiv.style.display = 'block';
        isGameActive = false;
        return;
    }

    currentPlayer = 'X';
}

function resetGame() {
    board.fill('');
    currentPlayer = 'X';
    isGameActive = true;
    winnerDiv.textContent = '';
    winnerDiv.style.display = 'none';
    game.style.display = 'none';
    modeSelection.style.display = 'flex';
    modeInfo.style.display = 'none';
    resetButton.style.display = 'none';
    noteDiv.style.display = 'none';
}

function startGame(selectedMode) {
    mode = selectedMode;
    modeSelection.style.display = 'none';
    game.style.display = 'grid';
    modeInfo.textContent = `Mode: ${selectedMode === 'human' ? 'Play Against Each Other' : 'Play Against AI'}`;
    modeInfo.style.display = 'block';
    resetButton.style.display = 'block';
    noteDiv.style.display = 'block';
    initializeBoard();
}

humanModeButton.addEventListener('click', () => startGame('human'));
aiModeButton.addEventListener('click', () => startGame('ai'));
resetButton.addEventListener('click', resetGame);

resetButton.style.display = 'none';

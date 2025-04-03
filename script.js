const gridSize = 5;
const grid = document.getElementById("grid");
const message = document.getElementById("message");
const tutorial = document.getElementById("tutorial");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");

let correctPath = [];
let playerPosition = { x: 0, y: 0 };
let gameOver = false;
let canMove = false;

// Start Game
startBtn.addEventListener("click", startGame);

function startGame() {
    tutorial.style.display = "none";
    gameContainer.style.display = "block";
    createGrid();
    generatePath();
    revealPath();
}

// Generate Grid
function createGrid() {
    grid.innerHTML = "";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            grid.appendChild(cell);
        }
    }
    updatePlayer();
}

// Generate Path
function generatePath() {
    correctPath = [];
    let x = 0, y = 0;
    correctPath.push([x, y]);
    while (x < gridSize - 1 || y < gridSize - 1) {
        let possibleMoves = [];
        if (x < gridSize - 1) possibleMoves.push([x + 1, y]);
        if (y < gridSize - 1) possibleMoves.push([x, y + 1]);
        let nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        x = nextMove[0];
        y = nextMove[1];
        correctPath.push([x, y]);
    }
}

// Show Path
function revealPath() {
    canMove = false;
    message.textContent = "Memorize the path! 10 seconds...";
    correctPath.forEach(([x, y]) => {
        let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.add("path");
        }
    });
    setTimeout(hidePath, 10000);
}

// Hide Path
function hidePath() {
    document.querySelectorAll(".path").forEach(cell => {
        cell.classList.remove("path");
    });
    message.textContent = "Now move!";
    canMove = true;
    updatePlayer();
}

// Move Player
function movePlayer(x, y) {
    if (gameOver || !canMove) return;
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    if (Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) !== 1) return;
    
    playerPosition = { x, y };
    updatePlayer();
}

// Update Player Position
function updatePlayer() {
    document.querySelectorAll(".cell").forEach(cell => 
        cell.classList.remove("player", "wrong")
    );
    let playerCell = document.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
    
    if (correctPath.some(pos => pos[0] === playerPosition.x && pos[1] === playerPosition.y)) {
        playerCell.classList.add("player");
        if (playerPosition.x === gridSize - 1 && playerPosition.y === gridSize - 1) {
            message.textContent = "You Win! 🎉";
            gameOver = true;
            setTimeout(resetGame, 2000); // Auto-restart after 2 seconds
        }
    } else {
        playerCell.classList.add("wrong");
        message.textContent = "Wrong step! Restarting...";
        gameOver = true;
        setTimeout(resetGame, 1500);
    }
}

// Arrow Key Support
document.addEventListener("keydown", (e) => {
    if (!canMove || gameOver) return;
    switch(e.key) {
        case "ArrowUp": movePlayer(playerPosition.x, playerPosition.y - 1); break;
        case "ArrowDown": movePlayer(playerPosition.x, playerPosition.y + 1); break;
        case "ArrowLeft": movePlayer(playerPosition.x - 1, playerPosition.y); break;
        case "ArrowRight": movePlayer(playerPosition.x + 1, playerPosition.y); break;
    }
});

// Click Support (only when path is hidden)
grid.addEventListener("click", (e) => {
    if (!canMove || !e.target.classList.contains("cell")) return;
    movePlayer(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
});

// Touch Support
grid.addEventListener("touchmove", (e) => {
    if (!canMove) return;
    e.preventDefault();
    let touch = e.touches[0];
    let target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target?.classList.contains("cell")) {
        movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
    }
}, { passive: false });

// Reset Game
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    gameOver = false;
    createGrid();
    generatePath();
    revealPath();
}

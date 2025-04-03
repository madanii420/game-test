const gridSize = 5;
const grid = document.getElementById("grid");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const tutorial = document.getElementById("tutorial");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");

let correctPath = [];
let playerPosition = { x: 0, y: 0 };
let gameOver = false;
let canMove = false;
let timerInterval;
let isDragging = false;

// Start Game
startBtn.addEventListener("click", startGame);

function startGame() {
    tutorial.style.display = "none";
    gameContainer.style.display = "flex";
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

// Show Path with Timer
function revealPath() {
    canMove = false;
    let timeLeft = 10;
    timerDisplay.textContent = timeLeft;
    correctPath.forEach(([x, y]) => {
        let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.add("path");
        }
    });
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            hidePath();
        }
    }, 1000);
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
    
    const newPos = [x, y];
    const currentIndex = correctPath.findIndex(pos => 
        pos[0] === playerPosition.x && pos[1] === playerPosition.y
    );
    const nextValidPos = correctPath[currentIndex + 1] || correctPath[currentIndex];
    
    if (newPos[0] === nextValidPos[0] && newPos[1] === nextValidPos[1]) {
        playerPosition = { x, y };
        updatePlayer();
    } else {
        const wrongCell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        wrongCell.classList.add("wrong");
        message.textContent = "Wrong move!";
        gameOver = true;
        canMove = false;
        clearInterval(timerInterval);
        setTimeout(resetGame, 1000);
    }
}

// Update Player Position
function updatePlayer() {
    document.querySelectorAll(".cell").forEach(cell => 
        cell.classList.remove("player")
    );
    let playerCell = document.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
    playerCell.classList.add("player");
    
    if (playerPosition.x === gridSize - 1 && playerPosition.y === gridSize - 1) {
        message.textContent = "You Win! 🎉";
        gameOver = true;
        canMove = false;
        clearInterval(timerInterval);
        setTimeout(resetGame, 2000);
    }
}

// Drag Movement (Mouse)
grid.addEventListener("mousedown", (e) => {
    if (!canMove || !e.target.classList.contains("cell")) return;
    isDragging = true;
    movePlayer(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
});

grid.addEventListener("mousemove", (e) => {
    if (!isDragging || !canMove || !e.target.classList.contains("cell")) return;
    movePlayer(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
});

grid.addEventListener("mouseup", () => {
    isDragging = false;
});

grid.addEventListener("mouseleave", () => {
    isDragging = false;
});

// Touch Movement (Phone)
grid.addEventListener("touchstart", (e) => {
    if (!canMove) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target?.classList.contains("cell")) {
        movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
    }
}, { passive: false });

grid.addEventListener("touchmove", (e) => {
    if (!canMove) return;
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target?.classList.contains("cell")) {
        movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
    }
}, { passive: false });

// Reset Game
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    gameOver = false;
    canMove = false;
    clearInterval(timerInterval);
    createGrid();
    generatePath();
    revealPath();
}

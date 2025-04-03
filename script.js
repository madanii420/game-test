const gridSize = 5;
const grid = document.getElementById("grid");
const message = document.getElementById("message");
const tutorial = document.getElementById("tutorial");
const gameContainer = document.getElementById("game-container");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");

let correctPath = [];
let playerPosition = { x: 0, y: 0 };
let gameOver = false;

// Start Game on Button Click
startBtn.addEventListener("click", () => {
    tutorial.style.display = "none";
    gameContainer.style.display = "block";
    createGrid();
    generatePath();
    revealPath();
});

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
}

// Generate Random Path
function generatePath() {
    let x = 0, y = 0;
    correctPath = [[x, y]];
    while (x < gridSize - 1 || y < gridSize - 1) {
        if (x === gridSize - 1) y++; 
        else if (y === gridSize - 1) x++;
        else Math.random() > 0.5 ? x++ : y++;
        correctPath.push([x, y]);
    }
}

// Show Path for 3 Seconds
function revealPath() {
    correctPath.forEach(([x, y]) => {
        document.querySelector(`[data-x="${x}"][data-y="${y}"]`).classList.add("path");
    });

    setTimeout(() => {
        nextBtn.style.display = "block";
    }, 3000);
}

// Hide Path and Start the Game when Next is Clicked
nextBtn.addEventListener("click", () => {
    document.querySelectorAll(".path").forEach(cell => cell.classList.remove("path"));
    message.textContent = "Drag to move!";
    nextBtn.style.display = "none"; 
    gameOver = false;
    updatePlayer();
});

// Update Player Position
function updatePlayer() {
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("player", "wrong"));
    let playerCell = document.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
    if (correctPath.some(pos => pos[0] === playerPosition.x && pos[1] === playerPosition.y)) {
        playerCell.classList.add("player");
        if (playerPosition.x === gridSize - 1 && playerPosition.y === gridSize - 1) {
            message.textContent = "You Win! 🎉";
            gameOver = true;
        }
    } else {
        playerCell.classList.add("wrong");
        message.textContent = "Wrong step! Restarting...";
        gameOver = true;

        // Restart game after 1.5 seconds
        setTimeout(() => {
            resetGame();
        }, 1500);
    }
}

// Drag and Touch Movement
let isDragging = false;

grid.addEventListener("mousedown", (e) => {
    if (gameOver) return;
    isDragging = true;
    movePlayer(e.target);
});

grid.addEventListener("mousemove", (e) => {
    if (isDragging) movePlayer(e.target);
});

grid.addEventListener("mouseup", () => {
    isDragging = false;
});

// Touch Events
grid.addEventListener("touchstart", (e) => {
    if (gameOver) return;
    movePlayer(e.target);
});

// Move Player Function
function movePlayer(target) {
    if (!target.classList.contains("cell") || gameOver) return;
    let x = parseInt(target.dataset.x);
    let y = parseInt(target.dataset.y);
    if (Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) === 1) {
        playerPosition = { x, y };
        updatePlayer();
    }
}

// Reset Game
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    message.textContent = "Memorize the path!";
    gameOver = false;
    revealPath();
}

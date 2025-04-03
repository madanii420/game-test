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
let isDragging = false;

// Start Game on Button Click
startBtn.addEventListener("click", () => {
    tutorial.style.display = "none";
    gameContainer.style.display = "block";
    grid.style.display = "grid";
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
    correctPath = [];
    let x = 0, y = 0;
    correctPath.push([x, y]);
    while (x < gridSize - 1 || y < gridSize - 1) {
        let possibleMoves = [];
        if (x < gridSize - 1) possibleMoves.push([x + 1, y]);
        if (y < gridSize - 1) possibleMoves.push([x, y + 1]);
        if (Math.random() > 0.5 && x < gridSize - 1) {
            x++;
        } else if (y < gridSize - 1) {
            y++;
        }
        correctPath.push([x, y]);
    }
}

// Show Path for 10 Seconds
function revealPath() {
    canMove = false;
    message.textContent = "Memorize the path! 10 seconds...";
    correctPath.forEach(([x, y], index) => {
        let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.classList.add("path");
            if (index === 0) {
                cell.innerHTML = "⬆️"; // Start arrow
            } else if (index === correctPath.length - 1) {
                cell.innerHTML = "🏁"; // End flag
            }
        }
    });
    setTimeout(hidePath, 10000);
}

// Hide Path and Enable Movement
function hidePath() {
    document.querySelectorAll(".path").forEach(cell => cell.classList.remove("path"));
    message.textContent = "Now move!";
    canMove = true;
}

// Move Player
function movePlayer(target) {
    if (!target.classList.contains("cell") || gameOver || !canMove) return;
    let x = parseInt(target.dataset.x);
    let y = parseInt(target.dataset.y);
    if (Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) === 1) {
        playerPosition = { x, y };
        updatePlayer();
    }
}

// Update Player Position
function updatePlayer() {
    if (!canMove) return;
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
        setTimeout(resetGame, 1500);
    }
}

// Drag and Touch Movement (Fixed for Mobile)
grid.addEventListener("mousedown", (e) => { 
    isDragging = true; 
    movePlayer(e.target); 
});
grid.addEventListener("mousemove", (e) => { 
    if (isDragging) movePlayer(e.target); 
});
grid.addEventListener("mouseup", () => { 
    isDragging = false; 
});
grid.addEventListener("touchstart", (e) => { 
    movePlayer(e.target); 
});
grid.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];
    let target = document.elementFromPoint(touch.clientX, touch.clientY);
    movePlayer(target);
});
grid.addEventListener("touchend", () => { 
    isDragging = false; 
});

// Reset Game
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    message.textContent = "Memorize the path!";
    gameOver = false;
    revealPath();
}

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

// Start Game on Button Click
startBtn.addEventListener("click", () => {
    tutorial.style.display = "none";
    gameContainer.style.display = "block";
    grid.style.display = "grid";  // Show grid when game starts
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

// Generate Multiple Random Paths
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

    correctPath.forEach(([x, y]) => {
        let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) cell.classList.add("path");
    });

    let countdown = 10;
    let countdownInterval = setInterval(() => {
        countdown--;
        message.textContent = `Memorize the path! ${countdown} seconds...`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            hidePath();
        }
    }, 1000);
}

// Hide Path and Enable Movement
function hidePath() {
    document.querySelectorAll(".path").forEach(cell => cell.classList.remove("path"));
    message.textContent = "Now move!";
    canMove = true;
}

// Reset Game
function resetGame() {
    playerPosition = { x: 0, y: 0 };
    message.textContent = "Memorize the path!";
    gameOver = false;
    revealPath();
}

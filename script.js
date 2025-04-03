let gridSize = 5; // Default medium
let correctPath = [];
let playerPosition = { x: 0, y: 0 };
let gameOver = false;
let canMove = false;
let timerInterval;
let isDragging = false;
let currentDifficulty = "medium"; // Track current difficulty

// Wait for DOM to load before attaching listeners
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const message = document.getElementById("message");
    const timerDisplay = document.getElementById("timer");
    const tutorial = document.getElementById("tutorial");
    const gameContainer = document.getElementById("game-container");
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    const sameDifficultyBtn = document.getElementById("same-difficulty-btn");
    const changeDifficultyBtn = document.getElementById("change-difficulty-btn");
    const winOptions = document.getElementById("win-options");

    // Difficulty Selection
    difficultyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentDifficulty = btn.dataset.difficulty;
            switch (currentDifficulty) {
                case "easy": gridSize = 4; break;
                case "medium": gridSize = 5; break;
                case "hard": gridSize = 6; break;
                case "impossible": gridSize = 7; break;
            }
            startGame();
        });
    });

    // Win Options
    sameDifficultyBtn.addEventListener("click", continueSameDifficulty);
    changeDifficultyBtn.addEventListener("click", changeDifficulty);

    function startGame() {
        tutorial.style.display = "none";
        gameContainer.style.display = "flex";
        winOptions.style.display = "none";
        createGrid();
        generatePath();
        revealPath();
    }

    // Generate Grid
    function createGrid() {
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;
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
        const target = [gridSize - 1, gridSize - 1];
        let visited = new Set([`${x},${y}`]);

        if (currentDifficulty === "hard" || currentDifficulty === "impossible") {
            // Hamiltonian-like path for 6x6 and 7x7
            let direction = "right";
            while (correctPath.length < gridSize * gridSize) {
                if (direction === "right" && x + 1 < gridSize && !visited.has(`${x + 1},${y}`)) {
                    x++;
                } else if (direction === "down" && y + 1 < gridSize && !visited.has(`${x},${y + 1}`)) {
                    y++;
                } else if (direction === "left" && x - 1 >= 0 && !visited.has(`${x - 1},${y}`)) {
                    x--;
                } else if (direction === "up" && y - 1 >= 0 && !visited.has(`${x},${y - 1}`)) {
                    y--;
                } else {
                    // Change direction if stuck
                    if (direction === "right") direction = "down";
                    else if (direction === "down") direction = "left";
                    else if (direction === "left") direction = "up";
                    else if (direction === "up") direction = "right";
                    continue;
                }
                correctPath.push([x, y]);
                visited.add(`${x},${y}`);
            }
            // Ensure it ends at target
            while (x !== target[0] || y !== target[1]) {
                if (x < target[0] && !visited.has(`${x + 1},${y}`)) x++;
                else if (y < target[1] && !visited.has(`${x},${y + 1}`)) y++;
                else if (x > target[0] && !visited.has(`${x - 1},${y}`)) x--;
                else if (y > target[1] && !visited.has(`${x},${y - 1}`)) y--;
                correctPath.push([x, y]);
                visited.add(`${x},${y}`);
            }
        } else {
            // Simple right/down path for easy and medium
            while (x !== target[0] || y !== target[1]) {
                let possibleMoves = [
                    [x + 1, y], // Right
                    [x, y + 1]  // Down
                ].filter(([nx, ny]) => 
                    nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && 
                    !visited.has(`${nx},${ny}`)
                );

                if (possibleMoves.length > 0) {
                    let nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    x = nextMove[0];
                    y = nextMove[1];
                    correctPath.push([x, y]);
                    visited.add(`${x},${y}`);
                } else {
                    break;
                }
            }
        }
    }

    // Show Path with Timer
    function revealPath() {
        canMove = false;
        let timeLeft;
        switch (currentDifficulty) {
            case "easy": timeLeft = 12; break;
            case "medium": timeLeft = 10; break;
            case "hard": timeLeft = 8; break;
            case "impossible": timeLeft = 6; break;
        }
        message.textContent = "Memorize the path! "; // Reset message
        timerDisplay.textContent = timeLeft;
        timerDisplay.style.display = "inline"; // Ensure timer is visible
        correctPath.forEach(([x, y]) => {
            let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) cell.classList.add("path");
        });
        
        clearInterval(timerInterval);
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
        document.querySelectorAll(".path").forEach(cell => cell.classList.remove("path"));
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
        document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("player"));
        let playerCell = document.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
        playerCell.classList.add("player");
        
        if (playerPosition.x === gridSize - 1 && playerPosition.y === gridSize - 1) {
            gameOver = true;
            canMove = false;
            clearInterval(timerInterval);
            message.textContent = "You Win!";
            winOptions.style.display = "flex";
            setTimeout(() => {
                message.textContent = "";
            }, 1000);
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

    grid.addEventListener("mouseup", () => isDragging = false);
    grid.addEventListener("mouseleave", () => isDragging = false);

    // Touch Movement (Phone)
    grid.addEventListener("touchstart", (e) => {
        if (!canMove) return;
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains("cell")) {
            movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
        }
    }, { passive: false });

    grid.addEventListener("touchmove", (e) => {
        if (!canMove) return;
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains("cell")) {
            movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
        }
    }, { passive: false });

    // Reset Game
    function resetGame() {
        playerPosition = { x: 0, y: 0 };
        gameOver = false;
        canMove = false;
        clearInterval(timerInterval);
        grid.innerHTML = ""; // Clear grid to avoid overlap
        createGrid();
        generatePath();
        revealPath();
    }

    // Continue Same Difficulty
    function continueSameDifficulty() {
        winOptions.style.display = "none";
        resetGame();
    }

    // Change Difficulty
    function changeDifficulty() {
        gameContainer.style.display = "none";
        tutorial.style.display = "flex";
        winOptions.style.display = "none";
        grid.innerHTML = ""; // Clear grid to prevent glitch
        message.textContent = "Memorize the path! "; // Reset message
        timerDisplay.style.display = "inline"; // Ensure timer visibility
    }
});

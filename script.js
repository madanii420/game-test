let gridSize = 5; // Default medium
let grid = [];
let correctPath = [];
let playerPosition = { x: 0, y: 0 };
let gameOver = false;
let canMove = false;
let timerInterval;
let isDragging = false;
let currentDifficulty = "medium";
let isTestMode = false;
const difficultyOrder = ["easy", "medium", "hard", "impossible", "extreme", "nightmare"];
let playerProgress = [];
let hasLost = false;
let walkedPath = [];
let hintsClickCount = 0;
let hintsClickTimer = null;
let isHiddenFeatureUnlocked = false;

document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById("grid");
    const message = document.getElementById("message");
    const timerDisplay = document.getElementById("timer");
    const tutorial = document.getElementById("tutorial");
    const gameContainer = document.getElementById("game-container");
    const difficultyButtons = document.querySelectorAll(".difficulty-btn");
    const sameDifficultyBtn = document.getElementById("same-difficulty-btn");
    const nextDifficultyBtn = document.getElementById("next-difficulty-btn");
    const changeDifficultyBtn = document.getElementById("change-difficulty-btn");
    const quitBtn = document.getElementById("quit-btn");
    const winOptions = document.getElementById("win-options");
    const testControls = document.getElementById("test-controls");
    const skipBtn = document.getElementById("skip-btn");
    const exitTestBtn = document.getElementById("exit-test-btn");
    const congratsPage = document.getElementById("congrats-page");
    const playAgainBtn = document.getElementById("play-again-btn");
    const hintsBtn = document.getElementById("hints-btn");
    const hintsMessage = document.getElementById("hints-message");

    function setCellSize() {
        const viewportWidth = window.innerWidth;
        const maxCellSize = 60;
        const minCellSize = 40;
        const paddingAndBorders = 20 + (gridSize - 1) * 5 + 10;
        let availableWidth = viewportWidth - paddingAndBorders;
        if (availableWidth < 0) availableWidth = viewportWidth;

        let cellSize = Math.floor(availableWidth / gridSize);
        cellSize = Math.max(minCellSize, Math.min(maxCellSize, cellSize));

        gridElement.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
        gridElement.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

        document.querySelectorAll(".cell").forEach(cell => {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
        });
    }

    hintsBtn.addEventListener("click", () => {
        hintsMessage.style.display = hintsMessage.style.display === "none" ? "block" : "none";

        hintsClickCount++;
        if (hintsClickCount === 1) {
            hintsClickTimer = setTimeout(() => {
                hintsClickCount = 0;
            }, 2000);
        }

        if (hintsClickCount >= 5) {
            isHiddenFeatureUnlocked = true;
            clearTimeout(hintsClickTimer);
            hintsClickCount = 0;
            console.log("Hidden feature unlocked! You can now use Shift + Q on the tutorial page.");
        }
    });

    difficultyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            currentDifficulty = btn.dataset.difficulty;
            switch (currentDifficulty) {
                case "easy": gridSize = 4; break;
                case "medium": gridSize = 5; break;
                case "hard": gridSize = 6; break;
                case "impossible": gridSize = 7; break;
                case "extreme": gridSize = 8; break;
                case "nightmare": gridSize = 9; break;
            }
            playerProgress = [];
            hasLost = false;
            startGame();
        });
    });

    sameDifficultyBtn.addEventListener("click", continueSameDifficulty);
    nextDifficultyBtn.addEventListener("click", () => {
        const currentIndex = difficultyOrder.indexOf(currentDifficulty);
        if (currentIndex < difficultyOrder.length - 1) {
            currentDifficulty = difficultyOrder[currentIndex + 1];
            switch (currentDifficulty) {
                case "easy": gridSize = 4; break;
                case "medium": gridSize = 5; break;
                case "hard": gridSize = 6; break;
                case "impossible": gridSize = 7; break;
                case "extreme": gridSize = 8; break;
                case "nightmare": gridSize = 9; break;
            }
            winOptions.style.display = "none";
            testControls.style.display = "none";
            resetGame();
        }
    });
    changeDifficultyBtn.addEventListener("click", changeDifficulty);

    quitBtn.addEventListener("click", () => {
        gameContainer.style.display = "none";
        tutorial.style.display = "flex";
        gameOver = false;
        canMove = false;
        clearInterval(timerInterval);
        timerDisplay.style.display = "none";
        message.textContent = "Memorize the path! ";
        message.appendChild(timerDisplay);
        message.style.color = "white";
        document.body.style.backgroundColor = "#333";
        gridElement.innerHTML = "";
        testControls.style.display = "none";
        isTestMode = false;
    });

    skipBtn.addEventListener("click", resetGame);
    exitTestBtn.addEventListener("click", () => {
        isTestMode = false;
        testControls.style.display = "none";
        resetGame();
    });

    playAgainBtn.addEventListener("click", () => {
        congratsPage.style.display = "none";
        tutorial.style.display = "flex";
        playerProgress = [];
        hasLost = false;
        currentDifficulty = "easy";
        gridSize = 4;
        isTestMode = false;
        const testModeMessage = document.getElementById("test-mode-message");
        if (testModeMessage) testModeMessage.style.display = "none";
    });

    function startGame() {
        tutorial.style.display = "none";
        gameContainer.style.display = "flex";
        winOptions.style.display = "none";
        testControls.style.display = isTestMode ? "flex" : "none"; // Show test controls if test mode is active
        message.style.color = "white";
        document.body.style.backgroundColor = "#333";
        resetGame();
    }

    function createGrid() {
        gridElement.innerHTML = "";
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        correctPath = [];
        walkedPath = [];

        playerPosition = { x: 0, y: 0 };
        generatePath();

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;
                gridElement.appendChild(cell);
            }
        }

        setCellSize();
        updatePlayer();
    }

    function generatePath() {
        correctPath = [];
        let x = 0, y = 0;
        correctPath.push([x, y]);
        while (x < gridSize - 1 || y < gridSize - 1) {
            let possibleMoves = [];
            if (x < gridSize - 1) possibleMoves.push([x + 1, y]);
            if (y < gridSize - 1) possibleMoves.push([x, y + 1]);
            if (possibleMoves.length === 0) break;
            if (Math.random() > 0.5 && x < gridSize - 1) {
                x++;
            } else if (y < gridSize - 1) {
                y++;
            }
            correctPath.push([x, y]);
        }
    }

    function revealGrid() {
        if (isTestMode) {
            showTestPath();
            return;
        }
        canMove = false;
        let timeLeft = 5;
        message.textContent = "Memorize the path! ";
        timerDisplay.textContent = timeLeft + " seconds...";
        timerDisplay.style.display = "inline-block";
        timerDisplay.style.visibility = "visible";
        timerDisplay.style.opacity = "1";
        message.appendChild(timerDisplay);

        correctPath.forEach(([x, y], index) => {
            let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                cell.classList.add("path");
                if (index === 0) {
                    cell.innerHTML = "⬆️";
                } else if (index === correctPath.length - 1) {
                    cell.innerHTML = "🏁";
                }
            }
        });
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft + " seconds...";
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.style.display = "none";
                timerDisplay.style.visibility = "hidden";
                timerDisplay.style.opacity = "0";
                hidePath();
            }
        }, 1000);
    }

    function showTestPath() {
        message.textContent = "Test Mode: Edit the path or skip.";
        timerDisplay.style.display = "none";
        canMove = true;
        correctPath.forEach(([x, y], index) => {
            let cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (cell) {
                cell.classList.add("path-test");
                if (index === 0) {
                    cell.innerHTML = "⬆️";
                } else if (index === correctPath.length - 1) {
                    cell.innerHTML = "🏁";
                }
            }
        });
    }

    function hidePath() {
        document.querySelectorAll(".path, .path-test").forEach(cell => {
            cell.classList.remove("path", "path-test");
            cell.innerHTML = "";
        });
        message.textContent = "Now move!";
        canMove = true;
    }

    function movePlayer(x, y) {
        if (gameOver || !canMove) return;

        if (Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y) !== 1) return;

        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            message.textContent = "Out of bounds!";
            gameOver = true;
            canMove = false;
            setTimeout(resetGame, 1500);
            return;
        }

        if (playerPosition.x !== x || playerPosition.y !== y) {
            walkedPath.push([playerPosition.x, playerPosition.y]);
        }

        playerPosition = { x, y };
        updatePlayer();
    }

    function updatePlayer() {
        if (!canMove) return;
        document.querySelectorAll(".cell").forEach(cell => {
            cell.classList.remove("player", "wrong", "walked");
        });

        walkedPath.forEach(([x, y]) => {
            let walkedCell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
            if (walkedCell) {
                walkedCell.classList.add("walked");
            }
        });

        let playerCell = document.querySelector(`[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
        if (isTestMode || correctPath.some(pos => pos[0] === playerPosition.x && pos[1] === playerPosition.y)) {
            playerCell.classList.add("player");
            if (playerPosition.x === gridSize - 1 && playerPosition.y === gridSize - 1) {
                message.textContent = "You Win! 🎉";
                gameOver = true;
                canMove = false;
                if (!playerProgress.includes(currentDifficulty)) {
                    playerProgress.push(currentDifficulty);
                }
                if (playerProgress.length === difficultyOrder.length && !hasLost) {
                    gameContainer.style.display = "none";
                    congratsPage.style.display = "flex";
                    const victorySound = document.getElementById("victory-sound");
                    victorySound.muted = false;
                    victorySound.currentTime = 0;
                    victorySound.play().then(() => {
                        console.log("Victory sound played successfully");
                    }).catch(error => {
                        console.error("Error playing victory sound:", error);
                    });
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                } else {
                    winOptions.style.display = "flex";
                    testControls.style.display = isTestMode ? "flex" : "none";
                }
            }
        } else {
            playerCell.classList.add("wrong");
            message.textContent = "Wrong step! Restarting...";
            gameOver = true;
            canMove = false;
            hasLost = true;
            setTimeout(resetGame, 1500);
        }
    }

    gridElement.addEventListener("mousedown", (e) => {
        if (!canMove || !e.target.classList.contains("cell")) return;
        isDragging = true;
        movePlayer(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
    });

    gridElement.addEventListener("mousemove", (e) => {
        if (!isDragging || !canMove || !e.target.classList.contains("cell")) return;
        movePlayer(parseInt(e.target.dataset.x), parseInt(e.target.dataset.y));
    });

    gridElement.addEventListener("mouseup", () => isDragging = false);
    gridElement.addEventListener("mouseleave", () => isDragging = false);

    gridElement.addEventListener("touchstart", (e) => {
        if (!canMove) return;
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains("cell")) {
            isDragging = true;
            movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
        }
    }, { passive: false });

    gridElement.addEventListener("touchmove", (e) => {
        if (!isDragging || !canMove) return;
        e.preventDefault();
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target && target.classList.contains("cell")) {
            movePlayer(parseInt(target.dataset.x), parseInt(target.dataset.y));
        }
    }, { passive: false });

    gridElement.addEventListener("touchend", () => {
        isDragging = false;
    });

    gridElement.addEventListener("click", (e) => {
        if (!isTestMode || !e.target.classList.contains("cell")) return;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        const posIndex = correctPath.findIndex(pos => pos[0] === x && pos[1] === y);
        if (posIndex === -1) {
            correctPath.push([x, y]);
            e.target.classList.add("path-test");
            correctPath.forEach(([px, py], index) => {
                let cell = document.querySelector(`[data-x="${px}"][data-y="${py}"]`);
                cell.innerHTML = "";
                if (index === 0) {
                    cell.innerHTML = "⬆️";
                } else if (index === correctPath.length - 1) {
                    cell.innerHTML = "🏁";
                }
            });
        } else {
            correctPath.splice(posIndex, 1);
            e.target.classList.remove("path-test");
            e.target.innerHTML = "";
            correctPath.forEach(([px, py], index) => {
                let cell = document.querySelector(`[data-x="${px}"][data-y="${py}"]`);
                cell.innerHTML = "";
                if (index === 0) {
                    cell.innerHTML = "⬆️";
                } else if (index === correctPath.length - 1) {
                    cell.innerHTML = "🏁";
                }
            });
        }
    });

    function resetGame() {
        playerPosition = { x: 0, y: 0 };
        gameOver = false;
        canMove = false;
        clearInterval(timerInterval);
        timerDisplay.style.display = "inline-block";
        timerDisplay.style.visibility = "visible";
        timerDisplay.style.opacity = "1";
        message.textContent = "Memorize the path! ";
        message.appendChild(timerDisplay);
        message.style.color = "white";
        document.body.style.backgroundColor = "#333";
        winOptions.style.display = "none";
        testControls.style.display = "none";
        gridElement.innerHTML = "";
        createGrid();
        revealGrid();
    }

    function continueSameDifficulty() {
        winOptions.style.display = "none";
        testControls.style.display = "none";
        resetGame();
    }

    function changeDifficulty() {
        gameContainer.style.display = "none";
        tutorial.style.display = "flex";
        winOptions.style.display = "none";
        gameOver = false;
        canMove = false;
        clearInterval(timerInterval);
        timerDisplay.style.display = "inline-block";
        timerDisplay.style.visibility = "visible";
        timerDisplay.style.opacity = "1";
        message.textContent = "Memorize the path! ";
        message.appendChild(timerDisplay);
        message.style.color = "white";
        document.body.style.backgroundColor = "#333";
        gridElement.innerHTML = "";
        testControls.style.display = "none";
        isTestMode = false;
    }

    document.addEventListener("keydown", (e) => {
        if (e.shiftKey && e.key.toLowerCase() === "q") {
            if (isHiddenFeatureUnlocked && tutorial.style.display !== "none") {
                isTestMode = !isTestMode;
                const testModeMessage = document.getElementById("test-mode-message");
                if (testModeMessage) {
                    testModeMessage.style.display = isTestMode ? "block" : "none";
                }
            } else if (tutorial.style.display === "none") {
                isTestMode = !isTestMode;
                if (isTestMode) {
                    testControls.style.display = "flex";
                    clearInterval(timerInterval);
                    timerDisplay.style.display = "none";
                    showTestPath();
                } else {
                    testControls.style.display = "none";
                    resetGame();
                }
            }
        }
    });

    window.addEventListener("resize", () => {
        if (!gameOver && canMove) {
            setCellSize();
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (!canMove || gameOver) return;
    let { x, y } = playerPosition;

    switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
            movePlayer(x, y - 1);
            break;
        case "ArrowDown":
        case "s":
        case "S":
            movePlayer(x, y + 1);
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            movePlayer(x - 1, y);
            break;
        case "ArrowRight":
        case "d":
        case "D":
            movePlayer(x + 1, y);
            break;
    }
});

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid Walk Challenge</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
</head>
<body>
    <div id="tutorial">
        <h1>Welcome to The Grid Walk Challenge</h1>
        <p id="creator">Created by madanii420</p>
        <p>🎮 How to Play:</p>
        <ul>
            <li>🔎 Memorize the yellow path shown on the grid for 5 seconds.</li>
            <li>🎯 Click and drag, touch and slide, or use arrow keys to move.</li>
            <li>❌ If you step on a wrong tile, you restart.</li>
            <li>🏆 Reach the bottom-right corner of the grid to win!</li>
        </ul>
        <div id="difficulty-selection">
            <p>Select Difficulty:</p>
            <button class="difficulty-btn" data-difficulty="easy">Easy (4x4)</button>
            <button class="difficulty-btn" data-difficulty="medium">Medium (5x5)</button>
            <button class="difficulty-btn" data-difficulty="hard">Hard (6x6)</button>
            <button class="difficulty-btn" data-difficulty="impossible">Impossible (7x7)</button>
            <button class="difficulty-btn" data-difficulty="extreme">Extreme (8x8)</button>
            <button class="difficulty-btn" data-difficulty="nightmare">Nightmare (9x9)</button>
        </div>
        <div id="hints-tab">
            <button id="hints-btn">Hints</button>
            <p id="hints-message" style="display: none;">Complete the whole difficulties without losing to reveal the surprise!</p>
        </div>
        <p id="test-mode-message" style="display: none; color: #FFCA28;">I'm in Test Mode</p>
        <p id="version">3.0 version</p>
    </div>

    <div id="game-container" style="display: none;">
        <h1>The Grid Walk Challenge</h1>
        <p id="message">Memorize the path! <span id="timer"></span></p>
        <div id="grid"></div>
        <button id="quit-btn">Quit</button>
        <div id="test-controls" style="display: none;">
            <p>Test Mode: Click cells to edit the path.</p>
            <button id="skip-btn">Skip Game</button>
            <button id="exit-test-btn">Exit Test Mode</button>
        </div>
        <div id="win-options" style="display: none;">
            <button id="same-difficulty-btn">Continue Same Difficulty</button>
            <button id="next-difficulty-btn">Next Difficulty</button>
            <button id="change-difficulty-btn">Change Difficulty</button>
        </div>
    </div>

    <div id="congrats-page" style="display: none;">
        <h1>Congratulations! 🎉</h1>
        <p>You've conquered all difficulties without losing!</p>
        <button id="play-again-btn">Play Again</button>
    </div>

    <audio id="victory-sound" src="assets/victory.mp3" preload="auto"></audio>

    <script src="script.js"></script>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'92b0d4537c9ebff6',t:'MTc0Mzc2OTk1Ni4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>

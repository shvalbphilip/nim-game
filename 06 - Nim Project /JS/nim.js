document.addEventListener("DOMContentLoaded", () => {
    const modeSDiv = document.querySelector(".modeSelectionDiv");
    const modeChoice = document.querySelector("#modeSelect");
    const startGameBtn = document.querySelector("#startGameBtn");
    const gameArea = document.querySelector("#gameArea");

    modeSDiv.classList.remove("hide");

    startGameBtn.addEventListener("click", () => {
        const selectedValue = modeChoice.value;
        handleGameMode(modeSDiv, selectedValue);
    });
});

function handleGameMode(modeSDiv, selectedValue) {
    console.log(modeSDiv, selectedValue);
    if (selectedValue === 'Easy: Stupid Machine' || selectedValue === 'Hard: Smart Machine') {
        modeSDiv.style.display = 'none';
        startGame(selectedValue);
    } else {
        alert('Please select a valid game mode.');
    }
}

function startGame(mode) {
    const gameArea = document.querySelector("#gameArea");
    gameArea.classList.remove("hide");
    gameArea.innerHTML = `
        <div class="NewDiv">
            <p>Game Mode: ${mode}</p>
            <div id="stickContainer"></div>
            <input type="number" id="playerInput" min="1" max="3">
            <button id="playerMoveBtn">Make Move</button>
            <p id="gameMessage"></p>
        </div>
    `;

    initializeGame(mode);
}

function initializeGame(mode) {
    const stickContainer = document.querySelector("#stickContainer");
    for (let i = 0; i < 100; i++) {
        const stick = document.createElement("div");
        stick.style.position = "absolute";
        stick.style.width = "5px";
        stick.style.height = "20px";
        stick.style.backgroundColor = "brown";
        stick.style.top = `${Math.random() * 680}px`;
        stick.style.left = `${Math.random() * 880}px`;
        stick.style.transform = `rotate(${Math.random() * 360}deg)`;
        stickContainer.appendChild(stick);
    }

    document.querySelector("#playerMoveBtn").addEventListener("click", () => {
        const playerInput = document.querySelector("#playerInput").value;
        makePlayerMove(parseInt(playerInput, 10));
    });

    // Initialize game state
    const gameState = {
        sticks: 100,
        mode: mode
    };

    updateGameState(gameState);
}

function makePlayerMove(count) {
    const gameState = getGameState();
    if (count < 1 || count > 3 || count > gameState.sticks) {
        alert("Invalid move. You can only take 1 to 3 sticks.");
        return;
    }

    gameState.sticks -= count;
    updateGameState(gameState);

    if (gameState.sticks === 0) {
        endGame("Player wins!");
        return;
    }

    setTimeout(() => {
        makeMachineMove(gameState);
    }, 1000);
}

function makeMachineMove(gameState) {
    let machineMove;
    if (gameState.mode === 'Easy: Stupid Machine') {
        machineMove = Math.floor(Math.random() * 3) + 1;
    } else if (gameState.mode === 'Hard: Smart Machine') {
        machineMove = 4 - (gameState.sticks % 4);
        if (machineMove === 4) {
            machineMove = Math.floor(Math.random() * 3) + 1;
        }
    }

    if (machineMove > gameState.sticks) {
        machineMove = gameState.sticks;
    }

    gameState.sticks -= machineMove;
    updateGameState(gameState);

    if (gameState.sticks === 0) {
        endGame("Machine wins!");
        return;
    }
}

function updateGameState(gameState) {
    const stickContainer = document.querySelector("#stickContainer");
    stickContainer.innerHTML = "";
    for (let i = 0; i < gameState.sticks; i++) {
        const stick = document.createElement("div");
        stick.style.position = "absolute";
        stick.style.width = "5px";
        stick.style.height = "20px";
        stick.style.backgroundColor = "brown";
        stick.style.top = `${Math.random() * 580}px`;
        stick.style.left = `${Math.random() * 680}px`;
        stick.style.transform = `rotate(${Math.random() * 360}deg)`;
        stickContainer.appendChild(stick);
    }
    setGameState(gameState);
}

function endGame(message) {
    const gameMessage = document.querySelector("#gameMessage");
    gameMessage.textContent = message;
    document.querySelector("#playerMoveBtn").disabled = true;
}

function getGameState() {
    return JSON.parse(localStorage.getItem("gameState"));
}

function setGameState(gameState) {
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

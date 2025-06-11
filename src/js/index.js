// index.js
import "../styles/styles.css";
import "../styles/reset.css";
import { createGrid, renderBoard } from './modules/dom.js';
import { Player } from './modules/player.js';
import { Ship } from './modules/ship.js';

// DOM elements
const modal = document.getElementById('startModal');
const modalText = document.querySelector('#startModal p');
const startBtn = document.getElementById('start-btn');
const playerGridContainer = document.getElementById('player-grid');
const enemyGridContainer = document.getElementById('enemy-grid');
const rotateBtn = document.getElementById('rotate-btn');
const playerMsg = document.getElementById('player-msg');
const computerMsg = document.getElementById('computer-msg');

// Game state
let human;
let enemy;
let gameActive = false;  // true when battle can begin
let shipOrientation = 'horizontal';
const shipLengths = [5, 4, 3, 3, 2];
let nextShipIndex = 0;

// Update rotate button label
function updateRotateLabel() {
    rotateBtn.textContent = `Orientation: ${shipOrientation}`;
}

// Randomly place all computer ships
function randomPlaceAllShips(board) {
    shipLengths.forEach(length => {
        let placed = false;
        while (!placed) {
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            placed = board.placeShip(new Ship(length), [x, y], orientation);
        }
    });
}

// Start placement when Start button clicked
startBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    startPlacementPhase();
    playerMsg.textContent = 'Place your ships.';
});

// Begin ship placement phase
function startPlacementPhase() {
    human = new Player('human');
    enemy = new Player('computer');

    // Place computer ships
    randomPlaceAllShips(enemy.gameboard);

    gameActive = false;
    shipOrientation = 'horizontal';
    nextShipIndex = 0;
    document.body.dataset.shipOrientation = shipOrientation;
    playerMsg.textContent = '';
    computerMsg.textContent = '';

    createGrid(playerGridContainer);
    createGrid(enemyGridContainer);

    renderBoard(playerGridContainer,
        human.gameboard.grid,
        human.gameboard.hitShots,
        human.gameboard.missedShots,
        false
    );
    renderBoard(enemyGridContainer,
        enemy.gameboard.grid,
        enemy.gameboard.hitShots,
        enemy.gameboard.missedShots,
        true
    );

    rotateBtn.disabled = false;
    rotateBtn.style.display = 'inline-block';
    updateRotateLabel();

    rotateBtn.addEventListener('click', onRotateOrientation);
    playerGridContainer.addEventListener('mouseover', onCellHover);
    playerGridContainer.addEventListener('mouseout', onCellOut);
    playerGridContainer.addEventListener('click', onCellClick);
}

// Toggle orientation
function onRotateOrientation() {
    shipOrientation = shipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    document.body.dataset.shipOrientation = shipOrientation;
    updateRotateLabel();
}

// Validate placement
function canPlaceShip(x, y, length, orientation) {
    const grid = human.gameboard.grid;
    if (orientation === 'vertical' && x + length > 10) return false;
    if (orientation === 'horizontal' && y + length > 10) return false;
    for (let i = 0; i < length; i++) {
        const px = orientation === 'vertical' ? x + i : x;
        const py = orientation === 'horizontal' ? y + i : y;
        if (grid[px][py] !== null) return false;
    }
    return true;
}

// Show preview on hover
function onCellHover(e) {
    if (gameActive) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    clearPreview();
    const [x, y] = cell.dataset.coord.split(',').map(Number);
    const length = shipLengths[nextShipIndex];
    const coords = getPreviewCoords(x, y, length, shipOrientation);
    const valid = canPlaceShip(x, y, length, shipOrientation);

    coords.forEach(([px, py]) => {
        const c = playerGridContainer.querySelector(
            `.cell[data-coord="${px},${py}"]`
        );
        if (c) c.classList.add(valid ? 'preview' : 'invalid');
    });
}

// Remove previews
function onCellOut() {
    clearPreview();
}

function clearPreview() {
    document.querySelectorAll('.cell.preview, .cell.invalid')
        .forEach(c => c.classList.remove('preview', 'invalid'));
}

// Place ship on click
function onCellClick(e) {
    if (gameActive) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    clearPreview();
    const [x, y] = cell.dataset.coord.split(',').map(Number);
    const length = shipLengths[nextShipIndex];
    const placed = human.gameboard.placeShip(
        new Ship(length), [x, y], shipOrientation
    );

    if (!placed) {
        playerMsg.textContent = '❗ Invalid placement';
        return;
    }

    renderBoard(playerGridContainer,
        human.gameboard.grid,
        human.gameboard.hitShots,
        human.gameboard.missedShots,
        false
    );

    nextShipIndex++;
    playerMsg.textContent = `Placed length-${length} ship.`;

    if (nextShipIndex >= shipLengths.length) {
        rotateBtn.removeEventListener('click', onRotateOrientation);
        playerGridContainer.removeEventListener('mouseover', onCellHover);
        playerGridContainer.removeEventListener('mouseout', onCellOut);
        playerGridContainer.removeEventListener('click', onCellClick);

        rotateBtn.disabled = true;
        rotateBtn.style.display = 'none';
        playerMsg.textContent = 'All ships placed! Begin battle.';
        gameActive = true;
    } else {
        const nextLen = shipLengths[nextShipIndex];
        playerMsg.textContent += ` Next: length-${nextLen}`;
    }
}

// Calculate ship coords
function getPreviewCoords(x, y, length, orientation) {
    const coords = [];
    for (let i = 0; i < length; i++) {
        const px = orientation === 'vertical' ? x + i : x;
        const py = orientation === 'horizontal' ? y + i : y;
        coords.push([px, py]);
    }
    return coords;
}

// Battle phase: player clicks enemy
enemyGridContainer.addEventListener('click', (e) => {
    if (!gameActive) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;

    const [x, y] = cell.dataset.coord.split(',').map(Number);
    const playerHit = enemy.gameboard.receiveAttack([x, y]);
    renderBoard(enemyGridContainer,
        enemy.gameboard.grid,
        enemy.gameboard.hitShots,
        enemy.gameboard.missedShots,
        true
    );
    playerMsg.textContent = playerHit ? '🎯 You hit!' : '💧 You missed…';

    if (enemy.gameboard.allShipsSunk()) {
        playerMsg.textContent = '🏆 You win!';
        modal.style.display = 'flex';
        modalText.textContent = "You win! Play again?";
        gameActive = false;
        return;
    }

    // Computer's turn
    const [cx, cy] = enemy.chooseRandomAttack(human.gameboard);
    const compHit = human.gameboard.receiveAttack([cx, cy]);
    renderBoard(playerGridContainer,
        human.gameboard.grid,
        human.gameboard.hitShots,
        human.gameboard.missedShots,
        false
    );
    computerMsg.textContent = compHit
        ? `🤖 Computer hit at [${cx},${cy}]!`
        : `🤖 Computer missed at [${cx},${cy}].`;

    if (human.gameboard.allShipsSunk()) {
        computerMsg.textContent += ' 💀 You lose';
        modal.style.display = 'flex';
        modalText.textContent = "You lose... Play again?";
        gameActive = false;
    }
});
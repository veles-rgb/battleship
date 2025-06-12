/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/js/modules/dom.js
// dom.js

function createGrid(container) {
    container.innerHTML = '';
    container.classList.add('gameboard');

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.coord = `${x},${y}`;
            container.appendChild(cell);
        }
    }
}

function renderBoard(
    container,
    grid,
    hitShots = [],
    missedShots = [],
    hideShips = false
) {
    // Clear previous status classes
    container.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('hit', 'miss', 'ship', 'sunk');
    });

    // Loop over each grid cell
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            const cellEl = container.querySelector(
                `.cell[data-coord="${x},${y}"]`
            );
            const ship = grid[x][y];

            // Reveal sunk ships always (even if hideShips=true)
            if (ship) {
                const sunk =
                    typeof ship.hasSunk === 'function'
                        ? ship.hasSunk()
                        : ship.isSunk;
                if (sunk) {
                    cellEl.classList.add('sunk');
                    continue;
                }
            }

            // Mark hits (non-sunk)
            if (hitShots.some(([hx, hy]) => hx === x && hy === y)) {
                cellEl.classList.add('hit');
                continue;
            }

            // Mark misses
            if (missedShots.some(([mx, my]) => mx === x && my === y)) {
                cellEl.classList.add('miss');
                continue;
            }

            // Reveal remaining ships if allowed
            if (ship && !hideShips) {
                cellEl.classList.add('ship');
            }
        }
    }
}

;// ./src/js/modules/gameboard.js
class Gameboard {
    constructor() {
        this.grid = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.ships = [];
        this.hitShots = [];
        this.missedShots = [];
    }

    placeShip(ship, [startX, startY], direction) {
        // Out-of-bounds check
        if (direction === 'vertical' && startX + ship.length > 10) return false;
        if (direction === 'horizontal' && startY + ship.length > 10) return false;

        // Overlap check (ship already in coords)
        const coords = [];
        for (let i = 0; i < ship.length; i++) {
            // x = row index, y = column index
            const x = direction === 'vertical' ? startX + i : startX;
            const y = direction === 'horizontal' ? startY + i : startY;

            if (this.grid[x][y] !== null) return false;
            coords.push({ x, y });
        }

        // Place the ship after checks
        coords.forEach(({ x, y }) => {
            this.grid[x][y] = ship;
        });

        // Add ship to board.ships
        this.ships.push(ship);
        return true;
    }


    receiveAttack([x, y]) {
        // Check for attack or miss on coords
        const coordsHit = this.hitShots.some(
            (coords) => coords[0] === x && coords[1] === y
        );
        const coordsMissed = this.hitShots.some(
            (coords) => coords[0] === x && coords[1] === y
        );

        // Don't receive attack if coords have been hit or missed already
        if (coordsHit || coordsMissed) return false;

        const target = this.grid[x][y];

        // Determine if shot is a hit or miss if not hit or missed already
        if (target === null) {
            // Miss
            this.missedShots.push([x, y]);
            return false;
        } else {
            // Hit
            target.hit();
            this.hitShots.push([x, y]);
            return true;
        }
    }

    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk);
    }

    getAvailableMoves() {
        const attacked = new Set([
            ...this.hitShots.map(([x, y]) => `${x},${y}`),
            ...this.missedShots.map(([x, y]) => `${x},${y}`)
        ]);
        const moves = [];
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (!attacked.has(`${x},${y}`)) moves.push([x, y]);
            }
        }
        return moves;
    }
}


;// ./src/js/modules/player.js


class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
        // For computer attacks
        this.targetQueue = [];
        this.lastHitShip = null;
    }

    // Method for computer attacks
    chooseRandomAttack(opponentBoard) {
        // Get target coords (if there targetQueue not empty)
        while (this.targetQueue.length > 0) {
            let coord = this.targetQueue.shift();
            let moves = opponentBoard.getAvailableMoves();
            if (moves.some(m => m[0] === coord[0] && m[1] === coord[1])) {
                return coord;
            }
        }

        // Pick random valid coords
        const moves = opponentBoard.getAvailableMoves();
        if (moves.length === 0) return null;
        const idx = Math.floor(Math.random() * moves.length);
        return moves[idx];
    }

    recordAttackResult(coord, wasHit, opponentBoard) {
        if (!wasHit) return;

        // Find ship at coord
        const [x, y] = coord;
        const ship = opponentBoard.grid[x][y];
        if (!ship) return;

        // Reset targetQueue if new ship
        if (ship !== this.lastHitShip) {
            this.lastHitShip = ship;
            this.targetQueue = [];
        }

        // If hit ship not sunk, target 4 possible areas
        if (!ship.hasSunk()) {
            // Set possible attack coords based on hit position
            const deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];
            const moves = opponentBoard.getAvailableMoves();
            // Adjust attack coords based on hit position
            for (const [dx, dy] of deltas) {
                const nx = x + dx;
                const ny = y + dy;
                if (
                    nx >= 0 && nx < 10 &&
                    ny >= 0 && ny < 10 &&
                    moves.some(m => m[0] === nx && m[1] === ny)) {
                    this.targetQueue.push([nx, ny]);
                }
            }
        } else {
            // Ship sank, clear variables
            this.lastHitShip = null;
            this.targetQueue = [];
        }
    }
}


;// ./src/js/modules/ship.js
// ship.js
class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.isSunk = false;
    }

    hit() {
        if (this.isSunk) {
            return;
        }

        this.timesHit += 1;

        if (this.timesHit === this.length) {
            this.isSunk = true;
        }
    }

    hasSunk() {
        return this.timesHit >= this.length;
    }
}


;// ./src/js/index.js
// index.js






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

// Randomly place computer ships
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

// Begin player ship placement
function startPlacementPhase() {
    human = new Player('human');
    enemy = new Player('computer');

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

    // Prevent repeat shots
    if (
        cell.classList.contains('hit') ||
        cell.classList.contains('miss') ||
        cell.classList.contains('sunk')
    ) {
        playerMsg.textContent = '❗ You already fired there.';
        computerMsg.textContent = '';
        return;
    }

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
        computerMsg.textContent = '';
        modal.style.display = 'flex';
        gameActive = false;
        modalText.textContent = 'You win! Play again?';
        return;
    }

    // Computer's turn
    const [cx, cy] = enemy.chooseRandomAttack(human.gameboard);
    const compHit = human.gameboard.receiveAttack([cx, cy]);
    // If attack was a hit, record attack coords
    enemy.recordAttackResult([cx, cy], compHit, human.gameboard);

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
        computerMsg.textContent = ' 💀 You lose';
        playerMsg.textContent = "";
        modal.style.display = 'flex';
        modalText.textContent = 'You lose... Play again?';
        gameActive = false;
    }
});

/******/ })()
;
//# sourceMappingURL=main.js.map
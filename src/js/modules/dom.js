// dom.js

export function createGrid(container) {
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

export function renderBoard(
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

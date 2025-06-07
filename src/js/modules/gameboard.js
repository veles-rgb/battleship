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


    receiveAttack() {

    }

    allShipsSunk() {

    }
}

export { Gameboard };
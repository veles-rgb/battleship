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

export { Gameboard };
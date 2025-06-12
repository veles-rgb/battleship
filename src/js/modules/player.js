import { Gameboard } from "./gameboard";

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

export { Player };
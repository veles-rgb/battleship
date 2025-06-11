import { Gameboard } from "./gameboard";

class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
    }

    chooseRandomAttack(opponentBoard) {
        const moves = opponentBoard.getAvailableMoves();
        if (moves.length === 0) return null;
        const idx = Math.floor(Math.random() * moves.length);
        return moves[idx];
    }
}

export { Player };
class Gameboard {
    constructor() {
        this.grid = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.ships = [];
        this.hitShots = [];
        this.missedShots = [];
    }

    placeShip(ship, cords, direction) {

    }

    receiveAttack(cords) {

    }

    allShipsSunk() {

    }
}

export { Gameboard };
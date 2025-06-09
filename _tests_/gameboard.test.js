// gameboard.test.js
import { Gameboard } from "../src/js/modules/gameboard.js";
import { Ship } from "../src/js/modules/ship.js";

describe('Gameboard tests', () => {
    let board;
    let ship;

    beforeEach(() => {
        board = new Gameboard();
    });

    test('board.grid exists and is empty at first', () => {
        expect(board.grid[0][0]).toBe(null);
    });

    test('placeShip places a ship at coords horizontally', () => {
        // ship.length of 3
        ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'horizontal');
        expect(board.grid[0][0]).toBe(ship);  // row 0, col 0
        expect(board.grid[0][1]).toBe(ship);  // row 0, col 1
        expect(board.grid[0][2]).toBe(ship);  // row 0, col 2
    });

    test('placeShip places a ship at coords vertically', () => {
        // ship.length of 3
        ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'vertical');
        expect(board.grid[0][0]).toBe(ship);  // row 0, col 0
        expect(board.grid[1][0]).toBe(ship);  // row 1, col 0
        expect(board.grid[2][0]).toBe(ship);  // row 2, col 0
    });

    test('placeShip cannot place a ship out of bounds of the grid', () => {
        ship = new Ship(4);
        expect(board.placeShip(ship, [0, 7], 'horizontal')).toBe(false);
    });

    test('placeShip cannot place a ship where there is already a ship', () => {
        let placedShip = new Ship(4);
        ship = new Ship(3);

        // Add placedShip to grid
        board.placeShip(placedShip, [1, 2], 'horizontal');
        expect(board.grid[1][2]).toBe(placedShip); // row 1, col 2
        expect(board.grid[1][3]).toBe(placedShip); // row 1, col 3
        expect(board.grid[1][4]).toBe(placedShip); // row 1, col 4
        expect(board.grid[1][5]).toBe(placedShip); // row 1, col 5

        // Check to make sure I cannot place in occupied spots
        expect(board.placeShip(ship, [1, 2], 'horizontal')).toBe(false); // row 1, col 2, horizontal
        expect(board.placeShip(ship, [1, 2], 'vertical')).toBe(false); // row 1, col 2, vertical
        expect(board.placeShip(ship, [1, 5], 'vertical')).toBe(false); // row 1, col 5, vertical
    });

    test('receiveAttack sends hit() to the right ship', () => {
        ship = new Ship(3);
        board.placeShip(ship, [2, 2], 'horizontal');
        board.receiveAttack([2, 2]);

        expect(ship.timesHit).toBe(1);
    });

    test('receiveAttack records the coordinates of a missed shot if missed', () => {
        ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'horizontal');
        board.receiveAttack([1, 0]);

        expect(board.missedShots[0]).toEqual([1, 0]);
    });

    test('receiveAttack cannot hit() the same spots more than once', () => {
        ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'horizontal');
        board.receiveAttack([0, 0]);

        expect(board.receiveAttack([0, 0])).toBe(false);
    });

    test('board.missedShots returns an array of all missed shots', () => {
        ship = new Ship(3);
        board.placeShip(ship, [0, 0], 'horizontal');
        board.receiveAttack([1, 0]);
        board.receiveAttack([2, 0]);
        board.receiveAttack([3, 0]);

        expect(board.missedShots).toEqual([[1, 0], [2, 0], [3, 0]]);
    });

    test('allShipsSunk reports true if all ships isSunk', () => {
        ship = new Ship(3);
        let ship2 = new Ship(2);
        let ship3 = new Ship(3);
        // Place ships
        board.placeShip(ship, [0, 0], 'horizontal');
        board.placeShip(ship2, [1, 3], 'vertical');
        board.placeShip(ship3, [5, 6], 'horizontal');
        // Attack ship
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        board.receiveAttack([0, 2]);
        // Attack ship 2
        board.receiveAttack([1, 3]);
        board.receiveAttack([2, 3]);
        // Attack ship 3
        board.receiveAttack([5, 6]);
        board.receiveAttack([5, 7]);
        board.receiveAttack([5, 8]);

        expect(board.allShipsSunk()).toEqual(true);
    });

    test('allShipsSunk reports false if all ships are not sunk', () => {
        ship = new Ship(3);
        let ship2 = new Ship(2);
        let ship3 = new Ship(3);
        // Place ships
        board.placeShip(ship, [0, 0], 'horizontal');
        board.placeShip(ship2, [1, 3], 'vertical');
        board.placeShip(ship3, [5, 6], 'horizontal');

        expect(board.allShipsSunk()).toEqual(false);
    });
});
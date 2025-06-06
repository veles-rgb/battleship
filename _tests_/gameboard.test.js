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
        board.placeShip(ship, [0, 0], horizontal);
        expect(board[0][0]).toBe(ship);  // row 0, col 0
        expect(board[0][1]).toBe(ship);  // row 0, col 1
        expect(board[0][2]).toBe(ship);  // row 0, col 2
    });

    test('placeShip places a ship at coords vertically', () => {
        // ship.length of 3
        ship = new Ship(3);
        board.placeShip(ship, [0, 0], vertical);
        expect(board[0][0]).toBe(ship);  // row 0, col 0
        expect(board[1][0]).toBe(ship);  // row 1, col 0
        expect(board[2][0]).toBe(ship);  // row 2, col 0
    });

    test('placeShip cannot place a ship out of bounds of the grid', () => {

    });

    test('placeShip cannot place a ship where there is already a ship', () => {

    });

    test('receiveAttack sends hit() to the right ship', () => {

    });

    test('receiveAttack records the coordinates of a missed shot if missed', () => {

    });

    test('receiveAttack cannot hit() the same spots more than once', () => {

    });

    test('board.missedShots returns an array of all missed shots', () => {

    });

    test('allShipsSunk reports true if all ships isSunk', () => {

    });

    test('allShipsSunk reports false if all ships are not sunk', () => {

    });
});
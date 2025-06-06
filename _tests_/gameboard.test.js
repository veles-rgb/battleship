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

    });

    test('placeShip places a ship at horizontally', () => {

    });

    test('placeShip places a ship vertically', () => {

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
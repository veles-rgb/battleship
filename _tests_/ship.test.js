// ship.test.js
import { Ship } from "../src/js/modules/ship.js";

describe('Ship Tests', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship(3);
    });

    test('Check ships length set to 3', () => {
        ship.length = 3;

        expect(ship.length).toBe(3);
    });

    test('Check if ship was hit 2 times', () => {
        ship.hit();
        ship.hit();

        expect(ship.timesHit).toBe(2);
    });

    test('Check if ship is sunk after ship.length hits', () => {
        // Hit the ship 3 times - ship.length = 3
        ship.hit();
        ship.hit();
        ship.hit();

        expect(ship.isSunk).toBe(true);
    });

    test('did timesHit increase?', () => {
        const beforeHit = ship.timesHit;
        ship.hit();

        expect(ship.timesHit).toBe(beforeHit + 1);
    });

    test('ship is considered sunk based on its length and the number of hits it has received', () => {
        ship.hit();
        ship.hit();
        ship.hit();

        expect(ship.hasSunk()).toBe(true);
    });
});
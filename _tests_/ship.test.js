// ship.test.js
import { Ship } from "../src/js/modules/ship.js";

describe("Ship Class", () => {
    let ship;

    beforeEach(() => {
        ship = new Ship(3);
    });

    test("constructor sets length and initial state", () => {
        expect(ship.length).toBe(3);
        expect(ship.timesHit).toBe(0);
        expect(ship.isSunk).toBe(false);
        expect(ship.hasSunk()).toBe(false);
    });

    test("hit() increments timesHit by 1", () => {
        ship.hit();
        expect(ship.timesHit).toBe(1);
        ship.hit();
        expect(ship.timesHit).toBe(2);
    });

    test("isSunk remains false until timesHit === length", () => {
        ship.hit(); // timesHit = 1
        expect(ship.hasSunk()).toBe(false);
        ship.hit(); // timesHit = 2
        expect(ship.hasSunk()).toBe(false);
    });

    test("ship is sunk exactly when timesHit === length", () => {
        ship.hit(); // 1/3
        ship.hit(); // 2/3
        ship.hit(); // 3/3
        expect(ship.timesHit).toBe(3);
        expect(ship.isSunk).toBe(true);
        expect(ship.hasSunk()).toBe(true);
    });

    test("timesHit never exceeds length even if hit() called extra times", () => {
        // sink the ship
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.hasSunk()).toBe(true);

        // additional hits should not change timesHit
        ship.hit();
        ship.hit();
        expect(ship.timesHit).toBe(3);
        expect(ship.hasSunk()).toBe(true);
    });

    test("calling hit() on a sunk ship does not change isSunk", () => {
        // sink it first
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk).toBe(true);

        // hit again
        ship.hit();
        expect(ship.timesHit).toBe(3);
        expect(ship.isSunk).toBe(true);
    });

    test("hasSunk() remains true once ship is sunk", () => {
        ship.hit();
        ship.hit();
        ship.hit(); // sunk
        expect(ship.hasSunk()).toBe(true);

        // call hasSunk() multiple times
        expect(ship.hasSunk()).toBe(true);
        expect(ship.isSunk).toBe(true);
    });

    test("length = 1 ship sinks on first hit", () => {
        const oneLength = new Ship(1);
        expect(oneLength.hasSunk()).toBe(false);
        oneLength.hit();
        expect(oneLength.timesHit).toBe(1);
        expect(oneLength.hasSunk()).toBe(true);
        // extra hit does not increment
        oneLength.hit();
        expect(oneLength.timesHit).toBe(1);
        expect(oneLength.hasSunk()).toBe(true);
    });
});
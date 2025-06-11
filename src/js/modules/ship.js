// ship.js
class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.isSunk = false;
    }

    hit() {
        if (this.isSunk) {
            return;
        }

        this.timesHit += 1;

        if (this.timesHit === this.length) {
            this.isSunk = true;
        }
    }

    hasSunk() {
        return this.timesHit >= this.length;
    }
}

export { Ship };
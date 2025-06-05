class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.isSunk = false;
    }

    hit() {
        if (this.timesHit < this.length) {
            this.timesHit += 1;
            this.hasSunk();
        } else {
            this.hasSunk();
            return "This ship has sunk";
        }
    }

    hasSunk() {
        if (this.timesHit === this.length) {
            this.isSunk = true;
            return true;
        } else {
            this.isSunk = false;
            return false;
        }
    }
}

export { Ship };
"use strict";

// incapsulates player balance calculations
class Player {
    // initial setup
    constructor({ credit, roundCost }) {
        this.balance = credit;
        this.roundCost = roundCost;
    }

    // play round calculations
    playRound(secretNumber, guessedNumber) {
        this.balance -= this.roundCost;
        let win = false;
        if (+guessedNumber < +secretNumber) {
            this.balance += +guessedNumber * this.roundCost;
            win = true;
        }

        return { win, balance: Math.round(this.balance * 100) / 100, guessedNumber };
    }

    //virifies that player has enough credits for next round
    hasCredit() {
        return this.balance >= this.roundCost;
    }
};

export default Player;
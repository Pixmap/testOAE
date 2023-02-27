"use strict";
import Player from './player.js'

// class that incapsulate the game logic
class Game {
    // initial game setup in contuctor
    constructor({ opponents, credit, roundCost, graphLifetime, roundDelay, dbManager }) {
        this.opponents = opponents;
        this.credit = credit;
        this.graphLifetime = graphLifetime;
        this.roundDelay = roundDelay;
        this.gameIsOver = false;
        this.wonTheGame = false;
        this.roundNumber = 1;
        this.players = Array.from({ length: opponents }, () => new Player({ credit, roundCost }));
        this.realPlayer = new Player({ credit, roundCost });
        this.readyToPlay = true;
        this.dbManager = dbManager;
    }

    // random value generator
    getRandomValue() {
        return (Math.random() * 10).toFixed(2);
    }

    // round logic
    playRound(guessedNumber, callback) {
        if (this.readyToPlay && !this.gameIsOver) {
            this.readyToPlay = false;
            // generate round secret number
            const secretNumber = this.getRandomValue();

            setTimeout(() => { this.readyToPlay = true; callback('cleargraph'); }, this.graphLifetime);
            setTimeout(() => { this.readyToPlay = true; callback('readytoplay'); }, this.roundDelay);

            // play round for every player and concatenate real player results and opponents
            const roundResults = [this.realPlayer.playRound(secretNumber, guessedNumber),
            ...this.players.map((pl) => pl.playRound(secretNumber, this.getRandomValue()))];

            // store round results into DB
            this.dbManager.writeRoundResults({ roundNumber: this.roundNumber, secretNumber, results: roundResults });
            this.roundNumber++;
            return { roundNumber: this.roundNumber, secretNumber, roundResults };
        }
    }

    // end of game validator
    isGameOver() {
        const playerHasntCredit = !this.realPlayer.hasCredit();
        const opponentsHaventCredit = this.players.every((pl) => !pl.hasCredit());

        if (opponentsHaventCredit) {
            console.info('opponentsHaventCredit');
            this.wonTheGame = true;
        }

        if (playerHasntCredit) {
            console.info('playerHasntCredit');
        }

        const gameOver = playerHasntCredit || opponentsHaventCredit;
        if (gameOver) {
            this.dbManager.writeGameResults(this.wonTheGame);
        }
        return gameOver;
    }
};

export default Game;

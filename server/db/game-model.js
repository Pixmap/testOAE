"use strict";

import mongoose from "mongoose";

// DB schema for the game
const GameSchema = new mongoose.Schema({
    rounds: [
        {
            roundNumber: Number,
            secretNumber: Number,
            results: [{
                playerNumber: Number,
                guessedNumber: Number,
                win: Boolean,
                balance: Number
            }]
        }
    ],
    wonTheGame: {
        type: Boolean,
        default: false,
    },
});

const GameModel = mongoose.model("Game", GameSchema);

export default GameModel;
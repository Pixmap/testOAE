"use strict";

import mongoose from "mongoose";
mongoose.set('strictQuery', true);

import GameModel from './game-model.js'

// Encapsulates database related logic
class DBManager {
    init = async (dbName) => {
        try {
            // establish connection with databae
            // all configs values are hardcoded just fir simplicity, ideally should be taken from config\
            // replace on `mongodb://127.0.0.1:27017/${dbName}` for starting without docker 
            await mongoose.connect(`mongodb://mongo_db:27017/${dbName}`);
            console.info('DB connected!');
        } catch (err) {
            console.error(`Filed to connect database: ${err.message}`);
            process.exit(1);
        }
    }

    // updates round results
    writeRoundResults = async ({ roundNumber, secretNumber, results }) => {
        const roundResults = results.map((result, index) => {
            return { ...result, plyerNumber: index + 1 }
        });

        try {
            if (!this.gameModel) {
                this.gameModel = new GameModel({ rounds: [{ roundNumber, secretNumber, results: roundResults }] });
                await this.gameModel.save();
            } else {
                let doc = await GameModel.findOne({ _id: this.gameModel._id });
                doc.rounds.push({ roundNumber, secretNumber, results: roundResults });
                await doc.save();
            }
        } catch (err) {
            console.error(`Failed to writeRoundResults err=${err.message}`);
        }
    }

    // writes game result
    writeGameResults = async (wonTheGame) => {
        try {
            const doc = await GameModel.findOne({ _id: this.gameModel?._id });
            doc.wonTheGame = wonTheGame;
            await doc.save();
        } catch (err) {
            console.error(`Failed to writeGameResults err=${err.message}`);
        }
    }
};

export default DBManager;
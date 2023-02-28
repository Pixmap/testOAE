"use strict";
import DBManager from "./db/db-manager.js";
import { WebSocketServer } from "ws";
import Game from "./services/game.js";

console.info('NodeJS server has started!');

// create DBManager instance()
const dbManager = new DBManager();
dbManager.init('test');

// create websocket instance
const wss = new WebSocketServer({ port: 7071 });
let theGame;

// to handle websocket events
wss.on('connection', (ws) => {
    ws.on('open', () => {
        console.info('ws connection opened');
    });

    ws.on("close", () => {
        console.info('ws connection closed');
    });

    ws.on('message', (event) => {
        const msg = JSON.parse(event);
        if (msg?.cmd === 'start') {
            const credit = 100;
            const roundCost = 10;
            // create new game instance
            // ability to have several simultaneous games was omitted for simplicity
            theGame = new Game({
                opponents: 4,
                credit,
                roundCost,
                graphLifetime: 3000,
                roundDelay: 10000,
                dbManager: dbManager
            });
            // notify client that game was started
            ws.send(JSON.stringify({ cmd: 'started', payload: { players: new Array(5).fill({ balance: credit, roundCost }) } }));
        }

        if (msg?.cmd === 'playround') {
            //play next round
            const roundResults = theGame.playRound(msg.payload?.guessedNumber, (cmd) => {
                // handle chart reset and readytopla events
                ws.send(JSON.stringify({ cmd }));
            });

            //send round results to the client
            ws.send(JSON.stringify({ cmd: 'roundresults', payload: { ...roundResults } }));

            // let's give the client a chance to consume results of the latest round
            if (theGame.isGameOver()) {
                setTimeout(function () {
                    ws.send(JSON.stringify({ cmd: 'gameover' }));
                }, 500);
            }
        }
    });
});

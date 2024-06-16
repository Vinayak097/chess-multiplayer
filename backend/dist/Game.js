"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({ type: message_1.init__game, payload: { color: "white" } }));
        this.player2.send(JSON.stringify({ type: message_1.init__game, payload: { color: "black" } }));
    }
    joinGame() {
        // Implementation of joinGame
    }
    makeMove(socket, move) {
        //validate moves 
        if (this.board.moves().length % 2 == 0 && socket !== this.player1) {
            console.log("early return 1");
            return;
        }
        if (this.board.moves().length % 2 == 1 && socket !== this.player2) {
            console.log("early return 2");
            return;
        }
        try {
            console.log("before move ", this.board);
            this.board.move(move);
            console.log("moved ", this.board);
        }
        catch (error) {
            console.log('error', error);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.emit(JSON.stringify({
                type: message_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.board.moves().length % 2 == 0) {
            console.log("emits moves");
            this.player2.emit(JSON.stringify({
                type: message_1.Move,
                payload: move
            }));
            this.player1.emit(JSON.stringify({ type: message_1.Move,
                payload: move
            }));
        }
    }
}
exports.Game = Game;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const message_1 = require("./message");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({ type: message_1.init__game, payload: { color: "white" } }));
        this.player2.send(JSON.stringify({ type: message_1.init__game, payload: { color: "black" } }));
    }
    makeMove(socket, move) {
        // Validate player turn
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log("Not white player's turn");
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log("Not black player's turn");
            return;
        }
        // Make move
        try {
            const result = this.board.move({
                from: move.from,
                to: move.to
            });
            if (!result) {
                console.log("Invalid move");
                return;
            }
            console.log(`Move made: ${move.from} to ${move.to}`);
            console.log(this.board.ascii());
            // Send move to opponent
            const moveMessage = JSON.stringify({
                type: message_1.Move,
                payload: move
            });
            if (this.moveCount % 2 === 0) {
                this.player2.send(moveMessage);
            }
            else {
                this.player1.send(moveMessage);
            }
            this.moveCount++;
            // Check game end conditions
            if (this.board.isGameOver()) {
                const gameOverMessage = JSON.stringify({
                    type: message_1.GAME_OVER,
                    payload: {
                        winner: this.board.turn() === 'w' ? "black" : "white",
                        reason: this.getGameOverReason()
                    }
                });
                this.player1.send(gameOverMessage);
                this.player2.send(gameOverMessage);
                return;
            }
        }
        catch (error) {
            console.error('Move error:', error);
            return;
        }
    }
    getGameOverReason() {
        if (this.board.isCheckmate())
            return "checkmate";
        if (this.board.isDraw())
            return "draw";
        if (this.board.isStalemate())
            return "stalemate";
        if (this.board.isThreefoldRepetition())
            return "threefold repetition";
        if (this.board.isInsufficientMaterial())
            return "insufficient material";
        return "unknown";
    }
    isValidMove(from, to) {
        try {
            const moves = this.board.moves({ verbose: true });
            return moves.some(move => move.from === from && move.to === to);
        }
        catch (_a) {
            return false;
        }
    }
    getCurrentTurn() {
        return this.board.turn() === 'w' ? 'white' : 'black';
    }
    getGameDuration() {
        return Date.now() - this.startTime.getTime();
    }
}
exports.Game = Game;

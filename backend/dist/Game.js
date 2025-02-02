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
        try {
            const result = this.board.move({
                from: move.from,
                to: move.to
            });
            if (!result) {
                console.log("Invalid move");
                return;
            }
            // Send move to BOTH players
            const moveMessage = JSON.stringify({
                type: message_1.Move,
                payload: {
                    move: move,
                    board: this.board.board(),
                    turn: this.board.turn(),
                    fen: this.board.fen()
                }
            });
            this.player1.send(moveMessage);
            this.player2.send(moveMessage);
            this.moveCount++;
            console.log("Board after move:\n" + this.board.ascii());
            // Check for game over
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === 'w' ? 'black' : 'white';
                const gameOverMessage = JSON.stringify({
                    type: message_1.GAME_OVER,
                    payload: {
                        winner: winner,
                        reason: this.getGameOverReason()
                    }
                });
                this.player1.send(gameOverMessage);
                this.player2.send(gameOverMessage);
                console.log(`Game over! Winner: ${winner}`);
            }
        }
        catch (error) {
            console.error('Move error:', error);
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

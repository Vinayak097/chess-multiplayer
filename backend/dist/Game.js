"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameStatus = void 0;
const chess_js_1 = require("chess.js");
var GameStatus;
(function (GameStatus) {
    GameStatus["waiting"] = "wating";
    GameStatus["inGame"] = "inGame";
    GameStatus["ended"] = "ended";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
class Game {
    constructor(id, player1) {
        this.id = id;
        this.status = GameStatus.waiting;
        this.player1 = player1,
            this.player2 = null,
            this.chess = new chess_js_1.Chess();
    }
    makemove(move) {
        var _a;
        const turn = this.chess.turn();
        if (turn != ((_a = this.player1) === null || _a === void 0 ? void 0 : _a.color)) {
            throw new Error("it not your turn");
        }
        const movve = this.chess.move(move);
        if (!movve) {
            throw new Error("not a valid move");
        }
        if (this.chess.isGameOver()) {
            //handle game over by sending emit 
            this.status = GameStatus.ended;
        }
        return {
            move: movve,
            fen: this.chess.fen(),
            turn: this.chess.turn(),
            gameOver: this.chess.isGameOver(),
            checkmate: this.chess.isCheckmate()
        };
        //validation
        //check whos turn is this 
        //make changes to the board with that move 
        //check winnerr if so return winner somhow 
        //and return the chess
    }
    addPlayer(player) {
        this.player2 = player;
        this.status = GameStatus.inGame;
    }
}
exports.Game = Game;

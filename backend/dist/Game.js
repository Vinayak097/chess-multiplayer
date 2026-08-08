"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = exports.GameStatus = void 0;
const chess_js_1 = require("chess.js");
const Timer_1 = require("./Timer");
const _1 = require(".");
var GameStatus;
(function (GameStatus) {
    GameStatus["waiting"] = "waiting";
    GameStatus["inGame"] = "inGame";
    GameStatus["ended"] = "ended";
})(GameStatus || (exports.GameStatus = GameStatus = {}));
class Game {
    constructor(id, player1, gametype) {
        this.id = id;
        this.status = GameStatus.waiting;
        this.result = undefined;
        ((this.player1 = player1),
            (this.gametype = gametype),
            (this.player2 = null),
            (this.chess = new chess_js_1.Chess()));
        if (gametype == "Blitz") {
            this.timer = new Timer_1.Timer(id, 180, 180, "w", (gameId, loser) => this.ontimeOut(loser), (whiteTimer, blackTimer) => this.gameTick(whiteTimer, blackTimer));
        }
        else if (gametype == "Bullet") {
            this.timer = new Timer_1.Timer(id, 60, 60, "w", (gameId, loser) => this.ontimeOut(loser), (whiteTimer, blackTimer) => this.gameTick(whiteTimer, blackTimer));
        }
        else {
            this.timer = new Timer_1.Timer(id, 600, 600, "w", (gameId, loser) => this.ontimeOut(loser), (whiteTimer, blackTimer) => this.gameTick(whiteTimer, blackTimer));
        }
    }
    makemove({ playerId, move }) {
        var _a, _b;
        console.log("playerd from move", playerId, move);
        // 1. Game already ended
        if (playerId == null)
            return;
        if (this.status === GameStatus.ended) {
            console.log("Game has already ended");
            return;
        }
        // 2. Check whose turn it is
        const turn = this.chess.turn(); // 'w' or 'b'
        if ((turn === "w" && playerId !== ((_a = this.player1) === null || _a === void 0 ? void 0 : _a.id)) ||
            (turn === "b" && playerId !== ((_b = this.player2) === null || _b === void 0 ? void 0 : _b.id))) {
            console.log("not your turn ", playerId);
            return;
        }
        // 3. Make move (guard against chess.js throwing on invalid input)
        let playedMove = null;
        try {
            playedMove = this.chess.move(move);
        }
        catch (err) {
            console.log("invalid move (exception)", move, err);
            return null;
        }
        if (!playedMove) {
            console.log("invalid move ", move);
            return null;
        }
        let time;
        if (this.gametype == "Blitz") {
            time = 2;
            this.timer.incrementTime(turn, time);
        }
        else if (this.gametype == "Rapid") {
        }
        else {
        }
        this.timer.switchTurn(this.chess.turn());
        // 4. Update game status
        if (this.chess.isGameOver()) {
            this.status = GameStatus.ended;
        }
        // 5. Return updated game state
        return {
            move: playedMove,
            fen: this.chess.fen(),
            turn: this.chess.turn(),
            gameOver: this.chess.isGameOver(),
            checkmate: this.chess.isCheckmate(),
            draw: this.chess.isDraw(),
            stalemate: this.chess.isStalemate(),
            insufficientMaterial: this.chess.isInsufficientMaterial(),
            threefoldRepetition: this.chess.isThreefoldRepetition(),
        };
    }
    addPlayer(player) {
        this.player2 = player;
        this.status = GameStatus.inGame;
        this.timer.start();
    }
    ontimeOut(loser) {
        this.status = "finished";
        this.winner = loser == "w" ? "b" : "w";
        this.result = "Timeout";
        _1.io.to(this.id).emit("game-over", {
            winner: this.winner,
            result: this.result,
        });
    }
    gameTick(whiteTimer, blackTimer) {
        _1.io.to(this.id).emit("timer-update", {
            whiteTime: whiteTimer,
            blackTime: blackTimer,
        });
    }
}
exports.Game = Game;

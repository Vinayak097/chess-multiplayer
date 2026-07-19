"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const gameManger_1 = require("./gameManger");
const Game_1 = require("./Game");
const server = http_1.default.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const gameManager = new gameManger_1.GameManager();
app.get("/health", (res) => {
    console.log("fine");
    res.json({ message: "hello fine" });
});
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("a user is connected");
    socket.on("join-game", (p) => {
        var _a, _b, _c;
        let data = p;
        if (typeof p == "string") {
            data = JSON.parse(p);
        }
        console.log(p, "joing game recienved", p.id);
        const player = {
            id: p.id || (0, uuid_1.v4)(),
            color: "w",
            socket: socket,
        };
        const result = gameManager.joinGame(player);
        if (result == null) {
            return;
        }
        console.log(result.game.status == Game_1.GameStatus.waiting, " waiting check");
        if (result.game.status == Game_1.GameStatus.waiting) {
            console.log("emiteing the player 1");
            (_a = result.game.player1) === null || _a === void 0 ? void 0 : _a.socket.emit("waiting", {
                gameId: result.game.id,
            });
            socket.join(result.game.id);
            return;
        }
        if (result.game.status == Game_1.GameStatus.inGame) {
            socket.join(result.game.id);
            const player1 = result.game.player1;
            const player2 = result.game.player2;
            player1.socket.emit("game-start", {
                gameId: result.game.id,
                playerId: (_b = result.game.player1) === null || _b === void 0 ? void 0 : _b.id,
                fen: result.game.chess.fen(),
                turn: result.game.chess.turn(),
                color: "w",
            });
            console.log(result.game, ' game object');
            player2.socket.emit("game-start", {
                gameId: result.game.id,
                playerId: (_c = result.game.player2) === null || _c === void 0 ? void 0 : _c.id,
                fen: result.game.chess.fen(),
                turn: result.game.chess.turn(),
                color: "b",
            });
            return;
        }
    });
    socket.on("move", (playload) => {
        let data = playload;
        if (typeof data == "string") {
            data = JSON.parse(playload);
        }
        console.log("payload move ", playload, playload.move);
        const game = gameManager.getGame(playload.gameId);
        console.log(game, "returned game ");
        if (!game) {
            socket.emit("gamenotfound", { receivedGameId: data.gameId });
            return;
        }
        const move = game.makemove({ playerId: data.playerId, move: data.move });
        if (!move) {
            console.log("invalid move ");
            return;
        }
        console.log("move completed");
        let winner;
        if (game.chess.isCheckmate()) {
            winner = game.chess.turn() === "w" ? "b" : "w";
        }
        console.log("emiteted ");
        const res = io.sockets.adapter.rooms.get(game.id);
        console.log("res game paritcipants  ", res);
        io.to(data.gameId).emit("move-made", {
            gameId: data.gameId,
            fen: game.chess.fen(),
            turn: game.chess.turn(),
            gameOver: game.chess.isGameOver(),
            winner: winner,
        });
    });
});
server.listen(3000, () => {
    console.log("server started fine ");
});

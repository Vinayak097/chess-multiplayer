"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const gameManger_1 = require("./gameManger");
const Game_1 = require("./Game");
const server = http_1.default.createServer(app);
const { Server } = require("socket.io");
exports.io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const gameManager = new gameManger_1.GameManager();
const drawOffers = new Map();
app.get("/health", (res) => {
    console.log("fine");
    res.json({ message: "hello fine" });
});
exports.io.on("connection", (socket) => {
    console.log("a user connected");
    socket.emit("a user is connected");
    socket.on("join-game", (p) => {
        var _a, _b, _c, _d, _e, _f;
        let data = p;
        if (typeof p == "string") {
            data = JSON.parse(p);
        }
        console.log(p, "joing game recienved", p.id);
        const gametype = (_a = p.gametype) !== null && _a !== void 0 ? _a : p.type;
        const player = {
            id: p.id || (0, uuid_1.v4)(),
            color: "w",
            socket: socket,
        };
        const result = gameManager.joinGame(player, gametype);
        if (result == null) {
            return;
        }
        console.log(result.game.status == Game_1.GameStatus.waiting, " waiting check");
        if (result.game.status == Game_1.GameStatus.waiting) {
            console.log("emiteing the player 1");
            (_b = result.game.player1) === null || _b === void 0 ? void 0 : _b.socket.emit("waiting", {
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
                opponent: { name: "player2", color: (_c = result.game.player2) === null || _c === void 0 ? void 0 : _c.color },
                gameId: result.game.id,
                playerId: (_d = result.game.player1) === null || _d === void 0 ? void 0 : _d.id,
                fen: result.game.chess.fen(),
                turn: result.game.chess.turn(),
                color: "w",
                whiteTime: result.game.timer.whiteTime,
                blackTime: result.game.timer.blackTime,
            });
            console.log(result.game, " game object");
            player2.socket.emit("game-start", {
                opponent: { name: "player1", color: (_e = result.game.player1) === null || _e === void 0 ? void 0 : _e.color },
                gameId: result.game.id,
                playerId: (_f = result.game.player2) === null || _f === void 0 ? void 0 : _f.id,
                fen: result.game.chess.fen(),
                turn: result.game.chess.turn(),
                color: "b",
                whiteTime: result.game.timer.whiteTime,
                blackTime: result.game.timer.blackTime,
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
        if (game.status == "finished") {
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
        const res = exports.io.sockets.adapter.rooms.get(game.id);
        console.log("res game paritcipants  ", res);
        exports.io.to(data.gameId).emit("move-made", {
            gameId: data.gameId,
            fen: game.chess.fen(),
            turn: game.chess.turn(),
            gameOver: game.chess.isGameOver(),
            winner: winner,
            move: move.move,
            history: game.chess.history(),
        });
    });
    socket.on("RESIGN", (data) => {
        var _a, _b, _c;
        console.log("recieved resign");
        const game = gameManager.getGame(data.gameId);
        if (!game)
            return;
        const winner = socket.id == ((_a = game.player1) === null || _a === void 0 ? void 0 : _a.socket.id)
            ? (_b = game.player2) === null || _b === void 0 ? void 0 : _b.color
            : (_c = game.player1) === null || _c === void 0 ? void 0 : _c.color;
        console.log("winner , ", winner);
        game.status = "finished";
        game.timer.stop();
        exports.io.to(game.id).emit("game-over", {
            winner,
            result: "resign",
        });
    });
    socket.on("DRAW", (data) => {
        var _a, _b;
        const game = gameManager.getGame(data.gameId);
        if (!game || game.status !== Game_1.GameStatus.inGame)
            return;
        const player = ((_a = game.player1) === null || _a === void 0 ? void 0 : _a.socket.id) === socket.id
            ? game.player1
            : ((_b = game.player2) === null || _b === void 0 ? void 0 : _b.socket.id) === socket.id
                ? game.player2
                : null;
        const opponent = player === game.player1 ? game.player2 : game.player1;
        if (!player || !opponent || drawOffers.has(game.id))
            return;
        drawOffers.set(game.id, socket.id);
        opponent.socket.emit("draw-offered", { from: player.color });
        socket.emit("draw-offer-sent");
    });
    socket.on("DRAW_ACCEPT", (data) => {
        const game = gameManager.getGame(data.gameId);
        const offererSocketId = drawOffers.get(data.gameId);
        if (!game ||
            game.status !== Game_1.GameStatus.inGame ||
            !offererSocketId ||
            offererSocketId === socket.id)
            return;
        drawOffers.delete(game.id);
        game.timer.stop();
        game.status = Game_1.GameStatus.ended;
        exports.io.to(game.id).emit("game-over", { winner: "none", result: "draw" });
    });
    socket.on("DRAW_DECLINE", (data) => {
        const game = gameManager.getGame(data.gameId);
        const offererSocketId = drawOffers.get(data.gameId);
        if (!game || !offererSocketId || offererSocketId === socket.id)
            return;
        drawOffers.delete(game.id);
        exports.io.to(offererSocketId).emit("draw-declined");
        socket.emit("draw-declined");
    });
    socket.on("DRAW_CANCEL", (data) => {
        const game = gameManager.getGame(data.gameId);
        if (game && drawOffers.get(game.id) === socket.id) {
            drawOffers.delete(game.id);
            socket.emit("draw-declined");
        }
    });
});
server.listen(3000, () => {
    console.log("server started fine ");
});

import express from "express";
import { v4 as uuidv4 } from "uuid";
const app = express();
import { Response } from "express";
import http from "http";
import { GameManager, GameType } from "./gameManger";
import { GameStatus } from "./Game";
import { Socket } from "socket.io";
import { Move } from "chess.js";
import { Timer } from "./Timer";

type MovePayload = {
  playerId: string;
  gameId: string;
  move: Move;
};
const server = http.createServer(app);
const { Server } = require("socket.io");
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const gameManager = new GameManager();
const drawOffers = new Map<string, string>();

app.get("/health", (res: Response) => {
  console.log("fine");
  res.json({ message: "hello fine" });
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.emit("a user is connected");
  socket.on("join-game", (p: { id: string; gametype: GameType }) => {
    let data = p;
    if (typeof p == "string") {
      data = JSON.parse(p);
    }
    console.log(p, "joing game recienved", p.id);
    const gametype = p.gametype ?? (p as any).type;
    const player = {
      id: p.id || uuidv4(),
      color: "w",
      socket: socket,
    };
    const result = gameManager.joinGame(player, gametype);
    if (result == null) {
      return;
    }

    console.log(result.game.status == GameStatus.waiting, " waiting check");
    if (result.game.status == GameStatus.waiting) {
      console.log("emiteing the player 1");
      result.game.player1?.socket.emit("waiting", {
        gameId: result.game.id,
      });
      socket.join(result.game.id);
      return;
    }
    if (result.game.status == GameStatus.inGame) {
      socket.join(result.game.id);
      const player1 = result.game.player1!;
      const player2 = result.game.player2!;

      player1.socket.emit("game-start", {
        opponent: { name: "player2", color: result.game.player2?.color },
        gameId: result.game.id,
        playerId: result.game.player1?.id,
        fen: result.game.chess.fen(),
        turn: result.game.chess.turn(),
        color: "w",
        whiteTime: result.game.timer.whiteTime,
        blackTime: result.game.timer.blackTime,
      });

      console.log(result.game, " game object");

      player2.socket.emit("game-start", {
        opponent: { name: "player1", color: result.game.player1?.color },
        gameId: result.game.id,
        playerId: result.game.player2?.id,
        fen: result.game.chess.fen(),
        turn: result.game.chess.turn(),
        color: "b",
        whiteTime: result.game.timer.whiteTime,
        blackTime: result.game.timer.blackTime,
      });
      return;
    }
  });

  socket.on("move", (playload: any) => {
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
    const res = io.sockets.adapter.rooms.get(game.id);
    console.log("res game paritcipants  ", res);
    io.to(data.gameId).emit("move-made", {
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
    console.log("recieved resign");
    const game = gameManager.getGame(data.gameId);
    if (!game) return;
    const winner =
      socket.id == game.player1?.socket.id
        ? game.player2?.color
        : game.player1?.color;
    console.log("winner , ", winner);
    game.status = "finished";
    game.timer.stop();
    io.to(game.id).emit("game-over", {
      winner,
      result: "resign",
    });
  });
  socket.on("DRAW", (data) => {
    const game = gameManager.getGame(data.gameId);
    if (!game || game.status !== GameStatus.inGame) return;
    const player =
      game.player1?.socket.id === socket.id
        ? game.player1
        : game.player2?.socket.id === socket.id
          ? game.player2
          : null;
    const opponent = player === game.player1 ? game.player2 : game.player1;
    if (!player || !opponent || drawOffers.has(game.id)) return;

    drawOffers.set(game.id, socket.id);
    opponent.socket.emit("draw-offered", { from: player.color });
    socket.emit("draw-offer-sent");
  });
  socket.on("DRAW_ACCEPT", (data) => {
    const game = gameManager.getGame(data.gameId);
    const offererSocketId = drawOffers.get(data.gameId);
    if (
      !game ||
      game.status !== GameStatus.inGame ||
      !offererSocketId ||
      offererSocketId === socket.id
    )
      return;

    drawOffers.delete(game.id);
    game.timer.stop();
    game.status = GameStatus.ended;
    io.to(game.id).emit("game-over", { winner: "none", result: "draw" });
  });
  socket.on("DRAW_DECLINE", (data) => {
    const game = gameManager.getGame(data.gameId);
    const offererSocketId = drawOffers.get(data.gameId);
    if (!game || !offererSocketId || offererSocketId === socket.id) return;

    drawOffers.delete(game.id);
    io.to(offererSocketId).emit("draw-declined");
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

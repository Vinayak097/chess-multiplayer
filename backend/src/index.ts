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

app.get("/health", (res: Response) => {
  console.log("fine");
  res.json({ message: "hello fine" });
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  socket.emit("a user is connected");
  socket.on("join-game", (p: { id: string,gametype:GameType }) => {
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
        opponent:{name:"player2",color:result.game.player2?.color},
        gameId: result.game.id,
        playerId:result.game.player1?.id,
        fen: result.game.chess.fen(),
        turn: result.game.chess.turn(),
        color: "w",
      });
      
      console.log(result.game , ' game object')

      player2.socket.emit("game-start", {
        opponent:{name:"player1",color:result.game.player1?.color},
        gameId: result.game.id,
        playerId: result.game.player2?.id,
        fen: result.game.chess.fen(),
        turn: result.game.chess.turn(),
        color: "b",
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
    if(game.status=='finished'){
      return
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
  socket.on('RESIGN',(data)=>{
    console.log('recieved resign')
    const game=gameManager.getGame(data.gameId)
    if(!game) return
    const winner = socket.id==game.player1?.socket.id?game.player2?.color:game.player1?.color
    console.log("winner , " , winner )
    game.status='finished'
    game.timer.stop()
    io.to(game.id).emit('game-over',{
      winner,
      result:'resign'
    })
  })
  socket.on('DRAW',(data)=>{
    console.log("recieved draw")
    const game=gameManager.getGame(data.gameId)
    if(!game) return
    game.timer.stop()
    game.status='finished'
    io.to(game.id).emit('game-over',{
      winner:"none",
      result:'draw'
    })    
  })

});

server.listen(3000, () => {
  console.log("server started fine ");
});

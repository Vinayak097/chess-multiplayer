import { Chess, Move } from "chess.js";
import { Socket } from "socket.io";

export enum GameStatus {
  waiting = "waiting",
  inGame = "inGame",
  ended = "ended",
}
export type Player = {
  color: string;
  id: string;
  socket: Socket;
};
export type MovePayload = {
  playerId: string | null;
  move: Move;
};

export class Game {
  id: string;
  status: string;
  player1: Player | null;
  player2: Player | null;
  chess: Chess;

  constructor(id: string, player1: Player) {
    this.id = id;
    this.status = GameStatus.waiting;
    ((this.player1 = player1),
      (this.player2 = null),
      (this.chess = new Chess()));
  }
  makemove({ playerId, move }: MovePayload) {
    console.log("playerd from move ", playerId, move);
    // 1. Game already ended
    if (this.status === GameStatus.ended) {
      console.log("Game has already ended");
      return;
    }

    // 2. Check whose turn it is
    const turn = this.chess.turn(); // 'w' or 'b'

    if (
      (turn === "w" && playerId !== this.player1?.id) ||
      (turn === "b" && playerId !== this.player2?.id)
    ) {
      console.log("not your turn ", playerId);
      return;
    }

    // 3. Make move (guard against chess.js throwing on invalid input)
    let playedMove: any = null;
    try {
      playedMove = this.chess.move(move as any);
    } catch (err) {
      console.log("invalid move (exception)", move, err);
      return null;
    }

    if (!playedMove) {
      console.log("invalid move ", move);
      return null;
    }

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
  addPlayer(player: Player) {
    this.player2 = player;
    this.status = GameStatus.inGame;
  }
}

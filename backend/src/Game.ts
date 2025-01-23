import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, Move, init__game } from "./message";
export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess; 
    private moveCount=0;
    private startTime: Date;
  
    constructor(player1: WebSocket, player2: WebSocket) {
      this.player1 = player1;
      this.player2 = player2;
      this.board=new Chess();
      this.startTime=new Date();
      this.player1.send(JSON.stringify({type:init__game,payload:{color:"white"}}))    
      this.player2.send(JSON.stringify({type:init__game,payload:{color:"black"}}))
    } 
  
   
    makeMove(socket: WebSocket, move: { from: string, to: string }) {
      try {
        const result = this.board.move({
          from: move.from,
          to: move.to
        })

        if (!result) {
          console.log("Invalid move")
          return
        }

        // Send move to BOTH players
        const moveMessage = JSON.stringify({
          type: Move,
          payload: move
        })

        this.player1.send(moveMessage)
        this.player2.send(moveMessage)

        this.moveCount++
        console.log("Board after move:\n" + this.board.ascii())

      } catch (error) {
        console.error('Move error:', error)
      }
    }
    private getGameOverReason(): string {
      if (this.board.isCheckmate()) return "checkmate";
      if (this.board.isDraw()) return "draw";
      if (this.board.isStalemate()) return "stalemate";
      if (this.board.isThreefoldRepetition()) return "threefold repetition";
      if (this.board.isInsufficientMaterial()) return "insufficient material";
      return "unknown";
    }

    public isValidMove(from: string, to: string): boolean {
      try {
        const moves = this.board.moves({ verbose: true });
        return moves.some(move => move.from === from && move.to === to);
      } catch {
        return false;
      }
    }

    public getCurrentTurn(): 'white' | 'black' {
      return this.board.turn() === 'w' ? 'white' : 'black';
    }

    public getGameDuration(): number {
      return Date.now() - this.startTime.getTime();
    }
}
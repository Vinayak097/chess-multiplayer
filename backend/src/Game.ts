import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER } from "./message";
export class Game {
    private player1: WebSocket;
    private player2: WebSocket;
    private board: Chess; // Corrected from 'bord' to 'board'
    
    private startTime: Date;
  
    constructor(player1: WebSocket, player2: WebSocket) {
      this.player1 = player1;
      this.player2 = player2;
      this.board=new Chess();
      this.startTime=new Date();    
    }    
  
    joinGame() {
      // Implementation of joinGame
    }
    makeMove(socket:WebSocket,move:{from:string,to:string}){
      //validate moves 
      if(this.board.moves.length%2==0 && socket!==this.player1){
        return
      }
      if(this.board.moves.length%2==0 && socket!==this.player2){
        return;
      }
      try{
        this.board.move(move);
      }catch(error){
        return;

      }
      if(this.board.isGameOver()){
        this.player1.emit(JSON.stringify({
           type:GAME_OVER,
           payload:{
            winner:this.board.turn()==="w"?"black":"white"
           }
        }))
        return;
      }
      
    }
    
  }
  
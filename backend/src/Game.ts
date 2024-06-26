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
  
    joinGame() {
      // Implementation of joinGame
    }
    makeMove(socket:WebSocket,move:{from:string,to:string}){
      //validate moves 
      console.log("validateing move")
      console.log(this.board.moves().length , ' length of moves')
      if(this.moveCount % 2===0 && socket !== this.player1){
        console.log("early return 1")
        return
      }
      if(this.moveCount % 2 === 1 && socket !== this.player2){
        console.log("early return 2")
        return;
      }
      try{
        console.log("movess")
        this.board.move(move);
        console.log("move suceess")
        
      }catch(error){
        console.log('error', error)
        return;

      }
      console.log('game over check')
      if(this.board.isGameOver()){
        this.player1.emit(JSON.stringify({
           type:GAME_OVER,
           payload:{
            winner:this.board.turn()==="w"?"black":"white"
           }
        }))
        this.player2.emit(JSON.stringify({
          type:GAME_OVER,
          payload:{
           winner:this.board.turn()==="w"?"black":"white"
          }
       }))
        return;
      }
      console.log("emits checks")
      if(this.moveCount%2===0){

        console.log("emits moves")
        console.log("sent1")
        this.player2.send(JSON.stringify({
          type:Move,
          payload:move
        }))
       
      }else{
        console.log("sent2")
        this.player1.send(JSON.stringify({type:Move,
          payload:move         
        }))
      }
      this.moveCount++;
      
    }
    
  }
  
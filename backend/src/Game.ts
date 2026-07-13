import { Chess, Move } from "chess.js";
import { Socket } from "socket.io";

export enum GameStatus{
    waiting="waiting",
    inGame="inGame",
    ended="ended"
}
export type Player={
    color:string,
    id:string,
    socket:Socket
}
export class Game{
    id:string;
    status:string;
    player1:Player|null
    player2:Player|null
    chess:Chess;

    constructor(id:string,player1:Player,){
        this.id=id
        this.status=GameStatus.waiting
        this.player1=player1,
        this.player2=null,
        this.chess= new Chess()
    }
    makemove(move:Move){
        const turn=this.chess.turn()
        if(turn!=this.player1?.color){
            throw new Error("it not your turn")
            
        }
        const movve=this.chess.move(move)
        if(!movve){
            throw new Error("not a valid move")
        }
        if(this.chess.isGameOver()){
            //handle game over by sending emit 
            this.status=GameStatus.ended
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
    addPlayer(player:Player){
        this.player2=player      
        this.status=GameStatus.inGame  
    }
    
}
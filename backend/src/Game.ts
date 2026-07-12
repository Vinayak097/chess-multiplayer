import { Chess, Move } from "chess.js";

enum Status{
    waiting="wating",
    game="inGame",
    ended="ended"
}

export class Game{
    id:string;
    status:string;
    player1:string|null;
    player2:string|null;
    chess:Chess;

    constructor(id:string,player1:string,){
        this.id=id
        this.status=Status.waiting
        this.player1=player1,
        this.player2=null,
        this.chess= new Chess()
    }
    makemove(move:Move){
        //validation
        //check whos turn is this 
        //make changes to the board with that move 
        //check winnerr if so return winner somhow 
        //and return the chess
    }
    addPlayer(id:string,player2:string){
        

    }
}
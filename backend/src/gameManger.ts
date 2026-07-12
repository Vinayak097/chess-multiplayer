import { Game } from "./Game"
import {v4 as uuid4} from 'uuid'
type Move={
    from:string;
    to:string
}

export class GameManager{
    game:Game[]|[]
    
    constructor(){
        this.game= []
    }
    createGame(player1:string){
        const id = uuid4()
        const game=new Game(id,player1)
        return game    
    }
    makemove(move:Move){
        //validation
        //check whos turn is this 
        //make changes to the board with that move 
        //check winnerr if so return winner somhow 
        //and return the chess


    }

}

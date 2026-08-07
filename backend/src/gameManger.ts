import { Game, GameStatus, Player } from "./Game";
import { v4 as uuid4 } from "uuid";


type Move = {
  from: string;
  to: string;
};

export type GameType = "Rapid" | "Blitz" | "Bullet";

export class GameManager {
  game: Game[];
  constructor() {
    this.game = [];
  }
  createGame(player1: Player,gametype:GameType) {
    const id = uuid4();
    const game = new Game(id, player1,gametype);
    return game;
  }
  getGame(id: string) {
    console.log("gameds ", this.game);

    const game = this.game.find((game) => game.id === id);
    console.log("game id  ", id, " , game found :", game);
    return game;
  }
  removeGame(id: string) {
    this.game = this.game.filter((game) => game.id !== id);
  }
  isPlayerinGame(player: string,game:Game|undefined) {
    if(game==undefined){
      return undefined
    }
    if(game.player1?.id==player){
      return true
    }
    if(game.player2?.id==player){
      return true
    }
    
    return false;
  }
  joinGame(player: Player, gametype:GameType){
    let game = this.game.find((game:Game) => game.status === GameStatus.waiting);
    const isingame = this.isPlayerinGame(player.id,game!=undefined?game :undefined);
    if (isingame) {
      console.log("already in game");
      
      return null;
    }
    game=this.game.find((game)=>game.status==GameStatus.waiting && game.gametype==gametype)

    

    if (!game) {
      const id = uuid4();
      const game = new Game(id, player ,gametype);
      console.log("game created " , game.timer, game.timer.whiteTime)
      this.game.push(game);
      return {
        game,
      };
    } else {
      if (game.player1?.socket === player.socket) {
        return { game };
      }
      player.color = "b";
      game.addPlayer(player);

     
      
    }
    return {
      game,
    };
  } 
}

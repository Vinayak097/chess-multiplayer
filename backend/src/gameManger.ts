import { Game, GameStatus, Player } from "./Game";
import { v4 as uuid4 } from "uuid";
type Move = {
  from: string;
  to: string;
};

export class GameManager {
  game: Game[];

  constructor() {
    this.game = [];
  }
  createGame(player1: Player) {
    const id = uuid4();
    const game = new Game(id, player1);
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
  isPlayerinGame(player: string) {
    const foundgame = this.game.filter(
      (game) => game.player1?.id === player || game.player2?.id === player,
    );
    console.log(foundgame, "already in game", player);
    return foundgame.length > 0;
  }
  joinGame(player: Player) {
    const game = this.game.find((game) => game.status === GameStatus.waiting);
    const isingame = this.isPlayerinGame(player.id);
    if (isingame) {
      console.log("already in game");
      return null;
    }

    if (!game) {
      const id = uuid4();
      const game = new Game(id, player);
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

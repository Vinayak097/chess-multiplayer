import { Game } from "./Game";
import { Move } from "./message";
import WebSocket from "ws";

export interface GameInterface {
  id: number,
  name: string,
  player1: WebSocket,
  player2: WebSocket
}
interface gameinterface{
  player1:WebSocket,
  player2:WebSocket
}

export class GameManager extends Game {
  private games;
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games= GameInterface[];
        
  }

  addUser(socket: WebSocket) {  
    this.users.push(socket);  
    this.addHandler(socket);
  }   

  removeUser(socket: WebSocket) { 
    this.users = this.users.filter(user => user !== socket);
   
  }

  private addHandler(socket: WebSocket) { 
    socket.on("message", (data: any) => {
      const message = JSON.parse(data.toString());
      if (message.type === "init_game") { 
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      } else if (message.type === Move) {
        const game=this.games.find(game=>game.player1===socket || game.player1===socket);
        
        
            game.makeMove(socket,message.move);
      
      }
    });
  }
}

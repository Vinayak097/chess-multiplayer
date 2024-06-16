import { Game } from "./Game";
import { Move } from "./message";
import WebSocket from "ws";

export interface GameInterface {
  id: number,
  name: string,
  player1: WebSocket,
  player2: WebSocket
}

export class GameManager  {
  private games:Game[];
  private pendingUser: WebSocket | null;
  private users:WebSocket[];

  constructor() {
    
    this.games=[]
    this.users=[]
    this.pendingUser=null
  }

  addUser(socket: WebSocket) {  
    this.users.push(socket)
    this.addHandler(socket);
  }   

  removeUser(socket: WebSocket) { 
    this.users = this.users.filter(user => user !== socket);
   
  }

  private addHandler(socket: WebSocket) { 
    socket.on("message", (data: any) => {
      console.log("message unparseddata messaage.type , ", data)
      const message = JSON.parse(data.toString());

      if (message.type === "init_game") { 
        if (this.pendingUser) {
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          if(game.player1){

          }
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      } 
      if (message.type === Move) {
        const game=this.games.find(game=>game.player1==socket || game.player1==socket);       
        if(game){
          game.makeMove(socket,message.move);
        }
      }

      
    });
  }
  
}

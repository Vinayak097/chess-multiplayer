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
    console.log("user added")
    this.addHandler(socket);
  }   

  removeUser(socket: WebSocket) { 
    this.users = this.users.filter(user => user !== socket);
   
  }

  private addHandler(socket: WebSocket) { 
    console.log("user gone add handler")
    socket.on("message", (data: any) => {      
      const message = JSON.parse(data.toString());
      
      if (message.type === "init_game"){ 
        console.log(message)
        if (this.pendingUser) {
          if(this.pendingUser!=socket){
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          
          this.pendingUser = null;
        }else{
          socket.send(JSON.stringify({ type: "error", message: "You are already in a game." }));
        }
       } else {

          this.pendingUser = socket;
        
      } 
    }
      if (message.type === Move) {
        console.log(message.type)
        const game=this.games.find(game=>game.player1==socket || game.player2==socket);  
        console.log(this.games);
        
        
        
        if(game){
          console.log("function call")
          game.makeMove(socket,message.move);
        }else{
          console.log("not found game")
        }
      }

      
    });
  }
  
}

    import express from 'express'
    import {v4 as uuidv4} from 'uuid'
    const app=express()
    import { Response } from 'express'
    import http from 'http'
    import { GameManager } from './gameManger'
    import { GameStatus } from './game'
    import { Socket } from 'socket.io'
import { Move } from 'chess.js'

type MovePayload={
    playerId:string,
    gameId:string
    move:Move,
}
    const server= http.createServer(app)
    const {Server} =require("socket.io")
    const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
    const gameManager = new GameManager()

    app.get("/health",(res:Response)=>{
        console.log("fine")
        res.json({message:"hello fine"})
    })

    io.on('connection', (socket:Socket) => {
    console.log('a user connected');
    socket.emit("a user is connected")
    socket.on("join-game",(p:{id:string})=>{
        console.log(p , "joing game recienved" ,p.id)
        const player={
            id:p.id||uuidv4(),
            color:'w',
            socket:socket
        }
        const result=gameManager.joinGame(player)
        
        console.log(result.game.status==GameStatus.waiting ,  ' waiting check')
        if(result.game.status==GameStatus.waiting){
            
            console.log('emiteing the player 1')
            result.game.player1?.socket.emit("waiting",{
                gameId:result.game.id
            })
            socket.join(result.game.id)
            return
        }
        if(result.game.status==GameStatus.inGame){
        
            socket.join(result.game.id)
            const player1=result.game.player1!
            const player2=result.game.player2!
            
            player1.socket.emit("game-start", {
        gameId:result.game.id,
        fen:result.game.chess.fen(),
        turn:result.game.chess.turn(),
        color:'w'
    
    });

    player2.socket.emit("game-start", {
        gameId:result.game.id,
        fen:result.game.chess.fen(),
        turn:result.game.chess.turn(),
        color:'b'
        
    });
            return
        }
    })

    socket.on("move",(playload:string)=>{
       const data:MovePayload =JSON.parse(playload)
        const game = gameManager.getGame(data.gameId)
        console.log(game , 'returned game ')
        if(!game){
            socket.emit("gamenotfound", { receivedGameId: data.gameId })
            return
        }
        const move =game.makemove(data.move)

        if(!move){
            console.log("invalid move ")
            return
        }
        console.log("move completed")
        let winner;
        if (game.chess.isCheckmate()) {
    winner = game.chess.turn() === "w" ? "b" : "w";
}   
console.log("emiteted ")
    const res= io.sockets.adapter.rooms.get(game.id);
    console.log('res game paritcipants  ', res)
        io.to(data.gameId).emit("move-made",{
            gameId:data.gameId,
            fen:game.chess.fen(),
            turn:game.chess.turn(),
            gameOver:game.chess.isGameOver(),
             winner: winner
        })


    })






});



    server.listen(3000,()=>{
        console.log("server started fine ")
    })



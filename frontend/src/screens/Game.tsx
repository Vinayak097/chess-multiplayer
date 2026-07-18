import { useState, useEffect } from 'react'
import { socket } from '../socket'
import { Chess } from 'chess.js';

import { UserRoundArrowLeft } from 'lucide-react';
import UserPlayCard from '@/component/UserPlayCard';



const Game = () => {
  const [chess, setChess] = useState<any>(null)
  const [board, setBoard] = useState(new Chess().board())
  const [turn, setTurn] = useState('w')
  const [gameId, setGameId] = useState('')



useEffect(() => {
    socket.on("waiting", (data) => {
      setGameId(data.gameId)
        console.log(data,);
        
    });

    socket.on("game-start", (data) => {
      setGameId(data.gameId)
      setTurn(data.color)
      const newChess = new Chess(data.fen);
      setChess(newChess);
      setBoard(newChess.board());
      console.log("data", data)
    });

    socket.on("move-made", (data) => {
        const chess = new Chess(data.fen);
        setChess(chess);
    setBoard(chess.board());
    setTurn(data.turn);
    });

    return () => {
        socket.off("waiting");
        socket.off("game-start");
        socket.off("move-made");
    };
}, []);

function onMove(move:{from:string,to:string}){
  socket.emit('move', {
    gameId,
    move,
  })
  console.log('move emited ', move)
}
  return (

 <div>
  <UserPlayCard></UserPlayCard>
 </div>   
    
  )
}

export default Game



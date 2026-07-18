import { useState, useEffect } from 'react'
import { socket } from '../socket'
import { Chess } from 'chess.js';
import Chessboard from '../component/chessboard';
import SidePannel from '../component/SidePannel';

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
    <div className="h-screen w-full bg-background">
    <nav className="w-full text-center p-5">
        <h1 className="text-3xl font-bold text-primary">
            Open Chess
        </h1>
    </nav>

    <div className="flex h-[calc(100vh-88px)]">

        {/* Chess Board */}
        <div className="flex-1 flex justify-center items-center">
            <Chessboard
            chess={chess}
            board={board}
            currentTurn={turn}
            onMove={onMove} socket={socket}            />
        </div>

        {/* Side Panel */}
        <div className="w-80 border-l border-border bg-card">
            <SidePannel />
        </div>

    </div>
</div>
  )
}

export default Game



import { useState, useEffect, JSXElementConstructor, ReactNode } from 'react'
import { socket } from '../socket'
import { Chess } from 'chess.js';

import { MoveLeft, UserRoundArrowLeft } from 'lucide-react';
import UserPlayCard from '@/component/UserPlayCard';
import { Button } from '@/component/ui/button';
import Chessboard from '@/component/chessboard';
import { Undo2,Lightbulb,Handshake ,Flag } from 'lucide-react';

<Flag />
const footers=[
  {
  icon:<Undo2></Undo2>,
  text:"UNDO"

},
{
  icon:<Lightbulb></Lightbulb>,
  text:'HINT'
},
{
  icon:<Handshake />,
  text:"DRAW"
},

{
  icon:<Flag></Flag>,
  text:'RESIGN'
}
]
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

 <div className=' h-screen  flex  flex-col items-center gap-2 mt-4 '>
  <div className='w-lg flex flex-col gap-2 '>

    {/* back button bar */}
  <div className='flex justify-between  w-lg '>
        <div>
          <Button className='bg-black text-white flex gap-2 rounded-none'>
            <MoveLeft></MoveLeft>
            <span>EXTRACT</span>
            
          </Button>
          
        </div>
       <div className="relative flex items-center gap-2 border border-orange-600 px-2 py-1">
  <div className="absolute inset-0 bg-orange-800 opacity-20"></div>
  <span className="relative h-2 w-2  rounded-full bg-orange-500"></span>
  <span className="relative text-orange-500">LIVE</span>
</div>
</div>


  <UserPlayCard></UserPlayCard>

  {/* chessboard */}
  <Chessboard board={board} chess={chess} currentTurn={turn} onMove={onMove} socket={socket} key={3

  } ></Chessboard>

  <UserPlayCard></UserPlayCard>


  {/* FOOTER CARDS */}
  <div className=' flex gap-2'>
    {footers.map((foot:{icon:ReactNode,text:string})=>(
      <div className='bg-black p-4 w-sm border items-center justify-center'>
        <div className=' flex items-center flex-col'>
          <span>{foot.icon}</span>
        <span>{foot.text}</span>

        </div>
        
      </div>

    ))}

  </div>

  </div> 
 </div>   
    
  )
}

export default Game



import React, { useEffect, useState } from 'react'
import Chessboard from '../compoenents/chessboard'
import { useSocket } from '../hooks/useSocket'
import { Chess } from 'chess.js';
export const init_game="init_game";
export const Move="move";
export const game_over="game_over"
function Game() {
  const socket=useSocket();
  const [chess ,setChess]=useState(new Chess())
  const [board,setBoard]=useState(chess.board())
  useEffect(()=>{
    if(socket){
      socket.onmessage=(event)=>{
        const message=JSON.parse(event.data);
        console.log(message)
        switch(message.type){
          case init_game:
            setChess(new Chess())
            setBoard(chess.board())
            console.log("game initiated")
            break;
          case Move:
            const move=message.payload;
            chess.move(move)
            setBoard(chess.board())
            console.log("Move made")
            break;
          case game_over:
            console.log("game over")
            break;
        }
      }
    }
  })
  return (
    <div>

    
    <div className='flex justify-center bg-slate-900 h-screen  '>
      <div className='pt-8 max-w-screen-lg  w-full '>
        <div className='grid grid-cols-6 gap-4  '>
        <div className='  col-span-3  bg-slate-700  w-full'>
          <Chessboard board={board}></Chessboard>
        </div>
        <div className='col-span-2 bg-slate-700 text-white w-full flex flex-col gap-4 items-center  rounded-md' >
          <select name="timstamp" id="timestamp" className='mt-8 w-48 p-2 bg-slate-500 text-white  '>time 00</select>
          <button className='bg-green-500 hover:bg-green-600 p-2 w-48 rounded-md'>Play</button>
          
        </div>
        </div>

        </div>
     </div>
    </div>
  )
}

export default Game
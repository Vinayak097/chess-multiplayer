import React, { useState } from 'react'
import { Chess, Color, PieceSymbol, Square } from 'chess.js'
import { json } from 'react-router-dom'
const chess=new Chess()
const Chessboard=({board, socket}:{
  board:({
    square:Square,
    type:PieceSymbol,
    color:Color

  }|null)[][], 
  socket:WebSocket;

}) =>{  
  console.log(board)

  const [from ,setform]  =useState<null|Square>()
  const [to,setTo]=useState<null|Square>()
  return (
    <div  className= '  text-white p-2 w-full '>
      <div>
      </div>
        {board.map((row,i)=>{
          return <div  key={i} className='flex justify-center '>
            {row.map((square,j)=>{
              const squareRepresantation=String.fromCharCode(65+(j%8))+""+(8-1) as Square;
              return <div onClick={()=>{
                if(!from){
                  setform(squareRepresantation)
                }else{
                 console.log(square)
                  socket?.send(JSON.stringify({
                    type:"move",
                    payload:{
                      move:{
                        from,
                      to:squareRepresantation

                      }
                      
                    }
                  }))
                  setform(null)
                  console.log(from,squareRepresantation)                  
                }
                
              }} key={j} className={`flex items-center justify-center w-16 h-16 bg-green-500 ${(i+j)%2==0?"bg-blue-50":""} ${square?.color=="w"?"text-black":"text-amber-900 " }`}>{square? square.type:" "}</div>
            })}
          </div>
        })}
        
      


    </div>
  )
}

export default Chessboard;
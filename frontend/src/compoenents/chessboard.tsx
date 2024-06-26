import  { useState } from 'react'
import {  Color, PieceSymbol, Square } from 'chess.js'

import { Move } from '../screens/Game'

const Chessboard=({ chess,board, socket,setBoard}:{
  chess:any;
  board:({
    square:Square,
    type:PieceSymbol,
    color:Color

  }|null)[][] ;
  socket:WebSocket;
  setBoard:any;
  

}) =>{  
  console.log(" baord" ,board)
  console.log("chess ",chess)
  const [from ,setform] = useState<null|Square>()
  const [to,setto]=useState<null|Square>()
  console.log("from ",from)
  return (
    <div  className= '  text-white p-2 w-full '>
      <div>
      </div>
        {board.map((row,i)=>{
          return <div  key={i} className='flex justify-center '>
            {row.map((square,j)=>{
              const squareRepresantation=String.fromCharCode(65+(j%8))+""+(8-i) as Square
              
              
              
              return <div  onClick={()=>{
                if(!from){
                  setform(squareRepresantation)
                }else{
                 console.log(square)
                  socket?.send(JSON.stringify({
                    type:Move,
                  
                      move:{
                        from,
                      to:squareRepresantation

                      }
                      
                    
                  }))
                  console.log({from,
                    to:squareRepresantation})
                  setform(null)
                  chess.move({
                    from,
                  to:squareRepresantation

                  })
                  setBoard(chess.board())
                                    
                }
                
              }} key={j} className={`flex items-center justify-center w-16 h-16 ${(i+j)%2===0?"bg-blue-50":"bg-green-400"} ${square?.color=="w"?"text-black":"text-amber-900 " }`}>{square? square.type:" "}</div>
            })}
          </div>
        })}
        
      


    </div>
  )
}

export default Chessboard;
import { useState ,useEffect} from 'react'
import { socket } from '../socket'
import { Chess } from "chess.js";
import Chessboard from '../compoenents/chessboard';
const Game = () => {
  
  const [chess,setChess]=useState<any>(null)
  const [board,setBoard]=useState(new Chess().board())
const [turn, setTurn] = useState("w")
const [gameId, setGameId] = useState("")



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
  socket.emit('move',{
    gameId:gameId,
    move
  })
  console.log("move emited ", move)

}
const JoinGame=()=>{
  console.log("joined game clikec " , socket)
  const id=crypto.randomUUID()
  socket.emit("join-game",{id})
}
  return (
    <div className=' h-screen w-full  '>
      <nav className='w-full text-center p-5'>
      <h1 className='text-green-500 bg-text text-text '>Open Chess</h1>
      </nav>
      <div className='w-full h-full '>
       
          {/* chess board  */}
          <Chessboard socket={socket} chess={chess} board={board} currentTurn={turn}   onMove={onMove }></Chessboard>
        
      

      <button onClick={()=>{JoinGame()}}>play</button>

      </div>
      
    </div>
  )
}

export default Game



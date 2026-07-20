import { useState, useEffect, ReactNode } from "react";
import { socket } from "../socket";
import { Chess } from "chess.js";

import { MoveLeft } from "lucide-react";
import UserPlayCard from "@/component/UserPlayCard";
import { Button } from "@/component/ui/button";
import Chessboard from "@/component/chessboard";
import { Undo2, Lightbulb, Handshake, Flag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


<Flag />;
const footers = [
  {
    icon: <Undo2></Undo2>,
    text: "UNDO",
  },
  {
    icon: <Lightbulb></Lightbulb>,
    text: "HINT",
  },
  {
    icon: <Handshake />,
    text: "DRAW",
  },

  {
    icon: <Flag></Flag>,
    text: "RESIGN",
  },
];
const Game = () => {
  const [chess, setChess] = useState<any>(null);
  const [board, setBoard] = useState(new Chess().board());
  const [turn, setTurn] = useState("w");
  const [gameId, setGameId] = useState("");
  const [gamestate, setGameState] = useState("");
  const navigate = useNavigate()
  const [playerId,setPlayerId]=useState("")
  const [color , setColor]=useState<"w"|"b">()
  const [winner,setWinner] = useState<string>("")
  const [play,setPlay]=useState(true)
  const [result,setResult]=useState("")
  const [blackTimer,setBlackTimer]=useState<number>(0)
  const [whiteTimer,setWhiteTimer]=useState<number>(0)
  console.log(color," color i got")

  useEffect(() => {
    socket.on("waiting", (data) => {
      setGameId(data.gameId);
      setPlay(false)
      console.log(data);
    });

    socket.on("game-start", (data) => {
      setGameId(data.gameId);
      setTurn(data.color);
      setPlay(false)
      setPlayerId(data.playerId);
      console.log('settled the playerid', data.playerId);
      const newChess = new Chess(data.fen);
      setChess(newChess);
      setBoard(newChess.board());
      setGameState("")
      setColor(data.color)
      console.log("data", data);
    });

    socket.on("move-made", (data) => {
      const chess = new Chess(data.fen);
      setChess(chess);
      setBoard(chess.board());
      
      setTurn(data.turn);
      if(data.winner){
        setWinner(winner)
        setGameState("finished")
        setTimeout(()=>{
          setWinner('')
          setGameState('')
          setPlay(true)
        },3000)
        
      }
    });
    
    socket.on('game-over',(data=>{
        setWinner(data.winner)
        setResult(data.result)
        
        setGameState("finished")
        setTimeout(()=>{
          setWinner('')
          setGameState('')
          setPlay(true)
        },3000)
    }))
    socket.on('timer-update',(data)=>{
     
    
      setWhiteTimer(data.whiteTime)
      setBlackTimer(data.blackTime)
    })

    return () => {
      socket.off("waiting");
      socket.off("game-start");
      socket.off("move-made");
    };
  }, []);

  function onMove(move: { from: string; to: string }) {
    socket.emit("move", {
      gameId,
      playerId,
      move,
    });

    console.log("move emited ", move , playerId);
  }

  function cancelMatchmaking(){
    console.log("game canclesed ");
    navigate('/')
  }
  console.log("game timing "  , whiteTimer,blackTimer)

  return (
    <div className=" h-screen  flex  flex-col items-center gap-2 mt-4 m-4">
      <div className={`w-full sm:max-w-sm    flex items-center flex-col gap-2  ${gamestate=='waiting' && 'opacity-20'} `}>
        {/* back button bar */}
        <div className={`flex justify-between  w-full lg:max-w-sm  `}>
          <div>
            <Button disabled={!play} className="bg-black text-white flex gap-2 rounded-none">
              <MoveLeft />
              <span className="text-xs sm:text-base">EXTRACT</span>
            </Button>
          </div>
          <div className="relative flex items-center gap-2 border border-orange-600 px-2 py-1">
            <div className="absolute inset-0 bg-orange-800 opacity-20"></div>
            <span className="relative h-2 w-2  rounded-full bg-orange-500"></span>
            <span className="relative text-orange-500 lg:text-lg  text-xs">LIVE</span>
          </div>
        </div>

        <UserPlayCard timer={blackTimer}></UserPlayCard>

        {/* chessboard */}
        <Chessboard
          board={board}
          chess={chess}
          currentTurn={turn}
          onMove={onMove}
          socket={socket}
          key={3}
          
        ></Chessboard>

        <UserPlayCard timer={whiteTimer}></UserPlayCard>

        {/* FOOTER CARDS */}
        <div className=" flex justify-between  gap-2  w-full lg:max-w-sm">
          {footers.map((foot: { icon: ReactNode; text: string }) => (
            <div className="bg-black p-4 w-full lg:w-full  border items-center justify-center">
              <div className=" flex items-center flex-col">
                <span className="text-[10px] sm:text-sm">{foot.icon}</span>
                <span className="text-[10px] sm:text-sm">{foot.text}</span>
              </div>
            </div>
          ))}
        </div>
        
      </div>
      {gamestate=="waiting" && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black rounded-xl p-6 text-center shadow-xl">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />

        <h2 className="text-xl font-semibold">
          Searching for opponent...
        </h2>

        <p className="text-gray-400 mt-2">
          Matchmaking usually takes a few seconds.
        </p>

        <button
          onClick={cancelMatchmaking}
          className="mt-5 px-4 py-2 bg-orange-500 rounded hover:bg-orange-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
  {gamestate=="finished" && (
    <div className="absolute inset-0 flex items-center justify-center bg-transperant border border-orange-600 ">
        <div>
          <h1 className="font-extrabold text-3xl p-2 bg-black ">You {winner==color?(<span className="text-orange-700">Won</span>):(<span className="text-orange-700">Lose</span>)}</h1>
        </div>
    </div>
  )}
    </div>
  );

};

export default Game;

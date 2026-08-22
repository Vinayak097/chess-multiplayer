import { useState, useEffect, ReactNode } from "react";
import { socket } from "../socket";
import { Chess } from "chess.js";

import { MoveLeft, Redo2 } from "lucide-react";
import UserPlayCard from "@/component/UserPlayCard";
import { Button } from "@/component/ui/button";
import Chessboard from "@/component/chessboard";
import { Undo2, Handshake, Flag } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Move } from "chess.js";
const footers = [
  {
    icon: <Undo2></Undo2>,
    text: "PREVIOS",
  },
  {
    icon: <Redo2 />,
    text: "Next",
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
const Footer = {
  resign: "RESIGN",
  draw: "DRAW",
  next: "Next",
  previos: "PREVIOS",
};
type MoveRow = { white?: string; black?: string };
type GameStart = { opponent: { name: string; color: "w" | "b" }; gameId: string; color: "w" | "b"; playerId: string; fen: string; turn: "w" | "b"; whiteTime: number; blackTime: number };
const Game = () => {
  const [searchParams, setSearchParams] = useSearchParams();
 
  const [chess, setChess] = useState<Chess | null>(null);
  const [board, setBoard] = useState(new Chess().board());
  const [turn, setTurn] = useState("w");
  const [gameId, setGameId] = useState("");
  const [gamestate, setGameState] = useState("");
  const navigate = useNavigate();
  const [opponent,setOpponent]=useState<{ name: string; color: "w" | "b" }>()
  const [playerId, setPlayerId] = useState("");
  const [color, setColor] = useState<"w" | "b">("w");
  const [winner, setWinner] = useState<string>("");
  const [play, setPlay] = useState(true);
  const [blackTimer, setBlackTimer] = useState<number>(0);
  const [whiteTimer, setWhiteTimer] = useState<number>(0);
  const [next, setNext] = useState<[] | Move[]>([]);
  const [moveRows, setMoveRows] = useState<MoveRow[]>([]);
  const [drawOffer, setDrawOffer] = useState<"incoming" | "outgoing" | null>(null);
  const [drawOfferFrom, setDrawOfferFrom] = useState<"w" | "b" | null>(null);
  
  console.log(color, " color i got");

  useEffect(() => {
    socket.on("waiting", (data: { gameId: string }) => {
      setGameId(data.gameId);
      setPlay(false);
      setGameState("waiting")
      
    });

    socket.on("game-start", (data: GameStart) => {
      console.log("ddata of game start " , data)
      setOpponent(data.opponent)
      setGameId(data.gameId);
      setTurn(data.turn);
      setPlay(false);
      setPlayerId(data.playerId);
      
      const newChess = new Chess(data.fen);
      setChess(newChess);
      setBoard(newChess.board());
      setGameState("playing");
      searchParams.set('s','playing')
      setSearchParams()
      setColor(data.color);
      setWhiteTimer(data.whiteTime);
      setBlackTimer(data.blackTime);
      setMoveRows([]);
      
    });

    socket.on("move-made", (data: { fen: string; turn: "w" | "b"; winner?: string; move?: Move; history?: string[] }) => {
      const chess = new Chess(data.fen);
      setChess(chess);
      setBoard(chess.board());

      setTurn(data.turn);
      if (data.history) {
        const history = data.history;
        const rows: MoveRow[] = [];
        for (let index = 0; index < history.length; index += 2) {
          rows.push({ white: history[index], black: history[index + 1] });
        }
        setMoveRows(rows);
      }
      if (data.winner) {
        setWinner(data.winner);
        setGameState("finished");
        setTimeout(() => {
          setWinner("");
          setGameState("");
          setPlay(true);
        }, 3000);
      }
    });

    socket.on("game-over", (data: { winner: string }) => {
      setDrawOffer(null);
      setDrawOfferFrom(null);
      
      setWinner(data.winner);

      setGameState("finished");
      setTimeout(() => {
        setWinner("");
        setGameState("");
        setPlay(true);
      }, 3000);
    });
    socket.on("timer-update", (data: { whiteTime: number; blackTime: number }) => {
      setWhiteTimer(data.whiteTime);
      setBlackTimer(data.blackTime);
    });
    socket.on("draw-offered", (data: { from: "w" | "b" }) => {
      setDrawOffer("incoming");
      setDrawOfferFrom(data.from);
    });
    socket.on("draw-offer-sent", () => setDrawOffer("outgoing"));
    socket.on("draw-declined", () => {
      setDrawOffer(null);
      setDrawOfferFrom(null);
    });

    return () => {
      socket.off("waiting");
      socket.off("game-start");
      socket.off("move-made");
      socket.off("game-over");
      socket.off("timer-update");
      socket.off("draw-offered");
      socket.off("draw-offer-sent");
      socket.off("draw-declined");
    };
  }, []);

  function onMove(move: { from: string; to: string }) {
    socket.emit("move", {
      gameId,
      playerId,
      move,
    });

    
  }

  function emits(emit: string) {
    socket.emit(emit, {
      playerId,
      gameId,
    });
  }

  function requestDraw() {
    if (drawOffer || gamestate !== "playing") return;
    socket.emit("DRAW", { playerId, gameId });
  }

  function respondToDraw(accepted: boolean) {
    socket.emit(accepted ? "DRAW_ACCEPT" : drawOffer === "outgoing" ? "DRAW_CANCEL" : "DRAW_DECLINE", { playerId, gameId });
    setDrawOffer(null);
    setDrawOfferFrom(null);
  }

  function moveNext() {
    if (!chess || next.length === 0) {
      return;
    }

    setNext((prev) => {
      const copy = [...prev];
      const move = copy.pop();

      if (!move) return prev;
      chess.move(move);
      setBoard(chess.board());
      return copy;
    });
  }

  function footerButton(type: string) {
    switch (type) {
      case Footer.resign:
        emits(Footer.resign);
        break;
      case Footer.draw:
        requestDraw();
        break;
      case Footer.next:
        moveNext();
        break;
      case Footer.previos:
      {
        if (!chess) break;
        const move = chess.undo();

        if (move) {
          setNext((prev) => [...prev, move]);
          setBoard(chess.board());
        }
      }
        break;
    }
  }
  function cancelMatchmaking() {
    
    navigate("/");
  }

  const statusText = !chess ? "Waiting for game" : chess.isCheckmate() ? "Checkmate" : chess.isDraw() ? "Draw" : chess.isCheck() ? `${turn === color ? "Your" : "Opponent's"} king is in check` : turn === color ? "Your move" : "Opponent's move";
  const captured = chess ? chess.board().flat().filter((piece) => piece === null).length - 32 : 0;
  

  return (
    <div className="game-shell">
      <div className={`game-layout ${gamestate == "waiting" ? "game-is-waiting" : ""}`}>
        <section className="game-main">
        {/* back button bar */}
        <div className="game-topbar">
          <div>
            <Button
              disabled={!play}
              className="bg-black text-white flex gap-2 rounded-none"
              onClick={()=>{
                navigate('/')
              }}
            >
              <MoveLeft />
              <span  className="text-xs sm:text-base">EXTRACT</span>
            </Button>
          </div>
          <div className="relative flex items-center gap-2 border border-orange-600 px-2 py-1">
            <div className="absolute inset-0 bg-orange-800 opacity-20"></div>
            <span className="relative h-2 w-2  rounded-full bg-orange-500"></span>
            <span className="relative text-orange-500 lg:text-lg  text-xs">
              LIVE
            </span>
          </div>
        </div>

        <UserPlayCard player={opponent} yourTurn={turn==opponent?.color} timer={opponent?.color=='w'?whiteTimer:blackTimer}></UserPlayCard>

        {/* chessboard */}
        <Chessboard
        color={color}
          board={board}
          chess={chess}
          currentTurn={turn}
          onMove={onMove}
          key={3}
        ></Chessboard>

        <UserPlayCard player={{color, name: playerId ? "You" : undefined}}  yourTurn={turn==color} timer={ color=='w'?whiteTimer:blackTimer}></UserPlayCard>

        <div className="game-info-bar">
          <span className={chess?.isCheck() ? "status-warning" : ""}>{statusText}</span>
          <span>{captured > 0 ? `${captured} pieces off board` : "Standard position"}</span>
        </div>
        </section>
        <aside className="game-side-rail">
        <div className="move-log" aria-label="Move history">
          <div className="move-log-header"><span>MOVE HISTORY</span><span>{moveRows.length} rounds</span></div>
          <div className="move-log-list">
            {moveRows.length === 0 ? <span className="move-empty">Moves will appear here</span> : moveRows.map((row, index) => <div className="move-row" key={index}><span>{index + 1}.</span><strong>{row.white || ""}</strong><strong>{row.black || ""}</strong></div>)}
          </div>
        </div>

        {/* FOOTER CARDS */}
        <div className=" flex justify-between  gap-2  w-full lg:max-w-sm">
          {footers.map((foot: { icon: ReactNode; text: string }) => (
            <div
              key={String(foot.text)}
              role="button"
              tabIndex={0}
              aria-disabled={!chess || gamestate !== "playing"}
              onClick={() => {
                if (chess && gamestate === "playing" && !(foot.text === Footer.draw && drawOffer)) footerButton(foot.text);
              }}
              className="bg-black p-4 w-full lg:w-full  border items-center justify-center"
            >
              <div className=" flex items-center flex-col">
                <span className="text-[10px] sm:text-sm">{foot.icon}</span>
                <span className="text-[10px] sm:text-sm">{foot.text}</span>
              </div>
            </div>
          ))}
        </div>
        </aside>
      </div>
      {drawOffer && gamestate === "playing" && (
        <div className="draw-overlay" role="dialog" aria-modal="true" aria-label="Draw offer">
          <div className="draw-dialog">
            {drawOffer === "incoming" ? (
              <>
                <span className="draw-kicker">MATCH REQUEST</span>
                <h2>{drawOfferFrom === opponent?.color ? opponent.name : "Your opponent"} offers a draw</h2>
                <p>Accepting will end the game for both players.</p>
                <div className="draw-actions">
                  <button className="draw-accept" onClick={() => respondToDraw(true)}>ACCEPT DRAW</button>
                  <button className="draw-decline" onClick={() => respondToDraw(false)}>DECLINE</button>
                </div>
              </>
            ) : (
              <>
                <span className="draw-kicker">DRAW OFFER SENT</span>
                <h2>Waiting for a response</h2>
                <p>Your opponent has been asked to agree to a draw.</p>
                <button className="draw-decline" onClick={() => respondToDraw(false)}>CANCEL OFFER</button>
              </>
            )}
          </div>
        </div>
      )}
      {gamestate == "waiting" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black rounded-xl p-6 text-center shadow-xl">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />

            <h2 className="text-xl font-semibold">Searching for opponent...</h2>

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
      {gamestate == "finished" && (
        <div className="absolute inset-0 flex items-center justify-center bg-transperant border border-orange-600 ">
          <div>
            <h1 className="font-extrabold text-3xl p-2 bg-black ">
              {winner == "none" ? (
                <div className="text-orange-700">
                  Draw

                </div>
              ) : (
                <div>
                  You{" "}
                  {winner == color ? (
                    <span className="text-orange-700">Won</span>
                  ) : (
                    <span className="text-orange-700">Lose</span>
                  )}
                </div>
              )}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;

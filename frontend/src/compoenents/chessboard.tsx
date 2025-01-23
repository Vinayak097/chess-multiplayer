import { Color, PieceSymbol, Square } from 'chess.js'
import { useState, useEffect } from 'react'

const getPieceSymbol = (piece: { type: PieceSymbol, color: Color }) => {
  const symbols: { [key: string]: string } = {
    'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
    'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
  }
  return symbols[piece.color + piece.type]
}

const Chessboard = ({chess, socket, board}: {
  chess:any,
  socket:WebSocket
  board: ({
    square: Square,
    type: PieceSymbol,
    color: Color
  } | null)[][];
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)

  const handleSquareClick = (square: string) => {
    if (!selectedSquare) {
      setSelectedSquare(square);
    } else {
      socket.send(JSON.stringify({
        type: "move",
        move: {
          from: selectedSquare,
          to: square
        }
      }));
      setSelectedSquare(null);
    }
  };

  // Force re-render when board changes
  useEffect(() => {
    console.log("Board updated in Chessboard:", board); // Debug log
  }, [board]);

  return (
    <div className="border-4 border-slate-800 inline-block">
      {board.map((row, i) => (
        <div key={i} className='flex'>
          {row.map((square, j) => {
            const squareId = String.fromCharCode(97 + j) + String(8 - i);
            return (
              <div 
                key={`${i}-${j}-${square?.type || 'empty'}`} // Force re-render with piece type
                onClick={() => handleSquareClick(squareId)}
                className={`
                  w-16 h-16 flex items-center justify-center text-4xl
                  ${(i + j) % 2 === 0 ? 'bg-slate-200' : 'bg-slate-500'}
                  ${selectedSquare === squareId ? 'bg-blue-400' : ''}
                `}
              >
                {square && 
                  <span className={`${square.color === 'w' ? 'text-white' : 'text-black'}`}>
                    {getPieceSymbol(square)}
                  </span>
                }
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chessboard
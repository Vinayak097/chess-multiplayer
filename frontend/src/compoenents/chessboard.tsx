import { Color, PieceSymbol, Square } from 'chess.js';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn } from '@fortawesome/free-solid-svg-icons';

const getPieceIcon = (piece: { type: PieceSymbol, color: Color }) => {
  const pieceMap: { [key: string]: any } = {
    'wk': faChessKing,
    'wq': faChessQueen,
    'wr': faChessRook,
    'wb': faChessBishop,
    'wn': faChessKnight,
    'wp': faChessPawn,
    'bk': faChessKing,
    'bq': faChessQueen,
    'br': faChessRook,
    'bb': faChessBishop,
    'bn': faChessKnight,
    'bp': faChessPawn,
  };
  return pieceMap[piece.color + piece.type];
};

const Chessboard = ({ chess, socket, board, onMove, currentTurn }: {
  chess: any,
  socket: WebSocket,
  board: ({
    square: Square,
    type: PieceSymbol,
    color: Color
  } | null)[][],
  onMove: (move: { from: string, to: string }) => void,
  currentTurn: string
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const handleSquareClick = (square: string) => {
    if (!selectedSquare) {
      setSelectedSquare(square);
    } else {
      onMove({
        from: selectedSquare,
        to: square
      });
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
                  <FontAwesomeIcon 
                    icon={getPieceIcon(square)} 
                    className={`${square.color === 'w' ? 'text-white' : 'text-black'}`}
                  />
                }
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
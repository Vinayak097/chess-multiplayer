import { Color, PieceSymbol, Square } from 'chess.js';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKing, faChessQueen, faChessRook, faChessBishop, faChessKnight, faChessPawn } from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'socket.io-client';
import { useIsMobile } from '@/hooks/use-mobile';

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

const Chessboard = ({color:_color, chess: _chess, socket: _socket, board, onMove, currentTurn: _currentTurn, }: {
  chess: any,
  color:string,
  socket: Socket,
  board: ({
    square: Square,
    type: PieceSymbol,
    color: Color
  } | null)[][],
  onMove: (move: { from: string, to: string }) => void,
  currentTurn: string,
  
}) => {

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [winner, setWinner] = useState<null | string>();
  const handleSquareClick = (square: string) => {
    console.log('selectedsquare', selectedSquare, square)
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
    
    if (_chess?.isCheckmate()) {
      const winner = _chess.turn() === "w" ? "b" : "w";
      setWinner(winner)
    }
  }, [board]);
  const ismobile=useIsMobile()
  return (
    <div className={`border-4 border-black inline-block ${_color === "b" ? "board-wrapper black" : "board-wrapper"}`}>
    <div className="border-4 border-black  inline-block ">
      {winner && (
        <div className='m-4'>
          {winner} player Won
        </div>
      )}
      {board.map((row, i) => (
        <div key={i} className={`flex w-full board`}>
          {row.map((square, j) => {
            const squareId = String.fromCharCode(97 + j) + String(8 - i);
            const squareBgClass = selectedSquare === squareId
              ? 'bg-blue-400'
              : (i + j) % 2 === 0
                ? 'bg-zinc-700'
                : 'bg-black-500';
            return (
              <div 
                key={`${i}-${j}-${square?.type || 'empty'}`} // Force re-render with piece type
                onClick={() => handleSquareClick(squareId)}
                className={`piece w-10 h-10 lg:h-12 lg:w-12 flex items-center justify-center text-4xl ${squareBgClass}`}
              >
                {square && 
                  <FontAwesomeIcon 
                  height={ismobile?8:50}
                  width={ismobile?20:50}
                    icon={getPieceIcon(square)} 
                    className={`${square.color === 'w' ? 'text-orange-600' : 'text-white'}`}
                  />
                }
              </div>
            );
          })}
        </div>
      ))}
    </div>
    </div>
  );
};

export default Chessboard;
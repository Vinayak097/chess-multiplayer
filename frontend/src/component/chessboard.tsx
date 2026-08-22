import { Chess, Color, PieceSymbol, Square } from 'chess.js';
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

const Chessboard = ({color:_color, chess: _chess, board, onMove, currentTurn: _currentTurn, }: {
  chess: Chess | null,
  color:string,
  board: ({
    square: Square,
    type: PieceSymbol,
    color: Color
  } | null)[][],
  onMove: (move: { from: string, to: string }) => void,
  currentTurn: string,
  
}) => {

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalSquares, setLegalSquares] = useState<string[]>([]);
  const handleSquareClick = (square: string) => {
    if (!_chess || _chess.turn() !== _currentTurn) return;
    const chessSquare = square as Square;
    const piece = _chess.get(chessSquare);
    if (!selectedSquare) {
      if (!piece || piece.color !== _color) return;
      setSelectedSquare(square);
      setLegalSquares(_chess.moves({ square: chessSquare, verbose: true }).map((move: { to: string }) => move.to));
      return;
    }

    if (square === selectedSquare) {
      setSelectedSquare(null);
      setLegalSquares([]);
      return;
    }

    if (piece?.color === _color) {
      setSelectedSquare(square);
      setLegalSquares(_chess.moves({ square: chessSquare, verbose: true }).map((move: { to: string }) => move.to));
      return;
    }

    if (legalSquares.includes(square)) onMove({ from: selectedSquare, to: square });
    setSelectedSquare(null);
    setLegalSquares([]);
  };

  // Force re-render when board changes
  useEffect(() => {
  }, [board]);
  return (
    <div className={`board-wrapper ${_color === "b" ? "black" : ""}`}>
      {board.map((row, i) => (
        <div key={i} className="flex w-full board">
          {row.map((square, j) => {
            const squareId = String.fromCharCode(97 + j) + String(8 - i);
            const isLegal = legalSquares.includes(squareId);
            const squareBgClass = selectedSquare === squareId ? 'selected' : (i + j) % 2 === 0 ? 'light-square' : 'dark-square';
            return (
              <div 
                key={`${i}-${j}`}
                onClick={() => handleSquareClick(squareId)}
                className={`piece ${squareBgClass} ${isLegal ? 'legal-square' : ''}`}
              >
                {square && 
                  <FontAwesomeIcon 
                    icon={getPieceIcon(square)} 
                    className={`${square.color === 'w' ? 'piece-white' : 'piece-black'}`}
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
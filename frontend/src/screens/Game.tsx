import React, { useEffect, useState } from 'react';
import Chessboard from '../compoenents/chessboard';
import { useSocket } from '../hooks/useSocket';
import { Chess } from 'chess.js';
import Button from '../compoenents/Button';

export const Move = "move";
export const init_game = "init_game";
export const GAME_OVER = "game_over";

function Game() {
  const socket = useSocket();
  const [chess] = useState(() => new Chess());
  const [board, setBoard] = useState(() => chess.board());
  const [turn, setTurn] = useState('w');
  const [isConnected, setIsConnected] = useState(false);
  const [gameStatus, setGameStatus] = useState('Waiting to start...');
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(true);
    
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message); // Debug log
      
      switch (message.type) {
        case init_game:
          chess.reset();
          setBoard([...chess.board()]); // Force update with spread
          setTurn('w');
          setGameStatus('Game started!' +message.payload.color);
          setWinner(null);
          break;
        case Move:
          try {
            const moveResult = chess.move({
              from: message.payload.move.from,
              to: message.payload.move.to
            });
            
            if (moveResult) {
              // Force a new array reference to trigger re-render
              const newBoard = chess.board();
              setBoard([...newBoard]);
              setTurn(message.payload.turn);
              console.log("Board updated:", chess.ascii()); // Debug log
            }
          } catch (err) {
            console.error("Move error:", err);
          }
          break;
        case GAME_OVER:
          setGameStatus(`Game Over! Winner: ${message.payload.winner}`);
          setWinner(message.payload.winner);
          break;
      }
    };

    return () => {
      socket.onmessage = null;
    };

  }, [socket, chess]);

  const handleMove = (move: { from: string, to: string }) => {
    socket.send(JSON.stringify({
      type: Move,
      move: move
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-3">
            <div className="bg-slate-800 p-6 rounded-lg">
              {isConnected ? (
                <Chessboard 
                  socket={socket} 
                  chess={chess} 
                  board={board} 
                  onMove={handleMove}
                  currentTurn={turn}
                />
              ) : (
                <div className="text-white text-center p-8">Connecting...</div>
              )}
            </div>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-lg">
            <div className="text-white space-y-4">
              <div className={`text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
              <div className="text-lg font-semibold">{gameStatus}</div>
              {winner && (
                <div className="text-xl font-bold">
                  Winner: {winner}
                </div>
              )}
              <Button 
                label="Start Game" 
                onClick={() => {
                  socket?.send(JSON.stringify({ type: init_game }));
                  setGameStatus('Starting game...');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
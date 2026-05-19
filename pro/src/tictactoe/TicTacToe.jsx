import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import RetroButton from '../components/ui/RetroButton';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, SwatchBook } from 'lucide-react';
import logger from '../utils/logger';

const TicTacToe = () => {
  const { socket, playerName, roomId, setRoomId } = useGameContext();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winningCells, setWinningCells] = useState([]);
  const [mySymbol, setMySymbol] = useState(null);
  const navigate = useNavigate();

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  useEffect(() => {
    if (!socket) return;

    logger.info('TTT', `Socket connected: ${socket.id}`);

    socket.on('ttt_roomInfo', ({ id, players, gameState, currentTurn, board }) => {
      logger.socket('⬅️', 'ttt_roomInfo', { roomId: id, gameState });
      setRoomId(id);
      setPlayers(players);
      setGameState(gameState);
      setCurrentTurn(currentTurn);
      if (board) setBoard(board);
      
      const playerIndex = players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        setMySymbol(playerIndex === 0 ? 'X' : 'O');
      }
    });

    socket.on('ttt_gameStarted', () => {
      logger.socket('⬅️', 'ttt_gameStarted', 'Game started');
      setGameState('playing');
      setWinningCells([]);
      Swal.fire({
        title: 'Game Started!',
        text: 'The battle begins!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('ttt_gameRestarted', () => {
      logger.socket('⬅️', 'ttt_gameRestarted', 'Game restarted');
      setGameState('playing');
      setWinningCells([]);
      setBoard(Array(9).fill(null));
      Swal.fire({
        title: 'Game Restarted',
        text: 'Round 2!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('ttt_moveMade', ({ position, symbol, board }) => {
      logger.socket('⬅️', 'ttt_moveMade', { position, symbol });
      playMove();
      setBoard(board);
    });

    socket.on('ttt_nextTurn', (playerId) => {
      logger.socket('⬅️', 'ttt_nextTurn', { playerId });
      setCurrentTurn(playerId);
    });

    socket.on('ttt_gameWon', ({ winner, winningLine }) => {
      logger.socket('⬅️', 'ttt_gameWon', { winner, winningLine });
      playWin();
      setWinningCells(winningLine);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      const winnerName = players.find(p => p.id === winner)?.name || 'Someone';
      Swal.fire({
        title: '🎉 Victory!',
        text: `${winnerName} has won!`,
        icon: 'success',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
      setGameState('ended');
    });

    socket.on('ttt_gameDraw', () => {
      logger.socket('⬅️', 'ttt_gameDraw', 'Draw!');
      Swal.fire({
        title: '🤝 Draw!',
        text: 'It\'s a tie!',
        icon: 'info',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
      setGameState('ended');
    });

    socket.on('ttt_playerLeft', (playerId) => {
      logger.socket('⬅️', 'ttt_playerLeft', { playerId });
      Swal.fire({
        title: 'Player Left',
        text: 'The opponent has left the party.',
        icon: 'warning',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
      setGameState('waiting');
      setBoard(Array(9).fill(null));
    });

    socket.on('ttt_alert', ({ icon, title, text }) => {
      logger.socket('⬅️', 'ttt_alert', { icon, title, text });
      Swal.fire({ icon, title, text, customClass: { popup: 'glass rounded-3xl paper-font' } });
    });

    return () => {
      socket.off('ttt_roomInfo');
      socket.off('ttt_gameStarted');
      socket.off('ttt_gameRestarted');
      socket.off('ttt_moveMade');
      socket.off('ttt_nextTurn');
      socket.off('ttt_gameWon');
      socket.off('ttt_gameDraw');
      socket.off('ttt_playerLeft');
      socket.off('ttt_alert');
    };
  }, [socket, players, setRoomId, playMove, playWin]);

  const handleCellClick = (position) => {
    if (gameState === 'playing' && currentTurn === socket?.id && !board[position]) {
      logger.socket('➡️', 'ttt_makeMove', { roomId, position });
      socket.emit('ttt_makeMove', { roomId, position });
    }
  };

  const handleCreateRoom = () => {
    logger.socket('➡️', 'ttt_createRoom', { playerName });
    socket.emit('ttt_createRoom', playerName);
  };

  const handleJoinRoom = async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: 'Join Room',
      input: 'text',
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      customClass: { popup: 'glass rounded-3xl paper-font' }
    });
    if (joinRoomId) {
      logger.socket('➡️', 'ttt_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
      socket.emit('ttt_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
    }
  };

  const handleRestartGame = () => {
    logger.socket('➡️', 'ttt_restartGame', { roomId });
    socket.emit('ttt_restartGame', roomId);
  };

  const renderBoard = () => (
    <div className="glass p-3 sm:p-6 rounded-xl sm:rounded-2xl">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 w-48 sm:w-64 md:w-80">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={gameState !== 'playing' || currentTurn !== socket?.id || cell}
            className={`
              aspect-square text-3xl sm:text-5xl md:text-6xl font-bold 
              glass rounded-lg sm:rounded-xl transition-all duration-200
              ${cell ? 'cursor-default' : 'cursor-pointer hover:bg-white/40'}
              ${cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-600' : 'text-transparent'}
              ${winningCells.includes(i) ? 'bg-yellow-300/50 ring-2 ring-yellow-500' : ''}
            `}
          >
            {cell || ''}
          </button>
        ))}
      </div>
    </div>
  );

return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
      <RetroButton 
        onClick={() => navigate('/')} 
        variant="secondary" 
        className="absolute top-2 sm:top-8 left-2 sm:left-8 flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 sm:px-4"
      >
        <ArrowLeft size={14} className="sm:w-[18px]" />
        <span className="hidden sm:inline">Back</span>
      </RetroButton>

      <h1 className="text-3xl sm:text-5xl md:text-6xl hand-drawn mb-4 sm:mb-8 text-blue-600">Tic Tac Toe</h1>

      {!roomId ? (
        <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
          <RetroButton onClick={handleCreateRoom} className="text-sm sm:text-base px-3 sm:px-6 py-2">Create</RetroButton>
          <RetroButton onClick={handleJoinRoom} variant="secondary" className="text-sm sm:text-base px-3 sm:px-6 py-2">Join</RetroButton>
        </div>
      ) : (
        <div className="w-full max-w-sm sm:max-w-md">
          <div className="glass p-2 sm:p-4 rounded-xl sm:rounded-2xl mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <div className="paper-font text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
              <SwatchBook size={14} className="sm:w-[18px] text-blue-500" />
              <span className="hidden sm:inline">Room:</span> 
              <span className="font-bold text-blue-600 uppercase">{roomId}</span>
            </div>
            <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
              {players.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 ${p.id === currentTurn ? 'scale-105' : 'opacity-60'}`}>
                  {p.id === currentTurn ? (
                    <Users size={12} className="sm:w-4 text-blue-500 animate-pulse" />
                  ) : (
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                  )}
                  <span className="font-bold paper-font">
                    {p.name.length > 8 ? p.name.slice(0,8)+'...' : p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {renderBoard()}

          {gameState === 'ended' && (
            <RetroButton onClick={handleRestartGame} className="mt-4 text-sm sm:text-base px-3 sm:px-6 py-2">
              Play Again
            </RetroButton>
          )}

          <div className="text-center paper-font text-xs sm:text-lg text-gray-700 flex flex-col items-center gap-2">
            {gameState === 'playing' ? (
              currentTurn === socket?.id ? (
                <div className="flex items-center gap-1 sm:gap-2 text-blue-600 animate-bounce">
                  <Trophy size={16} className="sm:w-6" />
                  <span>Your turn!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Waiting for {players.find(p => p.id === currentTurn)?.name}...</span>
                  <span className="sm:hidden">Waiting...</span>
                </div>
              )
            ) : (
              gameState === 'waiting' ? "Waiting for opponent..." : "Game Over!"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;

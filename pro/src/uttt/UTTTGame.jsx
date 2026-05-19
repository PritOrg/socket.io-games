import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import RetroButton from '../components/ui/RetroButton';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Grid3X3, Star } from 'lucide-react';
import MacroGrid from './components/MacroGrid';
import logger from '../utils/logger';

const UTTTGame = () => {
  const { socket, playerName, roomId, setRoomId } = useGameContext();
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [macroBoard, setMacroBoard] = useState(Array(9).fill(null));
  const [activeGrid, setActiveGrid] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [lastMove, setLastMove] = useState(null);
  const [mySymbol, setMySymbol] = useState(null);
  const navigate = useNavigate();

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  useEffect(() => {
    if (!socket) return;

    logger.info('UTTT', `Socket connected: ${socket.id}`);

    socket.on('uttt_roomInfo', (room) => {
      logger.socket('⬅️', 'uttt_roomInfo', { roomId: room.id, gameState: room.gameState });
      setRoomId(room.id);
      setPlayers(room.players);
      setGameState(room.gameState);
      setCurrentTurn(room.currentTurn);
      if (room.board) setBoard(room.board);
      if (room.macroBoard) setMacroBoard(room.macroBoard);
      if (room.activeGrid !== undefined) setActiveGrid(room.activeGrid);
      if (room.scores) setScores(room.scores);
      if (room.lastMove) setLastMove(room.lastMove);
      
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        setMySymbol(playerIndex === 0 ? 'X' : 'O');
        logger.info('UTTT', `You are player ${playerIndex + 1} (${playerIndex === 0 ? 'X' : 'O'})`);
      }
    });

    socket.on('uttt_gameState', (room) => {
      logger.socket('⬅️', 'uttt_gameState', { 
        gameState: room.gameState, 
        currentTurn: room.currentTurn,
        activeGrid: room.activeGrid,
        scores: room.scores 
      });
      setGameState(room.gameState);
      setCurrentTurn(room.currentTurn);
      setBoard(room.board);
      setMacroBoard(room.macroBoard);
      setActiveGrid(room.activeGrid);
      setScores(room.scores);
      setLastMove(room.lastMove);
    });

    socket.on('uttt_gameStarted', () => {
      logger.socket('⬅️', 'uttt_gameStarted', 'Game started!');
      setGameState('playing');
      setBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
      setMacroBoard(Array(9).fill(null));
      setActiveGrid(null);
      setScores({ X: 0, O: 0 });
      setLastMove(null);
      Swal.fire({
        title: 'Game Started!',
        text: 'Ultimate Tic-Tac-Toe begins!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

socket.on('uttt_gameOver', ({ winner, symbol, scores, reason }) => {
       logger.socket('⬅️', 'uttt_gameOver', { winner, symbol, scores, reason });
       playWin();
       confetti({
         particleCount: 200,
         spread: 70,
         origin: { y: 0.6 }
       });
       
       let winnerName;
       if (reason === 'tiebreaker' && scores.X === scores.O) {
         winnerName = 'No one - it\'s a tie!';
       } else if (winner) {
         winnerName = players.find(p => p.id === winner)?.name || 'Someone';
       } else {
         winnerName = symbol || 'Someone';
       }
       const reasonText = reason === 'macro_win' 
         ? ' won the game!' 
         : ` won by points (${scores.X} - ${scores.O})!`;
       
       Swal.fire({
         title: '🎉 Victory!',
         text: `${winnerName}${reasonText}`,
         icon: 'success',
         customClass: { popup: 'glass rounded-3xl paper-font' }
       });
       setGameState('ended');
     });

    socket.on('uttt_error', ({ message }) => {
      logger.socket('⬅️', 'uttt_error', { message });
      Swal.fire({
        title: 'Oops!',
        text: message,
        icon: 'error',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('uttt_playerLeft', ({ playerId }) => {
      logger.socket('⬅️', 'uttt_playerLeft', { playerId });
      Swal.fire({
        title: 'Player Left',
        text: 'The opponent has left the party.',
        icon: 'warning',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
      setGameState('waiting');
      setBoard(Array(9).fill(null).map(() => Array(9).fill(null)));
      setMacroBoard(Array(9).fill(null));
      setActiveGrid(null);
    });

    return () => {
      socket.off('uttt_roomInfo');
      socket.off('uttt_gameState');
      socket.off('uttt_gameStarted');
      socket.off('uttt_gameOver');
      socket.off('uttt_error');
      socket.off('uttt_playerLeft');
    };
  }, [socket, players, setRoomId, playWin]);

  const handleCellClick = (gridIndex, squareIndex) => {
    if (gameState === 'playing' && currentTurn === socket?.id) {
      if (activeGrid !== null && activeGrid !== gridIndex) return;
      if (board[gridIndex][squareIndex] !== null) return;
      if (macroBoard[gridIndex] !== null && macroBoard[gridIndex] !== 'DEAD') return;
      
      playMove();
      logger.socket('➡️', 'uttt_makeMove', { roomId, gridIndex, squareIndex });
      socket.emit('uttt_makeMove', { roomId, gridIndex, squareIndex });
    }
  };

  const handleCreateRoom = () => {
    logger.socket('➡️', 'uttt_createRoom', { playerName });
    socket.emit('uttt_createRoom', playerName);
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
      logger.socket('➡️', 'uttt_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
      socket.emit('uttt_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
    }
  };

  const handleRestartGame = () => {
    logger.socket('➡️', 'uttt_restartGame', { roomId });
    socket.emit('uttt_restartGame', roomId);
  };

  const getMyScore = () => {
    if (!mySymbol) return 0;
    return scores[mySymbol];
  };

  const getOpponentScore = () => {
    if (!mySymbol) return 0;
    return mySymbol === 'X' ? scores.O : scores.X;
  };

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

      <h1 className="text-2xl sm:text-3xl md:text-5xl hand-drawn mb-2 sm:mb-4 text-blue-600 flex items-center gap-2 sm:gap-3 text-center">
        <Grid3X3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        <span className="hidden sm:inline">Ultimate Tic-Tac-Toe</span>
        <span className="sm:hidden">UTTT</span>
      </h1>

      {!roomId ? (
        <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
          <RetroButton onClick={handleCreateRoom} className="text-sm sm:text-base px-3 sm:px-6 py-2">Create</RetroButton>
          <RetroButton onClick={handleJoinRoom} variant="secondary" className="text-sm sm:text-base px-3 sm:px-6 py-2">Join</RetroButton>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-2xl">
          <div className="glass p-2 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
            <div className="paper-font text-gray-600 flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
              <Grid3X3 size={14} className="sm:w-[18px] text-blue-500" />
              <span className="hidden sm:inline">Room:</span> <span className="font-bold text-blue-600 uppercase">{roomId}</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Star size={14} className="sm:w-[18px] text-blue-500" />
                <span className="font-bold text-blue-600 text-sm sm:text-base">{scores.X}</span>
                <span className="text-gray-400">-</span>
                <span className="font-bold text-red-600 text-sm sm:text-base">{scores.O}</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
              {players.map((p, i) => (
                <div 
                  key={p.id} 
                  className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 ${p.id === currentTurn ? 'scale-105' : 'opacity-60'}`}
                >
                  {p.id === currentTurn ? (
                    <Users size={12} className="sm:w-4 text-blue-500 animate-pulse" />
                  ) : (
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${i === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                  )}
                  <span className="font-bold paper-font text-xs sm:text-base">
                    {p.name.length > 8 ? p.name.slice(0,8)+'...' : p.name} ({i === 0 ? 'X' : 'O'})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3 sm:mb-6 px-1">
            <MacroGrid
              board={board}
              macroBoard={macroBoard}
              activeGrid={activeGrid}
              lastMove={lastMove}
              onCellClick={handleCellClick}
            />
          </div>

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
            ) : gameState === 'waiting' ? (
              <span className="text-xs sm:text-base">Waiting for opponent...</span>
            ) : (
              <RetroButton onClick={handleRestartGame} className="text-xs sm:text-base px-3 sm:px-6 py-1 sm:py-2">Play Again</RetroButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UTTTGame;
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { SketchButton, SketchCard, sketchPopupClass, GameLayout } from '../components/ui';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, SwatchBook } from 'lucide-react';
import logger from '../utils/logger';

const PLAYER_COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233'];

const TicTacToe = () => {
  const { socket, playerName, roomId, setRoomId, clearRoomId } = useGameContext();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winningCells, setWinningCells] = useState([]);
  const [, setMySymbol] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const navigate = useNavigate();

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  useEffect(() => {
    if (!socket) return;

    logger.info('TTT', `Socket connected: ${socket.id}`);

    const saved = sessionStorage.getItem('ttt_reconnect');
    if (saved && !roomId) {
      const { roomId: savedRoomId, playerId } = JSON.parse(saved);
      logger.socket('➡️', 'ttt_reconnect', { roomId: savedRoomId, playerId });
      socket.emit('ttt_reconnect', { roomId: savedRoomId, playerId });
    }

    socket.on('ttt_roomInfo', ({ id, players, gameState, currentTurn, board }) => {
      logger.socket('⬅️', 'ttt_roomInfo', { roomId: id, gameState });
      setRoomId(id);
      setPlayers(players);
      setGameState(gameState);
      setCurrentTurn(currentTurn);
      if (board) setBoard(board);

      const playerIndex = players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        setMySymbol(playerIndex === 0 ? 'X' : 'O');
        setMyPlayerIndex(playerIndex);
        sessionStorage.setItem('ttt_reconnect', JSON.stringify({ roomId: id, playerId: players[playerIndex].id }));
      }
    });

    socket.on('ttt_gamePaused', ({ reason }) => {
      logger.socket('⬅️', 'ttt_gamePaused', { reason });
      Swal.fire({
        title: 'Game Paused',
        text: reason,
        icon: 'warning',
        customClass: { popup: sketchPopupClass },
      });
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
        customClass: { popup: sketchPopupClass },
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
        customClass: { popup: sketchPopupClass },
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
        origin: { y: 0.6 },
      });
      const winnerName = players.find((p) => p.id === winner)?.name || 'Someone';
      Swal.fire({
        title: 'Victory!',
        text: `${winnerName} has won!`,
        icon: 'success',
        customClass: { popup: sketchPopupClass },
      });
      setGameState('ended');
      sessionStorage.removeItem('ttt_reconnect');
    });

    socket.on('ttt_gameDraw', () => {
      logger.socket('⬅️', 'ttt_gameDraw', 'Draw!');
      Swal.fire({
        title: 'Draw!',
        text: "It's a tie!",
        icon: 'info',
        customClass: { popup: sketchPopupClass },
      });
      setGameState('ended');
      sessionStorage.removeItem('ttt_reconnect');
    });

    socket.on('ttt_playerLeft', (playerId) => {
      logger.socket('⬅️', 'ttt_playerLeft', { playerId });
      Swal.fire({
        title: 'Player Left',
        text: 'The opponent has left the party.',
        icon: 'warning',
        customClass: { popup: sketchPopupClass },
      });
      setGameState('waiting');
      setBoard(Array(9).fill(null));
    });

    socket.on('ttt_alert', ({ icon, title, text }) => {
      logger.socket('⬅️', 'ttt_alert', { icon, title, text });
      Swal.fire({
        icon,
        title,
        text,
        customClass: { popup: sketchPopupClass },
      });
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
      socket.off('ttt_gamePaused');
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
      customClass: { popup: sketchPopupClass },
    });
    if (joinRoomId) {
      logger.socket('➡️', 'ttt_joinRoom', {
        roomId: joinRoomId.toUpperCase(),
        playerName,
      });
      socket.emit('ttt_joinRoom', {
        roomId: joinRoomId.toUpperCase(),
        playerName,
      });
    }
  };

  const handleRestartGame = () => {
    logger.socket('➡️', 'ttt_restartGame', { roomId });
    socket.emit('ttt_restartGame', roomId);
  };

  const handleLeaveRoom = () => {
    Swal.fire({
      title: 'Leave Game?',
      text: 'Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      customClass: { popup: sketchPopupClass },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Leaving...',
          text: 'Are you absolutely sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, leave now',
          cancelButtonText: 'Stay',
          customClass: { popup: sketchPopupClass },
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            socket.emit('ttt_leaveRoom', roomId);
            sessionStorage.removeItem('ttt_reconnect');
            clearRoomId(roomId);
            navigate('/');
          }
        });
      }
    });
  };

  const renderBoard = () => (
    <SketchCard className="p-3 sm:p-6">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 w-48 sm:w-64 md:w-80">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            disabled={gameState !== 'playing' || currentTurn !== socket?.id || cell}
            className={`
              aspect-square text-3xl sm:text-5xl md:text-6xl font-bold
              transition-all duration-200
              ${cell ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'}
              ${cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-600' : 'text-transparent'}
              ${winningCells.includes(i) ? 'bg-yellow-300/50 ring-2 ring-yellow-500' : ''}
              font-sketch
            `}
          >
            {cell || ''}
          </button>
        ))}
      </div>
    </SketchCard>
  );

  return (
    <GameLayout socket={socket} roomId={roomId} gamePrefix="ttt" players={players}>
      <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sketch mb-4 sm:mb-8 text-ink">Tic Tac Toe</h1>

        {!roomId ? (
          <SketchCard className="p-8 max-w-md w-full">
            <div className="flex gap-2 sm:gap-4 flex-wrap justify-center">
              <SketchButton onClick={handleCreateRoom} className="text-sm sm:text-base px-3 sm:px-6 py-2">
                Create
              </SketchButton>
              <SketchButton onClick={handleJoinRoom} className="text-sm sm:text-base px-3 sm:px-6 py-2">
                Join
              </SketchButton>
            </div>
          </SketchCard>
        ) : (
          <div className="w-full max-w-sm sm:max-w-md">
            <SketchCard className="p-2 sm:p-4 mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
              <div className="font-handwriting text-ink flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                <SwatchBook size={14} className="sm:w-[18px] text-ink" />
                <span className="hidden sm:inline">Room:</span>
                <span className="font-bold text-ink uppercase">{roomId}</span>
              </div>
              <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
                {players.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-1 sm:gap-2 transition-all duration-300 ${p.id === currentTurn ? 'scale-105' : 'opacity-40'}`}
                    style={{ color: PLAYER_COLORS[i] }}
                  >
                    {p.id === currentTurn ? (
                      <Users size={12} className="sm:w-4 text-ink animate-pulse" />
                    ) : (
                      <div
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                        style={{ backgroundColor: PLAYER_COLORS[i] }}
                      />
                    )}
                    <span className="font-bold font-handwriting">
                      {p.name.length > 8 ? p.name.slice(0, 8) + '...' : p.name}
                    </span>
                    {i === myPlayerIndex && <span className="text-xs text-gray-500">(You)</span>}
                  </div>
                ))}
              </div>
            </SketchCard>

            {renderBoard()}

            {gameState === 'ended' && (
              <SketchButton onClick={handleRestartGame} className="mt-4 text-sm sm:text-base px-3 sm:px-6 py-2">
                Play Again
              </SketchButton>
            )}

            {(gameState === 'ready' || gameState === 'playing') && (
              <SketchButton onClick={handleLeaveRoom} className="mt-2 text-xs sm:text-sm px-3 py-1">
                Leave Room
              </SketchButton>
            )}

            <div className="text-center font-handwriting text-xs sm:text-lg text-ink flex flex-col items-center gap-2">
              {gameState === 'playing' ? (
                currentTurn === socket?.id ? (
                  <div className="flex items-center gap-1 sm:gap-2 text-ink animate-bounce text-xl font-bold">
                    <Trophy size={20} className="sm:w-6" />
                    <span>Your turn!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1 sm:gap-2 text-ink">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">
                        Waiting for <span className="font-bold">{players.find((p) => p.id === currentTurn)?.name}</span>
                        ...
                      </span>
                      <span className="sm:hidden">Waiting...</span>
                    </div>
                  </div>
                )
              ) : gameState === 'waiting' ? (
                'Waiting for opponent...'
              ) : (
                'Game Over!'
              )}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default TicTacToe;

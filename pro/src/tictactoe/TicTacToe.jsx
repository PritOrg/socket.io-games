import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import {
  SketchButton,
  SketchCard,
  sketchPopupClass,
  GameLayout,
  RoomLobby,
  MatchReport,
  AvatarSelector,
  LeaveButton,
} from '../components/ui';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import logger from '../utils/logger';

const PLAYER_COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233'];

const TicTacToe = () => {
  const { socket, playerName, roomId, setRoomId, clearRoomId } = useGameContext();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winningCells, setWinningCells] = useState([]);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const [avatar, setAvatar] = useState('🐼');
  const [avatarColor, setAvatarColor] = useState('#2a2a3e');
  const navigate = useNavigate();

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  useEffect(() => {
    if (!socket) return;

    const saved = sessionStorage.getItem('ttt_reconnect');
    if (saved && !roomId) {
      const { roomId: savedRoomId, playerId } = JSON.parse(saved);
      socket.emit('ttt_reconnect', { roomId: savedRoomId, playerId });
    }

    socket.on('ttt_roomInfo', ({ id, players, gameState, currentTurn, board }) => {
      setRoomId(id);
      setPlayers(players);
      setGameState(gameState);
      setCurrentTurn(currentTurn);
      if (board) setBoard(board);

      const playerIndex = players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        setMyPlayerIndex(playerIndex);
        sessionStorage.setItem('ttt_reconnect', JSON.stringify({ roomId: id, playerId: players[playerIndex].id }));
      }
    });

    socket.on('ttt_gamePaused', ({ reason }) => {
      Swal.fire({
        title: 'Game Paused',
        text: reason,
        icon: 'warning',
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on('ttt_gameStarted', () => {
      setGameState('playing');
      setWinningCells([]);
    });

    socket.on('ttt_gameRestarted', () => {
      setGameState('playing');
      setWinningCells([]);
      setBoard(Array(9).fill(null));
    });

    socket.on('ttt_moveMade', ({ board }) => {
      playMove();
      setBoard(board);
    });

    socket.on('ttt_nextTurn', (playerId) => {
      setCurrentTurn(playerId);
    });

    socket.on('ttt_gameWon', ({ winner, winningLine }) => {
      playWin();
      setWinningCells(winningLine);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setGameState('ended');
      sessionStorage.removeItem('ttt_reconnect');
    });

    socket.on('ttt_gameDraw', () => {
      setGameState('ended');
      sessionStorage.removeItem('ttt_reconnect');
    });

    socket.on('ttt_playerLeft', () => {
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
      Swal.fire({ icon, title, text, customClass: { popup: sketchPopupClass } });
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
  }, [socket, setRoomId, playMove, playWin]);

  const handleCellClick = (position) => {
    if (gameState === 'playing' && currentTurn === socket?.id && !board[position]) {
      socket.emit('ttt_makeMove', { roomId, position });
    }
  };

  const handleCreateRoom = () => {
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
      socket.emit('ttt_joinRoom', {
        roomId: joinRoomId.toUpperCase(),
        playerName,
      });
    }
  };

  const handleRestartGame = () => {
    socket.emit('ttt_restartGame', roomId);
  };

  const handleLeaveRoom = () => {
    socket.emit('ttt_leaveRoom', roomId);
    sessionStorage.removeItem('ttt_reconnect');
    clearRoomId(roomId);
    navigate('/');
  };

  const isGameOver = gameState === 'ended';
  const isDraw = isGameOver && winningCells.length === 0;
  const isWinner = isGameOver && winningCells.length > 0;
  const winnerName =
    isWinner && players.length > 0 ? players.find((p) => p.id === currentTurn)?.name || 'Someone' : null;
  const iWon = isWinner && currentTurn !== socket?.id;

  if (!roomId) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl sm:text-5xl font-sketch mb-6 text-ink">Tic Tac Toe</h1>
        <SketchCard className="p-6 max-w-md w-full mb-4">
          <AvatarSelector
            avatar={avatar}
            color={avatarColor}
            onAvatarChange={setAvatar}
            onColorChange={setAvatarColor}
          />
        </SketchCard>
        <SketchCard className="p-8 max-w-md w-full">
          <div className="flex gap-4 justify-center">
            <SketchButton onClick={handleCreateRoom}>Create</SketchButton>
            <SketchButton onClick={handleJoinRoom}>Join</SketchButton>
          </div>
        </SketchCard>
      </div>
    );
  }

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

        {gameState === 'ended' ? (
          <MatchReport winner={winnerName} isWinner={iWon} onRematch={handleRestartGame} />
        ) : (
          <div className="w-full max-w-sm sm:max-w-md">
            {gameState === 'playing' && (
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={20} />
                  <span className="font-sketch text-xl text-ink">
                    {currentTurn === socket?.id ? 'Your turn!' : "Opponent's turn"}
                  </span>
                </div>
              </div>
            )}

            {renderBoard()}

            {gameState === 'waiting' && (
              <div className="mt-4 text-center font-handwriting text-ink">Waiting for opponent...</div>
            )}

            <div className="mt-4 flex justify-center">
              <SketchButton onClick={handleLeaveRoom} className="text-sm px-3 py-1">
                Leave Room
              </SketchButton>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default TicTacToe;

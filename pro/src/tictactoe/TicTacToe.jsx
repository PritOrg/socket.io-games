import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import {
  SketchButton,
  SketchCard,
  sketchPopupClass,
  GameLayout,
  AvatarSelector,
  AvatarReactionBar,
} from '../components/ui';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useSocketListeners from '../hooks/useSocketListeners';
import useReconnection from '../hooks/useReconnection';

const TicTacToe = () => {
  const { socket, roomId, setRoomId, clearRoomId, setGamePrefix, profile, setProfile } = useGameContext();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winningCells, setWinningCells] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const navigate = useNavigate();

  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  const handleCreateRoom = useCallback(() => {
    if (!socket) return;
    socket.emit('ttt_createRoom', {
      playerName: profile.name,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
    });
  }, [socket, profile]);

  const handleJoinRoom = useCallback(async () => {
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
        playerName: profile.name,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
      });
    }
  }, [socket, profile]);

  const { clearReconnect } = useReconnection({
    socket,
    gamePrefix: 'ttt',
    roomId,
    onRestore: (room) => {
      if (!room) return;
      setRoomId(room.id);
      setPlayers(room.players || []);
      setGameState(room.gameState || 'waiting');
      setCurrentTurn(room.currentTurn);
      if (room.board) setBoard(room.board);
    },
  });

  useSocketListeners(
    socket,
    {
      ttt_roomInfo: ({ id, players, gameState, currentTurn, board }) => {
        setRoomId(id);
        setPlayers(players);
        setGameState(gameState);
        setCurrentTurn(currentTurn);
        if (board) setBoard(board);
        const playerIndex = players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== -1) {
          sessionStorage.setItem('ttt_reconnect', JSON.stringify({ roomId: id, playerId: players[playerIndex].id }));
        }
      },
      ttt_gameStarted: () => {
        setGameState('playing');
        setWinningCells([]);
        setLastMove(null);
        Swal.fire({
          title: 'Game Started!',
          text: 'Make your move!',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: sketchPopupClass },
        });
      },
      ttt_gameRestarted: () => {
        setGameState('waiting');
        setWinningCells([]);
        setBoard(Array(9).fill(null));
        setLastMove(null);
      },
      ttt_gameWon: ({ winningLine }) => {
        playWin();
        setWinningCells(winningLine);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });
        setGameState('ended');
        clearReconnect();
      },
      ttt_gameDraw: () => {
        setGameState('ended');
        clearReconnect();
      },
      ttt_playerLeft: () => {
        Swal.fire({
          title: 'Player Left',
          text: 'The opponent has left the party.',
          icon: 'warning',
          customClass: { popup: sketchPopupClass },
        });
        setGameState('waiting');
        setBoard(Array(9).fill(null));
        setLastMove(null);
      },
      ttt_alert: ({ icon, title, text }) => {
        Swal.fire({ icon, title, text, customClass: { popup: sketchPopupClass } });
      },
      server_shutdown: ({ message }) => {
        Swal.fire({
          title: 'Server Shutting Down',
          text: message || 'The server is going down for maintenance.',
          icon: 'info',
          customClass: { popup: sketchPopupClass },
        }).then(() => {
          clearReconnect();
          clearRoomId(roomId);
          navigate('/');
        });
      },
    },
    [clearRoomId, navigate, playWin, roomId],
  );

  useEffect(() => {
    if (!socket) return;
    setGamePrefix('ttt');
  }, [socket, setGamePrefix]);

  const handleCellClick = useCallback(
    (position) => {
      if (gameState === 'playing' && currentTurn === socket?.id && !board[position]) {
        socket.emit('ttt_makeMove', { roomId, position });
      }
    },
    [gameState, currentTurn, roomId, socket, board],
  );

  const handleRestartGame = useCallback(() => {
    socket.emit('ttt_restartGame', roomId);
  }, [roomId, socket]);

  const handleLeaveRoom = useCallback(async () => {
    const result = await Swal.fire({
      title: 'Leave Game?',
      text: 'Your progress will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Leave',
      cancelButtonText: 'Stay',
      customClass: { popup: sketchPopupClass },
    });
    if (!result.isConfirmed) return;
    socket.emit('ttt_leaveRoom', roomId);
    clearReconnect();
    clearRoomId(roomId);
    navigate('/');
  }, [roomId, socket, clearReconnect, clearRoomId, navigate]);

  const renderBoard = () => (
    <SketchCard className="p-3 sm:p-6">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 w-48 sm:w-64 md:w-80">
        {board.map((cell, i) => {
          const isLastMoveCell = lastMove && lastMove.position === i;
          return (
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
                ${isLastMoveCell ? 'ring-2 ring-sky-400 ring-offset-2' : ''}
                font-sketch
              `}
            >
              {cell || ''}
            </button>
          );
        })}
      </div>
    </SketchCard>
  );

  if (!roomId) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl sm:text-5xl font-sketch mb-6 text-ink">Tic Tac Toe</h1>
        <SketchCard className="p-6 max-w-md w-full mb-4">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-ink/30 rounded sketch-font text-ink bg-white/80"
          />
          <AvatarSelector
            avatarIcon={profile.avatarIcon}
            color={profile.color}
            onAvatarChange={(icon) => setProfile({ ...profile, avatarIcon: icon })}
            onColorChange={(c) => setProfile({ ...profile, color: c })}
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

  if (gameState === 'waiting') {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <SketchCard className="p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-handwriting text-ink flex items-center gap-2">
              <span>Room:</span>
              <span className="font-bold uppercase">{roomId}</span>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {players.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-2 sketch-border px-3 py-2">
                <span className="text-lg">{p.connected !== false ? '☑️' : '☐'}</span>
                <span className="font-handwriting text-ink flex-1 truncate">{p.name}</span>
                {idx === 0 && <span className="text-xs opacity-60">(You)</span>}
              </div>
            ))}
          </div>
        </SketchCard>

        <SketchButton onClick={handleRestartGame} disabled={players.length < 2} className="w-full">
          {players.length < 2 ? 'Waiting for opponent...' : 'Start Game'}
        </SketchButton>

        <SketchButton onClick={handleLeaveRoom} className="w-full mt-2" style={{ background: '#fff0f0' }}>
          Leave Room
        </SketchButton>
      </div>
    );
  }

  return (
    <GameLayout players={players}>
      <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sketch mb-4 sm:mb-8 text-ink">Tic Tac Toe</h1>

        {gameState !== 'waiting' && (
          <div className="w-full max-w-sm sm:max-w-md">
            {gameState === 'playing' && (
              <div className="mb-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-sketch text-xl text-ink">
                    {currentTurn === socket?.id ? 'Your turn!' : "Opponent's turn"}
                  </span>
                </div>
              </div>
            )}

            {renderBoard()}

            <div className="mt-4 flex justify-center">
              <SketchButton onClick={handleLeaveRoom} className="text-sm px-3 py-1">
                Leave Room
              </SketchButton>
            </div>
          </div>
        )}

        {gameState === 'ended' && (
          <div className="mt-4 text-center">
            <SketchButton onClick={handleRestartGame} className="text-sm px-3 py-1">
              Play Again
            </SketchButton>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <AvatarReactionBar socket={socket} roomId={roomId} gamePrefix="ttt" players={players} />
      )}
    </GameLayout>
  );
};

export default TicTacToe;

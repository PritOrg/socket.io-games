import React, { useState, useEffect } from 'react';
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
import { Trophy, Copy, Share2 } from 'lucide-react';
import { PlayerAvatar } from '../components/ui/AvatarSelector';

const TicTacToe = () => {
  const { socket, playerName, roomId, setRoomId, clearRoomId, profile, setProfile } = useGameContext();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [winningCells, setWinningCells] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
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

    socket.on('ttt_gameStarted', () => {
      setGameState('playing');
      setWinningCells([]);
      setLastMove(null);
    });

    socket.on('ttt_gameRestarted', () => {
      if (roomId) {
        setGameState('waiting');
        setWinningCells([]);
        setBoard(Array(9).fill(null));
        setLastMove(null);
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

    socket.on('ttt_moveMade', ({ board, lastMove }) => {
      playMove();
      setBoard(board);
      if (lastMove) setLastMove(lastMove);
    });

    socket.on('ttt_nextTurn', (playerId) => {
      setCurrentTurn(playerId);
    });

    socket.on('ttt_gameWon', ({ winningLine }) => {
      playWin();
      setWinningCells(winningLine);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
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
      setLastMove(null);
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
  }, [socket, setRoomId, playMove, playWin, roomId]);

  const handleCellClick = (position) => {
    if (gameState === 'playing' && currentTurn === socket?.id && !board[position]) {
      socket.emit('ttt_makeMove', { roomId, position });
    }
  };

  const handleCreateRoom = () => {
    socket.emit('ttt_createRoom', {
      playerName: profile.name || playerName,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
    });
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
        playerName: profile.name || playerName,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
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
            className="w-full sketch-border font-handwriting text-ink px-3 py-2 rounded mb-4"
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

  const renderBoard = () => (
    <SketchCard className="p-3 sm:p-6">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 w-48 sm:w-64 md:w-80">
        {board.map((cell, i) => {
          const isLastMoveCell = lastMove && lastMove.cellIndex === i;
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

  return (
    <GameLayout socket={socket} roomId={roomId} gamePrefix="ttt" players={players}>
      <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sketch mb-4 sm:mb-8 text-ink">Tic Tac Toe</h1>

        {gameState === 'waiting' && (
          <div className="max-w-sm w-full">
            <SketchCard className="p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-handwriting text-ink flex items-center gap-2">
                  <span>Room:</span>
                  <span className="font-bold uppercase">{roomId}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={async () => await navigator.clipboard.writeText(roomId)}
                    className="sketch-button px-2 py-1 text-xs"
                  >
                    <Copy size={14} />
                  </button>
                  {navigator.share && (
                    <button
                      onClick={() =>
                        navigator.share({
                          title: 'Join my TicTacToe room!',
                          text: `Room code: ${roomId}`,
                          url: window.location.href,
                        })
                      }
                      className="sketch-button px-2 py-1 text-xs"
                    >
                      <Share2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {players.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-2 sketch-border px-3 py-2">
                    <PlayerAvatar avatarIcon={p.avatarIcon} color={p.color} size={20} />
                    <span className="font-handwriting text-ink flex-1 truncate">{p.name}</span>
                    {idx === myPlayerIndex && <span className="text-xs opacity-60">(You)</span>}
                  </div>
                ))}
              </div>
            </SketchCard>

            {myPlayerIndex === 0 && (
              <SketchButton onClick={handleRestartGame} disabled={players.length < 2} className="w-full">
                {players.length < 2 ? 'Waiting for opponent...' : 'Start Game'}
              </SketchButton>
            )}

            <SketchButton onClick={handleLeaveRoom} className="w-full mt-2" style={{ background: '#fff0f0' }}>
              Leave Room
            </SketchButton>
          </div>
        )}

        {gameState !== 'waiting' && (
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

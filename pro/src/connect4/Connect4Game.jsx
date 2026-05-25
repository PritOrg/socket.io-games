import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GameLayout from '../components/ui/GameLayout';
import RoomLobby from '../components/ui/RoomLobby';
import MatchReport from '../components/ui/MatchReport';
import SketchButton from '../components/ui/SketchButton';
import TurnIndicator from '../components/ui/TurnIndicator';
import Swal from 'sweetalert2';

const Connect4Game = () => {
  const { socket, playerName, setPlayerName, clearRoomId } = useGameContext();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('lobby');
  const [room, setRoom] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('c4_reconnect');
    if (saved && socket) {
      const data = JSON.parse(saved);
      socket.emit('c4_reconnect', data);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('c4_roomInfo', (data) => {
      setRoom(data);
      sessionStorage.setItem(
        'c4_reconnect',
        JSON.stringify({
          roomId: data.id,
          playerId: data.players?.find((p) => p.name === playerName)?.id || socket.id,
        }),
      );
    });

    socket.on('c4_gameStarted', () => {
      setGameState('playing');
    });

    socket.on('c4_moveMade', (data) => {
      setRoom((prev) => ({ ...prev, ...data }));
    });

    socket.on('c4_gameOver', (_data) => {
      setGameState('ended');
    });

    socket.on('c4_gamePaused', () => {
      setGameState('paused');
    });

    socket.on('c4_gameRestarted', () => {
      setGameState('lobby');
    });

    socket.on('c4_alert', ({ icon, title, text }) => {
      Swal.fire({
        icon,
        title,
        text,
      });
    });

    return () => {
      socket.off('c4_roomInfo');
      socket.off('c4_gameStarted');
      socket.off('c4_moveMade');
      socket.off('c4_gameOver');
      socket.off('c4_gamePaused');
      socket.off('c4_gameRestarted');
      socket.off('c4_alert');
    };
  }, [socket, playerName]);

  const handleCreateRoom = () => {
    if (!socket || !playerName) return;
    socket.emit('c4_createRoom', { playerName });
  };

  const handleJoinRoom = (roomIdToJoin, asSpectator) => {
    if (!socket || !playerName) return;
    socket.emit('c4_joinRoom', { roomId: roomIdToJoin, playerName, asSpectator });
  };

  const handleStartGame = () => {
    if (!socket || !room) return;
    socket.emit('c4_startGame', { roomId: room.id });
  };

  const handleRestart = () => {
    if (!socket || !room) return;
    socket.emit('c4_restartGame', room.id);
  };

  const handleLeave = () => {
    if (!socket || !room) return;
    socket.emit('c4_leaveRoom', room.id);
    sessionStorage.removeItem('c4_reconnect');
    clearRoomId();
    setRoom(null);
    setGameState('lobby');
    navigate('/');
  };

  const handleColumnClick = (col) => {
    if (!room || gameState !== 'playing') return;
    const myPlayer = room.players.find((p) => p.name === playerName);
    if (!myPlayer || myPlayer.id !== room.currentTurn) return;

    socket.emit('c4_makeMove', { roomId: room.id, column: col });
  };

  const isSpectator = room?.spectators?.some((s) => s.name === playerName);
  const isHost = room && room.creator === (room.players.find((p) => p.name === playerName)?.id || '');

  if (gameState === 'ended' && room) {
    const myPlayer = room.players.find((p) => p.name === playerName);
    const isWinner = room.winner === myPlayer?.id;
    return <MatchReport winner={room.winner} isWinner={isWinner} onRematch={handleRestart} onLeave={handleLeave} />;
  }

  if (room && room.gameState === 'waiting') {
    return (
      <RoomLobby
        roomId={room.id}
        players={room.players}
        spectators={room.spectators}
        isHost={isHost}
        minPlayers={2}
        onStart={handleStartGame}
        onLeave={handleLeave}
        gameName="Connect 4"
      />
    );
  }

  if (room && gameState === 'playing') {
    const myPlayer = room.players.find((p) => p.name === playerName);
    const canPlay = myPlayer && myPlayer.id === room.currentTurn && !isSpectator;

    return (
      <GameLayout>
        <div className="flex flex-col items-center gap-4 p-4">
          {isSpectator && (
            <div className="sketch-card px-4 py-2 bg-blue-100">
              <span className="paper-font text-blue-700 font-semibold">👁️ Spectating</span>
            </div>
          )}

          <TurnIndicator players={room.players} currentTurn={room.currentTurn} />

          <div className="grid grid-cols-7 gap-1 p-4 sketch-card bg-blue-50" onMouseLeave={() => setHoverCol(null)}>
            {Array(7)
              .fill(null)
              .map((_, col) => (
                <div
                  key={col}
                  className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer flex items-center justify-center"
                  onClick={() => canPlay && handleColumnClick(col)}
                  onMouseEnter={() => canPlay && setHoverCol(col)}
                >
                  {hoverCol === col && canPlay && (
                    <div
                      className={`w-8 h-8 rounded-full opacity-50 ${
                        room.currentTurn === 0 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    />
                  )}
                </div>
              ))}

            <AnimatePresence>
              {room.board.map((row, r) =>
                row.map((cell, c) => {
                  if (cell === null) return null;
                  return (
                    <motion.div
                      key={`disc-${r}-${c}`}
                      initial={{ y: -100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full ${
                        cell === 0 ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{
                        gridRow: r + 1,
                        gridColumn: c + 1,
                      }}
                    />
                  );
                }),
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-7 gap-1 w-64 sm:w-72">
            {room.board[0].map((_, col) => (
              <button
                key={col}
                onClick={() => canPlay && handleColumnClick(col)}
                disabled={!canPlay}
                className="py-2 text-2xl font-sketch hover:bg-paper-dark rounded sketch-transition"
              >
                ⬇️
              </button>
            ))}
          </div>

          <SketchButton onClick={handleLeave} style={{ background: '#fff0f0' }}>
            Leave Room
          </SketchButton>
        </div>
      </GameLayout>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="sketch-card p-8 max-w-sm w-full space-y-6">
        <h2 className="text-2xl font-sketch text-center text-ink">Connect 4</h2>

        <div>
          <label className="paper-font text-sm text-ink/60">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter name"
            className="sketch-input w-full mt-1"
            maxLength={20}
          />
        </div>

        <SketchButton onClick={handleCreateRoom} className="w-full">
          Create Room
        </SketchButton>

        <div className="border-t border-ink/20 pt-4">
          <label className="paper-font text-sm text-ink/60">Join Room</label>
          <input
            type="text"
            placeholder="Room Code"
            className="sketch-input w-full mt-1 mb-2"
            maxLength={6}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const roomId = e.target.value.trim();
                if (roomId && playerName) handleJoinRoom(roomId);
              }
            }}
          />
          <SketchButton
            onClick={(e) => {
              const roomIdInput = e.target.previousElementSibling;
              if (roomIdInput?.value && playerName) handleJoinRoom(roomIdInput.value.trim());
            }}
            className="w-full"
          >
            Join as Player
          </SketchButton>
          <SketchButton
            onClick={(e) => {
              const roomIdInput = e.target.previousElementSibling.previousElementSibling;
              if (roomIdInput?.value && playerName) handleJoinRoom(roomIdInput.value.trim(), true);
            }}
            className="w-full mt-2"
            style={{ background: '#f0f8ff' }}
          >
            Join as Spectator
          </SketchButton>
        </div>
      </div>
    </div>
  );
};

export default Connect4Game;

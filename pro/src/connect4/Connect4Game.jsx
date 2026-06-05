import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/ui/GameLayout';
import RoomLobby from '../components/ui/RoomLobby';
import MatchReport from '../components/ui/MatchReport';
import SketchButton from '../components/ui/SketchButton';
import TurnIndicator from '../components/ui/TurnIndicator';
import { AvatarSelector, AvatarReactionBar, sketchPopupClass } from '../components/ui';
import Swal from 'sweetalert2';
import useSound from 'use-sound';

const Connect4Game = () => {
  const { socket, clearRoomId, setGamePrefix, profile, setProfile } = useGameContext();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('lobby');
  const [room, setRoom] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const reconnectAttempted = useRef(false);
  const joinRoomIdRef = useRef(null);
  const [lastMove, setLastMove] = useState(null);

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  useEffect(() => {
    if (!socket) return;

    setGamePrefix('c4');

    const saved = sessionStorage.getItem('c4_reconnect');
    if (saved && !reconnectAttempted.current) {
      reconnectAttempted.current = true;
      const data = JSON.parse(saved);
      socket.emit('c4_reconnect', data);
    }
  }, [socket, setGamePrefix]);

  useEffect(() => {
    if (!socket) return;

    // recovery: emit requestRoomInfo if roomId exists but we haven't received roomInfo yet
    if (room && !reconnectAttempted.current) {
      socket.emit('c4_requestRoomInfo', room.id);
    }

    socket.on('c4_roomInfo', (data) => {
      setRoom(data);
      if (data.gameState === 'playing') {
        setGameState('playing');
      }
      sessionStorage.setItem(
        'c4_reconnect',
        JSON.stringify({
          roomId: data.id,
          playerId: data.players?.find((p) => p.id === socket.id)?.id || socket.id,
        }),
      );
    });

    socket.on('c4_gameStarted', () => {
      setGameState('playing');
    });

    socket.on('c4_moveMade', (data) => {
      setRoom((prev) => ({ ...prev, ...data }));
      if (data.lastMove) {
        setLastMove(data.lastMove);
        playMove();
      }
    });

    socket.on('c4_gameOver', (data) => {
      setGameState('ended');
      if (data.winLine) {
        setWinLine(data.winLine.map((c) => `${c.row}-${c.col}`));
        playWin();
      }
    });

    socket.on('c4_gamePaused', () => {
      setGameState('paused');
    });

    socket.on('c4_gameRestarted', () => {
      setGameState('lobby');
      setWinLine(null);
    });

    socket.on('c4_alert', ({ icon, title, text }) => {
      Swal.fire({
        icon,
        title,
        text,
      });
    });

    socket.on('server_shutdown', ({ message }) => {
      Swal.fire({
        title: 'Server Shutting Down',
        text: message || 'The server is going down for maintenance.',
        icon: 'info',
        customClass: { popup: sketchPopupClass },
      }).then(() => {
        sessionStorage.removeItem('c4_reconnect');
        clearRoomId(room?.id);
        setRoom(null);
        setGameState('lobby');
        navigate('/');
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
      socket.off('server_shutdown');
    };
  }, [socket, room?.id, playMove, playWin, clearRoomId, navigate]);

  const handleCreateRoom = () => {
    if (!socket) return;
    socket.emit('c4_createRoom', {
      playerName: profile.name,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
    });
  };

  const handleJoinRoom = (roomIdToJoin, asSpectator) => {
    if (!socket) return;
    socket.emit('c4_joinRoom', {
      roomId: roomIdToJoin,
      playerName: profile.name,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
      asSpectator,
    });
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
    if (room.currentTurn !== socket?.id) return;

    socket.emit('c4_makeMove', { roomId: room.id, column: col });
  };

  const isSpectator = room?.spectators?.some((s) => s.id === socket?.id);
  const isHost = room && room.creator === socket?.id;

  if (gameState === 'ended' && room) {
    const isWinner = room.winner === socket?.id;
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
    const canPlay = room.currentTurn === socket?.id && !isSpectator;

    return (
      <GameLayout players={room.players}>
        <div className="flex flex-col items-center gap-4 p-4">
          {isSpectator && (
            <div className="sketch-card px-4 py-2 bg-blue-100">
              <span className="paper-font text-blue-700 font-semibold">👁️ Spectating</span>
            </div>
          )}

          <TurnIndicator players={room.players} currentTurn={room.currentTurn} />

          <div
            className="grid grid-cols-7 gap-1 p-4 sketch-card bg-blue-50 relative"
            style={{ width: 'fit-content' }}
            onMouseLeave={() => setHoverCol(null)}
          >
            {room.board.map((row, r) =>
              row.map((cell, c) => {
                const isWinning = winLine && winLine.includes(`${r}-${c}`);
                const isLastMove = lastMove && lastMove.row === r && lastMove.col === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-full flex items-center justify-center ${
                      isWinning ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-ink/20'
                    } ${isLastMove ? 'ring-2 ring-sky-400' : ''}`}
                  >
                    {cell !== null && (
                      <div className={`w-8 h-8 rounded-full ${cell === 0 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div className="grid grid-cols-7 gap-1 w-64 sm:w-72 relative" onMouseLeave={() => setHoverCol(null)}>
            {room.board[0].map((_, col) => (
              <button
                key={col}
                onClick={() => canPlay && handleColumnClick(col)}
                disabled={!canPlay}
                className="py-2 text-2xl font-sketch hover:bg-paper-dark rounded sketch-transition relative"
                onMouseEnter={() => canPlay && setHoverCol(col)}
              >
                {hoverCol === col && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                      room.currentTurn === 0 ? 'bg-red-500/30' : 'bg-yellow-500/30'
                    } rounded-full`}
                  />
                )}
                ⬇️
              </button>
            ))}
          </div>

          <SketchButton onClick={handleLeave} style={{ background: '#fff0f0' }}>
            Leave Room
          </SketchButton>
        </div>

        {gameState === 'playing' && (
          <AvatarReactionBar socket={socket} roomId={room.id} gamePrefix="c4" players={room.players} />
        )}
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
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Enter name"
            className="sketch-input w-full mt-1"
            maxLength={20}
          />
        </div>

        <AvatarSelector
          avatarIcon={profile.avatarIcon}
          color={profile.color}
          onAvatarChange={(icon) => setProfile({ ...profile, avatarIcon: icon })}
          onColorChange={(c) => setProfile({ ...profile, color: c })}
        />

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
            ref={joinRoomIdRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const roomId = e.target.value.trim();
                if (roomId) handleJoinRoom(roomId);
              }
            }}
          />
          <SketchButton
            onClick={() => {
              const roomIdInput = joinRoomIdRef.current?.value || '';
              if (roomIdInput) handleJoinRoom(roomIdInput.trim());
            }}
            className="w-full"
          >
            Join as Player
          </SketchButton>
          <SketchButton
            onClick={() => {
              const roomIdInput = joinRoomIdRef.current?.value || '';
              if (roomIdInput) handleJoinRoom(roomIdInput.trim(), true);
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

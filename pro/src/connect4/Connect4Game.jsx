import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/ui/GameLayout';
import GameLobby from '../components/ui/GameLobby';
import MatchReport from '../components/ui/MatchReport';
import SketchButton from '../components/ui/SketchButton';
import TurnIndicator from '../components/ui/TurnIndicator';
import { AvatarSelector, AvatarReactionBar, sketchPopupClass } from '../components/ui';
import useSocketListeners from '../hooks/useSocketListeners';
import useReconnection from '../hooks/useReconnection';
import Swal from 'sweetalert2';
import useSound from 'use-sound';

const Connect4Game = () => {
  const { socket, roomId, setRoomId, clearRoomId, setGamePrefix, profile, setProfile } = useGameContext();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('lobby');
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const [hoverCol, setHoverCol] = useState(null);
  const [winLine, setWinLine] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [board, setBoard] = useState([]);
  const joinRoomIdRef = useRef(null);

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  const handleCreateRoom = useCallback(() => {
    if (!socket) return;
    socket.emit('c4_createRoom', {
      playerName: profile.name,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
    });
  }, [socket, profile]);

  const handleJoinRoom = useCallback(
    (roomIdToJoin, asSpectator) => {
      if (!socket) return;
      socket.emit('c4_joinRoom', {
        roomId: roomIdToJoin,
        playerName: profile.name,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
        asSpectator,
      });
    },
    [socket, profile],
  );

  const { clearReconnect } = useReconnection({
    socket,
    gamePrefix: 'c4',
    roomId,
    onRestore: (room) => {
      if (!room) return;
      setRoomId(room.id);
      setPlayers(room.players || []);
      setSpectators(room.spectators || []);
      setGameState(room.gameState || 'lobby');
      setCurrentTurn(room.currentTurn);
      setBoard(room.board || []);
    },
  });

  useSocketListeners(
    socket,
    {
      c4_roomInfo: (data) => {
        setRoomId(data.id);
        setPlayers(data.players || []);
        setSpectators(data.spectators || []);
        setGameState(data.gameState);
        setCurrentTurn(data.currentTurn);
        setBoard(data.board || []);
        const myPlayer = data.players?.find((p) => p.id === socket.id);
        setMyPlayerIndex(myPlayer ? data.players.findIndex((p) => p.id === myPlayer.id) : -1);
      },
      c4_gameStarted: () => {
        setGameState('playing');
      },
      c4_moveMade: (data) => {
        setBoard(data.board || []);
        if (data.lastMove) {
          setLastMove(data.lastMove);
          playMove();
        }
      },
      c4_gameOver: (data) => {
        setGameState('ended');
        if (data.winLine) {
          setWinLine(data.winLine.map((c) => `${c.row}-${c.col}`));
          playWin();
        }
      },
      c4_gamePaused: () => {
        setGameState('paused');
      },
      c4_gameRestarted: () => {
        setGameState('waiting');
        setWinLine(null);
      },
      c4_alert: ({ icon, title, text }) => {
        Swal.fire({ icon, title, text });
      },
      c4_reconnectFailed: ({ reason, roomId: failedRoomId }) => {
        Swal.fire({
          title: 'Reconnection Failed',
          text:
            reason === 'room_not_found'
              ? 'The room no longer exists.'
              : reason === 'player_not_found'
                ? 'Your player session was not found.'
                : reason === 'game_already_ended'
                  ? 'The game has ended.'
                  : 'Could not reconnect to the game.',
          icon: 'error',
          customClass: { popup: sketchPopupClass },
        }).then(() => {
          clearReconnect();
          clearRoomId();
          setGameState('lobby');
          navigate('/');
        });
      },
      server_shutdown: ({ message }) => {
        Swal.fire({
          title: 'Server Shutting Down',
          text: message || 'The server is going down for maintenance.',
          icon: 'info',
          customClass: { popup: sketchPopupClass },
        }).then(() => {
          clearReconnect();
          clearRoomId();
          setGameState('lobby');
          navigate('/');
        });
      },
    },
    [clearRoomId, navigate, playMove, playWin, setRoomId],
  );

  useEffect(() => {
    if (!socket) return;
    setGamePrefix('c4');

    const saved = sessionStorage.getItem('c4_reconnect');
    if (saved) {
      const data = JSON.parse(saved);
      socket.emit('c4_reconnect', data);
    }
  }, [socket, setGamePrefix]);

  const handleStartGame = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('c4_startGame', { roomId });
  }, [socket, roomId]);

  const handleRestart = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('c4_restartGame', roomId);
  }, [socket, roomId]);

  const handleLeave = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('c4_leaveRoom', roomId);
    clearReconnect();
    clearRoomId();
    setGameState('lobby');
    navigate('/');
  }, [socket, roomId, clearReconnect, clearRoomId, navigate]);

  const handleColumnClick = useCallback(
    (col) => {
      if (!roomId || gameState !== 'playing') return;
      if (myPlayerIndex !== currentTurn) return;

      socket.emit('c4_makeMove', { roomId, column: col });
    },
    [roomId, gameState, myPlayerIndex, currentTurn, socket],
  );

  const isSpectator = spectators.some((s) => s.id === socket?.id);
  const isHost = players[0]?.id === socket?.id;

  if (gameState === 'ended') {
    const scores = players.map((p, idx) => ({
      name: p.name || `Player ${idx + 1}`,
      score: 0,
    }));
    return (
      <MatchReport winner={null} isWinner={false} scores={scores} onRematch={handleRestart} onNewRoom={handleLeave} />
    );
  }

  if (roomId && gameState === 'waiting') {
    return (
      <GameLobby
        gameName="Connect 4"
        roomId={roomId}
        players={players}
        spectators={spectators}
        isHost={!!isHost}
        minPlayers={2}
        onStart={handleStartGame}
        onLeave={handleLeave}
        showJoinInput
        startLabel="Start Game"
        profile={profile}
        onProfileChange={(next) => setProfile(next)}
      />
    );
  }

  if (roomId && gameState === 'playing') {
    const canPlay = myPlayerIndex === currentTurn && !isSpectator;

    return (
      <GameLayout players={players}>
        <div className="flex flex-col items-center gap-4 p-4">
          {isSpectator && (
            <div className="sketch-card px-4 py-2 bg-blue-100">
              <span className="paper-font text-blue-700 font-semibold">👁️ Spectating</span>
            </div>
          )}

          <TurnIndicator players={players} currentTurn={currentTurn} />

          <div
            className="grid grid-cols-7 gap-1 p-4 sketch-card bg-blue-50 relative"
            onMouseLeave={() => setHoverCol(null)}
          >
            {board.map((row, r) =>
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
            {board[0]?.map((_, col) => (
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
                      currentTurn === 0 ? 'bg-red-500/30' : 'bg-yellow-500/30'
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
          <AvatarReactionBar socket={socket} roomId={roomId} gamePrefix="c4" players={players} />
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
            onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter name"
            className="sketch-input w-full mt-1"
            maxLength={20}
          />
        </div>

        <AvatarSelector
          avatarIcon={profile.avatarIcon}
          color={profile.color}
          onAvatarChange={(icon) => setProfile((prev) => ({ ...prev, avatarIcon: icon }))}
          onColorChange={(c) => setProfile((prev) => ({ ...prev, color: c }))}
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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/ui/GameLayout';
import GameLobby from '../components/ui/GameLobby';
import MatchReport from '../components/ui/MatchReport';
import SketchButton from '../components/ui/SketchButton';
import TurnIndicator from '../components/ui/TurnIndicator';
import { sketchPopupClass, AvatarSelector } from '../components/ui';
import useSocketListeners from '../hooks/useSocketListeners';
import useReconnection from '../hooks/useReconnection';
import Swal from 'sweetalert2';

const SOSGame = () => {
  const { socket, playerName, roomId, setRoomId, clearRoomId, setGamePrefix, profile, setProfile } = useGameContext();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('lobby');
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('S');
  const [flashCells, setFlashCells] = useState([]);
  const [desiredSize, setDesiredSize] = useState(6);
  const [board, setBoard] = useState([]);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const joinRoomIdRef = useRef('');
  const roomLoadedRef = useRef(false);

  const handleCreateRoom = useCallback(() => {
    if (!socket) return;
    socket.emit('sos_createRoom', {
      playerName: profile.name || playerName,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
      size: desiredSize,
    });
  }, [socket, profile, playerName, desiredSize]);

  const handleJoinRoom = useCallback(
    (roomIdToJoin, asSpectator) => {
      if (!socket) return;
      socket.emit('sos_joinRoom', {
        roomId: roomIdToJoin,
        playerName: profile.name || playerName,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
        asSpectator,
      });
    },
    [socket, profile, playerName],
  );

  const { clearReconnect } = useReconnection({
    socket,
    gamePrefix: 'sos',
    roomId,
    onRestore: (room, myPlayer) => {
      if (!room) return;
      setRoomId(room.id);
      setPlayers(room.players || []);
      setSpectators(room.spectators || []);
      setGameState(room.gameState || 'lobby');
      setCurrentTurn(room.currentTurn);
      setBoard(room.board || []);
      setMyPlayerIndex(myPlayer ? (room.players || []).findIndex((p) => p.id === myPlayer.id) : -1);
    },
  });

  useSocketListeners(
    socket,
    {
      sos_roomInfo: (data) => {
        roomLoadedRef.current = true;
        setRoomId(data.id);
        setPlayers(data.players || []);
        setSpectators(data.spectators || []);
        setGameState(data.gameState);
        setCurrentTurn(data.currentTurn);
        setBoard(data.board || []);
        const myPlayer = data.players?.find((p) => p.id === socket.id);
        setMyPlayerIndex(myPlayer ? data.players.findIndex((p) => p.id === myPlayer.id) : -1);
      },
      sos_gameStarted: () => {
        setGameState('playing');
      },
      sos_moveMade: (data) => {
        setBoard(data.board || []);
        if (data.patterns && data.patterns.length > 0) {
          const cells = data.patterns.flatMap((p) => p.cells.map((c) => `${c.row}-${c.col}`));
          setFlashCells(cells);
          setTimeout(() => setFlashCells([]), 2000);
        }
      },
      sos_gameOver: () => {
        setGameState('ended');
      },
      sos_gamePaused: () => {
        setGameState('paused');
      },
      sos_gameRestarted: () => {
        setGameState('waiting');
        setSelectedSymbol('S');
        setBoard([]);
      },
      sos_alert: ({ icon, title, text }) => {
        Swal.fire({ icon, title, text });
      },
      server_shutdown: ({ message }) => {
        Swal.fire({
          title: 'Server Shutting Down',
          text: message || 'The server is going down for maintenance.',
          icon: 'info',
          customClass: { popup: sketchPopupClass },
        }).then(() => {
          sessionStorage.removeItem('sos_reconnect');
          clearRoomId();
          navigate('/');
        });
      },
    },
    [clearRoomId, navigate, setRoomId],
  );

  useEffect(() => {
    if (!socket) return;
    setGamePrefix('sos');

    const saved = sessionStorage.getItem('sos_reconnect');
    if (saved && !roomLoadedRef.current) {
      roomLoadedRef.current = true;
      const data = JSON.parse(saved);
      socket.emit('sos_reconnect', data);
    }
  }, [socket, setGamePrefix]);

  const handleStartGame = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('sos_startGame', { roomId });
  }, [socket, roomId]);

  const handleRestart = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('sos_restartGame', roomId);
  }, [socket, roomId]);

  const handleLeave = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit('sos_leaveRoom', roomId);
    clearReconnect();
    clearRoomId();
    setGameState('lobby');
    navigate('/');
  }, [socket, roomId, clearReconnect, clearRoomId, navigate]);

  const handleCellClick = useCallback(
    (row, col) => {
      if (!roomId || gameState !== 'playing') return;
      if (myPlayerIndex !== currentTurn) return;
      if (board[row]?.[col] !== null) return;

      socket.emit('sos_makeMove', { roomId, row, col, value: selectedSymbol });
    },
    [roomId, gameState, myPlayerIndex, currentTurn, board, selectedSymbol, socket],
  );

  const isSpectator = spectators.some((s) => s.id === socket?.id);
  const isHost = players[0]?.id === socket?.id;

  if (gameState === 'ended') {
    const scores = players.map((p, idx) => ({
      name: p.name || `Player ${idx + 1}`,
      score: p.score || 0,
    }));
    return (
      <MatchReport winner={null} isWinner={false} scores={scores} onRematch={handleRestart} onLeave={handleLeave} />
    );
  }

  if (roomId && gameState === 'waiting') {
    return (
      <GameLobby
        gameName="SOS"
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
    const size = board.length || desiredSize;
    return (
      <GameLayout players={players}>
        <div className="flex flex-col items-center gap-4 p-4">
          {isSpectator && (
            <div className="sketch-card px-4 py-2 bg-blue-100">
              <span className="paper-font text-blue-700 font-semibold">👁️ Spectating</span>
            </div>
          )}
          <TurnIndicator players={players} currentTurn={currentTurn} />
          <div className="paper-font text-sm text-ink/60">
            Moves: {board.flat().filter((c) => c).length} / {size * size}
          </div>
          <div
            className="grid gap-1 p-4 sketch-card"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(32px, 1fr))` }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isFlashing = flashCells.includes(`${r}-${c}`);
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    disabled={myPlayerIndex !== currentTurn}
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl font-sketch border-2 border-ink/20 hover:bg-paper-dark rounded sketch-transition ${
                      isFlashing ? 'bg-yellow-200' : ''
                    }`}
                  >
                    {cell && <span className={cell.player === 0 ? 'text-red-600' : 'text-blue-600'}>{cell.value}</span>}
                  </button>
                );
              }),
            )}
          </div>

          {!isSpectator && (
            <div className="flex gap-4">
              <SketchButton
                onClick={() => setSelectedSymbol('S')}
                style={{ background: selectedSymbol === 'S' ? '#fee2e2' : '#fff' }}
              >
                S
              </SketchButton>
              <SketchButton
                onClick={() => setSelectedSymbol('O')}
                style={{ background: selectedSymbol === 'O' ? '#dbeafe' : '#fff' }}
              >
                O
              </SketchButton>
            </div>
          )}

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
        <h2 className="text-2xl font-sketch text-center text-ink">SOS</h2>

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

        <div>
          <label className="paper-font text-sm text-ink/60">Board Size</label>
          <select
            className="sketch-input w-full mt-1"
            value={desiredSize}
            onChange={(e) => setDesiredSize(Number(e.target.value))}
          >
            <option value={4}>4x4 (Quick)</option>
            <option value={5}>5x5</option>
            <option value={6}>6x6 (Balanced)</option>
            <option value={7}>7x7 (Deeper)</option>
            <option value={8}>8x8 (Longest)</option>
          </select>
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
                if (roomId && profile.name) handleJoinRoom(roomId);
              }
            }}
          />
          <SketchButton
            onClick={() => {
              const roomIdInput = joinRoomIdRef.current?.value || '';
              if (roomIdInput && profile.name) handleJoinRoom(roomIdInput.trim());
            }}
            className="w-full"
          >
            Join as Player
          </SketchButton>
          <SketchButton
            onClick={() => {
              const roomIdInput = joinRoomIdRef.current?.value || '';
              if (roomIdInput && profile.name) handleJoinRoom(roomIdInput.trim(), true);
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

export default SOSGame;

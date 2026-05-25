import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../components/ui/GameLayout';
import RoomLobby from '../components/ui/RoomLobby';
import MatchReport from '../components/ui/MatchReport';
import SketchButton from '../components/ui/SketchButton';
import TurnIndicator from '../components/ui/TurnIndicator';
import Swal from 'sweetalert2';

const SOSGame = () => {
  const { socket, playerName, setPlayerName, clearRoomId } = useGameContext();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('lobby');
  const [room, setRoom] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('S');

  useEffect(() => {
    const saved = sessionStorage.getItem('sos_reconnect');
    if (saved && socket) {
      const data = JSON.parse(saved);
      socket.emit('sos_reconnect', data);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('sos_roomInfo', (data) => {
      setRoom(data);
      sessionStorage.setItem(
        'sos_reconnect',
        JSON.stringify({
          roomId: data.id,
          playerId: data.players?.find((p) => p.name === playerName)?.id || socket.id,
        }),
      );
    });

    socket.on('sos_gameStarted', () => {
      setGameState('playing');
    });

    socket.on('sos_moveMade', (data) => {
      setRoom((prev) => ({ ...prev, ...data }));
    });

    socket.on('sos_gameOver', (_data) => {
      setGameState('ended');
    });

    socket.on('sos_gamePaused', () => {
      setGameState('paused');
    });

    socket.on('sos_gameRestarted', () => {
      setGameState('lobby');
      setSelectedSymbol('S');
    });

    socket.on('sos_alert', ({ icon, title, text }) => {
      Swal.fire({
        icon,
        title,
        text,
      });
    });

    return () => {
      socket.off('sos_roomInfo');
      socket.off('sos_gameStarted');
      socket.off('sos_moveMade');
      socket.off('sos_gameOver');
      socket.off('sos_gamePaused');
      socket.off('sos_gameRestarted');
      socket.off('sos_alert');
    };
  }, [socket, playerName]);

  const handleCreateRoom = (size) => {
    if (!socket || !playerName) return;
    socket.emit('sos_createRoom', { playerName, size });
  };

  const handleJoinRoom = (roomIdToJoin, asSpectator) => {
    if (!socket || !playerName) return;
    socket.emit('sos_joinRoom', { roomId: roomIdToJoin, playerName, asSpectator });
  };

  const handleStartGame = () => {
    if (!socket || !room) return;
    socket.emit('sos_startGame', { roomId: room.id });
  };

  const handleRestart = () => {
    if (!socket || !room) return;
    socket.emit('sos_restartGame', room.id);
  };

  const handleLeave = () => {
    if (!socket || !room) return;
    socket.emit('sos_leaveRoom', room.id);
    sessionStorage.removeItem('sos_reconnect');
    clearRoomId();
    setRoom(null);
    setGameState('lobby');
    navigate('/');
  };

  const handleCellClick = (row, col) => {
    if (!room || gameState !== 'playing') return;
    const currentPlayer = room.players.find((p) => p.id === room.currentTurn);
    if (currentPlayer?.name !== playerName && !room.spectators?.find((s) => s.name === playerName)) return;

    const myPlayer = room.players.find((p) => p.name === playerName && p.connected);
    if (!myPlayer || myPlayer.id !== room.currentTurn) return;
    if (room.board[row][col] !== null) return;

    socket.emit('sos_makeMove', { roomId: room.id, row, col, value: selectedSymbol });
  };

  const isSpectator = room?.spectators?.some((s) => s.name === playerName);
  const isHost = room && room.creator === (room.players.find((p) => p.name === playerName)?.id || '');

  if (gameState === 'ended' && room) {
    const myPlayer = room.players.find((p) => p.name === playerName);
    const isWinner = room.winner === myPlayer?.id;
    return (
      <MatchReport
        winner={room.winner}
        isWinner={isWinner}
        scores={room.scores}
        onRematch={handleRestart}
        onLeave={handleLeave}
      />
    );
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
        gameName="SOS"
      />
    );
  }

  if (room && gameState === 'playing') {
    return (
      <GameLayout>
        <div className="flex flex-col items-center gap-4 p-4">
          {isSpectator && (
            <div className="sketch-card px-4 py-2 bg-blue-100">
              <span className="paper-font text-blue-700 font-semibold">👁️ Spectating</span>
            </div>
          )}
          <TurnIndicator players={room.players} currentTurn={room.currentTurn} scores={room.scores} />
          <div
            className="grid gap-1 p-4 sketch-card"
            style={{
              gridTemplateColumns: `repeat(${room.size}, minmax(32px, 1fr))`,
            }}
          >
            {room.board.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  disabled={
                    !room.players.find((p) => p.name === playerName)?.id ||
                    room.currentTurn !== room.players.find((p) => p.name === playerName)?.id
                  }
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl font-sketch border-2 border-ink/20 hover:bg-paper-dark rounded sketch-transition"
                >
                  {cell && <span className={cell.value === 'S' ? 'text-red-600' : 'text-blue-600'}>{cell.value}</span>}
                </button>
              )),
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
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter name"
            className="sketch-input w-full mt-1"
            maxLength={20}
          />
        </div>

        <div>
          <label className="paper-font text-sm text-ink/60">Board Size</label>
          <select
            className="sketch-input w-full mt-1"
            defaultValue={6}
            onChange={(e) => handleCreateRoom(Number(e.target.value))}
          >
            <option value={4}>4x4 (Quick)</option>
            <option value={5}>5x5</option>
            <option value={6}>6x6 (Balanced)</option>
            <option value={7}>7x7 (Deeper)</option>
            <option value={8}>8x8 (Longest)</option>
          </select>
        </div>

        <SketchButton onClick={() => handleCreateRoom(6)} className="w-full">
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

export default SOSGame;

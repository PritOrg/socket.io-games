import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Users, Trophy, SwatchBook, Timer } from 'lucide-react';
import { PlayerAvatar } from '../components/ui/AvatarSelector';
import logger from '../utils/logger';

const PLAYER_COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233'];

const Bingo = () => {
  const { socket, roomId, setRoomId, clearRoomId, profile, setProfile, setGamePrefix } = useGameContext();
  const [numbers, setNumbers] = useState(Array.from({ length: 25 }, (_, i) => i + 1));
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('waiting');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [strikedOut, setStrikedOut] = useState('');
  const [turnTimer, setTurnTimer] = useState(30);
  const navigate = useNavigate();

  const strikedNumbersRef = useRef([]);
  const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });
  const [playTurn] = useSound('/sounds/turn.mp3', { volume: 0.6 });

  useEffect(() => {
    let timerInterval;
    if (gameState === 'playing' && currentTurn === socket?.id && turnTimer > 0) {
      timerInterval = setInterval(() => {
        setTurnTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameState, currentTurn, socket?.id, turnTimer]);

  const generateBoard = useCallback(() => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums;
  }, []);

  const calculateBingoProgress = useCallback((boardNumbers) => {
    const size = 5;
    const lines = [];
    for (let i = 0; i < size; i++) {
      lines.push(Array.from({ length: size }, (_, j) => i * size + j));
    }
    for (let i = 0; i < size; i++) {
      lines.push(Array.from({ length: size }, (_, j) => i + j * size));
    }
    lines.push(Array.from({ length: size }, (_, i) => i * size + i));
    lines.push(Array.from({ length: size }, (_, i) => (i + 1) * size - (i + 1)));

    const completedLinesCount = lines.filter((line) =>
      line.every((idx) => typeof boardNumbers[idx] === 'string'),
    ).length;

    return 'BINGO'.slice(0, Math.min(completedLinesCount, 5));
  }, []);

  useEffect(() => {
    if (!socket) return;

    setGamePrefix('bingo');

    const saved = sessionStorage.getItem('bingo_reconnect');
    const hasSavedReconnect = saved && !roomId;
    if (hasSavedReconnect) {
      const { roomId: savedRoomId, playerId } = JSON.parse(saved);
      logger.socket('➡️', 'bingo_reconnect', { roomId: savedRoomId, playerId });
      socket.emit('bingo_reconnect', { roomId: savedRoomId, playerId });
      setRoomId(savedRoomId);
    }

    // recovery: emit requestRoomInfo if roomId exists but we haven't received roomInfo yet
    if (roomId && !hasSavedReconnect) {
      socket.emit('bingo_requestRoomInfo', roomId);
    }

    socket.on('bingo_roomInfo', ({ id, creator, players, gameState, currentTurn, strikedNumbers }) => {
      logger.socket('⬅️', 'bingo_roomInfo', { roomId: id, gameState });
      setRoomId(id);
      setPlayers(players);
      setGameState(gameState);
      setCurrentTurn(currentTurn);
      setIsCreator(creator === socket.id);

      if (gameState === 'playing' && players.length > 0) {
        const me = players.find((p) => p.id === socket.id);
        if (me) sessionStorage.setItem('bingo_reconnect', JSON.stringify({ roomId: id, playerId: me.id }));
      }

      if (strikedNumbers) {
        strikedNumbersRef.current = strikedNumbers;
      }
    });

    socket.on('bingo_playerBoard', ({ board }) => {
      logger.socket('⬅️', 'bingo_playerBoard', 'Received board from server');
      const savedBoard = localStorage.getItem(`bingo_board_${roomId}`);
      const rawBoard = savedBoard ? JSON.parse(savedBoard) : board;
      const sn = strikedNumbersRef.current;
      const updatedBoard = sn.length > 0 ? rawBoard.map((n) => (sn.includes(n) ? 'X' : n)) : rawBoard;
      setNumbers(updatedBoard);
      if (!savedBoard) {
        localStorage.setItem(`bingo_board_${roomId}`, JSON.stringify(board));
      }
    });

    socket.on('bingo_gamePaused', ({ reason }) => {
      logger.socket('⬅️', 'bingo_gamePaused', { reason });
      Swal.fire({
        title: 'Game Paused',
        text: reason,
        icon: 'warning',
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on('bingo_gameStarted', ({ firstPlayerId, playerBoards }) => {
      logger.socket('⬅️', 'bingo_gameStarted', { firstPlayerId });
      setGameState('playing');
      setCurrentTurn(firstPlayerId);
      setTurnTimer(30);
      setStrikedOut('');

      const myBoard = playerBoards?.[socket.id];
      if (myBoard) {
        setNumbers(myBoard);
        localStorage.setItem(`bingo_board_${roomId}`, JSON.stringify(myBoard));
      }

      Swal.fire({
        title: 'Eyes Down!',
        text: 'Bingo has started!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on('bingo_gameRestarted', () => {
      setGameState('ready');
      setStrikedOut('');
      sessionStorage.removeItem('bingo_reconnect');
      setNumbers((prev) => {
        const fresh = prev.map((n) => (typeof n === 'number' ? n : n));
        localStorage.setItem(`bingo_board_${roomId}`, JSON.stringify(fresh));
        return fresh;
      });
      Swal.fire({
        title: 'Game Restarted',
        text: 'Get ready for a new round!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on('bingo_numberMarked', ({ nextTurn, strikedNumbers }) => {
      setNumbers((prev) => prev.map((n) => (strikedNumbers.includes(n) ? 'X' : n)));
      setCurrentTurn(nextTurn);
      playPop();
    });

    socket.on('bingo_nextTurn', ({ nextPlayerId, timestamp }) => {
      setCurrentTurn(nextPlayerId);
      const elapsed = Math.floor((Date.now() - timestamp) / 1000);
      setTurnTimer(Math.max(0, 30 - elapsed));
      if (nextPlayerId === socket.id) {
        playTurn();
      }
    });

    socket.on('bingo_playerWon', ({ winner }) => {
      playWin();
      const playerColor = players.find((p) => p.id === winner)?.color || '#2a2a3e';
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [playerColor],
      });
      const winnerName = players.find((p) => p.id === winner)?.name || 'Someone';
      Swal.fire({
        title: 'BINGO!',
        text: `${winnerName} has achieved Bingo!`,
        icon: 'success',
        customClass: { popup: sketchPopupClass },
      });
      setGameState('ended');
      sessionStorage.removeItem('bingo_reconnect');
    });

    socket.on('bingo_playerLeft', (_playerId) => {
      Swal.fire({
        title: 'Player Left',
        text: 'A player has left the game.',
        icon: 'warning',
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on('bingo_alert', ({ icon, title, text }) => {
      if (title === 'Room Created') {
        Swal.fire({
          icon,
          title,
          text,
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: sketchPopupClass },
        });
      } else {
        Swal.fire({
          icon,
          title,
          text,
          customClass: { popup: sketchPopupClass },
        });
      }
    });

    socket.on('server_shutdown', ({ message }) => {
      Swal.fire({
        title: 'Server Shutting Down',
        text: message || 'The server is going down for maintenance.',
        icon: 'info',
        customClass: { popup: sketchPopupClass },
      }).then(() => {
        sessionStorage.removeItem('bingo_reconnect');
        clearRoomId(roomId);
        navigate('/');
      });
    });

    return () => {
      socket.off('bingo_roomInfo');
      socket.off('bingo_playerBoard');
      socket.off('bingo_gameStarted');
      socket.off('bingo_gameRestarted');
      socket.off('bingo_numberMarked');
      socket.off('bingo_nextTurn');
      socket.off('bingo_playerWon');
      socket.off('bingo_playerLeft');
      socket.off('bingo_gamePaused');
      socket.off('bingo_alert');
      socket.off('server_shutdown');
    };
  }, [socket, roomId, playPop, playWin, playTurn, generateBoard, players, setGamePrefix, clearRoomId, navigate]);

  useEffect(() => {
    if (gameState !== 'playing' || numbers.length !== 25) return;

    const progress = calculateBingoProgress(numbers);
    if (progress.length > strikedOut.length) {
      setStrikedOut(progress);
      if (progress === 'BINGO') {
        socket.emit('bingo_achieved', roomId);
      }
    }
  }, [socket, numbers, gameState, strikedOut, roomId, calculateBingoProgress]);

  const handleCellClick = (number) => {
    if (gameState !== 'playing') return;
    if (currentTurn !== socket?.id) return;
    if (typeof number === 'string') return;

    socket.emit('bingo_markNumber', { roomId, number });
  };

  const handleCreateRoom = () => {
    socket.emit('bingo_createRoom', {
      creatorName: profile.name,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
    });
  };

  const handleJoinRoom = async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: 'Join Bingo Room',
      input: 'text',
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      customClass: { popup: sketchPopupClass },
    });
    if (joinRoomId) {
      socket.emit('bingo_joinRoom', {
        roomId: joinRoomId.toUpperCase(),
        playerName: profile.name,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
      });
    }
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      Swal.fire({
        title: 'Wait!',
        text: 'Need at least 2 players!',
        icon: 'info',
      });
      return;
    }
    socket.emit('bingo_startGame', roomId);
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
        socket.emit('bingo_leaveRoom', roomId);
        sessionStorage.removeItem('bingo_reconnect');
        clearRoomId(roomId);
        navigate('/');
      }
    });
  };

  return (
    <GameLayout players={players}>
      <div className="flex flex-col items-center justify-center p-4 w-full">
        <h1 className="text-6xl font-sketch mb-8 text-ink">Bingo Party</h1>

        {!roomId ? (
          <SketchCard className="p-8 max-w-md w-full">
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
            <div className="flex gap-4 mt-4">
              <SketchButton onClick={handleCreateRoom}>Create Room</SketchButton>
              <SketchButton onClick={handleJoinRoom}>Join Room</SketchButton>
            </div>
          </SketchCard>
        ) : (
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 w-full">
              <SketchCard className="p-4 mb-8 flex justify-between items-center">
                <div className="font-handwriting text-ink flex items-center gap-2">
                  <SwatchBook size={18} className="text-ink" />
                  Room: <span className="font-bold text-ink uppercase">{roomId}</span>
                </div>
                <div className="flex gap-2">
                  {'BINGO'.split('').map((l, i) => (
                    <span
                      key={i}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all duration-500
                    ${i < strikedOut.length ? 'bg-green-500 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-400'}`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </SketchCard>

              <div className="grid grid-cols-5 gap-2 md:gap-4 aspect-square">
                {numbers.map((n, i) => (
                  <button
                    key={i}
                    onClick={() => handleCellClick(n)}
                    disabled={typeof n === 'string' || gameState !== 'playing' || currentTurn !== socket?.id}
                    className={`text-xl md:text-3xl font-handwriting flex items-center justify-center transition-all duration-300 rounded-xl
                    ${typeof n === 'string' ? 'bg-green-500 text-white rotate-12 animate-pulse' : 'hover:bg-gray-100 cursor-pointer'}
                    ${gameState === 'playing' && currentTurn === socket?.id && typeof n !== 'string' ? 'ring-2 ring-ink ring-offset-2' : ''}
                    sketch-border`}
                    style={{
                      color: typeof n === 'string' ? '#fff' : '#2a2a3e',
                      backgroundColor: typeof n === 'string' ? '#22c55e' : '#fffef9',
                    }}
                  >
                    {typeof n === 'string' ? '★' : n}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-64 flex flex-col gap-6">
              <SketchCard className="p-6">
                <h3 className="font-sketch text-2xl mb-4 flex items-center gap-2">
                  <Users size={24} className="text-ink" />
                  Players
                </h3>
                <div className="flex flex-col gap-3">
                  {players.map((p, i) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded-lg transition-all
                    ${p.id === currentTurn ? 'scale-105' : 'opacity-40'}`}
                      style={{ color: p.color || PLAYER_COLORS[i % PLAYER_COLORS.length] }}
                    >
                      <div className="flex items-center gap-2">
                        <PlayerAvatar avatarIcon={p.avatarIcon} color={p.color} size={20} />
                        <span className="font-bold font-handwriting truncate flex-1">{p.name}</span>
                      </div>
                      {p.id === socket?.id && <span className="text-xs text-gray-500">(You)</span>}
                      {p.id === currentTurn && <Users size={16} className="text-ink animate-pulse" />}
                    </div>
                  ))}
                </div>
              </SketchCard>

              {isCreator && gameState === 'ready' && (
                <SketchButton
                  onClick={handleStartGame}
                  className="w-full text-xl py-4 animate-pulse flex items-center justify-center gap-2 bg-green-50"
                >
                  Start Party!
                </SketchButton>
              )}

              {(gameState === 'ready' || gameState === 'playing') && (
                <SketchButton onClick={handleLeaveRoom} className="w-full text-sm py-2 mt-2">
                  Leave Room
                </SketchButton>
              )}

              {gameState === 'playing' && (
                <SketchCard className="p-6 text-center">
                  <div className="text-sm font-handwriting text-gray-500 mb-1 flex items-center justify-center gap-1">
                    <Timer size={14} />
                    Time Remaining
                  </div>
                  <div
                    className={`text-4xl font-bold font-handwriting ${turnTimer < 10 ? 'text-red-500 animate-ping' : 'text-ink'}`}
                  >
                    {turnTimer}s
                  </div>
                  {currentTurn === socket?.id && (
                    <div className="mt-2 text-ink flex items-center justify-center gap-1 text-lg font-bold animate-bounce">
                      <Trophy size={18} />
                      Your Turn!
                    </div>
                  )}
                </SketchCard>
              )}
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <AvatarReactionBar socket={socket} roomId={roomId} gamePrefix="bingo" players={players} />
      )}
    </GameLayout>
  );
};

export default Bingo;

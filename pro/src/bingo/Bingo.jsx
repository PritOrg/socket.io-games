import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import RetroButton from '../components/ui/RetroButton';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, SwatchBook, Timer } from 'lucide-react';
import logger from '../utils/logger';

const Bingo = () => {
  const { socket, playerName, roomId, setRoomId } = useGameContext();
  const [numbers, setNumbers] = useState(() => {
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    return nums.sort(() => Math.random() - 0.5);
  });
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('waiting');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [strikedOut, setStrikedOut] = useState('');
  const [turnTimer, setTurnTimer] = useState(30);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const navigate = useNavigate();

  const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });
  const [playTurn] = useSound('/sounds/turn.mp3', { volume: 0.6 });

  useEffect(() => {
    let timerInterval;
    if (gameState === 'playing' && currentTurn === socket?.id && turnTimer > 0) {
      timerInterval = setInterval(() => {
        setTurnTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameState, currentTurn, socket?.id, turnTimer]);

  useEffect(() => {
    if (!socket) return;

    const saved = sessionStorage.getItem('bingo_reconnect');
    if (saved) {
      const { roomId: savedRoomId, playerId } = JSON.parse(saved);
      logger.socket('➡️', 'bingo_reconnect', { roomId: savedRoomId, playerId });
      socket.emit('bingo_reconnect', { roomId: savedRoomId, playerId });
    }

    socket.on('bingo_roomInfo', ({ id, creator, players, gameState, currentTurn }) => {
      logger.socket('⬅️', 'bingo_roomInfo', { roomId: id, gameState });
      setRoomId(id);
      setPlayers(players);
      setGameState(gameState);
      setCurrentTurn(currentTurn);
      setIsCreator(creator === socket.id);

      const playerIndex = players.findIndex(p => p.id === socket.id);
      setMyPlayerIndex(playerIndex);

      if (gameState === 'playing' && players.length > 0) {
        const me = players.find(p => p.id === socket.id);
        if (me) sessionStorage.setItem('bingo_reconnect', JSON.stringify({ roomId: id, playerId: me.id }));
      }
    });

    socket.on('bingo_gamePaused', ({ reason }) => {
      logger.socket('⬅️', 'bingo_gamePaused', { reason });
      Swal.fire({
        title: 'Game Paused',
        text: reason,
        icon: 'warning',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('bingo_gameStarted', (firstPlayerId) => {
      setGameState('playing');
      setCurrentTurn(firstPlayerId);
      setTurnTimer(30);
      Swal.fire({
        title: 'Eyes Down!',
        text: 'Bingo has started!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('bingo_gameRestarted', () => {
      setNumbers(Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5));
      setStrikedOut('');
      setGameState('ready');
      Swal.fire({
        title: 'Game Restarted',
        text: 'New card generated!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('bingo_numberMarked', ({ number, playerId }) => {
      setNumbers(prev => prev.map(n => n === number ? 'X' : n));
      playPop();
    });

    socket.on('bingo_nextTurn', (nextPlayerId) => {
      setCurrentTurn(nextPlayerId);
      setTurnTimer(30);
      if (nextPlayerId === socket.id) {
        playTurn();
      }
    });

    socket.on('bingo_playerWon', (winnerId) => {
      playWin();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      const winnerName = players.find(p => p.id === winnerId)?.name || 'Someone';
      Swal.fire({
        title: 'BINGO!',
        text: `${winnerName} has achieved Bingo!`,
        icon: 'success',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
      setGameState('ended');
      sessionStorage.removeItem('bingo_reconnect');
    });

    socket.on('bingo_playerLeft', (playerId) => {
      Swal.fire({
        title: 'Player Left',
        text: 'A player has left the game.',
        icon: 'warning',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('bingo_alert', ({ icon, title, text }) => {
      Swal.fire({ icon, title, text, customClass: { popup: 'glass rounded-3xl paper-font' } });
    });

    return () => {
      socket.off('bingo_roomInfo');
      socket.off('bingo_gameStarted');
      socket.off('bingo_gameRestarted');
      socket.off('bingo_numberMarked');
      socket.off('bingo_nextTurn');
      socket.off('bingo_playerWon');
      socket.off('bingo_playerLeft');
      socket.off('bingo_gamePaused');
      socket.off('bingo_alert');
    };
  }, [socket, players, setRoomId, playPop, playWin, playTurn]);

  const checkForWin = useCallback(() => {
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

    const completedLinesCount = lines.filter(line => line.every(cell => typeof numbers[cell] === 'string')).length;
    const newStrikedOut = 'BINGO'.slice(0, Math.min(completedLinesCount, 5));

    if (newStrikedOut.length > strikedOut.length) {
      setStrikedOut(newStrikedOut);
      if (newStrikedOut === 'BINGO') {
        socket.emit('bingo_achieved', roomId);
      }
    }
  }, [numbers, strikedOut, roomId, socket]);

  useEffect(() => {
    checkForWin();
  }, [numbers, checkForWin]);

  const handleCellClick = (number) => {
    if (gameState !== 'playing') return;
    if (currentTurn !== socket?.id) return;
    if (typeof number === 'string') return;

    socket.emit('bingo_markNumber', { roomId, number });
  };

  const handleCreateRoom = () => {
    socket.emit('bingo_createRoom', playerName);
  };

  const handleJoinRoom = async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: 'Join Bingo Room',
      input: 'text',
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      customClass: { popup: 'glass rounded-3xl paper-font' }
    });
    if (joinRoomId) {
      socket.emit('bingo_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
    }
  };

  const handleStartGame = () => {
    if (players.length < 2) {
      Swal.fire({ title: 'Wait!', text: 'Need at least 2 players!', icon: 'info' });
      return;
    }
    socket.emit('bingo_startGame', roomId);
  };

  const handleRestartGame = () => {
    socket.emit('bingo_restartGame', roomId);
  };

  const handleLeaveRoom = () => {
    Swal.fire({
      title: 'Leave Game?',
      text: "Are you sure you want to leave?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      customClass: { popup: 'glass rounded-3xl paper-font' }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Leaving...',
          text: 'Are you absolutely sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, leave now',
          cancelButtonText: 'Stay',
          customClass: { popup: 'glass rounded-3xl paper-font' }
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            socket.emit('bingo_leaveRoom', roomId);
            sessionStorage.removeItem('bingo_reconnect');
            setRoomId(null);
            setPlayers([]);
            setGameState('waiting');
            setCurrentTurn(null);
            setNumbers(Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5));
            setStrikedOut('');
            setIsCreator(false);
          }
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <RetroButton 
        onClick={() => navigate('/')} 
        variant="secondary" 
        className="absolute top-8 left-8 flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back
      </RetroButton>

      <h1 className="text-6xl hand-drawn mb-8 text-purple-600">Bingo Party</h1>

      {!roomId ? (
        <div className="flex gap-4">
          <RetroButton onClick={handleCreateRoom}>Create Room</RetroButton>
          <RetroButton onClick={handleJoinRoom} variant="secondary">Join Room</RetroButton>
        </div>
      ) : (
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full">
            <div className="glass p-4 rounded-2xl mb-8 flex justify-between items-center">
              <div className="paper-font text-gray-600 flex items-center gap-2">
                <SwatchBook size={18} className="text-purple-500" />
                Room: <span className="font-bold text-purple-600 uppercase">{roomId}</span>
              </div>
              <div className="flex gap-2">
                {'BINGO'.split('').map((l, i) => (
                  <span key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-all duration-500 
                    ${i < strikedOut.length ? 'bg-green-500 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                    {l}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-4 aspect-square">
              {numbers.map((n, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(n)}
                  disabled={typeof n === 'string' || gameState !== 'playing' || currentTurn !== socket?.id}
                  className={`glass text-xl md:text-3xl paper-font flex items-center justify-center transition-all duration-300 rounded-xl
                    ${typeof n === 'string' ? 'bg-purple-500/50 text-white rotate-12' : 'hover:bg-white/40 cursor-pointer'}
                    ${gameState === 'playing' && currentTurn === socket?.id && typeof n !== 'string' ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
                >
                  {typeof n === 'string' ? '★' : n}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-64 flex flex-col gap-6">
            <div className="glass p-6 rounded-2xl">
              <h3 className="hand-drawn text-2xl mb-4 flex items-center gap-2">
                <Users size={24} className="text-purple-500" />
                Players
              </h3>
              <div className="flex flex-col gap-3">
                {players.map(p => (
                  <div key={p.id} className={`flex items-center justify-between p-2 rounded-lg transition-all
                    ${p.id === currentTurn ? 'bg-purple-100 scale-105 ring-2 ring-purple-400' : 'opacity-70'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.id === currentTurn ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}`} />
                      <span className="font-bold paper-font truncate flex-1">{p.name}</span>
                      {p.id === socket?.id && <span className="text-xs text-gray-500">(You)</span>}
                    </div>
                    {p.id === currentTurn && <Users size={16} className="text-purple-500 animate-pulse" />}
                  </div>
                ))}
              </div>
            </div>

            {isCreator && gameState === 'ready' && (
              <RetroButton onClick={handleStartGame} variant="success" className="w-full text-xl py-4 animate-pulse flex items-center justify-center gap-2">
                🚀 Start Party!
              </RetroButton>
            )}

            {(gameState === 'ready' || gameState === 'playing') && (
              <RetroButton onClick={handleLeaveRoom} variant="secondary" className="w-full text-sm py-2 mt-2">
                Leave Room
              </RetroButton>
            )}

            {gameState === 'playing' && (
              <div className="glass p-6 rounded-2xl text-center">
                <div className="text-sm paper-font text-gray-500 mb-1 flex items-center justify-center gap-1">
                  <Timer size={14} />
                  Time Remaining
                </div>
                <div className={`text-4xl font-bold paper-font ${turnTimer < 10 ? 'text-red-500 animate-ping' : 'text-purple-600'}`}>
                  {turnTimer}s
                </div>
              {currentTurn === socket?.id && (
                <div className="mt-2 text-purple-600 flex items-center justify-center gap-1 text-lg font-bold animate-bounce">
                  <Trophy size={18} />
                  Your Turn!
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bingo;

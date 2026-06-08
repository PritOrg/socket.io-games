import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import {
  SketchButton,
  SketchCard,
  sketchPopupClass,
  GameLayout,
  AvatarSelector,
  ScoreBoard,
  AvatarReactionBar,
  MatchReport,
  GameLobby,
} from '../components/ui';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, Grid3X3, Sparkles } from 'lucide-react';
import MacroGrid from './components/MacroGrid';
import useSocketListeners from '../hooks/useSocketListeners';
import useReconnection from '../hooks/useReconnection';
import logger from '../utils/logger';

const PLAYER_COLORS = ['#1a1a2e', '#c73e1d'];

const UTTTGame = () => {
  const { socket, roomId, setRoomId, clearRoomId, profile, setProfile, setGamePrefix } = useGameContext();
  const [players, setPlayers] = useState([]);
  const [spectators, setSpectators] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [gameState, setGameState] = useState('waiting');
  const [board, setBoard] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
  );
  const [macroBoard, setMacroBoard] = useState(Array(9).fill(null));
  const [activeGrid, setActiveGrid] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [lastMove, setLastMove] = useState(null);
  const setMySymbol = useState(null)[1];
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const navigate = useNavigate();

  const [playMove] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playWin] = useSound('/sounds/win.mp3', { volume: 0.7 });

  const handleCreateRoom = useCallback(() => {
    if (!socket) return;
    logger.socket('➡️', 'uttt_createRoom', { playerName: profile.name });
    socket.emit('uttt_createRoom', {
      playerName: profile.name,
      avatarIcon: profile.avatarIcon,
      color: profile.color,
    });
  }, [socket, profile]);

  const handleJoinRoom = useCallback(async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: 'Join UTTT Room',
      input: 'text',
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      customClass: { popup: sketchPopupClass },
    });
    if (joinRoomId) {
      logger.socket('➡️', 'uttt_joinRoom', { roomId: joinRoomId.toUpperCase() });
      socket.emit('uttt_joinRoom', {
        roomId: joinRoomId.toUpperCase(),
        playerName: profile.name,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
      });
    }
  }, [socket, profile]);

  const { clearReconnect } = useReconnection({
    socket,
    gamePrefix: 'uttt',
    roomId,
    onRestore: (room) => {
      if (!room) return;
      setRoomId(room.id);
      setPlayers(room.players || []);
      setGameState(room.gameState || 'waiting');
      setCurrentTurn(room.currentTurn);
      if (room.board) setBoard(room.board);
      if (room.macroBoard) setMacroBoard(room.macroBoard);
      if (room.activeGrid !== undefined) setActiveGrid(room.activeGrid);
      if (room.scores) setScores(room.scores);
      if (room.lastMove) setLastMove(room.lastMove);
      const playerIndex = room.players.findIndex((p) => p.id === room.currentTurn);
      if (playerIndex !== -1) {
        setMySymbol(playerIndex === 0 ? 'X' : 'O');
        setMyPlayerIndex(playerIndex);
      }
    },
  });

  useSocketListeners(
    socket,
    {
      uttt_roomInfo: (room) => {
        logger.socket('⬅️', 'uttt_roomInfo', { roomId: room.id, gameState: room.gameState });
        setRoomId(room.id);
        setPlayers(room.players);
        setSpectators(room.spectators || []);
        setGameState(room.gameState);
        setCurrentTurn(room.currentTurn);
        if (room.board) setBoard(room.board);
        if (room.macroBoard) setMacroBoard(room.macroBoard);
        if (room.activeGrid !== undefined) setActiveGrid(room.activeGrid);
        if (room.scores) setScores(room.scores);
        if (room.lastMove) setLastMove(room.lastMove);

        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== -1) {
          setMySymbol(playerIndex === 0 ? 'X' : 'O');
          setMyPlayerIndex(playerIndex);
          sessionStorage.setItem(
            'uttt_reconnect',
            JSON.stringify({
              roomId: room.id,
              playerId: room.players[playerIndex].id,
            }),
          );
        }
      },
      uttt_gamePaused: ({ reason }) => {
        logger.socket('⬅️', 'uttt_gamePaused', { reason });
        Swal.fire({
          title: 'Game Paused',
          text: reason,
          icon: 'warning',
          customClass: { popup: sketchPopupClass },
        });
      },
      uttt_gameState: (room) => {
        logger.socket('⬅️', 'uttt_gameState', { gameState: room.gameState });
        setGameState(room.gameState);
        setCurrentTurn(room.currentTurn);
        setBoard(room.board);
        setMacroBoard(room.macroBoard);
        setActiveGrid(room.activeGrid);
        setScores(room.scores);
        setLastMove(room.lastMove);
      },
      uttt_gameStarted: () => {
        logger.socket('⬅️', 'uttt_gameStarted', 'Game started!');
        setGameState('playing');
        setBoard(
          Array(9)
            .fill(null)
            .map(() => Array(9).fill(null)),
        );
        setMacroBoard(Array(9).fill(null));
        setActiveGrid(null);
        setScores({ X: 0, O: 0 });
        setLastMove(null);
        Swal.fire({
          title: 'Game Started!',
          html: '<div class="font-handwriting">Ultimate Tic-Tac-Toe begins!</div>',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: sketchPopupClass },
        });
      },
      uttt_gameOver: ({ winner, symbol, scores, reason }) => {
        logger.socket('⬅️', 'uttt_gameOver', { winner, symbol, scores, reason });
        playWin();

        if (reason === 'macro_win') {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#1a1a2e', '#c73e1d', '#2d4a8f'],
          });
          setTimeout(() => {
            confetti({
              particleCount: 100,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
            });
          }, 250);
          setTimeout(() => {
            confetti({
              particleCount: 100,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
            });
          }, 400);
        } else {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        let winnerName;
        if (reason === 'tiebreaker' && scores.X === scores.O) {
          winnerName = "No one - it's a tie!";
        } else if (winner) {
          winnerName = players.find((p) => p.id === winner)?.name || 'Someone';
        } else {
          winnerName = symbol || 'Someone';
        }

        const reasonText =
          reason === 'macro_win' ? ' achieved a Macro Victory!' : ` won by grids (${scores.X} - ${scores.O})!`;
        Swal.fire({
          title: '🏆 Victory! 🏆',
          html: `<div class="font-handwriting text-lg">${winnerName}${reasonText}</div>`,
          icon: 'success',
          confirmButtonText: 'Awesome!',
          customClass: { popup: sketchPopupClass },
        });

        setGameState('ended');
        clearReconnect();
      },
      uttt_error: ({ message }) => {
        logger.socket('⬅️', 'uttt_error', { message });
        Swal.fire({
          title: 'Oops!',
          text: message,
          icon: 'error',
          customClass: { popup: sketchPopupClass },
        });
      },
      uttt_playerLeft: ({ playerId }) => {
        logger.socket('⬅️', 'uttt_playerLeft', { playerId });
        Swal.fire({
          title: 'Player Left',
          text: 'Your opponent has left the game.',
          icon: 'warning',
          customClass: { popup: sketchPopupClass },
        });
        setGameState('waiting');
        setBoard(
          Array(9)
            .fill(null)
            .map(() => Array(9).fill(null)),
        );
        setMacroBoard(Array(9).fill(null));
        setActiveGrid(null);
      },
      uttt_alert: ({ icon, title, text }) => {
        Swal.fire({
          title,
          text,
          icon,
          customClass: { popup: sketchPopupClass },
        });
      },
      uttt_reconnectFailed: ({ reason, roomId: failedRoomId }) => {
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
          clearRoomId(failedRoomId);
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
          clearRoomId(roomId);
          navigate('/');
        });
      },
    },
    [clearRoomId, clearReconnect, navigate, playWin, players, roomId, setRoomId],
  );

  const handleCellClick = useCallback(
    (gridIndex, squareIndex) => {
      if (gameState === 'playing' && currentTurn === socket?.id) {
        if (activeGrid !== null && activeGrid !== gridIndex) return;
        if (board[gridIndex][squareIndex] !== null) return;

        playMove();
        logger.socket('➡️', 'uttt_makeMove', { roomId, gridIndex, squareIndex });
        socket.emit('uttt_makeMove', { roomId, gridIndex, squareIndex });
      }
    },
    [gameState, currentTurn, socket, activeGrid, board, playMove, roomId],
  );

  const handleStartGame = useCallback(() => {
    if (!socket || !roomId) return;
    logger.socket('➡️', 'uttt_startGame', { roomId });
    socket.emit('uttt_startGame', roomId);
  }, [socket, roomId]);

  const handleLeaveRoom = useCallback(async () => {
    const result = await Swal.fire({
      title: 'Leave Game?',
      text: 'Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      customClass: { popup: sketchPopupClass },
    });
    if (result.isConfirmed) {
      socket.emit('uttt_leaveRoom', roomId);
      clearReconnect();
      clearRoomId(roomId);
      navigate('/');
    }
  }, [roomId, socket, clearReconnect, clearRoomId, navigate]);

  const handleRestartGame = useCallback(() => {
    logger.socket('➡️', 'uttt_restartGame', { roomId });
    socket.emit('uttt_restartGame', roomId);
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket) return;
    setGamePrefix('uttt');
    logger.info('UTTT', `Socket connected: ${socket.id}`);
  }, [socket, setGamePrefix]);

  const isSpectator = spectators?.some((s) => s.id === socket?.id);
  const isHost = players[0]?.id === socket?.id;

  if (gameState === 'ended') {
    const scoresList = [
      { name: players[0]?.name || 'Player 1', score: scores.X || 0 },
      { name: players[1]?.name || 'Player 2', score: scores.O || 0 },
    ];
    return (
      <MatchReport
        winner={null}
        isWinner={false}
        scores={scoresList}
        players={players}
        onRematch={handleRestartGame}
        onNewRoom={handleLeaveRoom}
      />
    );
  }

  if (roomId && gameState === 'waiting') {
    return (
      <GameLobby
        gameName="Ultimate Tic-Tac-Toe"
        roomId={roomId}
        players={players}
        spectators={spectators || []}
        isHost={!!isHost}
        minPlayers={2}
        onStart={handleStartGame}
        onLeave={handleLeaveRoom}
        showJoinInput
        startLabel="Start Game"
        profile={profile}
        onProfileChange={(next) => setProfile(next)}
      />
    );
  }

  return (
    <GameLayout players={players}>
      <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
        {/* Title with sketch effect */}
        <div className="text-center mb-3 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-sketch mb-1 sm:mb-2 text-ink flex items-center gap-2 sm:gap-3 justify-center">
            <Grid3X3 className="w-6 h-6 sm:w-8 sm:h-8 text-ink" />
            <span className="hidden sm:inline">Ultimate Tic-Tac-Toe</span>
            <span className="sm:hidden">UTTT</span>
          </h1>
          <p className="font-handwriting text-xs sm:text-sm text-gray-600 hidden sm:block">
            Win three grids in a row to claim victory!
          </p>
        </div>

        {!roomId ? (
          <SketchCard className="p-6 sm:p-8 max-w-md w-full" style={{ background: '#fffef9' }}>
            <div className="text-center mb-6">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-ink" />
              <h2 className="font-sketch text-xl sm:text-2xl text-ink mb-2">Ready to Play?</h2>
              <p className="font-handwriting text-sm text-gray-600">Create a new game or join an existing one</p>
            </div>

            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
              className="w-full sketch-border font-handwriting text-ink px-3 py-2 rounded mb-4"
            />
            <AvatarSelector
              avatarIcon={profile.avatarIcon}
              color={profile.color}
              onAvatarChange={(icon) => setProfile((prev) => ({ ...prev, avatarIcon: icon }))}
              onColorChange={(c) => setProfile((prev) => ({ ...prev, color: c }))}
            />

            <div className="flex gap-3 sm:gap-4 flex-col sm:flex-row mt-4">
              <SketchButton
                onClick={handleCreateRoom}
                className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 flex-1"
              >
                Create Room
              </SketchButton>
              <SketchButton onClick={handleJoinRoom} className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 flex-1">
                Join Room
              </SketchButton>
            </div>
          </SketchCard>
        ) : (
          <div className="w-full max-w-sm sm:max-w-2xl md:max-w-3xl">
            {/* Game Info Card */}
            <SketchCard className="p-3 sm:p-4 mb-3 sm:mb-6 flex flex-col gap-3" style={{ background: '#fffef9' }}>
              {/* Room ID and Score */}
              <div className="flex justify-between items-center">
                <div className="font-handwriting text-ink flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                  <Grid3X3 size={14} className="sm:w-[18px] text-ink" />
                  <span className="hidden sm:inline">Room:</span>
                  <span className="font-bold text-ink uppercase tracking-wider">{roomId}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-300/30">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: PLAYER_COLORS[0] }} />
                    <span className="font-bold text-sm sm:text-lg" style={{ color: PLAYER_COLORS[0] }}>
                      {scores.X}
                    </span>
                  </div>
                  <span className="text-gray-400 font-bold">:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm sm:text-lg" style={{ color: PLAYER_COLORS[1] }}>
                      {scores.O}
                    </span>
                    <div className="w-2 h-2 rounded-full" style={{ background: PLAYER_COLORS[1] }} />
                  </div>
                </div>
              </div>

              {/* Players */}
              <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm justify-center">
                {players.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 border ${
                      p.id === currentTurn
                        ? 'bg-white border-2 scale-105 shadow-md'
                        : 'bg-white/30 border-gray-300/30 opacity-60'
                    }`}
                    style={{
                      borderColor: p.id === currentTurn ? PLAYER_COLORS[i] : undefined,
                    }}
                  >
                    {p.id === currentTurn && <Sparkles size={12} className="sm:w-4 text-yellow-500 animate-pulse" />}
                    <span
                      className="font-bold font-handwriting text-xs sm:text-base"
                      style={{ color: PLAYER_COLORS[i] }}
                    >
                      {p.name.length > 8 ? p.name.slice(0, 8) + '...' : p.name}
                    </span>
                    <span className="text-[10px] sm:text-xs opacity-60">({i === 0 ? 'X' : 'O'})</span>
                    {i === myPlayerIndex && (
                      <span className="text-[10px] bg-yellow-100 px-1.5 rounded text-yellow-700 font-bold">You</span>
                    )}
                  </div>
                ))}
              </div>
            </SketchCard>

            {/* Game Board */}
            <div className="mb-4 sm:mb-6">
              <MacroGrid
                board={board}
                macroBoard={macroBoard}
                activeGrid={activeGrid}
                lastMove={lastMove}
                onCellClick={handleCellClick}
              />
            </div>

            {/* ScoreBoard */}
            <div className="mb-4">
              <ScoreBoard
                players={players}
                scores={{ X: scores.X || 0, O: scores.O || 0 }}
                currentTurn={currentTurn}
                myPlayerIndex={myPlayerIndex}
                lastMove={lastMove}
                orientation="horizontal"
              />
            </div>

            {/* Game Status */}
            <div className="text-center font-handwriting text-sm sm:text-lg text-ink flex flex-col items-center gap-3">
              {gameState === 'playing' ? (
                currentTurn === socket?.id ? (
                  <div className="flex items-center gap-2 sm:gap-3 text-ink animate-pulse bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-ink shadow-lg">
                    <Trophy size={20} className="sm:w-6 text-yellow-500" />
                    <span className="font-sketch text-base sm:text-xl">Your Turn!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 bg-white/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-300/30">
                    <div className="flex items-center gap-2 text-ink">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">
                        Waiting for {players.find((p) => p.id === currentTurn)?.name || 'opponent'}
                        ...
                      </span>
                      <span className="sm:hidden">Opponent&apos;s turn...</span>
                    </div>
                  </div>
                )
              ) : gameState === 'waiting' ? (
                <div className="bg-white/50 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-gray-300/30">
                  <span className="text-xs sm:text-base flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    Waiting for opponent...
                  </span>
                </div>
              ) : (
                <SketchButton onClick={handleRestartGame} className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                  Play Again
                </SketchButton>
              )}

              {(gameState === 'waiting' || gameState === 'playing') && (
                <SketchButton
                  onClick={handleLeaveRoom}
                  className="mt-2 text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 opacity-70 hover:opacity-100"
                >
                  Leave Room
                </SketchButton>
              )}
            </div>

            {/* Grid hint */}
            {activeGrid !== null && gameState === 'playing' && (
              <div className="text-center mt-4 font-handwriting text-xs sm:text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200/50">
                📍 You must play in grid {activeGrid + 1}
              </div>
            )}
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <AvatarReactionBar socket={socket} roomId={roomId} gamePrefix="uttt" players={players} />
      )}
    </GameLayout>
  );
};

export default UTTTGame;

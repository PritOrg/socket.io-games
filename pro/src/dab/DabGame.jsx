import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameContext } from '../context/GameContext';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import RetroButton from '../components/ui/RetroButton';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, SwatchBook, Plus, Minus, RotateCcw, Undo2 } from 'lucide-react';
import logger from '../utils/logger';

const PLAYER_COLORS = ['#3B82F6', '#EF4444', '#22C55E', '#F97316'];
const PLAYER_TAILWIND = ['blue-500', 'red-500', 'green-500', 'orange-500'];

const DabGame = () => {
  const { socket, playerName, roomId, setRoomId } = useGameContext();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('waiting');
  const [currentTurn, setCurrentTurn] = useState(0);
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [horizontalLines, setHorizontalLines] = useState([]);
  const [verticalLines, setVerticalLines] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [scores, setScores] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [mode, setMode] = useState('classic');
  const [customRows, setCustomRows] = useState(5);
  const [customCols, setCustomCols] = useState(5);
  const [customPlayers, setCustomPlayers] = useState(2);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [redoRequest, setRedoRequest] = useState(null);

  const [playLine] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playBox] = useSound('/sounds/win.mp3', { volume: 0.7 });

  const reconnectAttempted = useRef(false);

  useEffect(() => {
    if (!socket) return;

    const saved = sessionStorage.getItem('dab_reconnect');
    if (saved && !reconnectAttempted.current) {
      reconnectAttempted.current = true;
      const { roomId: savedRoomId, playerId } = JSON.parse(saved);
      logger.socket('➡️', 'dab_reconnect', { roomId: savedRoomId, playerId });
      socket.emit('dab_reconnect', { roomId: savedRoomId, playerId });
      setRoomId(savedRoomId);
      return;
    }

    socket.on('dab_roomInfo', (room) => {
      logger.socket('⬅️', 'dab_roomInfo', { roomId: room.id, gameState: room.gameState });
      setRoomId(room.id);
      setPlayers(room.players);
      setGameState(room.gameState);
      setCurrentTurn(room.currentTurn);
      setRows(room.rows);
      setCols(room.cols);
      setHorizontalLines(room.horizontalLines);
      setVerticalLines(room.verticalLines);
      setBoxes(room.boxes);
      setScores(room.scores);
      setLastMove(room.lastMove);
      setIsPaused(room.gameState === 'paused');

      const idx = room.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        setMyPlayerIndex(idx);
        sessionStorage.setItem('dab_reconnect', JSON.stringify({ roomId: room.id, playerId: room.players[idx].id }));
      }
    });

    socket.on('dab_gameStarted', ({ firstTurn }) => {
      logger.socket('⬅️', 'dab_gameStarted', { firstTurn });
      setGameState('playing');
      setIsPaused(false);
      Swal.fire({
        title: 'Game Started!',
        text: 'Draw lines to claim boxes!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('dab_gameRestarted', () => {
      logger.socket('⬅️', 'dab_gameRestarted', 'Game restarted');
      setGameState('waiting');
      setCurrentTurn(0);
      setHorizontalLines(rowsArray => Array(rows).fill(null).map(() => Array(cols).fill(null)));
      setVerticalLines(rowsArray => Array(rows).fill(null).map(() => Array(cols + 1).fill(null)));
      setBoxes(rowsArray => Array(rows).fill(null).map(() => Array(cols).fill(null)));
      setScores(Array(players.length).fill(0));
      setLastMove(null);
      setIsPaused(false);
      Swal.fire({
        title: 'Game Restarted',
        text: 'New game starting!',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('dab_moveResult', ({ lineType, r, c, claimedBoxes, scores: newScores, currentTurn: newTurn, playerIndex: movePlayerIndex }) => {
       logger.socket('⬅️', 'dab_moveResult', { claimedBoxes, scores: newScores });
       playLine();

       setHorizontalLines(prev => {
         const copy = prev.map(row => [...row]);
         if (lineType === 'h') copy[r][c] = movePlayerIndex;
         return copy;
       });
       setVerticalLines(prev => {
         const copy = prev.map(row => [...row]);
         if (lineType === 'v') copy[r][c] = movePlayerIndex;
         return copy;
       });

       if (claimedBoxes.length > 0) {
         playBox();
         setBoxes(prev => {
           const copy = prev.map(row => [...row]);
           for (const box of claimedBoxes) {
             copy[box.r][box.c] = movePlayerIndex;
           }
           return copy;
         });
       }

      setScores(newScores);
      setCurrentTurn(newTurn);
    });

    socket.on('dab_gameOver', ({ winner, scores: finalScores, winners }) => {
      logger.socket('⬅️', 'dab_gameOver', { winner, winners });
      setGameState('ended');
      setScores(finalScores);
      sessionStorage.removeItem('dab_reconnect');

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      if (winner) {
        const winnerName = players.find(p => p.id === winner)?.name || 'Player';
        Swal.fire({
          title: 'Victory!',
          text: `${winnerName} wins!`,
          icon: 'success',
          customClass: { popup: 'glass rounded-3xl paper-font' }
        });
      } else {
        Swal.fire({
          title: "It's a Tie!",
          text: 'Multiple players share the top score!',
          icon: 'info',
          customClass: { popup: 'glass rounded-3xl paper-font' }
        });
      }
    });

    socket.on('dab_playerLeft', ({ playerId }) => {
      logger.socket('⬅️', 'dab_playerLeft', { playerId });
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, connected: false } : p));
    });

    socket.on('dab_gamePaused', ({ reason }) => {
      logger.socket('⬅️', 'dab_gamePaused', { reason });
      setIsPaused(true);
      Swal.fire({
        title: 'Game Paused',
        text: reason,
        icon: 'warning',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('dab_redoRequest', ({ requesterId, requesterName, targetId }) => {
      logger.socket('⬅️', 'dab_redoRequest', { requesterId, requesterName, targetId });
      setRedoRequest({ requesterId, requesterName, targetId });
      Swal.fire({
        title: 'Redo Request',
        text: `${requesterName} wants to undo their last move. Accept?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Accept',
        cancelButtonText: 'Reject',
        customClass: { popup: 'glass rounded-3xl paper-font' }
      }).then((result) => {
        socket.emit('dab_respondRedo', { roomId, accept: result.isConfirmed });
        setRedoRequest(null);
      });
    });

    socket.on('dab_redoAccepted', ({ lineType, r, c, claimedBox, scores: newScores, currentTurn: newTurn }) => {
      logger.socket('⬅️', 'dab_redoAccepted', { lineType, r, c, claimedBox });
      setHorizontalLines(prev => {
        const copy = prev.map(row => [...row]);
        if (lineType === 'h') copy[r][c] = null;
        return copy;
      });
      setVerticalLines(prev => {
        const copy = prev.map(row => [...row]);
        if (lineType === 'v') copy[r][c] = null;
        return copy;
      });
      if (claimedBox) {
        setBoxes(prev => {
          const copy = prev.map(row => [...row]);
          copy[claimedBox.r][claimedBox.c] = null;
          return copy;
        });
      }
      setScores(newScores);
      setCurrentTurn(newTurn);
      setLastMove(null);
      Swal.fire({
        title: 'Redo Accepted',
        text: 'Move has been undone.',
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: 'glass rounded-3xl paper-font' }
      });
    });

    socket.on('dab_redoResponse', ({ accepted, requesterId, requesterName, reason }) => {
      logger.socket('⬅️', 'dab_redoResponse', { accepted, requesterName, reason });
      if (!accepted) {
        Swal.fire({
          title: 'Redo Rejected',
          text: reason || `${requesterName || 'Player'} rejected the redo request.`,
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'glass rounded-3xl paper-font' }
        });
      }
    });

    socket.on('dab_alert', ({ icon, title, text }) => {
      logger.socket('⬅️', 'dab_alert', { icon, title, text });
      Swal.fire({ icon, title, text, customClass: { popup: 'glass rounded-3xl paper-font' } });
    });

    return () => {
      socket.off('dab_roomInfo');
      socket.off('dab_gameStarted');
      socket.off('dab_gameRestarted');
      socket.off('dab_moveResult');
      socket.off('dab_gameOver');
      socket.off('dab_playerLeft');
      socket.off('dab_gamePaused');
      socket.off('dab_alert');
      socket.off('dab_redoRequest');
      socket.off('dab_redoAccepted');
      socket.off('dab_redoResponse');
    };
  }, [socket, players, setRoomId, playLine, playBox]);

  const handleCreateRoom = () => {
    let r = rows, c = cols, maxP = customPlayers;
    if (mode === 'custom') {
      r = customRows;
      c = customCols;
      maxP = customPlayers;
    }
    logger.socket('➡️', 'dab_createRoom', { mode, customRows: r, customCols: c, customPlayers: maxP, playerName });
    socket.emit('dab_createRoom', { mode, customRows: r, customCols: c, customPlayers: maxP, playerName });
  };

  const handleJoinRoom = async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: 'Join Room',
      input: 'text',
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      customClass: { popup: 'glass rounded-3xl paper-font' }
    });
    if (joinRoomId) {
      logger.socket('➡️', 'dab_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
      socket.emit('dab_joinRoom', { roomId: joinRoomId.toUpperCase(), playerName });
    }
  };

  const handleLineClick = useCallback((lineType, r, c, e) => {
    e.stopPropagation();
    logger.socket('➡️', 'dab_makeMove', { roomId, lineType, r, c, gameState, currentTurn, myPlayerIndex });
    if (gameState !== 'playing' || isPaused) return;
    if (currentTurn !== myPlayerIndex) return;

    socket.emit('dab_makeMove', { roomId, lineType, r, c });
  }, [gameState, isPaused, currentTurn, myPlayerIndex, roomId, socket]);

  const handleRestartGame = () => {
    logger.socket('➡️', 'dab_restartGame', { roomId, playerId: socket.id });
    socket.emit('dab_restartGame', roomId);
  };

  const handleLeaveRoom = () => {
    Swal.fire({
      title: 'Leave Game?',
      text: "Are you sure you want to leave? Your opponent will win by default.",
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
            socket.emit('dab_leaveRoom', roomId);
            sessionStorage.removeItem('dab_reconnect');
            setRoomId(null);
            setPlayers([]);
            setGameState('waiting');
            setBoxes([]);
            setHorizontalLines([]);
            setVerticalLines([]);
            setScores([]);
            setMyPlayerIndex(-1);
            setIsPaused(false);
          }
        });
      }
    });
  };

  const spacing = 40;
  const dotRadius = 4;
  const lineWidth = 3;
  const hitLineWidth = 16;
  const svgWidth = cols * spacing;
  const svgHeight = rows * spacing;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4">
      <RetroButton
        onClick={() => navigate('/')}
        variant="secondary"
        className="absolute top-2 sm:top-8 left-2 sm:left-8 flex items-center gap-1 sm:gap-2 text-xs sm:text-base px-2 sm:px-4"
      >
        <ArrowLeft size={14} className="sm:w-[18px]" />
        <span className="hidden sm:inline">Back</span>
      </RetroButton>

      <h1 className="text-3xl sm:text-5xl md:text-6xl hand-drawn mb-4 sm:mb-8 text-blue-600">Dots & Boxes</h1>

      {!roomId ? (
        <div className="w-full max-w-md">
          <div className="glass p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 space-y-4">
            <div>
              <label className="paper-font text-gray-600 text-sm mb-1 block">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 paper-font"
              >
                <option value="classic">Classic (9×9)</option>
                <option value="extended">Extended (14×14)</option>
                <option value="marathon">Marathon (19×19)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {mode === 'custom' && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="paper-font text-gray-600 text-sm mb-1 block">Rows (1-30)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={customRows}
                      onChange={(e) => setCustomRows(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                      className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 paper-font"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="paper-font text-gray-600 text-sm mb-1 block">Cols (1-30)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={customCols}
                      onChange={(e) => setCustomCols(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                      className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 paper-font"
                    />
                  </div>
                </div>
                <div>
                  <label className="paper-font text-gray-600 text-sm mb-1 block">Players (2-4)</label>
                  <input
                    type="number"
                    min={2}
                    max={4}
                    value={customPlayers}
                    onChange={(e) => setCustomPlayers(Math.max(2, Math.min(4, parseInt(e.target.value) || 2)))}
                    className="w-full bg-white/50 border border-gray-300 rounded-lg px-3 py-2 paper-font"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <RetroButton onClick={handleCreateRoom} className="flex-1 text-sm sm:text-base px-3 py-2">Create Room</RetroButton>
              <RetroButton onClick={handleJoinRoom} variant="secondary" className="flex-1 text-sm sm:text-base px-3 py-2">Join Room</RetroButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <div className="glass p-2 sm:p-4 rounded-xl sm:rounded-2xl mb-3 sm:mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="paper-font text-gray-600 flex items-center gap-2 text-xs sm:text-base">
                <SwatchBook size={14} className="sm:w-[18px] text-blue-500" />
                <span className="hidden sm:inline">Room:</span>
                <span className="font-bold text-blue-600 uppercase">{roomId}</span>
              </div>
              <RetroButton onClick={handleLeaveRoom} variant="secondary" className="text-xs px-2 py-1">
                Leave
              </RetroButton>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-3">
              {players.map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 paper-font text-xs sm:text-sm px-3 py-1 rounded-full transition-all ${
                    i === currentTurn && gameState === 'playing' && !isPaused
                      ? `bg-${PLAYER_TAILWIND[i]}/20 scale-105 ring-2 ring-${PLAYER_TAILWIND[i]}`
                      : 'opacity-60'
                  } ${!p.connected ? 'grayscale' : ''}`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAYER_COLORS[i] }} />
                  <span className="font-bold">{p.name.length > 10 ? p.name.slice(0, 10) + '...' : p.name}</span>
                  {i === myPlayerIndex && <span className="text-xs text-gray-500">(You)</span>}
                  <span className="font-mono text-sm">{scores[i] || 0}</span>
                  {!p.connected && <span className="text-gray-400 text-xs">(DC)</span>}
                  {i === currentTurn && gameState === 'playing' && !isPaused && p.connected && (
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: PLAYER_COLORS[i] }} />
                  )}
                </div>
              ))}
            </div>

            {gameState === 'playing' && !isPaused && (
              <div className="text-center paper-font text-xs sm:text-sm text-gray-700">
                {currentTurn === myPlayerIndex ? (
                  <div className="flex items-center justify-center gap-2 animate-bounce">
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: PLAYER_COLORS[myPlayerIndex] }} />
                    <span className="text-blue-600 font-bold text-lg">Your turn!</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: PLAYER_COLORS[currentTurn] || '#3B82F6' }} />
                      <span className="text-gray-600">Waiting for <span className="font-bold">{players[currentTurn]?.name}</span>...</span>
                    </div>
                    {lastMove && myPlayerIndex === (currentTurn + 1) % players.length && (
                      <RetroButton
                        onClick={() => {
                          logger.socket('➡️', 'dab_requestRedo', { roomId });
                          socket.emit('dab_requestRedo', roomId);
                        }}
                        variant="secondary"
                        className="text-xs px-2 py-1 flex items-center gap-1"
                      >
                        <Undo2 size={12} />
                        Request Redo
                      </RetroButton>
                    )}
                  </div>
                )}
              </div>
            )}
            {isPaused && (
              <div className="text-center paper-font text-sm text-yellow-600 font-bold animate-pulse">
                Game Paused — Waiting for players to reconnect
              </div>
            )}
            {gameState === 'ended' && (
              <div className="text-center paper-font text-sm text-green-600 font-bold">
                Game Over!
              </div>
            )}
            {gameState === 'ended' && (
              <RetroButton onClick={handleRestartGame} className="mt-2 mx-auto">
                Play Again
              </RetroButton>
            )}
          </div>

          <div className="glass p-2 sm:p-4 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center">
            <TransformWrapper
              initialScale={Math.min(1, 600 / Math.max(svgWidth, svgHeight))}
              minScale={0.3}
              maxScale={3}
              limitToBounds
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <div className="relative w-full h-full">
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button onClick={() => zoomIn(0.2)} className="bg-white/80 rounded-full p-1 shadow hover:bg-white"><Plus size={16} /></button>
                    <button onClick={() => zoomOut(0.2)} className="bg-white/80 rounded-full p-1 shadow hover:bg-white"><Minus size={16} /></button>
                    <button onClick={() => resetTransform()} className="bg-white/80 rounded-full p-1 shadow hover:bg-white"><RotateCcw size={16} /></button>
                  </div>
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <div className="select-none pointer-events-none" style={{ touchAction: 'none', minWidth: svgWidth, minHeight: svgHeight }}>
                  <svg
                    className="pointer-events-auto block"
                    width={svgWidth}
                    height={svgHeight}
                    viewBox={`-20 -20 ${svgWidth + 40} ${svgHeight + 40}`}
                  >
                    {boxes.map((row, r) =>
                      row.map((boxOwner, c) =>
                        boxOwner !== null ? (
                          <rect
                            key={`box-${r}-${c}`}
                            x={c * spacing}
                            y={r * spacing}
                            width={spacing}
                            height={spacing}
                            fill={PLAYER_COLORS[boxOwner]}
                            opacity={0.3}
                          />
                        ) : null
                      )
                    )}

                    {Array.from({ length: rows + 1 }, (_, r) =>
                      Array.from({ length: cols }, (_, c) => {
                        const owner = horizontalLines[r]?.[c];
                        return (
                          <g key={`h-${r}-${c}`}>
                            {owner !== null && (
                              <line
                                x1={c * spacing}
                                y1={r * spacing}
                                x2={(c + 1) * spacing}
                                y2={r * spacing}
                                stroke={PLAYER_COLORS[owner]}
                                strokeWidth={lineWidth}
                                vectorEffect="non-scaling-stroke"
                              />
                            )}
                            <line
                              x1={c * spacing}
                              y1={r * spacing}
                              x2={(c + 1) * spacing}
                              y2={r * spacing}
                              stroke="transparent"
                              strokeWidth={hitLineWidth}
                              style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                              onPointerDown={(e) => { e.stopPropagation(); handleLineClick('h', r, c, e); }}
                            />
                          </g>
                        );
                      })
                    )}

                    {Array.from({ length: rows }, (_, r) =>
                      Array.from({ length: cols + 1 }, (_, c) => {
                        const owner = verticalLines[r]?.[c];
                        return (
                          <g key={`v-${r}-${c}`}>
                            {owner !== null && (
                              <line
                                x1={c * spacing}
                                y1={r * spacing}
                                x2={c * spacing}
                                y2={(r + 1) * spacing}
                                stroke={PLAYER_COLORS[owner]}
                                strokeWidth={lineWidth}
                                vectorEffect="non-scaling-stroke"
                              />
                            )}
                            <line
                              x1={c * spacing}
                              y1={r * spacing}
                              x2={c * spacing}
                              y2={(r + 1) * spacing}
                              stroke="transparent"
                              strokeWidth={hitLineWidth}
                              style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                              onPointerDown={(e) => { e.stopPropagation(); handleLineClick('v', r, c, e); }}
                            />
                          </g>
                        );
                      })
                    )}

                    {Array.from({ length: rows + 1 }, (_, r) =>
                      Array.from({ length: cols + 1 }, (_, c) => (
                        <circle
                          key={`dot-${r}-${c}`}
                          cx={c * spacing}
                          cy={r * spacing}
                          r={dotRadius}
                          fill="#333"
                          vectorEffect="non-scaling-stroke"
                          style={{ pointerEvents: 'none' }}
                        />
                      ))
                    )}
                  </svg>
                </div>
              </TransformComponent>
                </div>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
    </div>
  );
};

export default DabGame;

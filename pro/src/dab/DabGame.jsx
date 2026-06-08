import React, { useState, useEffect, useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import GameLobby from '../components/ui/GameLobby';
import MatchReport from '../components/ui/MatchReport';
import UndoUI from '../components/ui/UndoUI';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SketchButton, SketchCard, sketchPopupClass, GameLayout, AvatarReactionBar } from '../components/ui';
import useSound from 'use-sound';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Plus, Minus, RotateCcw, Undo2 } from 'lucide-react';
import { PlayerAvatar } from '../components/ui/AvatarSelector';
import useReconnection from '../hooks/useReconnection';
import useSocketListeners from '../hooks/useSocketListeners';
import logger from '../utils/logger';
import DabPreGame from './DabPreGame';

const PLAYER_COLORS = ['#1a1a2e', '#c73e1d', '#2d4a8f', '#2f5233'];

const addWobble = (x1, y1, x2, y2, seed = 0) => {
  const segments = 8;
  const wobbleAmount = 1.5;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const offsetX = Math.sin(seed + i * 2.3) * wobbleAmount;
    const offsetY = Math.cos(seed + i * 1.7) * wobbleAmount;
    points.push(`${x + offsetX},${y + offsetY}`);
  }
  return `M ${points[0]} ${points
    .slice(1)
    .map((p) => `L ${p}`)
    .join(' ')}`;
};

const DabGame = () => {
  const { socket, playerName, roomId, setRoomId, clearRoomId, setGamePrefix, profile, setProfile } = useGameContext();
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
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [redoRequest, setRedoRequest] = useState(null);

  const [playLine] = useSound('/sounds/move.mp3', { volume: 0.5 });
  const [playBox] = useSound('/sounds/win.mp3', { volume: 0.7 });

  const handleLeave = useCallback(() => {
    Swal.fire({
      title: 'Leave Game?',
      text: 'Are you sure you want to leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      cancelButtonText: 'Stay',
      customClass: { popup: sketchPopupClass },
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit('dab_leaveRoom', roomId);
        sessionStorage.removeItem('dab_reconnect');
        clearRoomId(roomId);
        navigate('/');
      }
    });
  }, [socket, clearRoomId, navigate, roomId]);

  const handleStart = useCallback(
    ({ rows: gameRows, cols: gameCols }) => {
      setRows(gameRows);
      setCols(gameCols);
      socket.emit('dab_startGame', { roomId, rows: gameRows, cols: gameCols });
    },
    [roomId, socket],
  );

  const handleJoin = useCallback(
    (roomIdValue) => {
      socket.emit('dab_joinRoom', {
        roomId: roomIdValue,
        playerName: profile.name || playerName,
        avatarIcon: profile.avatarIcon,
        color: profile.color,
      });
    },
    [playerName, profile, socket],
  );

  const { clearReconnect } = useReconnection({
    socket,
    gamePrefix: 'dab',
    roomId,
    onRestore: (room) => {
      if (!room) return;
      setRoomId(room.id);
      setPlayers(room.players || []);
      setGameState(room.gameState || 'waiting');
      setCurrentTurn(room.currentTurn);
      setRows(room.rows);
      setCols(room.cols);
      setHorizontalLines(room.horizontalLines || []);
      setVerticalLines(room.verticalLines || []);
      setBoxes(room.boxes || []);
      setScores(room.scores || []);
      setLastMove(room.lastMove || null);
      setIsPaused(room.gameState === 'paused');
      setMyPlayerIndex((room.players || []).findIndex((p) => p.id === socket?.id));
      if (room.settings) {
        setMode(room.settings.mode || 'classic');
        setCustomRows(room.settings.customRows || 5);
        setCustomCols(room.settings.customCols || 5);
      }
    },
  });

  useSocketListeners(
    socket,
    {
      dab_gameStarted: () => {
        logger.socket('⬅️', 'dab_gameStarted');
        setGameState('playing');
        setIsPaused(false);
        Swal.fire({
          title: 'Game Started!',
          text: 'Draw lines to claim boxes!',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: sketchPopupClass },
        });
      },
      dab_gameRestarted: () => {
        logger.socket('⬅️', 'dab_gameRestarted');
        setGameState('waiting');
        setCurrentTurn(0);
        setHorizontalLines(Array.from({ length: rows }, () => Array(cols).fill(null)));
        setVerticalLines(Array.from({ length: rows }, () => Array(cols + 1).fill(null)));
        setBoxes(Array.from({ length: rows }, () => Array(cols).fill(null)));
        setScores(Array(players.length).fill(0));
        setLastMove(null);
        setIsPaused(false);
        Swal.fire({
          title: 'Game Restarted',
          text: 'New game starting!',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: sketchPopupClass },
        });
      },
      dab_moveResult: ({
        lineType,
        r,
        c,
        claimedBoxes,
        scores: newScores,
        currentTurn: newTurn,
        playerIndex: movePlayerIndex,
      }) => {
        playLine();
        setHorizontalLines((prev) => {
          const copy = prev.map((row) => [...row]);
          if (lineType === 'h') copy[r][c] = movePlayerIndex;
          return copy;
        });
        setVerticalLines((prev) => {
          const copy = prev.map((row) => [...row]);
          if (lineType === 'v') copy[r][c] = movePlayerIndex;
          return copy;
        });
        if (claimedBoxes && claimedBoxes.length > 0) {
          playBox();
          const playerColor = players[movePlayerIndex]?.color || PLAYER_COLORS[movePlayerIndex] || '#2a2a3e';
          confetti({
            particleCount: 25,
            spread: 35,
            origin: { y: 0.6 },
            colors: [playerColor],
            decay: 0.85,
            gravity: 0.5,
          });
          setBoxes((prev) => {
            const copy = prev.map((row) => [...row]);
            for (const box of claimedBoxes) copy[box.r][box.c] = movePlayerIndex;
            return copy;
          });
        }
        setScores(newScores);
        setCurrentTurn(newTurn);
        setLastMove({ lineType, r, c });
      },
      dab_gameOver: ({ winner, scores: finalScores }) => {
        logger.socket('⬅️', 'dab_gameOver');
        setGameState('ended');
        setScores(finalScores);
        sessionStorage.removeItem('dab_reconnect');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        if (!winner) {
          Swal.fire({
            title: "It's a Tie!",
            text: 'Multiple players share the top score!',
            icon: 'info',
            customClass: { popup: sketchPopupClass },
          });
        }
      },
      dab_playerLeft: ({ playerId }) => {
        setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, connected: false } : p)));
      },
      dab_playerReconnected: ({ playerId }) => {
        setPlayers((prev) => prev.map((p) => (p.id === playerId ? { ...p, connected: true } : p)));
        setIsPaused(false);
      },
      dab_gamePaused: () => setIsPaused(true),
      dab_redoRequested: ({ requesterId }) => setRedoRequest(requesterId),
      dab_redoCancelled: () => setRedoRequest(null),
      dab_moveUndone: ({ horizontalLines: h, verticalLines: v, boxes: b, scores: s, currentTurn: t }) => {
        setHorizontalLines(h);
        setVerticalLines(v);
        setBoxes(b);
        setScores(s);
        setCurrentTurn(t);
        setLastMove(null);
        setRedoRequest(null);
      },
    },
    [rows, cols, players, playBox, playLine, roomId],
  );

  useSocketListeners(
    socket,
    {
      dab_redoResponse: ({ accepted, reason, requesterId, requesterName }) => {
        if (!accepted) {
          setRedoRequest(null);
          if (reason === 'Requester disconnected.') {
            Swal.fire({
              title: 'Redo Failed',
              text: 'The player who requested undo disconnected.',
              icon: 'info',
              customClass: { popup: sketchPopupClass },
            });
          } else {
            const name = requesterName || players.find((p) => p.id === requesterId)?.name || 'Someone';
            Swal.fire({
              title: 'Undo Denied',
              text: `${name}'s undo request was denied.`,
              icon: 'warning',
              customClass: { popup: sketchPopupClass },
            });
          }
        } else {
          setRedoRequest(null);
        }
      },
      dab_reconnectFailed: ({ reason, roomId }) => {
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
          sessionStorage.removeItem('dab_reconnect');
          clearRoomId(roomId);
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
          sessionStorage.removeItem('dab_reconnect');
          clearRoomId(roomId);
          navigate('/');
        });
      },
    },
    [players, clearRoomId, roomId, navigate],
  );

  useEffect(() => {
    if (!socket) return;
    setGamePrefix('dab');
    logger.socket('➡️', 'dab_requestRoomInfo', { roomId });
    if (roomId) socket.emit('dab_requestRoomInfo', roomId);
  }, [socket, roomId, setGamePrefix]);

  const handleRestartGame = useCallback(() => {
    socket.emit('dab_restartGame', roomId);
  }, [roomId, socket]);

  const handleLeaveRoom = useCallback(() => {
    handleLeave();
  }, [handleLeave]);

  const handleStartGame = useCallback(() => {
    if (!roomId) return;
    handleStart({ rows, cols });
  }, [handleStart, roomId, rows, cols]);

  const handleUndoRequest = useCallback(() => {
    socket.emit('dab_requestRedo', roomId);
  }, [roomId, socket]);

  const handleUndoResponse = useCallback(
    (accept) => {
      socket.emit('dab_respondRedo', { roomId, accept });
    },
    [roomId, socket],
  );

  const handleLineClick = useCallback(
    (lineType, r, c) => {
      if (gameState !== 'playing' || isPaused || myPlayerIndex !== currentTurn) return;
      const arr = lineType === 'h' ? horizontalLines : verticalLines;
      if (arr[r]?.[c] !== null) return;
      socket.emit('dab_makeMove', { roomId, lineType, r, c });
    },
    [gameState, isPaused, myPlayerIndex, currentTurn, horizontalLines, verticalLines, roomId, socket],
  );

  const isHost = roomId && players[0]?.id === socket?.id;

  const customizationSlot = (
    <div className="space-y-3">
      <p className="paper-font text-sm text-ink/60">Game Mode</p>
      <div className="grid grid-cols-3 gap-2">
        {['classic', 'extended', 'marathon'].map((m) => (
          <SketchButton key={m} onClick={() => setMode(m)} className={mode === m ? 'bg-ink text-white' : ''}>
            {m}
          </SketchButton>
        ))}
      </div>
      <SketchButton onClick={() => setMode('custom')} className={mode === 'custom' ? 'bg-ink text-white' : ''}>
        Custom Size
      </SketchButton>
      {mode === 'custom' && (
        <div className="space-y-3">
          <div>
            <label className="paper-font text-sm text-ink/70">Rows: {customRows}</label>
            <input
              type="range"
              min="3"
              max="30"
              value={customRows}
              onChange={(e) => setCustomRows(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="paper-font text-sm text-ink/70">Columns: {customCols}</label>
            <input
              type="range"
              min="3"
              max="30"
              value={customCols}
              onChange={(e) => setCustomCols(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );

  const spacing = 60;
  const dotRadius = 4;
  const lineWidth = 3;
  const hitLineWidth = 20;
  const svgWidth = cols * spacing;
  const svgHeight = rows * spacing;

  if (!roomId) {
    return (
      <DabPreGame
        profile={profile}
        setProfile={setProfile}
        mode={mode}
        setMode={setMode}
        customRows={customRows}
        setCustomRows={setCustomRows}
        customCols={customCols}
        setCustomCols={setCustomCols}
        onStart={handleStart}
        onJoin={handleJoin}
      />
    );
  }

  if (gameState === 'waiting') {
    return (
      <GameLobby
        gameName="Dots & Boxes"
        roomId={roomId}
        players={players}
        spectators={[]}
        isHost={!!isHost}
        minPlayers={2}
        onStart={handleStartGame}
        onLeave={handleLeaveRoom}
        showJoinInput
        customizationSlot={customizationSlot}
        startLabel="Start Party!"
        profile={profile}
        onProfileChange={(next) => setProfile(next)}
      />
    );
  }

  if (gameState === 'ended') {
    return (
      <MatchReport
        winner={null}
        isWinner={false}
        scores={scores.map((score, idx) => ({
          name: players[idx]?.name || `Player ${idx + 1}`,
          score: typeof score === 'number' ? score : (score?.value ?? 0),
        }))}
        players={players}
        onRematch={handleRestartGame}
        onNewRoom={handleLeaveRoom}
      />
    );
  }

  return (
    <GameLayout players={players}>
      <div className="w-full p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <SketchButton onClick={handleLeaveRoom} style={{ background: '#fff0f0' }}>
              <ArrowLeft className="inline mr-1" size={20} />
              Leave Game
            </SketchButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <SketchCard className="p-4">
                <h3 className="font-sketch text-2xl mb-3 text-ink flex items-center gap-2">
                  <Trophy size={24} />
                  Scoreboard
                </h3>
                <div className="space-y-2">
                  {players.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded border-2 border-dashed ${
                        idx === currentTurn && gameState === 'playing'
                          ? 'border-current bg-yellow-50'
                          : 'border-gray-300'
                      }`}
                      style={{
                        color: players[idx]?.color || PLAYER_COLORS[idx],
                        transform: `rotate(${idx % 2 ? 0.5 : -0.5}deg)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <PlayerAvatar avatarIcon={p.avatarIcon} color={p.color} size={20} />
                        <span className="font-handwriting font-bold">
                          {p.name}
                          {idx === myPlayerIndex && ' (You)'}
                        </span>
                      </div>
                      <span className="font-sketch text-2xl font-bold">
                        {typeof scores[idx] === 'number' ? scores[idx] : 0}
                      </span>
                    </div>
                  ))}
                </div>
              </SketchCard>

              <UndoUI
                requesterId={redoRequest}
                players={players}
                currentTurn={currentTurn}
                myPlayerIndex={myPlayerIndex}
                onAllow={() => handleUndoResponse(true)}
                onDeny={() => handleUndoResponse(false)}
              />

              {gameState === 'playing' && (
                <SketchCard className="p-4">
                  {myPlayerIndex === currentTurn ? (
                    <div className="text-center">
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 border-2"
                        style={{ backgroundColor: players[myPlayerIndex]?.color || PLAYER_COLORS[myPlayerIndex] }}
                      />
                      <p className="font-sketch text-xl text-ink font-bold">Your Turn!</p>
                      <p className="font-handwriting text-sm text-gray-600">Draw a line</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 border-2"
                        style={{ backgroundColor: players[currentTurn]?.color || PLAYER_COLORS[currentTurn] }}
                      />
                      <p className="font-handwriting text-gray-600">
                        Waiting for <span className="font-bold text-ink">{players[currentTurn]?.name}</span>...
                      </p>
                      {lastMove && players.length > 1 && myPlayerIndex === (currentTurn + 1) % players.length && (
                        <SketchButton onClick={handleUndoRequest} className="mt-2 text-sm">
                          <Undo2 className="inline" size={14} /> Request Undo
                        </SketchButton>
                      )}
                    </div>
                  )}
                </SketchCard>
              )}

              {isPaused && (
                <SketchCard className="p-4 bg-yellow-50">
                  <p className="font-handwriting text-center text-ink font-bold">Game Paused</p>
                  <p className="font-handwriting text-sm text-center text-gray-600">Waiting for players to reconnect</p>
                </SketchCard>
              )}
            </div>

            <div className="lg:col-span-2">
              <SketchCard className="p-4 overflow-hidden">
                {svgWidth > 0 && svgHeight > 0 ? (
                  <TransformWrapper
                    initialScale={Math.min(1, 600 / Math.max(svgWidth, svgHeight))}
                    minScale={0.3}
                    maxScale={3}
                    limitToBounds
                    centerOnInit
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <button onClick={() => zoomIn(0.2)} className="sketch-button p-2 bg-white" title="Zoom In">
                            <Plus size={16} />
                          </button>
                          <button onClick={() => zoomOut(0.2)} className="sketch-button p-2 bg-white" title="Zoom Out">
                            <Minus size={16} />
                          </button>
                          <button onClick={() => resetTransform()} className="sketch-button p-2 bg-white" title="Reset">
                            <RotateCcw size={16} />
                          </button>
                        </div>
                        <TransformComponent>
                          <div className="select-none pointer-events-none" style={{ touchAction: 'none' }}>
                            <svg
                              className="pointer-events-auto block"
                              width={svgWidth}
                              height={svgHeight}
                              viewBox={`-20 -20 ${svgWidth + 40} ${svgHeight + 40}`}
                              style={{ background: '#fffef9', borderRadius: '4px' }}
                            >
                              <defs>
                                <filter id="paper-texture">
                                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
                                  <feDiffuseLighting in="noise" lightingColor="#f5f1e8" surfaceScale="1">
                                    <feDistantLight azimuth="45" elevation="60" />
                                  </feDiffuseLighting>
                                </filter>
                              </defs>

                              {boxes.map((row, r) =>
                                row.map((boxOwner, c) =>
                                  boxOwner !== null ? (
                                    <g key={`box-${r}-${c}`}>
                                      <rect
                                        x={c * spacing}
                                        y={r * spacing}
                                        width={spacing}
                                        height={spacing}
                                        fill={PLAYER_COLORS[boxOwner]}
                                        opacity={0.15}
                                      />
                                      <path
                                        d={`M ${c * spacing} ${r * spacing} L ${(c + 1) * spacing} ${(r + 1) * spacing} M ${(c + 1) * spacing} ${r * spacing} L ${c * spacing} ${(r + 1) * spacing}`}
                                        stroke={PLAYER_COLORS[boxOwner]}
                                        strokeWidth="1"
                                        opacity="0.3"
                                        strokeDasharray="3,3"
                                      />
                                    </g>
                                  ) : null,
                                ),
                              )}

                              {Array.from({ length: rows + 1 }, (_, r) =>
                                Array.from({ length: cols }, (_, c) => {
                                  const owner = horizontalLines[r]?.[c];
                                  const seed = r * 100 + c;
                                  const isLastMoveLine =
                                    lastMove && lastMove.lineType === 'h' && lastMove.r === r && lastMove.c === c;
                                  return (
                                    <g key={`h-${r}-${c}`}>
                                      {owner !== null && (
                                        <path
                                          d={addWobble(c * spacing, r * spacing, (c + 1) * spacing, r * spacing, seed)}
                                          stroke={PLAYER_COLORS[owner]}
                                          strokeWidth={lineWidth}
                                          fill="none"
                                          strokeLinecap="round"
                                          vectorEffect="non-scaling-stroke"
                                          style={{
                                            filter: isLastMoveLine ? 'drop-shadow(0 0 4px #38bdf8)' : undefined,
                                          }}
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
                                        onPointerDown={(e) => {
                                          e.stopPropagation();
                                          handleLineClick('h', r, c);
                                        }}
                                      />
                                    </g>
                                  );
                                }),
                              )}

                              {Array.from({ length: rows }, (_, r) =>
                                Array.from({ length: cols + 1 }, (_, c) => {
                                  const owner = verticalLines[r]?.[c];
                                  const seed = r * 100 + c + 1000;
                                  const isLastMoveLine =
                                    lastMove && lastMove.lineType === 'v' && lastMove.r === r && lastMove.c === c;
                                  return (
                                    <g key={`v-${r}-${c}`}>
                                      {owner !== null && (
                                        <path
                                          d={addWobble(c * spacing, r * spacing, c * spacing, (r + 1) * spacing, seed)}
                                          stroke={PLAYER_COLORS[owner]}
                                          strokeWidth={lineWidth}
                                          fill="none"
                                          strokeLinecap="round"
                                          vectorEffect="non-scaling-stroke"
                                          style={{
                                            filter: isLastMoveLine ? 'drop-shadow(0 0 4px #38bdf8)' : undefined,
                                          }}
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
                                        onPointerDown={(e) => {
                                          e.stopPropagation();
                                          handleLineClick('v', r, c);
                                        }}
                                      />
                                    </g>
                                  );
                                }),
                              )}

                              {Array.from({ length: rows + 1 }, (_, r) =>
                                Array.from({ length: cols + 1 }, (_, c) => {
                                  const seed = r * 1000 + c;
                                  const offsetX = Math.sin(seed * 0.1) * 0.5;
                                  const offsetY = Math.cos(seed * 0.1) * 0.5;
                                  return (
                                    <circle
                                      key={`dot-${r}-${c}`}
                                      cx={c * spacing + offsetX}
                                      cy={r * spacing + offsetY}
                                      r={dotRadius}
                                      fill="#2a2a3e"
                                      vectorEffect="non-scaling-stroke"
                                      style={{ pointerEvents: 'none' }}
                                    />
                                  );
                                }),
                              )}
                            </svg>
                          </div>
                        </TransformComponent>
                      </>
                    )}
                  </TransformWrapper>
                ) : (
                  <div className="flex items-center justify-center p-8">
                    <p className="font-handwriting text-gray-400 slide-texture">Loading...</p>
                  </div>
                )}
              </SketchCard>
            </div>
          </div>
        </div>
      </div>

      <AvatarReactionBar socket={socket} roomId={roomId} gamePrefix="dab" players={players} />
    </GameLayout>
  );
};

export default DabGame;

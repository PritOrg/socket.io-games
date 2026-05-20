import React, { useState, useEffect, useCallback, useRef } from "react";
import { useGameContext } from "../context/GameContext";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  SketchButton,
  SketchCard,
  SketchBorder,
  PlayerBadge,
  LeaveButton,
  sketchPopupClass,
} from "../components/ui";
import useSound from "use-sound";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Trophy,
  SwatchBook,
  Plus,
  Minus,
  RotateCcw,
  Undo2,
} from "lucide-react";
import logger from "../utils/logger";

// Sketch-style pen colors (ink colors)
const PLAYER_COLORS = ["#1a1a2e", "#c73e1d", "#2d4a8f", "#2f5233"];
const PLAYER_NAMES_COLORS = ["Navy Ink", "Red Ink", "Blue Ink", "Green Ink"];

// Helper function to add wobble to lines for hand-drawn effect
const addWobble = (x1, y1, x2, y2, seed = 0) => {
  const segments = 8;
  const wobbleAmount = 1.5;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;

    // Add controlled randomness based on seed
    const offsetX = Math.sin(seed + i * 2.3) * wobbleAmount;
    const offsetY = Math.cos(seed + i * 1.7) * wobbleAmount;

    points.push(`${x + offsetX},${y + offsetY}`);
  }

  return `M ${points[0]} ${points
    .slice(1)
    .map((p) => `L ${p}`)
    .join(" ")}`;
};

const DabGame = () => {
  const { socket, playerName, roomId, setRoomId, clearRoomId } =
    useGameContext();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState("waiting");
  const [currentTurn, setCurrentTurn] = useState(0);
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(9);
  const [horizontalLines, setHorizontalLines] = useState([]);
  const [verticalLines, setVerticalLines] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [scores, setScores] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [mode, setMode] = useState("classic");
  const [customRows, setCustomRows] = useState(5);
  const [customCols, setCustomCols] = useState(5);
  const [customPlayers, setCustomPlayers] = useState(2);
  const [myPlayerIndex, setMyPlayerIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [redoRequest, setRedoRequest] = useState(null);

  const [playLine] = useSound("/sounds/move.mp3", { volume: 0.5 });
  const [playBox] = useSound("/sounds/win.mp3", { volume: 0.7 });

  const reconnectAttempted = useRef(false);

  const handleCreateRoom = useCallback(() => {
    logger.socket("➡️", "dab_createRoom", {
      mode,
      customRows,
      customCols,
      customPlayers,
      playerName,
    });
    socket.emit("dab_createRoom", {
      mode,
      customRows,
      customCols,
      customPlayers,
      playerName,
    });
  }, [mode, customRows, customCols, customPlayers, playerName, socket]);

  const handleJoinRoom = useCallback(async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: "Join DAB Room",
      input: "text",
      inputPlaceholder: "Enter Room ID",
      showCancelButton: true,
      customClass: { popup: sketchPopupClass },
    });
    if (joinRoomId) {
      logger.socket("➡️", "dab_joinRoom", {
        roomId: joinRoomId.toUpperCase(),
        playerName,
      });
      socket.emit("dab_joinRoom", {
        roomId: joinRoomId.toUpperCase(),
        playerName,
      });
    }
  }, [socket, playerName]);

  useEffect(() => {
    if (!socket) return;

    const saved = sessionStorage.getItem("dab_reconnect");
    if (saved && !reconnectAttempted.current) {
      reconnectAttempted.current = true;
      const { roomId: savedRoomId, playerId } = JSON.parse(saved);
      logger.socket("➡️", "dab_reconnect", { roomId: savedRoomId, playerId });
      socket.emit("dab_reconnect", { roomId: savedRoomId, playerId });
      setRoomId(savedRoomId);
      return;
    }

    socket.on("dab_roomInfo", (room) => {
      logger.socket("⬅️", "dab_roomInfo", {
        roomId: room.id,
        gameState: room.gameState,
      });
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
      setIsPaused(room.gameState === "paused");

      const idx = room.players.findIndex((p) => p.id === socket.id);
      if (idx !== -1) {
        setMyPlayerIndex(idx);
        sessionStorage.setItem(
          "dab_reconnect",
          JSON.stringify({ roomId: room.id, playerId: room.players[idx].id }),
        );
      }
    });

    socket.on("dab_gameStarted", ({ firstTurn }) => {
      logger.socket("⬅️", "dab_gameStarted", { firstTurn });
      setGameState("playing");
      setIsPaused(false);
      Swal.fire({
        title: "Game Started!",
        text: "Draw lines to claim boxes!",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on("dab_gameRestarted", () => {
      logger.socket("⬅️", "dab_gameRestarted", "Game restarted");
      setGameState("waiting");
      setCurrentTurn(0);
      setHorizontalLines((rowsArray) =>
        Array(rows)
          .fill(null)
          .map(() => Array(cols).fill(null)),
      );
      setVerticalLines((rowsArray) =>
        Array(rows)
          .fill(null)
          .map(() => Array(cols + 1).fill(null)),
      );
      setBoxes((rowsArray) =>
        Array(rows)
          .fill(null)
          .map(() => Array(cols).fill(null)),
      );
      setScores(Array(players.length).fill(0));
      setLastMove(null);
      setIsPaused(false);
      Swal.fire({
        title: "Game Restarted",
        text: "New game starting!",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: sketchPopupClass },
      });
    });

    socket.on(
      "dab_moveResult",
      ({
        lineType,
        r,
        c,
        claimedBoxes,
        scores: newScores,
        currentTurn: newTurn,
        playerIndex: movePlayerIndex,
      }) => {
        logger.socket("⬅️", "dab_moveResult", {
          claimedBoxes,
          scores: newScores,
        });
        playLine();

        setHorizontalLines((prev) => {
          const copy = prev.map((row) => [...row]);
          if (lineType === "h") copy[r][c] = movePlayerIndex;
          return copy;
        });
        setVerticalLines((prev) => {
          const copy = prev.map((row) => [...row]);
          if (lineType === "v") copy[r][c] = movePlayerIndex;
          return copy;
        });

        if (claimedBoxes.length > 0) {
          playBox();
          setBoxes((prev) => {
            const copy = prev.map((row) => [...row]);
            for (const box of claimedBoxes) {
              copy[box.r][box.c] = movePlayerIndex;
            }
            return copy;
          });
        }

        setScores(newScores);
        setCurrentTurn(newTurn);
      },
    );

    socket.on("dab_gameOver", ({ winner, scores: finalScores, winners }) => {
      logger.socket("⬅️", "dab_gameOver", { winner, winners });
      setGameState("ended");
      setScores(finalScores);
      sessionStorage.removeItem("dab_reconnect");

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

      if (winner) {
        const winnerName =
          players.find((p) => p.id === winner)?.name || "Player";
        Swal.fire({
          title: "Victory!",
          text: `${winnerName} wins!`,
          icon: "success",
          customClass: { popup: sketchPopupClass },
        });
      } else {
        Swal.fire({
          title: "It's a Tie!",
          text: "Multiple players share the top score!",
          icon: "info",
          customClass: { popup: sketchPopupClass },
        });
      }
    });

    socket.on("dab_playerLeft", ({ playerId }) => {
      logger.socket("⬅️", "dab_playerLeft", { playerId });
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, connected: false } : p)),
      );
    });

    socket.on("dab_playerReconnected", ({ playerId }) => {
      logger.socket("⬅️", "dab_playerReconnected", { playerId });
      setPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, connected: true } : p)),
      );
      setIsPaused(false);
    });

    socket.on("dab_gamePaused", () => {
      logger.socket("⬅️", "dab_gamePaused", "Game paused");
      setIsPaused(true);
    });

    socket.on("dab_redoRequested", ({ requesterId }) => {
      logger.socket("⬅️", "dab_redoRequested", { requesterId });
      setRedoRequest(requesterId);
    });

    socket.on("dab_redoCancelled", () => {
      logger.socket("⬅️", "dab_redoCancelled", "Redo cancelled");
      setRedoRequest(null);
    });

    socket.on(
      "dab_moveUndone",
      ({
        horizontalLines: h,
        verticalLines: v,
        boxes: b,
        scores: s,
        currentTurn: t,
      }) => {
        logger.socket("⬅️", "dab_moveUndone", "Move undone");
        setHorizontalLines(h);
        setVerticalLines(v);
        setBoxes(b);
        setScores(s);
        setCurrentTurn(t);
        setLastMove(null);
        setRedoRequest(null);
      },
    );

    return () => {
      socket.off("dab_roomInfo");
      socket.off("dab_gameStarted");
      socket.off("dab_gameRestarted");
      socket.off("dab_moveResult");
      socket.off("dab_gameOver");
      socket.off("dab_playerLeft");
      socket.off("dab_playerReconnected");
      socket.off("dab_gamePaused");
      socket.off("dab_redoRequested");
      socket.off("dab_redoCancelled");
      socket.off("dab_moveUndone");
    };
  }, [socket]);

  const handleLineClick = (lineType, r, c, event) => {
    if (gameState !== "playing") return;
    if (isPaused) return;
    if (myPlayerIndex !== currentTurn) return;

    const arr = lineType === "h" ? horizontalLines : verticalLines;
    if (arr[r]?.[c] !== null) return;

    logger.socket("➡️", "dab_makeMove", { roomId, lineType, r, c });
    socket.emit("dab_makeMove", { roomId, lineType, r, c });
    setLastMove({ lineType, r, c });
  };

  const handleLeaveRoom = () => {
    Swal.fire({
      title: "Leave Game?",
      text: "Are you sure you want to leave?",
      showCancelButton: true,
      confirmButtonText: "Yes, Leave",
      cancelButtonText: "Stay",
      customClass: { popup: sketchPopupClass },
    }).then((result) => {
      if (result.isConfirmed) {
        logger.socket("➡️", "dab_leaveRoom", { roomId });
        socket.emit("dab_leaveRoom", roomId);
        clearRoomId();
        sessionStorage.removeItem("dab_reconnect");
        navigate("/dab");
      }
    });
  };

  const handleStartGame = () => {
    if (mode === "classic") {
      logger.socket("➡️", "dab_startGame", { roomId, rows: 9, cols: 9 });
      socket.emit("dab_startGame", { roomId, rows: 9, cols: 9 });
    } else {
      logger.socket("➡️", "dab_startGame", {
        roomId,
        rows: customRows,
        cols: customCols,
      });
      socket.emit("dab_startGame", {
        roomId,
        rows: customRows,
        cols: customCols,
      });
    }
  };

  const handleRestartGame = () => {
    logger.socket("➡️", "dab_restartGame", { roomId });
    socket.emit("dab_restartGame", roomId);
  };

  const spacing = 60;
  const dotRadius = 4;
  const lineWidth = 3;
  const hitLineWidth = 20;

  const svgWidth = cols * spacing;
  const svgHeight = rows * spacing;

  if (!roomId) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <SketchCard className="p-8 max-w-md w-full">
          <h2 className="text-3xl font-sketch mb-4 text-center text-ink">
            Dots & Boxes
          </h2>
          <div className="flex gap-3 mb-4">
            <SketchButton onClick={handleCreateRoom} className="flex-1">
              Create Room
            </SketchButton>
            <SketchButton onClick={handleJoinRoom} className="flex-1">
              Join Room
            </SketchButton>
          </div>
          <SketchBorder>
            <div className="flex items-center gap-2 mb-3">
              <SwatchBook size={20} className="text-ink" />
              <span className="font-handwriting text-lg text-ink">
                Game Mode
              </span>
            </div>
            <div className="flex gap-3 mb-4">
              <SketchButton
                onClick={() => setMode("classic")}
                className={
                  mode === "classic" ? "flex-1 bg-ink text-white" : "flex-1"
                }
              >
                Classic (9×9)
              </SketchButton>
              <SketchButton
                onClick={() => setMode("custom")}
                className={
                  mode === "custom" ? "flex-1 bg-ink text-white" : "flex-1"
                }
              >
                Custom Size
              </SketchButton>
            </div>
            {mode === "custom" && (
              <div className="space-y-3 pt-3 border-t-2 border-dashed border-ink/20">
                <div>
                  <label className="font-handwriting text-ink block mb-1">
                    Rows: {customRows}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={customRows}
                    onChange={(e) => setCustomRows(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="font-handwriting text-ink block mb-1">
                    Columns: {customCols}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={customCols}
                    onChange={(e) => setCustomCols(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </SketchBorder>
        </SketchCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper p-4">
      {gameState === "waiting" && (
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="sketch-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-sketch font-bold text-ink flex items-center gap-2">
                <span className="inline-block transform -rotate-2">Dots</span>
                <span className="text-2xl">&</span>
                <span className="inline-block transform rotate-1">Boxes</span>
              </h1>
              <button
                onClick={handleLeaveRoom}
                className="sketch-button text-red-600 hover:bg-red-50"
              >
                <ArrowLeft className="inline" size={20} />
              </button>
            </div>

            <div className="sketch-border mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-ink" />
                <span className="font-handwriting text-lg text-ink">
                  Room Code:
                </span>
              </div>
              <div className="font-sketch text-3xl font-bold text-ink tracking-wider">
                {roomId}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-handwriting text-xl mb-3 text-ink flex items-center gap-2">
                <Users size={20} />
                Players ({players.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {players.map((p, idx) => (
                  <div
                    key={p.id}
                    className="player-badge"
                    style={{
                      color: PLAYER_COLORS[idx],
                      opacity: p.connected ? 1 : 0.4,
                    }}
                  >
                    {p.name} {!p.connected && "(disconnected)"}
                  </div>
                ))}
              </div>
            </div>

            <div className="sketch-border mb-6">
              <div className="flex items-center gap-2 mb-3">
                <SwatchBook size={20} className="text-ink" />
                <span className="font-handwriting text-lg text-ink">
                  Game Mode
                </span>
              </div>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setMode("classic")}
                  className={`sketch-button flex-1 ${mode === "classic" ? "bg-ink text-white" : ""}`}
                >
                  Classic (9×9)
                </button>
                <button
                  onClick={() => setMode("custom")}
                  className={`sketch-button flex-1 ${mode === "custom" ? "bg-ink text-white" : ""}`}
                >
                  Custom Size
                </button>
              </div>

              {mode === "custom" && (
                <div className="space-y-3 pt-3 border-t-2 border-dashed border-ink/20">
                  <div>
                    <label className="font-handwriting text-ink block mb-1">
                      Rows: {customRows}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      value={customRows}
                      onChange={(e) => setCustomRows(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="font-handwriting text-ink block mb-1">
                      Columns: {customCols}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      value={customCols}
                      onChange={(e) => setCustomCols(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="sketch-button w-full text-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed bg-green-50 hover:bg-green-100"
            >
              {players.length < 2 ? "Waiting for players..." : "Start Game!"}
            </button>
          </div>
        </div>
      )}

      {(gameState === "playing" || gameState === "ended") && (
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-4">
            <button
              onClick={handleLeaveRoom}
              className="sketch-button text-ink hover:bg-gray-100"
            >
              <ArrowLeft className="inline mr-1" size={20} />
              Leave Game
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="sketch-card p-4">
                <h3 className="font-sketch text-2xl mb-3 text-ink flex items-center gap-2">
                  <Trophy size={24} />
                  Scoreboard
                </h3>
                <div className="space-y-2">
                  {players.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded border-2 border-dashed ${
                        idx === currentTurn && gameState === "playing"
                          ? "border-current bg-yellow-50"
                          : "border-gray-300"
                      }`}
                      style={{
                        color: PLAYER_COLORS[idx],
                        transform: `rotate(${idx % 2 ? 0.5 : -0.5}deg)`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border-2"
                          style={{
                            backgroundColor: PLAYER_COLORS[idx],
                            borderColor: PLAYER_COLORS[idx],
                          }}
                        />
                        <span className="font-handwriting font-bold">
                          {p.name}
                          {idx === myPlayerIndex && " (You)"}
                        </span>
                      </div>
                      <span className="font-sketch text-2xl font-bold">
                        {scores[idx] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {redoRequest && (
                <div className="sketch-card p-4 bg-yellow-50">
                  <p className="font-handwriting text-ink mb-3">
                    <span className="font-bold">
                      {players.find((p) => p.id === redoRequest)?.name}
                    </span>{" "}
                    wants to undo the last move
                  </p>
                  {myPlayerIndex === currentTurn && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          logger.socket("➡️", "dab_respondRedo", {
                            roomId,
                            accept: true,
                          });
                          socket.emit("dab_respondRedo", {
                            roomId,
                            accept: true,
                          });
                        }}
                        className="sketch-button flex-1 bg-green-50 hover:bg-green-100"
                      >
                        Allow
                      </button>
                      <button
                        onClick={() => {
                          logger.socket("➡️", "dab_respondRedo", {
                            roomId,
                            accept: false,
                          });
                          socket.emit("dab_respondRedo", {
                            roomId,
                            accept: false,
                          });
                        }}
                        className="sketch-button flex-1 bg-red-50 hover:bg-red-100"
                      >
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              )}

              {gameState === "playing" && (
                <div className="sketch-card p-4">
                  {myPlayerIndex === currentTurn ? (
                    <div className="text-center">
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 border-2 sketch-dot"
                        style={{
                          backgroundColor: PLAYER_COLORS[currentTurn],
                          borderColor: PLAYER_COLORS[currentTurn],
                        }}
                      />
                      <p className="font-sketch text-xl text-ink font-bold">
                        Your Turn!
                      </p>
                      <p className="font-handwriting text-sm text-gray-600">
                        Draw a line
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 border-2 sketch-dot"
                        style={{
                          backgroundColor: PLAYER_COLORS[currentTurn],
                          borderColor: PLAYER_COLORS[currentTurn],
                        }}
                      />
                      <p className="font-handwriting text-gray-600">
                        Waiting for{" "}
                        <span className="font-bold text-ink">
                          {players[currentTurn]?.name}
                        </span>
                        ...
                      </p>
                      {lastMove &&
                        myPlayerIndex ===
                          (currentTurn + 1) % players.length && (
                          <button
                            onClick={() => {
                              logger.socket("➡️", "dab_requestRedo", {
                                roomId,
                              });
                              socket.emit("dab_requestRedo", roomId);
                            }}
                            className="sketch-button mt-2 text-sm"
                          >
                            <Undo2 className="inline" size={14} /> Request Undo
                          </button>
                        )}
                    </div>
                  )}
                </div>
              )}

              {isPaused && (
                <div className="sketch-card p-4 bg-yellow-50">
                  <p className="font-handwriting text-center text-ink font-bold">
                    ⏸️ Game Paused
                  </p>
                  <p className="font-handwriting text-sm text-center text-gray-600">
                    Waiting for players to reconnect
                  </p>
                </div>
              )}

              {gameState === "ended" && (
                <div className="sketch-card p-4 bg-green-50">
                  <p className="font-sketch text-2xl text-center text-ink font-bold mb-3">
                    🏆 Game Over!
                  </p>
                  <button
                    onClick={handleRestartGame}
                    className="sketch-button w-full bg-green-100 hover:bg-green-200"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="sketch-card p-4 overflow-hidden">
                {svgWidth > 0 && svgHeight > 0 ? (
                  <TransformWrapper
                    initialScale={Math.min(
                      1,
                      600 / Math.max(svgWidth, svgHeight),
                    )}
                    minScale={0.3}
                    maxScale={3}
                    limitToBounds
                    centerOnInit
                  >
                    {({ zoomIn, zoomOut, resetTransform }) => (
                      <>
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          <button
                            onClick={() => zoomIn(0.2)}
                            className="sketch-button p-2 bg-white"
                            title="Zoom In"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => zoomOut(0.2)}
                            className="sketch-button p-2 bg-white"
                            title="Zoom Out"
                          >
                            <Minus size={16} />
                          </button>
                          <button
                            onClick={() => resetTransform()}
                            className="sketch-button p-2 bg-white"
                            title="Reset"
                          >
                            <RotateCcw size={16} />
                          </button>
                        </div>
                        <TransformComponent>
                          <div
                            className="select-none pointer-events-none"
                            style={{ touchAction: "none" }}
                          >
                            <svg
                              className="pointer-events-auto block"
                              width={svgWidth}
                              height={svgHeight}
                              viewBox={`-20 -20 ${svgWidth + 40} ${svgHeight + 40}`}
                              style={{
                                background: "#fffef9",
                                borderRadius: "4px",
                              }}
                            >
                              {/* Paper texture overlay */}
                              <defs>
                                <filter id="paper-texture">
                                  <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.9"
                                    numOctaves="4"
                                    result="noise"
                                  />
                                  <feDiffuseLighting
                                    in="noise"
                                    lightingColor="#f5f1e8"
                                    surfaceScale="1"
                                  >
                                    <feDistantLight
                                      azimuth="45"
                                      elevation="60"
                                    />
                                  </feDiffuseLighting>
                                </filter>
                              </defs>

                              {/* Claimed boxes with sketchy fill */}
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
                                      {/* Cross-hatch pattern */}
                                      <path
                                        d={`
                                          M ${c * spacing} ${r * spacing}
                                          L ${(c + 1) * spacing} ${(r + 1) * spacing}
                                          M ${(c + 1) * spacing} ${r * spacing}
                                          L ${c * spacing} ${(r + 1) * spacing}
                                        `}
                                        stroke={PLAYER_COLORS[boxOwner]}
                                        strokeWidth="1"
                                        opacity="0.3"
                                        strokeDasharray="3,3"
                                      />
                                    </g>
                                  ) : null,
                                ),
                              )}

                              {/* Horizontal lines with hand-drawn wobble */}
                              {Array.from({ length: rows + 1 }, (_, r) =>
                                Array.from({ length: cols }, (_, c) => {
                                  const owner = horizontalLines[r]?.[c];
                                  const seed = r * 100 + c;
                                  return (
                                    <g key={`h-${r}-${c}`}>
                                      {owner !== null && (
                                        <path
                                          d={addWobble(
                                            c * spacing,
                                            r * spacing,
                                            (c + 1) * spacing,
                                            r * spacing,
                                            seed,
                                          )}
                                          stroke={PLAYER_COLORS[owner]}
                                          strokeWidth={lineWidth}
                                          fill="none"
                                          strokeLinecap="round"
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
                                        style={{
                                          cursor: "pointer",
                                          pointerEvents: "stroke",
                                        }}
                                        onPointerDown={(e) => {
                                          e.stopPropagation();
                                          handleLineClick("h", r, c, e);
                                        }}
                                      />
                                    </g>
                                  );
                                }),
                              )}

                              {/* Vertical lines with hand-drawn wobble */}
                              {Array.from({ length: rows }, (_, r) =>
                                Array.from({ length: cols + 1 }, (_, c) => {
                                  const owner = verticalLines[r]?.[c];
                                  const seed = r * 100 + c + 1000;
                                  return (
                                    <g key={`v-${r}-${c}`}>
                                      {owner !== null && (
                                        <path
                                          d={addWobble(
                                            c * spacing,
                                            r * spacing,
                                            c * spacing,
                                            (r + 1) * spacing,
                                            seed,
                                          )}
                                          stroke={PLAYER_COLORS[owner]}
                                          strokeWidth={lineWidth}
                                          fill="none"
                                          strokeLinecap="round"
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
                                        style={{
                                          cursor: "pointer",
                                          pointerEvents: "stroke",
                                        }}
                                        onPointerDown={(e) => {
                                          e.stopPropagation();
                                          handleLineClick("v", r, c, e);
                                        }}
                                      />
                                    </g>
                                  );
                                }),
                              )}

                              {/* Hand-drawn dots (slightly irregular) */}
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
                                      style={{ pointerEvents: "none" }}
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
                    <p className="font-handwriting text-gray-400">Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DabGame;

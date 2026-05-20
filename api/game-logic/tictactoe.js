const BaseManager = require("./BaseManager");

class TicTacToeManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = "ttt";
  }

  handleConnection(socket) {
    socket.on("ttt_createRoom", (playerName) =>
      this.createRoom(socket, playerName),
    );
    socket.on("ttt_joinRoom", (data) => this.joinRoom(socket, data));
    socket.on("ttt_makeMove", (data) => this.makeMove(socket, data));
    socket.on("ttt_restartGame", (roomId) => this.restartGame(socket, roomId));
    socket.on("ttt_leaveRoom", (roomId) => this.leaveRoom(socket, roomId));
    socket.on("ttt_reconnect", (data) => this.reconnect(socket, data));
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  checkWinner(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    if (board.every((cell) => cell !== null)) return { draw: true };
    return null;
  }

  createRoom(socket, playerName) {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.join(roomId);
    const room = {
      id: roomId,
      players: [{ id: socket.id, name: playerName, connected: true }],
      board: Array(9).fill(null),
      gameState: "waiting",
      currentTurn: null,
      emptyTimer: null,
      forfeitTimer: null,
    };
    this.rooms.set(roomId, room);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room || room.players.length >= 2) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: "error",
        title: "Error",
        text: room ? "Room full" : "Not found",
      });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName, connected: true });
    room.gameState = "playing";
    room.currentTurn = room.players[0].id;

    this.clearTimer(`empty_${roomId}`);
    this.io.to(room.id).emit(`${this.gamePrefix}_gameStarted`);
    this.sendRoomInfo(room.id);
  }

  restartGame(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;
    room.board = Array(9).fill(null);
    room.gameState = "playing";
    room.currentTurn = room.players[0].id;
    this.io.to(roomId).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(roomId);
  }

  leaveRoom(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;

    room.players[playerIndex].connected = false;

    if (room.gameState === "playing") {
      const activeCount = room.players.filter((p) => p.connected).length;

      if (activeCount === 0) {
        this.registerEmptyTimer(roomId, () => {
          this.rooms.delete(roomId);
        });
      } else if (activeCount === 1) {
        room.gameState = "paused";
        this.io
          .to(room.id)
          .emit(`${this.gamePrefix}_gamePaused`, {
            reason: "Opponent disconnected",
          });
      }

      this.io
        .to(room.id)
        .emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
      this.sendRoomInfo(room.id);
    }
  }

  reconnect(socket, { roomId, playerId }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: "error",
        title: "Error",
        text: "Room not found",
      });
      return;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: "error",
        title: "Error",
        text: "Player not found in room",
      });
      return;
    }

    socket.join(room.id);
    player.id = socket.id;
    player.connected = true;

    this.clearTimer(`empty_${roomId}`);

    if (room.gameState === "paused") {
      const activeCount = room.players.filter((p) => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = "playing";
        this.clearTimer(`forfeit_${roomId}`);
        this.io
          .to(room.id)
          .emit(`${this.gamePrefix}_alert`, {
            icon: "success",
            title: "Player Reconnected",
            text: "Game resumed!",
          });
      }
    }

    this.sendRoomInfo(room.id);
  }

  handleDisconnect(socket) {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex === -1) continue;

      room.players[playerIndex].connected = false;

      if (room.gameState === "playing") {
        const activeCount = room.players.filter((p) => p.connected).length;

        if (activeCount === 0) {
          this.registerEmptyTimer(roomId, () => {
            this.rooms.delete(roomId);
          });
        } else if (activeCount === 1) {
          room.gameState = "paused";
          this.io
            .to(room.id)
            .emit(`${this.gamePrefix}_gamePaused`, {
              reason: "Opponent disconnected",
            });
        }

        this.io
          .to(room.id)
          .emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
        this.sendRoomInfo(room.id);
      }
    }
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (room) this.io.to(roomId).emit(`${this.gamePrefix}_roomInfo`, room);
  }
}

module.exports = TicTacToeManager;

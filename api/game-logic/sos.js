const BaseManager = require('./BaseManager');

class SOSManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'sos';
  }

  handleConnection(socket) {
    socket.on(`${this.gamePrefix}_createRoom`, (data) => this.createRoom(socket, data));
    socket.on(`${this.gamePrefix}_joinRoom`, (data) => this.joinRoom(socket, data));
    socket.on(`${this.gamePrefix}_reconnect`, (data) => this.reconnect(socket, data));
    socket.on(`${this.gamePrefix}_leaveRoom`, (roomId) => this.leaveRoom(socket, roomId));
    socket.on(`${this.gamePrefix}_makeMove`, (data) => this.makeMove(socket, data));
    socket.on(`${this.gamePrefix}_startGame`, (data) => this.startGame(socket, data));
    socket.on(`${this.gamePrefix}_restartGame`, (roomId) => this.restartGame(socket, roomId));
    socket.on(`${this.gamePrefix}_requestRoomInfo`, (roomId) => {
      const sanitized = this.sanitizeRoomId(roomId);
      if (sanitized) this.sendRoomInfo(sanitized);
    });
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  createRoom(socket, { playerName, size }) {
    const boardSize = Math.max(4, Math.min(8, size || 6));
    const roomId = this.generateRoomId();
    socket.join(roomId);

    const room = {
      id: roomId,
      creator: socket.id,
      players: [{ id: socket.id, name: this.sanitizePlayerName(playerName), connected: true }],
      spectators: [],
      gameState: 'waiting',
      size: boardSize,
      board: Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(null)),
      scores: { 0: 0, 1: 0 },
      currentTurn: null,
      formedPatterns: [],
      moveCount: 0,
      latestPattern: null,
    };

    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName, asSpectator }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    if (!sanitizedRoomId) {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Invalid room ID' });
      return;
    }

    const room = this.rooms.get(sanitizedRoomId);
    if (!room) {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Room not found' });
      return;
    }

    socket.join(room.id);

    const sanitizedName = this.sanitizePlayerName(playerName);

    if (asSpectator || room.players.length >= 2) {
      room.spectators.push({ id: socket.id, name: sanitizedName, connected: true });
      this._trackSocket(socket.id, room.id);
      this.sendRoomInfo(room.id);
      return;
    }

    if (room.gameState !== 'waiting') {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Game already in progress' });
      return;
    }

    room.players.push({ id: socket.id, name: sanitizedName, connected: true });
    this._trackSocket(socket.id, room.id);
    this.sendRoomInfo(room.id);
  }

  leaveRoom(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex !== -1) {
      if (room.gameState === 'playing') {
        room.players[playerIndex].connected = false;

        const activeCount = room.players.filter((p) => p.connected).length;
        if (activeCount === 0) {
          this.registerEmptyTimer(sanitizedRoomId, () => {
            this.rooms.delete(sanitizedRoomId);
          });
        } else if (activeCount === 1) {
          room.gameState = 'paused';
          this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
        }
      } else {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          this.rooms.delete(sanitizedRoomId);
          this._untrackSocket(socket.id, room.id);
          return;
        }
        if (room.creator === socket.id) {
          room.creator = room.players[0].id;
        }
      }
    }

    const spectatorIndex = room.spectators.findIndex((s) => s.id === socket.id);
    if (spectatorIndex !== -1) {
      room.spectators.splice(spectatorIndex, 1);
    }

    this._untrackSocket(socket.id, room.id);
    this.io.to(room.id).emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
    this.sendRoomInfo(room.id);
  }

  reconnect(socket, { roomId, playerId }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room) {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Room not found' });
      return;
    }

    let player = room.players.find((p) => p.id === playerId);
    if (player) {
      socket.join(room.id);
      player.id = socket.id;
      player.connected = true;
      this._trackSocket(socket.id, room.id);

      this.clearTimer(`empty_${sanitizedRoomId}`);

      if (room.gameState === 'paused') {
        const activeCount = room.players.filter((p) => p.connected).length;
        if (activeCount >= 2) {
          room.gameState = 'playing';
          this.io.to(room.id).emit(`${this.gamePrefix}_alert`, {
            icon: 'success',
            title: 'Player Reconnected',
            text: 'Game resumed!',
          });
        }
      }
    } else {
      const spectator = room.spectators.find((s) => s.id === playerId);
      if (spectator) {
        socket.join(room.id);
        spectator.id = socket.id;
        spectator.connected = true;
        this._trackSocket(socket.id, room.id);
      }
    }

    this.sendRoomInfo(room.id);
  }

  startGame(socket, { roomId }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.creator !== socket.id) return;
    if (room.players.length < 2) return;

    room.gameState = 'playing';
    room.currentTurn = 0;
    this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_gameStarted`, { firstTurn: room.players[0].id });
    this.sendRoomInfo(sanitizedRoomId);
  }

  restartGame(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.creator !== socket.id) return;

    room.gameState = 'waiting';
    room.board = Array(room.size)
      .fill(null)
      .map(() => Array(room.size).fill(null));
    room.scores = { 0: 0, 1: 0 };
    room.currentTurn = null;
    room.formedPatterns = [];
    room.moveCount = 0;
    room.latestPattern = null;

    this.io.to(room.id).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(sanitizedRoomId);
  }

  makeMove(socket, { roomId, row, col, value }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.gameState !== 'playing') return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;
    if (playerIndex !== room.currentTurn) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Not your turn',
        text: `Wait for your turn`,
      });
      return;
    }
    if (!room.players[playerIndex].connected) return;

    if (row < 0 || row >= room.size || col < 0 || col >= room.size) return;
    if (room.board[row][col] !== null) return;
    if (!['S', 'O'].includes(value)) return;

    room.board[row][col] = { player: playerIndex, value };
    room.moveCount += 1;

    const patterns = this.detectSOS(room, row, col);
    patterns.forEach((pattern) => {
      room.scores[playerIndex] += 1;
      room.formedPatterns.push({ ...pattern, player: playerIndex });
    });

    room.latestPattern = patterns.length > 0 ? { ...patterns[0], player: playerIndex } : null;

    if (patterns.length > 0) {
      // Extra turn on scoring
      this.io.to(room.id).emit(`${this.gamePrefix}_scoreFlash`, {
        playerIndex,
        patternCount: patterns.length,
        patterns,
      });
      this.io.to(room.id).emit(`${this.gamePrefix}_moveMade`, {
        row,
        col,
        value,
        playerIndex,
        patterns,
        scores: { ...room.scores },
        currentTurn: room.currentTurn,
        moveCount: room.moveCount,
        totalCells: room.size * room.size,
      });
    } else {
      room.currentTurn = room.currentTurn === 0 ? 1 : 0;
      room.latestPattern = null;
      this.io.to(room.id).emit(`${this.gamePrefix}_moveMade`, {
        row,
        col,
        value,
        playerIndex,
        patterns: [],
        scores: { ...room.scores },
        currentTurn: room.currentTurn,
        moveCount: room.moveCount,
        totalCells: room.size * room.size,
      });
    }

    if (this.checkGameOver(room)) {
      this.emitGameOver(room);
    } else {
      this.sendRoomInfo(room.id);
    }
  }

  detectSOS(room, row, col) {
    const patterns = [];
    const size = room.size;
    const placedValue = room.board[row][col].value;

    const directions = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
    ];

    for (const [dr, dc] of directions) {
      for (const sign of [-1, 1]) {
        const r1 = row + dr * sign;
        const c1 = col + dc * sign;
        const r2 = row - dr * sign;
        const c2 = col - dc * sign;

        if (r1 >= 0 && r1 < size && c1 >= 0 && c1 < size && r2 >= 0 && r2 < size && c2 >= 0 && c2 < size) {
          const cell1 = room.board[r1][c1];
          const cell2 = room.board[r2][c2];
          if (cell1 && cell2) {
            const values = [cell1.value, placedValue, cell2.value];
            if (values[0] === 'S' && values[1] === 'O' && values[2] === 'S') {
              patterns.push({
                cells: [
                  { row: r1, col: c1 },
                  { row, col },
                  { row: r2, col: c2 },
                ],
              });
            }
          }
        }
      }
    }

    return patterns;
  }

  checkGameOver(room) {
    for (let r = 0; r < room.size; r++) {
      for (let c = 0; c < room.size; c++) {
        if (room.board[r][c] === null) return false;
      }
    }
    return room.gameState !== 'ended';
  }

  emitGameOver(room) {
    room.gameState = 'ended';

    const p1Score = room.scores[0];
    const p2Score = room.scores[1];

    let winner = null;
    if (p1Score > p2Score) winner = room.players[0].id;
    else if (p2Score > p1Score) winner = room.players[1].id;

    this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
      winner,
      scores: { ...room.scores },
      players: room.players.map((p) => ({ id: p.id, name: p.name })),
    });
  }

  handleDisconnect(socket) {
    const roomIds = this.socketRooms.get(socket.id);
    if (!roomIds) return;

    for (const roomId of [...roomIds]) {
      const room = this.rooms.get(roomId);
      if (!room) continue;

      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players[playerIndex].connected = false;

        if (room.gameState === 'playing') {
          const activeCount = room.players.filter((p) => p.connected).length;

          if (activeCount === 0) {
            this.registerEmptyTimer(roomId, () => {
              this.rooms.delete(roomId);
            });
          } else if (activeCount === 1) {
            room.gameState = 'paused';
            this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
          }

          this.io.to(room.id).emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
          this.sendRoomInfo(room.id);
        }
      }

      const spectatorIndex = room.spectators.findIndex((s) => s.id === socket.id);
      if (spectatorIndex !== -1) {
        room.spectators[spectatorIndex].connected = false;
      }
    }

    this.socketRooms.delete(socket.id);
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    this.io.to(roomId).emit(`${this.gamePrefix}_roomInfo`, room);
  }
}

module.exports = SOSManager;

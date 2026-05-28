const BaseManager = require('./BaseManager');

class Connect4Manager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'c4';
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

  createRoom(socket, { playerName }) {
    const roomId = this.generateRoomId();
    socket.join(roomId);

    const room = {
      id: roomId,
      creator: socket.id,
      players: [{ id: socket.id, name: this.sanitizePlayerName(playerName), connected: true }],
      spectators: [],
      gameState: 'waiting',
      board: this.createEmptyBoard(),
      currentTurn: null,
      winner: null,
      lastMove: null,
      moveCount: 0,
    };

    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    this.sendRoomInfo(roomId);
  }

  createEmptyBoard() {
    return Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));
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
    room.board = this.createEmptyBoard();
    room.currentTurn = null;
    room.winner = null;
    room.lastMove = null;
    room.moveCount = 0;

    this.io.to(room.id).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(sanitizedRoomId);
  }

  makeMove(socket, { roomId, column }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.gameState !== 'playing') return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1 || playerIndex !== room.currentTurn) return;
    if (!room.players[playerIndex].connected) return;

    if (column < 0 || column >= 7) return;

    const col = column;
    let row = -1;
    for (let r = 5; r >= 0; r--) {
      if (room.board[r][col] === null) {
        row = r;
        break;
      }
    }

    if (row === -1) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'warning',
        title: 'Column Full',
        text: 'This column is full. Choose another column.',
      });
      return;
    }

    room.board[row][col] = playerIndex;
    room.lastMove = { row, col };
    room.moveCount += 1;

    const winLine = this.checkWin(room, row, col);
    if (winLine) {
      room.winner = room.players[playerIndex].id;
      room.gameState = 'ended';
      this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
        winner: room.winner,
        winLine,
        board: room.board,
        moveCount: room.moveCount,
      });
    } else if (this.checkDraw(room)) {
      room.gameState = 'ended';
      this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
        winner: null,
        winLine: null,
        board: room.board,
        moveCount: room.moveCount,
      });
    } else {
      room.currentTurn = room.currentTurn === 0 ? 1 : 0;
      this.io.to(room.id).emit(`${this.gamePrefix}_moveMade`, {
        row,
        col,
        playerIndex,
        board: room.board,
        currentTurn: room.currentTurn,
        moveCount: room.moveCount,
      });
      this.sendRoomInfo(room.id);
    }
  }

  checkWin(room, row, col) {
    const player = room.board[row][col];
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (const [dr, dc] of directions) {
      let count = 1;
      const line = [{ row, col }];

      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < 6 && c >= 0 && c < 7 && room.board[r][c] === player) {
          count++;
          line.push({ row: r, col: c });
        } else break;
      }

      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < 6 && c >= 0 && c < 7 && room.board[r][c] === player) {
          count++;
          line.unshift({ row: r, col: c });
        } else break;
      }

      if (count >= 4) {
        return line.slice(0, 4);
      }
    }

    return null;
  }

  checkDraw(room) {
    for (let c = 0; c < 7; c++) {
      if (room.board[0][c] === null) return false;
    }
    return true;
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

module.exports = Connect4Manager;

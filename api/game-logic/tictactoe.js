const BaseManager = require('./BaseManager');

class TicTacToeManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'ttt';
  }

  handleConnection(socket) {
    socket.on('ttt_createRoom', (playerName) => this.createRoom(socket, playerName));
    socket.on('ttt_joinRoom', (data) => this.joinRoom(socket, data));
    socket.on('ttt_makeMove', (data) => this.makeMove(socket, data));
    socket.on('ttt_restartGame', (roomId) => this.restartGame(socket, roomId));
    socket.on('ttt_leaveRoom', (roomId) => this.leaveRoom(socket, roomId));
    socket.on('ttt_reconnect', (data) => this.reconnect(socket, data));
    socket.on('ttt_requestRoomInfo', (roomId) => {
      const sanitized = this.sanitizeRoomId(roomId);
      if (sanitized) this.sendRoomInfo(sanitized);
    });
    socket.on('disconnect', () => this.handleDisconnect(socket));
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
    const roomId = this.generateRoomId();
    socket.join(roomId);
    const room = {
      id: roomId,
      players: [{ id: socket.id, name: playerName, connected: true }],
      board: Array(9).fill(null),
      gameState: 'waiting',
      currentTurn: null,
      emptyTimer: null,
      forfeitTimer: null,
    };
    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room || room.players.length >= 2) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: room ? 'Room full' : 'Not found',
      });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName, connected: true });
    this._trackSocket(socket.id, room.id);
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;

    this.clearTimer(`empty_${roomId}`);
    this.io.to(room.id).emit(`${this.gamePrefix}_gameStarted`);
    this.sendRoomInfo(room.id);
  }

  makeMove(socket, { roomId, position }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.gameState !== 'playing' || room.currentTurn !== socket.id) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    const symbol = playerIndex === 0 ? 'X' : 'O';

    if (position < 0 || position > 8) return;
    if (room.board[position] === null) {
      room.board[position] = symbol;
      this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_moveMade`, { position, symbol, board: room.board });

      const result = this.checkWinner(room.board);
      if (result) {
        room.gameState = 'ended';
        if (result.draw) {
          this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_gameDraw`);
        } else {
          this.io
            .to(sanitizedRoomId)
            .emit(`${this.gamePrefix}_gameWon`, { winner: socket.id, winningLine: result.line });
        }
      } else {
        room.currentTurn = room.players.find((p) => p.id !== socket.id).id;
        this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_nextTurn`, room.currentTurn);
      }
    }
  }

  restartGame(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;
    room.board = Array(9).fill(null);
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;
    this.io.to(roomIdSanitized).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(roomIdSanitized);
  }

  leaveRoom(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;

    if (room.gameState === 'playing') {
      room.players[playerIndex].connected = false;

      const activeCount = room.players.filter((p) => p.connected).length;

      if (activeCount === 0) {
        this.registerEmptyTimer(roomIdSanitized, () => {
          this.rooms.delete(roomIdSanitized);
        });
      } else if (activeCount === 1) {
        room.gameState = 'paused';
        this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, {
          reason: 'Opponent disconnected',
        });
      }
    } else {
      room.players.splice(playerIndex, 1);
      if (room.players.length === 0) {
        this.rooms.delete(roomIdSanitized);
        return;
      }
    }

    this._untrackSocket(socket.id, room.id);
    this.io.to(room.id).emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
    this.sendRoomInfo(room.id);
  }

  reconnect(socket, { roomId, playerId }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Room not found' });
      return;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Player not found in room' });
      return;
    }

    socket.join(room.id);
    player.id = socket.id;
    player.connected = true;
    this._trackSocket(socket.id, room.id);

    this.clearTimer(`empty_${roomIdSanitized}`);

    if (room.gameState === 'paused') {
      const activeCount = room.players.filter((p) => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = 'playing';
        this.clearTimer(`forfeit_${roomIdSanitized}`);
        this.io.to(room.id).emit(`${this.gamePrefix}_alert`, {
          icon: 'success',
          title: 'Player Reconnected',
          text: 'Game resumed!',
        });
      }
    }

    this.sendRoomInfo(room.id);
  }

  handleDisconnect(socket) {
    const roomIds = this.socketRooms.get(socket.id);
    if (!roomIds) return;
    for (const roomId of [...roomIds]) {
      const room = this.rooms.get(roomId);
      if (!room) continue;
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex === -1) continue;

      room.players[playerIndex].connected = false;

      if (room.gameState === 'playing') {
        const activeCount = room.players.filter((p) => p.connected).length;

        if (activeCount === 0) {
          this.registerEmptyTimer(roomId, () => {
            this.rooms.delete(roomId);
          });
        } else if (activeCount === 1) {
          room.gameState = 'paused';
          this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, {
            reason: 'Opponent disconnected',
          });
        }

        this.io.to(room.id).emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
        this.sendRoomInfo(room.id);
      }
    }
    this.socketRooms.delete(socket.id);
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (room) this.io.to(roomId).emit(`${this.gamePrefix}_roomInfo`, room);
  }
}

module.exports = TicTacToeManager;

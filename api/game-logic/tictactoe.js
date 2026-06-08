const BaseManager = require('./BaseManager');

class TicTacToeManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'ttt';
  }

  handleConnection(socket) {
    this.onSocketEvent(socket, 'ttt_createRoom', (data) => this.createRoom(socket, data));
    this.onSocketEvent(socket, 'ttt_joinRoom', (data) => this.joinRoom(socket, data));
    this.onSocketEvent(socket, 'ttt_makeMove', (data) => this.makeMove(socket, data));
    this.onSocketEvent(socket, 'ttt_restartGame', (roomId) => this.restartGame(socket, roomId));
    this.onSocketEvent(socket, 'ttt_leaveRoom', (roomId) => this.leaveRoom(socket, roomId));
    this.onSocketEvent(socket, 'ttt_reconnect', (data) => this.reconnect(socket, data));
    this.onSocketEvent(socket, 'ttt_requestRoomInfo', (roomId) => {
      const sanitized = this.sanitizeRoomId(roomId);
      if (sanitized) this.sendRoomInfo(sanitized);
    });
    this.onSocketEvent(socket, 'server_shutdown', () => {
      const rooms = this.socketRooms.get(socket.id);
      if (rooms) {
        for (const roomId of rooms) {
          this.clearAllTimersForRoom(roomId);
        }
      }
    });
    this.onSocketEvent(socket, 'disconnect', () => this.handleDisconnect(socket));
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

  createRoom(socket, data) {
    const { playerName, avatarIcon, color } = typeof data === 'string' ? { playerName: data } : data;
    const roomId = this.generateRoomId();
    socket.join(roomId);
    const room = {
      id: roomId,
      creator: socket.id,
      players: [
        {
          id: socket.id,
          name: playerName,
          avatarIcon,
          color,
          connected: true,
        },
      ],
      settings: {},
      board: Array(9).fill(null),
      gameState: 'waiting',
      currentTurn: null,
    };
    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, data) {
    const { roomId, playerName, avatarIcon, color } =
      typeof data === 'string' ? { roomId: data, playerName: 'Player' } : data;
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
    room.players.push({
      id: socket.id,
      name: playerName,
      avatarIcon,
      color,
      connected: true,
    });
    this._trackSocket(socket.id, room.id);
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;

    this.clearTimer(`empty_${roomIdSanitized}`);
    this.io.to(room.id).emit(`${this.gamePrefix}_gameStarted`);
    this.sendRoomInfo(room.id);
  }

  makeMove(socket, { roomId, position }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.gameState !== 'playing' || room.currentTurn !== socket.id) return;

    if (position < 0 || position > 8) return;
    if (room.board[position] === null) {
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      const symbol = playerIndex === 0 ? 'X' : 'O';
      room.board[position] = symbol;
      this.io
        .to(sanitizedRoomId)
        .emit(`${this.gamePrefix}_moveMade`, { position, symbol, board: room.board, lastMove: { position, symbol } });

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
        this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_nextTurn`, { nextPlayerId: room.currentTurn });
      }
    }
  }

  restartGame(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;
    const creator = room.creator || room.players[0]?.id;
    if (creator !== socket.id) return;
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
    const validation = this.validateReconnectPayload({ roomId, playerId }, socket);
    if (!validation) return false;

    const roomIdSanitized = validation.roomId;
    const room = this.rooms.get(roomIdSanitized);

    if (!room) {
      this.onSocketError(socket, new Error(`Room ${roomId} not found`), 'reconnect');
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Room Not Found',
        text: 'The room you were trying to reconnect to no longer exists.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'room_not_found',
        roomId: roomIdSanitized,
      });
      return false;
    }

    const player = room.players.find((p) => p.id === validation.playerId);
    if (!player) {
      this.onSocketError(socket, new Error(`Player ${playerId} not found in room`), 'reconnect');
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Player Not Found',
        text: 'Your player session was not found in the room.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'player_not_found',
        roomId: roomIdSanitized,
      });
      return false;
    }

    if (room.gameState === 'ended') {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'info',
        title: 'Game Ended',
        text: 'Cannot reconnect to an ended game.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'game_already_ended',
        roomId: roomIdSanitized,
      });
      return false;
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
    if (!room) return;
    const cleanRoom = {
      ...room,
      turnTimer: undefined,
      forfeitTimer: undefined,
      emptyTimer: undefined,
    };
    this.io.to(roomId).emit(`${this.gamePrefix}_roomInfo`, cleanRoom);
  }
}

module.exports = TicTacToeManager;

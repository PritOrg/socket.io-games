const { v4: uuidv4 } = require('uuid');
const BaseManager = require('./BaseManager');

class BingoManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'bingo';
  }

  handleConnection(socket) {
    this.onSocketEvent(socket, `${this.gamePrefix}_createRoom`, (creatorName) => this.createRoom(socket, creatorName));
    this.onSocketEvent(socket, `${this.gamePrefix}_joinRoom`, (data) => this.joinRoom(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_startGame`, (roomId) => this.startGame(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_markNumber`, (data) => this.markNumber(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_achieved`, (roomId) => this.bingoAchieved(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_restartGame`, (roomId) => this.restartGame(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_leaveRoom`, (roomId) => this.leaveRoom(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_reconnect`, (data) => this.reconnect(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_requestRoomInfo`, (roomId) => {
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

  createRoom(socket, data) {
    // Support both old string format and new object format
    const creatorName = typeof data === 'string' ? data : data.creatorName || data.playerName;
    const avatarIcon = typeof data === 'object' ? data.avatarIcon : undefined;
    const color = typeof data === 'object' ? data.color : undefined;

    const roomId = uuidv4().slice(0, 6).toUpperCase();
    socket.join(roomId);
    const room = {
      id: roomId,
      creator: socket.id,
      players: [
        {
          id: socket.id,
          name: creatorName || 'Player 1',
          avatarIcon,
          color,
          connected: true,
        },
      ],
      settings: {},
      currentTurn: null,
      turnOrder: [socket.id],
      gameState: 'waiting',
      strikedNumbers: [],
      playerBoards: {},
      playerBingos: {},
    };
    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    this.sendRoomInfo(roomId);
    socket.emit(`${this.gamePrefix}_alert`, {
      icon: 'success',
      title: 'Room Created',
      text: `Bingo Room ${roomId}`,
    });
  }

  joinRoom(socket, { roomId, playerName, avatarIcon, color }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    if (!sanitizedRoomId) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'warning',
        title: 'Error',
        text: 'Invalid room ID',
      });
      return;
    }
    const room = this.rooms.get(sanitizedRoomId);
    if (!room) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'warning',
        title: 'Error',
        text: 'Room not found',
      });
      return;
    }
    if (room.players.length >= 10) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'warning',
        title: 'Full',
        text: 'Room is full',
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
    room.turnOrder.push(socket.id);
    this._trackSocket(socket.id, room.id);

    if (room.players.length >= 2 && room.gameState === 'waiting') {
      room.gameState = 'ready';
      room.currentTurn = room.players[0].id;
    }

    this.sendRoomInfo(room.id);
  }

  startGame(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.creator !== socket.id) return;
    if (room.players.length < 2) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'warning',
        title: 'Wait',
        text: 'Need at least 2 players!',
      });
      return;
    }
    if (room.gameState !== 'ready') return;

    room.gameState = 'playing';
    const firstPlayerId = room.turnOrder[0];
    room.currentTurn = firstPlayerId;

    room.players.forEach((player) => {
      const nums = Array.from({ length: 25 }, (_, i) => i + 1);
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      room.playerBoards[player.id] = nums;
      room.playerBingos[player.id] = 0;
    });

    this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_gameStarted`, {
      firstPlayerId,
      playerBoards: room.playerBoards,
    });
    this.sendRoomInfo(sanitizedRoomId);
  }

  restartGame(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.creator !== socket.id) return;

    room.strikedNumbers = [];
    room.markedNumbers = {};
    room.playerBoards = {};
    room.playerBingos = {};
    room.gameState = 'ready';
    room.currentTurn = room.players[0].id;
    this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(sanitizedRoomId);
  }

  getBingoLinesForPlayer(room, playerId) {
    const playerBoard = room.playerBoards[playerId];
    if (!playerBoard) return [];

    const lines = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 12, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24],
      [4, 8, 12, 16, 20],
    ];

    return lines.filter((line) => line.every((idx) => room.strikedNumbers.includes(playerBoard[idx])));
  }

  checkAndBroadcastBingo(room, playerId) {
    const completedLines = this.getBingoLinesForPlayer(room, playerId);
    const newBingoCount = completedLines.length;
    const oldBingoCount = room.playerBingos[playerId] || 0;

    if (newBingoCount > oldBingoCount) {
      room.playerBingos[playerId] = newBingoCount;

      this.io.to(room.id).emit(`${this.gamePrefix}_bingoProgress`, {
        playerId,
        bingoCount: newBingoCount,
        completedLines: completedLines.length,
      });

      if (newBingoCount >= 5) {
        return true;
      }
    }
    return false;
  }

  markNumber(socket, { roomId, number }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room || room.gameState !== 'playing') return;
    if (room.currentTurn !== socket.id) return;

    if (!Number.isInteger(number) || number < 1 || number > 25) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Invalid Number',
        text: 'Number must be between 1 and 25',
      });
      return;
    }

    if (room.strikedNumbers.includes(number)) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Already Called',
        text: `${number} was already called`,
      });
      return;
    }

    room.strikedNumbers.push(number);

    // Get all other players to check their bingo progress
    const otherPlayers = room.players.filter((p) => p.id !== socket.id);

    // Check bingo progress for current player
    if (this.checkAndBroadcastBingo(room, socket.id)) {
      room.gameState = 'ended';
      this.io.to(roomIdSanitized).emit(`${this.gamePrefix}_playerWon`, { winner: socket.id });
      this.sendRoomInfo(roomIdSanitized);
      return;
    }

    // Check bingo progress for all other players
    for (const player of otherPlayers) {
      this.checkAndBroadcastBingo(room, player.id);
    }

    const currentIndex = room.turnOrder.indexOf(socket.id);
    const nextIndex = (currentIndex + 1) % room.turnOrder.length;
    room.currentTurn = room.turnOrder[nextIndex];

    // Clear existing turn timer before emitting to prevent stale timer callback
    this.clearTimer(`turn_${roomIdSanitized}`);

    const timestamp = Date.now();

    this.io.to(roomIdSanitized).emit(`${this.gamePrefix}_numberMarked`, {
      number,
      nextTurn: room.currentTurn,
      strikedNumbers: room.strikedNumbers,
      markedBy: socket.id,
    });
    this.io.to(roomIdSanitized).emit(`${this.gamePrefix}_nextTurn`, {
      nextPlayerId: room.currentTurn,
      timestamp,
    });

    const timer = setTimeout(() => {
      const currentRoom = this.rooms.get(roomIdSanitized);
      if (currentRoom && currentRoom.gameState === 'playing') {
        const idx = currentRoom.turnOrder.indexOf(currentRoom.currentTurn);
        const nextIdx = (idx + 1) % currentRoom.turnOrder.length;
        currentRoom.currentTurn = currentRoom.turnOrder[nextIdx];
        const timeoutTimestamp = Date.now();
        this.io.to(roomIdSanitized).emit(`${this.gamePrefix}_nextTurn`, {
          nextPlayerId: currentRoom.currentTurn,
          timestamp: timeoutTimestamp,
        });
        this.sendRoomInfo(roomIdSanitized);
      }
    }, 30000);

    this.timers.set(`turn_${roomIdSanitized}`, timer);
  }

  bingoAchieved(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.gameState !== 'playing') return;

    const playerBoard = room.playerBoards[socket.id];
    if (!playerBoard) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Player board not found',
      });
      return;
    }

    const completedLines = this.getBingoLinesForPlayer(room, socket.id);
    if (completedLines.length < 5) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Invalid',
        text: `Need 5 lines for BINGO! You have ${completedLines.length}`,
      });
      return;
    }

    room.gameState = 'ended';
    this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_playerWon`, { winner: socket.id });
    this.sendRoomInfo(sanitizedRoomId);
  }

  leaveRoom(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;

    if (room.gameState === 'playing') {
      room.players[playerIndex].connected = false;

      this.clearTimer(`turn_${roomIdSanitized}`);

      const activeCount = room.players.filter((p) => p.connected).length;

      if (activeCount === 0) {
        this.registerEmptyTimer(roomIdSanitized, () => {
          this.rooms.delete(roomIdSanitized);
        });
      } else if (activeCount === 1) {
        room.gameState = 'paused';
        this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
      }
    } else {
      room.players.splice(playerIndex, 1);
      room.turnOrder = room.turnOrder.filter((id) => id !== socket.id);
      if (room.players.length === 0) {
        this.rooms.delete(roomIdSanitized);
        return;
      }
      if (room.creator === socket.id) {
        room.creator = room.players[0].id;
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
      this.onSocketError(socket, new Error(`Game has ended`), 'reconnect');
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'info',
        title: 'Game Ended',
        text: 'Cannot reconnect to an ended game. You will be redirected to the lobby.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'game_already_ended',
        roomId: roomIdSanitized,
      });
      return false;
    }

    socket.join(room.id);
    const oldId = player.id;
    player.id = socket.id;
    player.connected = true;
    this._trackSocket(socket.id, room.id);

    // Re-key per-player state dicts to new socket ID
    if (room.playerBoards[oldId]) {
      room.playerBoards[socket.id] = room.playerBoards[oldId];
      delete room.playerBoards[oldId];
    }
    if (room.playerBingos[oldId] !== undefined) {
      room.playerBingos[socket.id] = room.playerBingos[oldId];
      delete room.playerBingos[oldId];
    }
    // Clear empty timer on reconnect
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

    if (room.playerBoards[socket.id]) {
      socket.emit(`${this.gamePrefix}_playerBoard`, {
        board: room.playerBoards[socket.id],
      });
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
      if (playerIndex === -1) continue;

      if (room.gameState === 'playing') {
        room.players[playerIndex].connected = false;
        const activeCount = room.players.filter((p) => p.connected).length;

        if (activeCount === 0) {
          this.registerEmptyTimer(roomId, () => {
            this.rooms.delete(roomId);
          });
        } else if (activeCount === 1) {
          room.gameState = 'paused';
          this.clearTimer(`turn_${roomId}`);
          this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
        }
      } else {
        room.players.splice(playerIndex, 1);
        room.turnOrder = room.turnOrder.filter((id) => id !== socket.id);
        if (room.players.length === 0) {
          this.rooms.delete(roomId);
          continue;
        }
        if (room.creator === socket.id) {
          room.creator = room.players[0].id;
        }
      }

      this.io.to(room.id).emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
      this.sendRoomInfo(room.id);
    }
    this.socketRooms.delete(socket.id);
  }

  sendRoomInfo(roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room) return;
    const cleanRoom = {
      ...room,
      turnTimer: undefined,
      forfeitTimer: undefined,
      emptyTimer: undefined,
    };
    this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_roomInfo`, cleanRoom);
  }
}

module.exports = BingoManager;

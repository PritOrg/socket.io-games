const BaseManager = require('./BaseManager');

class DabManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'dab';
  }

  handleConnection(socket) {
    this.onSocketEvent(socket, `${this.gamePrefix}_createRoom`, (data) => this.createRoom(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_joinRoom`, (data) => this.joinRoom(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_reconnect`, (data) => this.reconnect(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_leaveRoom`, (roomId) => this.leaveRoom(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_makeMove`, (data) => this.makeMove(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_requestRedo`, (roomId) => this.requestRedo(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_respondRedo`, (data) => this.respondRedo(socket, data));
    this.onSocketEvent(socket, `${this.gamePrefix}_restartGame`, (roomId) => this.restartGame(socket, roomId));
    this.onSocketEvent(socket, `${this.gamePrefix}_startGame`, (data) => this.startGame(socket, data));
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

  createRoom(socket, { mode, customRows, customCols, customPlayers, playerName, avatarIcon, color }) {
    let rows, cols;
    switch (mode) {
      case 'classic':
        rows = 9;
        cols = 9;
        break;
      case 'extended':
        rows = 14;
        cols = 14;
        break;
      case 'marathon':
        rows = 19;
        cols = 19;
        break;
      case 'custom':
        rows = Math.max(1, Math.min(30, customRows ?? 5));
        cols = Math.max(1, Math.min(30, customCols ?? 5));
        break;
      default:
        rows = 9;
        cols = 9;
    }

    const maxPlayers = Math.max(2, Math.min(4, customPlayers || 2));
    const roomId = this.generateRoomId();
    socket.join(roomId);

    const room = {
      id: roomId,
      creator: socket.id,
      players: [
        {
          id: socket.id,
          name: playerName || 'Player 1',
          avatarIcon,
          color,
          connected: true,
        },
      ],
      gameState: 'waiting',
      currentTurn: 0,
      rows,
      cols,
      maxPlayers,
      settings: {},
      horizontalLines: Array(rows + 1)
        .fill(null)
        .map(() => Array(cols).fill(null)),
      verticalLines: Array(rows)
        .fill(null)
        .map(() => Array(cols + 1).fill(null)),
      boxes: Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null)),
      scores: Array(maxPlayers).fill(0),
      lastMove: null,
      lastMovePlayerIndex: null,
      lastClaimedBoxes: [],
      redoRequest: null,
      startedWithPlayers: maxPlayers,
    };

    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName, avatarIcon, color }) {
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
    if (room.gameState !== 'waiting') {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Game already in progress' });
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit(`${this.gamePrefix}_alert`, { icon: 'error', title: 'Error', text: 'Room is full' });
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

    this.sendRoomInfo(room.id);
  }

  leaveRoom(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room) return;

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;

    if (room.gameState === 'playing') {
      // B3: Timer cleanup on player leave/disconnect
      // Clear redo timer if the leaving player was involved in the redo request
      if (room.redoRequest) {
        const isRequester = room.redoRequest.requesterId === socket.id;
        const isTarget = room.redoRequest.targetId === socket.id;
        if (isRequester || isTarget) {
          this.clearTimer(`redo_${sanitizedRoomId}`);
          room.redoRequest = null;
        }
      }

      // B5: Clear lastMove if relevant player disconnects
      if (room.lastMovePlayerIndex !== null && playerIndex === room.lastMovePlayerIndex) {
        room.lastMove = null;
        room.lastMovePlayerIndex = null;
        room.lastClaimedBoxes = [];
      }

      room.players[playerIndex].connected = false;

      const activeCount = room.players.filter((p) => p.connected).length;

      if (activeCount === 0) {
        this.registerEmptyTimer(sanitizedRoomId, () => {
          this.rooms.delete(sanitizedRoomId);
        });
      } else if (activeCount === 1) {
        const canContinue = room.startedWithPlayers >= 4;
        if (!canContinue) {
          room.gameState = 'paused';
          this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
        }
      }
    } else {
      room.players.splice(playerIndex, 1);
      if (room.players.length === 0) {
        this.rooms.delete(sanitizedRoomId);
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

  restartGame(socket, roomId) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room) return;
    if (room.creator !== socket.id) return;

    room.gameState = 'waiting';
    room.currentTurn = 0;
    room.horizontalLines = Array(room.rows + 1)
      .fill(null)
      .map(() => Array(room.cols).fill(null));
    room.verticalLines = Array(room.rows)
      .fill(null)
      .map(() => Array(room.cols + 1).fill(null));
    room.boxes = Array(room.rows)
      .fill(null)
      .map(() => Array(room.cols).fill(null));
    room.scores = Array(room.maxPlayers).fill(0);
    room.lastMove = null;
    room.lastMovePlayerIndex = null;
    room.lastClaimedBoxes = [];
    room.redoRequest = null;
    room.startedWithPlayers = room.maxPlayers;

    this.io.to(room.id).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(room.id);
  }

  startGame(socket, { roomId }) {
    const sanitizedRoomId = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(sanitizedRoomId);
    if (!room || room.creator !== socket.id) return;
    if (room.players.length < 2) return;

    room.gameState = 'playing';
    room.currentTurn = 0;
    room.startedWithPlayers = room.players.length;
    this.io.to(sanitizedRoomId).emit(`${this.gamePrefix}_gameStarted`, { firstTurn: room.players[0].id });
    this.sendRoomInfo(sanitizedRoomId);
  }

  requestRedo(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room || room.gameState !== 'playing') return;
    if (room.lastMove === null) return;

    // Only the player who made the last move can request a redo
    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1) return;

    // Check if this player made the last move (stored in lastMove playerIndex context)
    // We need to track who made the last move - use redoData from moveResult as reference
    const lastMoverIndex = room.lastMovePlayerIndex;
    if (playerIndex !== lastMoverIndex) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Not Allowed',
        text: 'Only the player who just moved can request a redo.',
      });
      return;
    }

    // Determine who can respond (the next player in turn order)
    const nextPlayerIndex = this.getNextTurn(room);

    // Clear any existing redo request timer
    this.clearTimer(`redo_${roomIdSanitized}`);

    room.redoRequest = {
      requesterId: socket.id,
      requesterIndex: playerIndex,
      requesterName: room.players[playerIndex].name,
      targetId: room.players[nextPlayerIndex].id,
      lastMove: room.lastMove ? { ...room.lastMove } : null,
      claimedBoxes: [...room.lastClaimedBoxes],
    };

    // Set redo request timer - auto-expire after 15 seconds
    const timer = setTimeout(() => {
      room.redoRequest = null;
      this.io.to(roomIdSanitized).emit(`${this.gamePrefix}_redoCancelled`);
      this.sendRoomInfo(roomIdSanitized);
    }, 15000);

    this.timers.set(`redo_${roomIdSanitized}`, timer);

    this.io.to(room.id).emit(`${this.gamePrefix}_redoRequested`, {
      requesterId: socket.id,
      requesterName: room.players[playerIndex].name,
    });
  }

  respondRedo(socket, { roomId, accept }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room || room.gameState !== 'playing' || !room.redoRequest) return;

    if (socket.id !== room.redoRequest.targetId) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Not Allowed',
        text: 'Only the immediate player can respond to this redo request.',
      });
      return;
    }

    const requester = room.players[room.redoRequest.requesterIndex];
    if (!requester || !requester.connected) {
      this.clearTimer(`redo_${roomIdSanitized}`);
      room.redoRequest = null;
      this.io.to(room.id).emit(`${this.gamePrefix}_redoResponse`, {
        accepted: false,
        reason: 'Requester disconnected.',
      });
      this.sendRoomInfo(room.id);
      return;
    }

    if (accept) {
      if (!room.redoRequest.lastMove) {
        this.clearTimer(`redo_${roomIdSanitized}`);
        room.redoRequest = null;
        this.io.to(room.id).emit(`${this.gamePrefix}_redoResponse`, { accepted: false });
        this.sendRoomInfo(room.id);
        return;
      }

      const { lineType, r, c } = room.redoRequest.lastMove;
      if (lineType === 'h') {
        room.horizontalLines[r][c] = null;
      } else {
        room.verticalLines[r][c] = null;
      }

      const claimedBoxes = room.redoRequest.claimedBoxes || [];
      const ri = room.redoRequest.requesterIndex;
      for (const cb of claimedBoxes) {
        if (cb && cb.r >= 0 && cb.r < room.rows && cb.c >= 0 && cb.c < room.cols) {
          room.boxes[cb.r][cb.c] = null;
          if (ri >= 0 && ri < room.scores.length) {
            room.scores[ri]--;
          }
        }
      }

      room.lastMove = null;
      room.lastMovePlayerIndex = null;
      room.lastClaimedBoxes = [];
      // Turn goes to the requester (who made the original move being redone)
      room.currentTurn = room.redoRequest.requesterIndex;

      this.io.to(room.id).emit(`${this.gamePrefix}_moveUndone`, {
        horizontalLines: room.horizontalLines,
        verticalLines: room.verticalLines,
        boxes: room.boxes,
        scores: [...room.scores],
        currentTurn: room.currentTurn,
      });
    } else {
      this.io.to(room.id).emit(`${this.gamePrefix}_redoResponse`, {
        accepted: false,
        requesterId: room.redoRequest.requesterId,
        requesterName: room.redoRequest.requesterName,
      });
    }

    this.clearTimer(`redo_${roomIdSanitized}`);
    room.redoRequest = null;
    this.sendRoomInfo(room.id);
  }

  reconnect(socket, { roomId, playerId }) {
    const validation = this.validateReconnectPayload({ roomId, playerId }, socket);
    if (!validation) return false;

    const sanitizedRoomId = validation.roomId;
    const room = this.rooms.get(sanitizedRoomId);

    if (!room) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Room Not Found',
        text: 'The room you were trying to reconnect to no longer exists.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'room_not_found',
        roomId: sanitizedRoomId,
      });
      return false;
    }

    const player = room.players.find((p) => p.id === validation.playerId);
    if (!player) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Player Not Found',
        text: 'Your player session was not found in the room.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'player_not_found',
        roomId: sanitizedRoomId,
      });
      return false;
    }

    if (room.gameState === 'ended') {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'info',
        title: 'Game Ended',
        text: 'Cannot reconnect to an ended game. You will be redirected to the lobby.',
      });
      socket.emit(`${this.gamePrefix}_reconnectFailed`, {
        reason: 'game_already_ended',
        roomId: sanitizedRoomId,
      });
      return false;
    }

    socket.join(room.id);
    const oldId = player.id;
    player.id = socket.id;
    player.connected = true;
    this._trackSocket(socket.id, room.id);

    // B5: Clear lastMove if relevant player reconnects (for redo eligibility)
    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (room.lastMovePlayerIndex !== null && playerIndex !== room.lastMovePlayerIndex) {
      room.lastMove = null;
      room.lastMovePlayerIndex = null;
      room.lastClaimedBoxes = [];
    }

    this.clearTimer(`empty_${sanitizedRoomId}`);

    if (room.gameState === 'paused') {
      const activeCount = room.players.filter((p) => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = 'playing';
        this.clearTimer(`forfeit_${sanitizedRoomId}`);
        this.io.to(room.id).emit(`${this.gamePrefix}_playerReconnected`, { playerId: socket.id });
        this.io.to(room.id).emit(`${this.gamePrefix}_alert`, {
          icon: 'success',
          title: 'Player Reconnected',
          text: 'Game resumed!',
        });
      }
    }

    this.sendRoomInfo(room.id);
  }

  makeMove(socket, { roomId, lineType, r, c }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room || room.gameState !== 'playing') return;

    if (!room.players[room.currentTurn].connected) {
      room.currentTurn = this.getNextTurn(room);
    }

    const playerIndex = room.players.findIndex((p) => p.id === socket.id);
    if (playerIndex === -1 || playerIndex !== room.currentTurn) return;
    if (!room.players[playerIndex].connected) return;

    if (typeof r !== 'number' || typeof c !== 'number') return;
    if (!['h', 'v'].includes(lineType)) return;
    if (lineType === 'h' && (r < 0 || r > room.rows || c < 0 || c >= room.cols)) return;
    if (lineType === 'v' && (r < 0 || r >= room.rows || c < 0 || c > room.cols)) return;

    if (lineType === 'h' && room.horizontalLines[r][c] !== null) return;
    if (lineType === 'v' && room.verticalLines[r][c] !== null) return;

    if (lineType === 'h') {
      room.horizontalLines[r][c] = playerIndex;
    } else {
      room.verticalLines[r][c] = playerIndex;
    }

    room.lastMove = { lineType, r, c };
    room.lastMovePlayerIndex = playerIndex;

    if (room.redoRequest) {
      this.clearTimer(`redo_${roomIdSanitized}`);
      room.redoRequest = null;
    }

    const claimedBoxes = this.checkBoxes(room, r, c, lineType, playerIndex);

    room.lastClaimedBoxes = claimedBoxes;

    if (claimedBoxes.length === 0) {
      room.currentTurn = this.getNextTurn(room);
    }

    this.io.to(roomId).emit(`${this.gamePrefix}_moveResult`, {
      lineType,
      r,
      c,
      claimedBoxes,
      scores: [...room.scores],
      currentTurn: room.currentTurn,
      playerIndex,
      redoData: {
        requesterId: room.players[playerIndex].id,
        requesterIndex: playerIndex,
        lastMove: { lineType, r, c },
        claimedBoxes: [...claimedBoxes],
      },
    });

    if (this.checkGameOver(room)) {
      this.emitGameOver(room);
    }
  }

  checkBoxes(room, r, c, lineType, playerIndex) {
    const claimed = [];

    const boxesToCheck = [];
    if (lineType === 'h') {
      if (r > 0) boxesToCheck.push({ boxR: r - 1, boxC: c });
      if (r < room.rows) boxesToCheck.push({ boxR: r, boxC: c });
    } else {
      if (c > 0) boxesToCheck.push({ boxR: r, boxC: c - 1 });
      if (c < room.cols) boxesToCheck.push({ boxR: r, boxC: c });
    }

    for (const { boxR, boxC } of boxesToCheck) {
      if (boxR < 0 || boxR >= room.rows || boxC < 0 || boxC >= room.cols) continue;
      if (room.boxes[boxR][boxC] !== null) continue;

      if (this.isBoxComplete(room, boxR, boxC)) {
        room.boxes[boxR][boxC] = playerIndex;
        room.scores[playerIndex]++;
        claimed.push({ r: boxR, c: boxC });
      }
    }

    return claimed;
  }

  isBoxComplete(room, boxR, boxC) {
    return (
      room.horizontalLines[boxR][boxC] !== null &&
      room.horizontalLines[boxR + 1][boxC] !== null &&
      room.verticalLines[boxR][boxC] !== null &&
      room.verticalLines[boxR][boxC + 1] !== null
    );
  }

  getNextTurn(room) {
    let nextTurn = (room.currentTurn + 1) % room.players.length;
    const activeCount = room.players.filter((p) => p.connected).length;
    if (activeCount > 1) {
      let safety = 0;
      while (!room.players[nextTurn].connected && safety < room.players.length) {
        nextTurn = (nextTurn + 1) % room.players.length;
        safety++;
      }
    }
    return nextTurn;
  }

  checkGameOver(room) {
    const totalBoxes = room.rows * room.cols;
    const claimedBoxes = room.scores.reduce((sum, s) => sum + s, 0);
    return claimedBoxes >= totalBoxes;
  }

  emitGameOver(room) {
    room.gameState = 'ended';

    const maxScore = Math.max(...room.scores);
    const winners = room.scores
      .map((score, index) => ({ index, score, player: room.players[index] }))
      .filter((entry) => entry.score === maxScore);

    if (winners.length === 1) {
      this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
        winner: winners[0].player.id,
        scores: [...room.scores],
      });
    } else {
      this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
        winner: null,
        scores: [...room.scores],
        winners: winners.map((w) => w.player.id),
      });
    }

    this.clearTimer(`forfeit_${room.id}`);
  }

  handleDisconnect(socket) {
    const roomIds = this.socketRooms.get(socket.id);
    if (!roomIds) return;
    for (const roomId of [...roomIds]) {
      const room = this.rooms.get(roomId);
      if (!room) continue;
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex === -1) continue;

      // B3: Timer cleanup on player leave/disconnect
      // Clear redo timer if the disconnecting player was involved in the redo request
      if (room.redoRequest) {
        const isRequester = room.redoRequest.requesterId === socket.id;
        const isTarget = room.redoRequest.targetId === socket.id;
        if (isRequester || isTarget) {
          this.clearTimer(`redo_${roomId}`);
          room.redoRequest = null;
        }
      }

      // B5: Clear lastMove if relevant player disconnects
      if (room.lastMovePlayerIndex !== null && playerIndex === room.lastMovePlayerIndex) {
        room.lastMove = null;
        room.lastMovePlayerIndex = null;
        room.lastClaimedBoxes = [];
      }

      room.players[playerIndex].connected = false;

      if (room.gameState === 'playing') {
        const activeCount = room.players.filter((p) => p.connected).length;

        if (activeCount === 0) {
          this.registerEmptyTimer(roomId, () => {
            this.rooms.delete(roomId);
          });
        } else if (activeCount === 1) {
          const canContinue = room.startedWithPlayers >= 4;
          if (!canContinue) {
            room.gameState = 'paused';
            this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
          }
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

module.exports = DabManager;

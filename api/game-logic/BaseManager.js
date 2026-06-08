const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class BaseManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
    this.timers = new Map();
    this.socketRooms = new Map();
  }

  onSocketError(socket, error, context) {
    const prefix = this.gamePrefix ? this.gamePrefix.toUpperCase() : 'SERVER';
    logger.error(prefix, `Error in ${context}`, {
      socketId: socket?.id,
      message: error?.message || String(error),
    });
  }

  validateReconnectPayload(data, socket) {
    if (!data || typeof data !== 'object') {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Invalid Reconnection',
        text: 'Reconnection data missing or malformed',
      });
      return null;
    }
    if (!data.roomId || typeof data.roomId !== 'string') {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Invalid Reconnection',
        text: 'Room ID is required',
      });
      return null;
    }
    if (!data.playerId || typeof data.playerId !== 'string') {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Invalid Reconnection',
        text: 'Player ID is required',
      });
      return null;
    }
    return {
      roomId: this.sanitizeRoomId(data.roomId),
      playerId: data.playerId,
    };
  }

  handleReconnection(socket, roomId, playerId, roomCallbacks, gamePrefix) {
    const room = this.rooms.get(roomId);
    if (!room) {
      if (roomCallbacks?.onNotFound) roomCallbacks.onNotFound(socket, gamePrefix);
      return false;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      if (roomCallbacks?.onPlayerNotFound) roomCallbacks.onPlayerNotFound(socket, gamePrefix);
      return false;
    }

    return true;
  }

  handleReconnectFailure(socket, reason, roomId, gamePrefix) {
    socket.emit(`${gamePrefix}_reconnectFailed`, { reason, roomId });
    this.clearTimer(`empty_${roomId}`);
    this.clearAllTimersForRoom(roomId);
  }

  onSocketEvent(socket, eventName, handler) {
    socket.on(eventName, (...args) => {
      Promise.resolve()
        .then(() => handler(...args))
        .catch((error) => {
          const prefix = this.gamePrefix ? this.gamePrefix.toUpperCase() : 'SERVER';
          logger.error(prefix, `Unhandled error while processing ${eventName}`, {
            socketId: socket?.id,
            message: error?.message || String(error),
            stack: error?.stack,
          });

          if (this.gamePrefix) {
            socket.emit(`${this.gamePrefix}_alert`, {
              icon: 'error',
              title: 'Server Error',
              text: 'Something went wrong. Please try again.',
            });
          }
        });
    });
  }

  generateRoomId() {
    return uuidv4().slice(0, 6).toUpperCase();
  }

  _trackSocket(socketId, roomId) {
    if (!this.socketRooms.has(socketId)) {
      this.socketRooms.set(socketId, new Set());
    }
    this.socketRooms.get(socketId).add(roomId);
  }

  _untrackSocket(socketId, roomId) {
    const rooms = this.socketRooms.get(socketId);
    if (rooms) {
      rooms.delete(roomId);
      if (rooms.size === 0) this.socketRooms.delete(socketId);
    }
  }

  sanitizeRoomId(roomId) {
    if (!roomId || typeof roomId !== 'string') return null;
    return roomId.toUpperCase();
  }

  validatePlayerName(playerName) {
    if (typeof playerName !== 'string') return false;
    const trimmed = playerName.trim();
    return trimmed.length >= 1 && trimmed.length <= 20;
  }

  sanitizePlayerName(playerName) {
    if (!this.validatePlayerName(playerName)) return 'Anonymous';
    return playerName.trim();
  }

  clearTimer(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  registerEmptyTimer(roomId, callback) {
    const timerKey = `empty_${roomId}`;
    this.clearTimer(timerKey);
    this.timers.set(
      timerKey,
      setTimeout(
        () => {
          callback();
        },
        5 * 60 * 1000,
      ),
    );
  }

  handlePlayerLeave(socket, roomId, callbacks) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === socket.id);
    if (!player) return;

    player.connected = false;
    if (callbacks?.onPlayerLeft) callbacks.onPlayerLeft(room, socket, player);
  }

  clearAllTimersForRoom(roomId) {
    const keysToDelete = [];
    for (const key of this.timers.keys()) {
      if (key.includes(roomId)) {
        clearTimeout(this.timers.get(key));
        keysToDelete.push(key);
      }
    }
    for (const key of keysToDelete) {
      this.timers.delete(key);
    }
  }
}

module.exports = BaseManager;

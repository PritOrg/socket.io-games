class BaseManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
    this.timers = new Map();
    this.socketRooms = new Map();
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

  handleReconnection(socket, roomId, playerId, roomCallbacks, gamePrefix) {
    const room = this.rooms.get(roomId);
    if (!room) {
      if (roomCallbacks?.onNotFound) roomCallbacks.onNotFound(socket, gamePrefix);
      return;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      if (roomCallbacks?.onPlayerNotFound) roomCallbacks.onPlayerNotFound(socket, gamePrefix);
      return;
    }

    socket.join(room.id);
    player.id = socket.id;
    player.connected = true;

    if (roomCallbacks?.onReconnect) roomCallbacks.onReconnect(socket, room, player);

    this.clearTimer(`empty_${roomId}`);

    if (room.gameState === 'paused' && roomCallbacks?.onResume) {
      const activeCount = room.players.filter((p) => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = 'playing';
        if (room.forfeitTimer) {
          clearTimeout(room.forfeitTimer);
          room.forfeitTimer = null;
        }
        this.io.to(room.id).emit(`${gamePrefix}_alert`, {
          icon: 'success',
          title: 'Player Reconnected',
          text: 'Game resumed!',
        });
      }
    }

    if (roomCallbacks?.onUpdateRoom) roomCallbacks.onUpdateRoom(room, roomId);
  }
}

module.exports = BaseManager;

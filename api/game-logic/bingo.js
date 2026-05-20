const { v4: uuidv4 } = require('uuid');

class BingoManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  handleConnection(socket) {
    socket.on('bingo_createRoom', (creatorName) => this.createRoom(socket, creatorName));
    socket.on('bingo_joinRoom', (data) => this.joinRoom(socket, data));
    socket.on('bingo_startGame', (roomId) => this.startGame(socket, roomId));
    socket.on('bingo_markNumber', (data) => this.markNumber(socket, data));
    socket.on('bingo_achieved', (roomId) => this.bingoAchieved(socket, roomId));
    socket.on('bingo_restartGame', (roomId) => this.restartGame(socket, roomId));
    socket.on('bingo_leaveRoom', (roomId) => this.leaveRoom(socket, roomId));
    socket.on('bingo_reconnect', (data) => this.reconnect(socket, data));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  createRoom(socket, creatorName) {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    socket.join(roomId);
    const room = {
      id: roomId,
      creator: socket.id,
      players: [{ id: socket.id, name: creatorName }],
      currentTurn: null,
      turnOrder: [socket.id],
      gameState: 'waiting'
    };
    this.rooms.set(roomId, room);
    this.sendRoomInfo(roomId);
    socket.emit('bingo_alert', { icon: 'success', title: 'Room Created', text: `Bingo Room ${roomId}` });
  }

  joinRoom(socket, { roomId, playerName }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      socket.emit('bingo_alert', { icon: 'warning', title: 'Error', text: 'Room not found' });
      return;
    }
    if (room.players.length >= 10) {
      socket.emit('bingo_alert', { icon: 'warning', title: 'Full', text: 'Room is full' });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName });
    room.turnOrder.push(socket.id);

    if (room.players.length >= 2 && room.gameState === 'waiting') {
      room.gameState = 'ready';
      room.currentTurn = room.players[0].id;
    }

    this.sendRoomInfo(room.id);
  }

  startGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.creator !== socket.id) return;
    if (room.players.length < 2) {
      socket.emit('bingo_alert', { icon: 'warning', title: 'Wait', text: 'Need at least 2 players!' });
      return;
    }
    if (room.gameState !== 'ready') return;
    room.gameState = 'playing';
    const firstPlayerId = room.turnOrder[0];
    room.currentTurn = firstPlayerId;
    this.io.to(roomId).emit('bingo_gameStarted', firstPlayerId);
    this.sendRoomInfo(roomId);
  }

  restartGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.creator !== socket.id) return;
    room.gameState = 'ready';
    room.currentTurn = room.players[0].id;
    this.io.to(roomId).emit('bingo_gameRestarted');
    this.sendRoomInfo(roomId);
  }

  markNumber(socket, { roomId, number }) {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== 'playing') return;
    if (room.currentTurn !== socket.id) return;

    this.io.to(roomId).emit('bingo_numberMarked', { number, playerId: socket.id });

    const currentIndex = room.turnOrder.indexOf(socket.id);
    const nextIndex = (currentIndex + 1) % room.turnOrder.length;
    room.currentTurn = room.turnOrder[nextIndex];
    this.io.to(roomId).emit('bingo_nextTurn', room.currentTurn);
  }

  bingoAchieved(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== 'playing') return;
    if (room.currentTurn !== socket.id) return;
    room.gameState = 'ended';
    this.io.to(roomId).emit('bingo_playerWon', socket.id);
  }

  joinRoom(socket, { roomId, playerName }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      socket.emit('bingo_alert', { icon: 'warning', title: 'Error', text: 'Room not found' });
      return;
    }
    if (room.players.length >= 10) {
      socket.emit('bingo_alert', { icon: 'warning', title: 'Full', text: 'Room is full' });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName });
    room.turnOrder.push(socket.id);
    
    if (room.players.length >= 2 && room.gameState === 'waiting') {
      room.gameState = 'ready';
    }
    
    this.sendRoomInfo(room.id);
  }

  startGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (room && room.creator === socket.id && room.players.length >= 2) {
      room.gameState = 'playing';
      room.currentTurn = 0;
      this.io.to(roomId).emit('bingo_gameStarted', room.turnOrder[0]);
      this.sendRoomInfo(roomId);
    }
  }

  restartGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (room && room.creator === socket.id) {
      room.gameState = 'ready';
      room.currentTurn = 0;
      this.io.to(roomId).emit('bingo_gameRestarted');
      this.sendRoomInfo(roomId);
    }
  }

  markNumber(socket, { roomId, number }) {
    const room = this.rooms.get(roomId);
    if (room && room.gameState === 'playing' && room.turnOrder[room.currentTurn] === socket.id) {
      this.io.to(roomId).emit('bingo_numberMarked', { number, playerId: socket.id });
      room.currentTurn = (room.currentTurn + 1) % room.turnOrder.length;
      this.io.to(roomId).emit('bingo_nextTurn', room.turnOrder[room.currentTurn]);
    }
  }

  bingoAchieved(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.gameState = 'ended';
      this.io.to(roomId).emit('bingo_playerWon', socket.id);
    }
  }

  leaveRoom(socket, roomId) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1) return;

    room.players[playerIndex].connected = false;

    if (room.gameState === 'playing') {
      const activeCount = room.players.filter(p => p.connected).length;

      if (activeCount === 0) {
        room.emptyTimer = setTimeout(() => {
          this.rooms.delete(roomId);
        }, 5 * 60 * 1000);
      } else if (activeCount === 1) {
        room.gameState = 'paused';
        this.io.to(room.id).emit('bingo_gamePaused', { reason: 'Opponent disconnected' });
      }

      this.io.to(room.id).emit('bingo_playerLeft', { playerId: socket.id });
      this.sendRoomInfo(room.id);
    }
  }

  reconnect(socket, { roomId, playerId }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      socket.emit('bingo_alert', { icon: 'error', title: 'Error', text: 'Room not found' });
      return;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      socket.emit('bingo_alert', { icon: 'error', title: 'Error', text: 'Player not found in room' });
      return;
    }

    socket.join(room.id);
    player.id = socket.id;
    player.connected = true;

    if (room.emptyTimer) {
      clearTimeout(room.emptyTimer);
      room.emptyTimer = null;
    }

    if (room.gameState === 'paused') {
      const activeCount = room.players.filter(p => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = 'playing';
        if (room.forfeitTimer) {
          clearTimeout(room.forfeitTimer);
          room.forfeitTimer = null;
        }
        this.io.to(room.id).emit('bingo_alert', { icon: 'success', title: 'Player Reconnected', text: 'Game resumed!' });
      }
    }

    this.sendRoomInfo(room.id);
  }

  handleDisconnect(socket) {
    for (const [roomId, room] of this.rooms.entries()) {
      const index = room.players.findIndex(p => p.id === socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        room.turnOrder = room.turnOrder.filter(id => id !== socket.id);
        
        if (room.players.length === 0) {
          this.rooms.delete(roomId);
        } else {
          if (room.creator === socket.id) room.creator = room.players[0].id;
          this.io.to(roomId).emit('bingo_playerLeft', socket.id);
          this.sendRoomInfo(roomId);
        }
      }
    }
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (room) this.io.to(roomId).emit('bingo_roomInfo', room);
  }
}

module.exports = BingoManager;

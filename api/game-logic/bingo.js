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
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  createRoom(socket, creatorName) {
    const roomId = uuidv4().slice(0, 6).toUpperCase();
    socket.join(roomId);
    const room = {
      id: roomId,
      creator: socket.id,
      players: [{ id: socket.id, name: creatorName }],
      currentTurn: 0,
      gameState: 'waiting',
      turnOrder: [socket.id]
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
    }
    
    this.sendRoomInfo(room.id);
  }

  startGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (room && room.creator === socket.id) {
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

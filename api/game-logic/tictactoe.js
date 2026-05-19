class TicTacToeManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  handleConnection(socket) {
    socket.on('ttt_createRoom', (playerName) => this.createRoom(socket, playerName));
    socket.on('ttt_joinRoom', (data) => this.joinRoom(socket, data));
    socket.on('ttt_makeMove', (data) => this.makeMove(socket, data));
    socket.on('ttt_restartGame', (roomId) => this.restartGame(socket, roomId));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  checkWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    if (board.every(cell => cell !== null)) return { draw: true };
    return null;
  }

  createRoom(socket, playerName) {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.join(roomId);
    const room = {
      id: roomId,
      players: [{ id: socket.id, name: playerName }],
      board: Array(9).fill(null),
      gameState: 'waiting',
      currentTurn: null
    };
    this.rooms.set(roomId, room);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room || room.players.length >= 2) {
      socket.emit('ttt_alert', { icon: 'error', title: 'Error', text: room ? 'Room full' : 'Not found' });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName });
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;
    
    this.io.to(room.id).emit('ttt_gameStarted');
    this.sendRoomInfo(room.id);
  }

  restartGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.board = Array(9).fill(null);
      room.gameState = 'playing';
      room.currentTurn = room.players[0].id;
      this.io.to(roomId).emit('ttt_gameRestarted');
      this.sendRoomInfo(roomId);
    }
  }

  makeMove(socket, { roomId, position }) {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== 'playing' || room.currentTurn !== socket.id) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    const symbol = playerIndex === 0 ? 'X' : 'O';

    if (room.board[position] === null) {
      room.board[position] = symbol;
      this.io.to(roomId).emit('ttt_moveMade', { position, symbol, board: room.board });

      const result = this.checkWinner(room.board);
      if (result) {
        room.gameState = 'ended';
        if (result.draw) {
          this.io.to(roomId).emit('ttt_gameDraw');
        } else {
          this.io.to(roomId).emit('ttt_gameWon', { winner: socket.id, winningLine: result.line });
        }
      } else {
        room.currentTurn = room.players.find(p => p.id !== socket.id).id;
        this.io.to(roomId).emit('ttt_nextTurn', room.currentTurn);
      }
    }
  }

  handleDisconnect(socket) {
    for (const [roomId, room] of this.rooms.entries()) {
      const index = room.players.findIndex(p => p.id === socket.id);
      if (index !== -1) {
        room.players = room.players.filter(p => p.id !== socket.id);
        if (room.players.length === 0) {
          this.rooms.delete(roomId);
        } else {
          room.gameState = 'waiting';
          room.board = Array(9).fill(null);
          this.io.to(roomId).emit('ttt_playerLeft', socket.id);
          this.sendRoomInfo(roomId);
        }
      }
    }
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (room) this.io.to(roomId).emit('ttt_roomInfo', room);
  }
}

module.exports = TicTacToeManager;

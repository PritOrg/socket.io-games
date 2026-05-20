const logger = require('../utils/logger');

class UTTTManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  handleConnection(socket) {
    socket.on('uttt_createRoom', (playerName) => {
      logger.socket('IN', 'uttt_createRoom', socket.id, { playerName });
      this.createRoom(socket, playerName);
    });
    
    socket.on('uttt_joinRoom', (data) => {
      logger.socket('IN', 'uttt_joinRoom', socket.id, data);
      this.joinRoom(socket, data);
    });
    
    socket.on('uttt_makeMove', (data) => {
      logger.socket('IN', 'uttt_makeMove', socket.id, data);
      this.makeMove(socket, data);
    });
    
    socket.on('uttt_restartGame', (roomId) => {
      logger.socket('IN', 'uttt_restartGame', socket.id, { roomId });
      this.restartGame(socket, roomId);
    });

    socket.on('uttt_leaveRoom', (roomId) => {
      logger.socket('IN', 'uttt_leaveRoom', socket.id, { roomId });
      this.leaveRoom(socket, roomId);
    });

    socket.on('uttt_reconnect', (data) => {
      logger.socket('IN', 'uttt_reconnect', socket.id, data);
      this.reconnect(socket, data);
    });
    
    socket.on('disconnect', () => {
      logger.warn('UTTT', `Socket disconnected: ${socket.id}`);
      this.handleDisconnect(socket);
    });
  }

  checkInnerWin(board) {
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
    return { winner: null };
  }

  checkMacroWin(macroBoard) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (macroBoard[a] && macroBoard[a] !== 'DEAD' && 
          macroBoard[a] === macroBoard[b] && macroBoard[a] === macroBoard[c]) {
        return { winner: macroBoard[a], line: [a, b, c] };
      }
    }
    return null;
  }

  createRoom(socket, playerName) {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.join(roomId);
    const room = {
      id: roomId,
      players: [{ id: socket.id, name: playerName, connected: true }],
      symbols: { [socket.id]: 'X' },
      currentTurn: null,
      gameState: 'waiting',
      board: Array(9).fill(null).map(() => Array(9).fill(null)),
      macroBoard: Array(9).fill(null),
      activeGrid: null,
      scores: { X: 0, O: 0 },
      lastMove: null,
      emptyTimer: null,
      forfeitTimer: null
    };
    this.rooms.set(roomId, room);
    logger.success('UTTT', `Room created: ${roomId} by ${playerName} (${socket.id})`);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      logger.warn('UTTT', `Join failed: Room ${roomId} not found`);
      socket.emit('uttt_error', { message: 'Room not found' });
      return;
    }
    if (room.players.length >= 2) {
      logger.warn('UTTT', `Join failed: Room ${roomId} is full`);
      socket.emit('uttt_error', { message: 'Room is full' });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName, connected: true });
    room.symbols[socket.id] = 'O';
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;
    
    if (room.emptyTimer) {
      clearTimeout(room.emptyTimer);
      room.emptyTimer = null;
    }

    logger.success('UTTT', `Player ${playerName} (${socket.id}) joined room ${roomId}`);
    this.io.to(room.id).emit('uttt_gameStarted');
    this.sendRoomInfo(roomId);
  }

  restartGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.board = Array(9).fill(null).map(() => Array(9).fill(null));
    room.macroBoard = Array(9).fill(null);
    room.activeGrid = null;
    room.scores = { X: 0, O: 0 };
    room.lastMove = null;
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;
    
    logger.info('UTTT', `Game restarted in room ${roomId}`);
    this.io.to(roomId).emit('uttt_gameStarted');
    this.sendRoomInfo(roomId);
  }

  makeMove(socket, { roomId, gridIndex, squareIndex }) {
    const room = this.rooms.get(roomId);
    if (!room) {
      logger.warn('UTTT', `Move failed: Room ${roomId} not found`);
      socket.emit('uttt_error', { message: 'Room not found' });
      return;
    }
    if (room.gameState !== 'playing') {
      logger.warn('UTTT', `Move failed: Game not active in ${roomId}`);
      socket.emit('uttt_error', { message: 'Game is not in progress' });
      return;
    }
    if (room.currentTurn !== socket.id) {
      logger.warn('UTTT', `Move failed: Not ${socket.id}'s turn in ${roomId}`);
      socket.emit('uttt_error', { message: 'Not your turn' });
      return;
    }
    if (room.activeGrid !== null && room.activeGrid !== gridIndex) {
      socket.emit('uttt_error', { message: `Must play in grid ${room.activeGrid}` });
      return;
    }
    if (room.board[gridIndex][squareIndex] !== null) {
      socket.emit('uttt_error', { message: 'Square already occupied' });
      return;
    }

    const symbol = room.symbols[socket.id];
    const player = room.players.find(p => p.id === socket.id);
    
    room.board[gridIndex][squareIndex] = symbol;
    logger.info('UTTT', `Move: ${player?.name} (${symbol}) played [${gridIndex},${squareIndex}] in ${roomId}`);

    const innerResult = this.checkInnerWin(room.board[gridIndex]);
    if (innerResult.winner) {
      room.macroBoard[gridIndex] = symbol;
      room.scores[symbol]++;
      logger.info('UTTT', `Inner win: Grid ${gridIndex} won by ${symbol}! Score: X=${room.scores.X}, O=${room.scores.O}`);
    } else if (room.board[gridIndex].every(cell => cell !== null)) {
      room.macroBoard[gridIndex] = 'DEAD';
    }

    const macroResult = this.checkMacroWin(room.macroBoard);
    if (macroResult) {
      room.gameState = 'ended';
      const winnerPlayer = room.players.find(p => room.symbols[p.id] === symbol);
      logger.success('UTTT', `GAME OVER! ${symbol} wins by macro in ${roomId}!`);
      this.io.to(room.id).emit('uttt_gameOver', { 
        winner: winnerPlayer?.id || socket.id, 
        symbol,
        scores: room.scores, 
        reason: 'macro_win',
        winningLine: macroResult.line
      });
      this.sendRoomInfo(room.id);
      return;
    }

    if (room.board.every(grid => grid.every(cell => cell !== null))) {
      room.gameState = 'ended';
      const winnerSymbol = room.scores.X > room.scores.O ? 'X' : (room.scores.O > room.scores.X ? 'O' : 'TIE');
      const winnerPlayer = winnerSymbol === 'TIE' ? null : room.players.find(p => room.symbols[p.id] === winnerSymbol);
      logger.success('UTTT', `GAME OVER! Tiebreaker - ${winnerSymbol} wins (${room.scores.X}-${room.scores.O}) in ${roomId}`);
      this.io.to(room.id).emit('uttt_gameOver', { 
        winner: winnerPlayer?.id || null, 
        symbol: winnerSymbol,
        scores: room.scores, 
        reason: 'tiebreaker' 
      });
      this.sendRoomInfo(room.id);
      return;
    }

    const nextGrid = squareIndex;
    if (room.macroBoard[nextGrid] !== null) {
      room.activeGrid = null;
    } else {
      room.activeGrid = nextGrid;
    }

    room.lastMove = { gridIndex, squareIndex };
    room.currentTurn = room.players.find(p => p.id !== socket.id).id;

    logger.debug('UTTT', `Next turn: ${room.currentTurn}, Active grid: ${room.activeGrid}`);
    this.io.to(room.id).emit('uttt_gameState', room);
  }

  handleDisconnect(socket) {
    for (const [roomId, room] of this.rooms.entries()) {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1) continue;

      room.players[playerIndex].connected = false;

      if (room.gameState === 'playing') {
        const activeCount = room.players.filter(p => p.connected).length;

        if (activeCount === 0) {
          room.emptyTimer = setTimeout(() => {
            this.rooms.delete(roomId);
            logger.info('UTTT', `Room ${roomId} deleted (timeout)`);
          }, 5 * 60 * 1000);
        } else if (activeCount === 1) {
          room.gameState = 'paused';
          this.io.to(room.id).emit('uttt_gamePaused', { reason: 'Opponent disconnected' });
        }

        this.io.to(room.id).emit('uttt_playerLeft', { playerId: socket.id });
        this.sendRoomInfo(room.id);
      }
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
        this.io.to(room.id).emit('uttt_gamePaused', { reason: 'Opponent disconnected' });
      }

      this.io.to(room.id).emit('uttt_playerLeft', { playerId: socket.id });
      this.sendRoomInfo(room.id);
    }
  }

  reconnect(socket, { roomId, playerId }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      socket.emit('uttt_error', { message: 'Room not found' });
      return;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      socket.emit('uttt_error', { message: 'Player not found in room' });
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
        this.io.to(room.id).emit('uttt_alert', { icon: 'success', title: 'Player Reconnected', text: 'Game resumed!' });
      }
    }

    this.sendRoomInfo(room.id);
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      this.io.to(roomId).emit('uttt_roomInfo', room);
    }
  }
}

module.exports = UTTTManager;
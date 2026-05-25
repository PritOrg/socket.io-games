const logger = require('../utils/logger');
const BaseManager = require('./BaseManager');

class UTTTManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'uttt';
  }

  handleConnection(socket) {
    socket.on(`${this.gamePrefix}_createRoom`, (playerName) => {
      logger.socket('IN', `${this.gamePrefix}_createRoom`, socket.id, { playerName });
      this.createRoom(socket, playerName);
    });

    socket.on(`${this.gamePrefix}_joinRoom`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_joinRoom`, socket.id, data);
      this.joinRoom(socket, data);
    });

    socket.on(`${this.gamePrefix}_makeMove`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_makeMove`, socket.id, data);
      this.makeMove(socket, data);
    });

    socket.on(`${this.gamePrefix}_restartGame`, (roomId) => {
      logger.socket('IN', `${this.gamePrefix}_restartGame`, socket.id, { roomId });
      this.restartGame(socket, roomId);
    });

    socket.on(`${this.gamePrefix}_leaveRoom`, (roomId) => {
      logger.socket('IN', `${this.gamePrefix}_leaveRoom`, socket.id, { roomId });
      this.leaveRoom(socket, roomId);
    });

    socket.on(`${this.gamePrefix}_reconnect`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_reconnect`, socket.id, data);
      this.reconnect(socket, data);
    });

    socket.on(`${this.gamePrefix}_requestRoomInfo`, (roomId) => {
      const sanitized = this.sanitizeRoomId(roomId);
      if (sanitized) this.sendRoomInfo(sanitized);
    });

    socket.on('disconnect', () => {
      logger.warn('UTTT', `Socket disconnected: ${socket.id}`);
      this.handleDisconnect(socket);
    });
  }

  checkInnerWin(board) {
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
    return { winner: null };
  }

  checkMacroWin(macroBoard) {
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
      if (
        macroBoard[a] &&
        macroBoard[a] !== 'DEAD' &&
        macroBoard[a] === macroBoard[b] &&
        macroBoard[a] === macroBoard[c]
      ) {
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
      board: Array(9)
        .fill(null)
        .map(() => Array(9).fill(null)),
      macroBoard: Array(9).fill(null),
      activeGrid: null,
      scores: { X: 0, O: 0 },
      wonGrids: new Set(),
      lastMove: null,
    };
    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    logger.success('UTTT', `Room created: ${roomId} by ${playerName} (${socket.id})`);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) {
      logger.warn('UTTT', `Join failed: Room ${roomId} not found`);
      socket.emit(`${this.gamePrefix}_error`, { message: 'Room not found' });
      return;
    }
    if (room.players.length >= 2) {
      logger.warn('UTTT', `Join failed: Room ${roomId} is full`);
      socket.emit(`${this.gamePrefix}_error`, { message: 'Room is full' });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName, connected: true });
    room.symbols[socket.id] = 'O';
    this._trackSocket(socket.id, room.id);
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;

    if (room.emptyTimer) {
      this.clearTimer(`empty_${roomId}`);
    }

    logger.success('UTTT', `Player ${playerName} (${socket.id}) joined room ${roomId}`);
    this.io.to(room.id).emit(`${this.gamePrefix}_gameStarted`);
    this.sendRoomInfo(roomId);
  }

  restartGame(socket, roomId) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) return;

    room.board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    room.macroBoard = Array(9).fill(null);
    room.activeGrid = null;
    room.scores = { X: 0, O: 0 };
    room.wonGrids = new Set();
    room.lastMove = null;
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;

    logger.info('UTTT', `Game restarted in room ${roomId}`);
    this.io.to(roomId).emit(`${this.gamePrefix}_gameStarted`);
    this.sendRoomInfo(roomId);
  }

  makeMove(socket, { roomId, gridIndex, squareIndex }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) {
      logger.warn('UTTT', `Move failed: Room ${roomId} not found`);
      socket.emit(`${this.gamePrefix}_error`, { message: 'Room not found' });
      return;
    }
    if (room.gameState !== 'playing') {
      logger.warn('UTTT', `Move failed: Game not active in ${roomId}`);
      socket.emit(`${this.gamePrefix}_error`, { message: 'Game is not in progress' });
      return;
    }
    if (room.currentTurn !== socket.id) {
      logger.warn('UTTT', `Move failed: Not ${socket.id}'s turn in ${roomId}`);
      socket.emit(`${this.gamePrefix}_error`, { message: 'Not your turn' });
      return;
    }
    if (typeof gridIndex !== 'number' || gridIndex < 0 || gridIndex > 8) {
      socket.emit(`${this.gamePrefix}_error`, { message: 'Invalid grid index' });
      return;
    }
    if (typeof squareIndex !== 'number' || squareIndex < 0 || squareIndex > 8) {
      socket.emit(`${this.gamePrefix}_error`, { message: 'Invalid square index' });
      return;
    }
    if (room.activeGrid !== null && room.activeGrid !== gridIndex) {
      socket.emit(`${this.gamePrefix}_error`, { message: `Must play in grid ${room.activeGrid}` });
      return;
    }
    if (room.board[gridIndex][squareIndex] !== null) {
      socket.emit(`${this.gamePrefix}_error`, { message: 'Square already occupied' });
      return;
    }

    const symbol = room.symbols[socket.id];
    const player = room.players.find((p) => p.id === socket.id);

    room.board[gridIndex][squareIndex] = symbol;
    logger.info('UTTT', `Move: ${player?.name} (${symbol}) played [${gridIndex},${squareIndex}] in ${roomId}`);

    const innerResult = this.checkInnerWin(room.board[gridIndex]);
    if (innerResult.winner && !['X', 'O', 'DEAD'].includes(room.macroBoard[gridIndex])) {
      room.macroBoard[gridIndex] = innerResult.winner;
      room.scores[innerResult.winner]++;
      room.wonGrids.add(gridIndex);
      logger.info(
        'UTTT',
        `Inner win: Grid ${gridIndex} won by ${innerResult.winner}! Score: X=${room.scores.X}, O=${room.scores.O}`,
      );
    }

    const isGridFull = room.board[gridIndex].every((cell) => cell !== null);
    if (isGridFull && !room.macroBoard[gridIndex]) {
      room.macroBoard[gridIndex] = 'DEAD';
    }

    const macroResult = this.checkMacroWin(room.macroBoard);
    if (macroResult) {
      room.gameState = 'ended';
      const winnerPlayer = room.players.find((p) => room.symbols[p.id] === symbol);
      logger.success('UTTT', `GAME OVER! ${symbol} wins by macro in ${roomId}!`);
      this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
        winner: winnerPlayer?.id || socket.id,
        symbol,
        scores: room.scores,
        reason: 'macro_win',
        winningLine: macroResult.line,
      });
      this.sendRoomInfo(room.id);
      return;
    }

    if (room.board.every((grid) => grid.every((cell) => cell !== null))) {
      room.gameState = 'ended';
      const winnerSymbol = room.scores.X > room.scores.O ? 'X' : room.scores.O > room.scores.X ? 'O' : 'TIE';
      const winnerPlayer =
        winnerSymbol === 'TIE' ? null : room.players.find((p) => room.symbols[p.id] === winnerSymbol);
      logger.success(
        'UTTT',
        `GAME OVER! Tiebreaker - ${winnerSymbol} wins (${room.scores.X}-${room.scores.O}) in ${roomId}`,
      );
      this.io.to(room.id).emit(`${this.gamePrefix}_gameOver`, {
        winner: winnerPlayer?.id || null,
        symbol: winnerSymbol,
        scores: room.scores,
        reason: 'tiebreaker',
      });
      this.sendRoomInfo(room.id);
      return;
    }

    const nextGrid = squareIndex;
    const isNextGridFull = room.board[nextGrid].every((cell) => cell !== null);

    if (isNextGridFull) {
      room.activeGrid = null;
    } else {
      room.activeGrid = nextGrid;
    }

    room.lastMove = { gridIndex, squareIndex };
    room.currentTurn = room.players.find((p) => p.id !== socket.id).id;

    logger.debug('UTTT', `Next turn: ${room.currentTurn}, Active grid: ${room.activeGrid}`);
    this.emitGameState(room.id);
  }

  emitGameState(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const cleanRoom = {
      id: room.id,
      players: room.players,
      symbols: room.symbols,
      currentTurn: room.currentTurn,
      gameState: room.gameState,
      board: room.board,
      macroBoard: room.macroBoard,
      activeGrid: room.activeGrid,
      scores: room.scores,
      lastMove: room.lastMove,
    };
    this.io.to(roomId).emit(`${this.gamePrefix}_gameState`, cleanRoom);
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
            logger.info('UTTT', `Room ${roomId} deleted (empty)`);
          });
        } else if (activeCount === 1) {
          room.gameState = 'paused';
          this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
        }

        this.io.to(room.id).emit(`${this.gamePrefix}_playerLeft`, { playerId: socket.id });
        this.sendRoomInfo(room.id);
      }
    }
    this.socketRooms.delete(socket.id);
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
        this.registerEmptyTimer(roomId, () => {
          this.rooms.delete(roomId);
        });
      } else if (activeCount === 1) {
        room.gameState = 'paused';
        this.io.to(room.id).emit(`${this.gamePrefix}_gamePaused`, { reason: 'Opponent disconnected' });
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
      socket.emit(`${this.gamePrefix}_error`, { message: 'Room not found' });
      return;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      socket.emit(`${this.gamePrefix}_error`, { message: 'Player not found' });
      return;
    }

    socket.join(room.id);
    player.id = socket.id;
    player.connected = true;
    this._trackSocket(socket.id, room.id);

    this.clearTimer(`empty_${roomId}`);

    if (room.gameState === 'paused') {
      const activeCount = room.players.filter((p) => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = 'playing';
        this.clearTimer(`forfeit_${roomId}`);
        this.io.to(room.id).emit(`${this.gamePrefix}_alert`, {
          icon: 'success',
          title: 'Player Reconnected',
          text: 'Game resumed!',
        });
      }
    }

    this.sendRoomInfo(room.id);
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const cleanRoom = {
      id: room.id,
      players: room.players,
      symbols: room.symbols,
      currentTurn: room.currentTurn,
      gameState: room.gameState,
      board: room.board,
      macroBoard: room.macroBoard,
      activeGrid: room.activeGrid,
      scores: room.scores,
      lastMove: room.lastMove,
    };
    this.io.to(roomId).emit(`${this.gamePrefix}_roomInfo`, cleanRoom);
  }
}

module.exports = UTTTManager;

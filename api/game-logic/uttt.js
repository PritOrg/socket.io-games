const logger = require('../utils/logger');
const BaseManager = require('./BaseManager');

class UTTTManager extends BaseManager {
  constructor(io) {
    super(io);
    this.gamePrefix = 'uttt';
  }

  handleConnection(socket) {
    this.onSocketEvent(socket, `${this.gamePrefix}_createRoom`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_createRoom`, socket.id, data);
      this.createRoom(socket, data);
    });

    this.onSocketEvent(socket, `${this.gamePrefix}_joinRoom`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_joinRoom`, socket.id, data);
      this.joinRoom(socket, data);
    });

    this.onSocketEvent(socket, `${this.gamePrefix}_makeMove`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_makeMove`, socket.id, data);
      this.makeMove(socket, data);
    });

    this.onSocketEvent(socket, `${this.gamePrefix}_restartGame`, (roomId) => {
      logger.socket('IN', `${this.gamePrefix}_restartGame`, socket.id, { roomId });
      this.restartGame(socket, roomId);
    });

    this.onSocketEvent(socket, `${this.gamePrefix}_leaveRoom`, (roomId) => {
      logger.socket('IN', `${this.gamePrefix}_leaveRoom`, socket.id, { roomId });
      this.leaveRoom(socket, roomId);
    });

    this.onSocketEvent(socket, `${this.gamePrefix}_reconnect`, (data) => {
      logger.socket('IN', `${this.gamePrefix}_reconnect`, socket.id, data);
      this.reconnect(socket, data);
    });

    this.onSocketEvent(socket, `${this.gamePrefix}_requestRoomInfo`, (roomId) => {
      const sanitized = this.sanitizeRoomId(roomId);
      if (sanitized) this.sendRoomInfo(sanitized);
    });

    this.onSocketEvent(socket, 'disconnect', () => {
      logger.warn('UTTT', `Socket disconnected: ${socket.id}`);
      this.handleDisconnect(socket);
    });

    this.onSocketEvent(socket, 'server_shutdown', () => {
      const rooms = this.socketRooms.get(socket.id);
      if (rooms) {
        for (const roomId of rooms) {
          this.clearAllTimersForRoom(roomId);
        }
      }
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
    return null;
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
          name: this.sanitizePlayerName(playerName),
          avatarIcon,
          color,
          connected: true,
        },
      ],
      settings: {},
      symbols: { [socket.id]: 'X' },
      currentTurn: null,
      gameState: 'waiting',
      board: Array(9)
        .fill(null)
        .map(() => Array(9).fill(null)),
      macroBoard: Array(9).fill(null),
      activeGrid: null,
      scores: { X: 0, O: 0 },
      wonGrids: [],
      lastMove: null,
    };
    this.rooms.set(roomId, room);
    this._trackSocket(socket.id, roomId);
    logger.success('UTTT', `Room created: ${roomId} by ${playerName} (${socket.id})`);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName, avatarIcon, color }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) {
      logger.warn('UTTT', `Join failed: Room ${roomId} not found`);
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Room not found',
      });
      return;
    }
    if (room.players.length >= 2) {
      logger.warn('UTTT', `Join failed: Room ${roomId} is full`);
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
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
    room.symbols[socket.id] = 'O';
    this._trackSocket(socket.id, room.id);
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;

    this.clearTimer(`empty_${roomIdSanitized}`);

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
    room.wonGrids = [];
    room.lastMove = null;
    room.gameState = 'playing';
    room.currentTurn = room.players[0].id;

    logger.info('UTTT', `Game restarted in room ${roomId}`);
    this.io.to(roomId).emit(`${this.gamePrefix}_gameStarted`);
    this.io.to(roomId).emit(`${this.gamePrefix}_gameRestarted`);
    this.sendRoomInfo(roomId);
  }

  makeMove(socket, { roomId, gridIndex, squareIndex }) {
    const roomIdSanitized = this.sanitizeRoomId(roomId);
    const room = this.rooms.get(roomIdSanitized);
    if (!room) {
      logger.warn('UTTT', `Move failed: Room ${roomId} not found`);
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Room not found',
      });
      return;
    }
    if (room.gameState !== 'playing') {
      logger.warn('UTTT', `Move failed: Game not active in ${roomId}`);
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Game is not in progress',
      });
      return;
    }
    if (room.currentTurn !== socket.id) {
      logger.warn('UTTT', `Move failed: Not ${socket.id}'s turn in ${roomId}`);
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Not your turn',
      });
      return;
    }
    if (typeof gridIndex !== 'number' || gridIndex < 0 || gridIndex > 8) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Invalid grid index',
      });
      return;
    }
    if (typeof squareIndex !== 'number' || squareIndex < 0 || squareIndex > 8) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Invalid square index',
      });
      return;
    }
    if (room.activeGrid !== null && room.activeGrid !== gridIndex) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: `Must play in grid ${room.activeGrid}`,
      });
      return;
    }
    if (room.board[gridIndex][squareIndex] !== null) {
      socket.emit(`${this.gamePrefix}_alert`, {
        icon: 'error',
        title: 'Error',
        text: 'Square already occupied',
      });
      return;
    }

    const symbol = room.symbols[socket.id];
    const player = room.players.find((p) => p.id === socket.id);

    room.board[gridIndex][squareIndex] = symbol;
    logger.info('UTTT', `Move: ${player?.name} (${symbol}) played [${gridIndex},${squareIndex}] in ${roomId}`);

    const innerResult = this.checkInnerWin(room.board[gridIndex]);
    const innerWinner = innerResult?.winner;
    if (innerWinner && !['X', 'O', 'DEAD'].includes(room.macroBoard[gridIndex])) {
      const prevWon = room.wonGrids.includes(gridIndex);
      room.macroBoard[gridIndex] = innerWinner;
      room.wonGrids = room.wonGrids.filter((g) => g !== gridIndex);
      room.wonGrids.push(gridIndex);
      room.scores[innerResult.winner]++;
      if (!prevWon) {
        this.io.to(room.id).emit(`${this.gamePrefix}_miniWin`, { gridIndex, winner: innerResult.winner });
      }
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

    const allMacroClaimed = room.macroBoard.every((cell) => cell !== null);
    if (allMacroClaimed) {
      room.gameState = 'ended';
      const winnerSymbol = room.scores.X > room.scores.O ? 'X' : room.scores.O > room.scores.X ? 'O' : 'TIE';
      const winnerPlayer =
        winnerSymbol === 'TIE' ? null : room.players.find((p) => room.symbols[p.id] === winnerSymbol);
      logger.success(
        'UTTT',
        `GAME OVER! All macro cells claimed - ${winnerSymbol} wins (${room.scores.X}-${room.scores.O}) in ${roomId}`,
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
        this.registerEmptyTimer(roomIdSanitized, () => {
          this.rooms.delete(roomIdSanitized);
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
    const validation = this.validateReconnectPayload({ roomId, playerId }, socket);
    if (!validation) return false;

    const roomIdSanitized = validation.roomId;
    const room = this.rooms.get(roomIdSanitized);

    if (!room) {
      logger.error('UTTT', `Reconnect failed: Room ${roomId} not found`);
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
      logger.error('UTTT', `Reconnect failed: Player ${playerId} not found in room`);
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
    const oldId = player.id;
    player.id = socket.id;
    player.connected = true;
    this._trackSocket(socket.id, room.id);

    // Re-key per-player symbols to new socket ID
    if (room.symbols[oldId]) {
      room.symbols[socket.id] = room.symbols[oldId];
      delete room.symbols[oldId];
    }

    this.clearTimer(`empty_${roomIdSanitized}`);

    if (room.gameState === 'paused') {
      const activeCount = room.players.filter((p) => p.connected).length;
      if (activeCount >= 2) {
        room.gameState = 'playing';
        this.clearTimer(`forfeit_${roomIdSanitized}`);
        logger.info('UTTT', `Player ${player.name} reconnected to room ${roomId}`);
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
      ...room,
      turnTimer: undefined,
      forfeitTimer: undefined,
      emptyTimer: undefined,
    };
    this.io.to(roomId).emit(`${this.gamePrefix}_roomInfo`, cleanRoom);
  }
}

module.exports = UTTTManager;

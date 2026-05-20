class DabManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  handleConnection(socket) {
    socket.on('dab_createRoom', (data) => this.createRoom(socket, data));
    socket.on('dab_joinRoom', (data) => this.joinRoom(socket, data));
    socket.on('dab_reconnect', (data) => this.reconnect(socket, data));
    socket.on('dab_leaveRoom', (roomId) => this.leaveRoom(socket, roomId));
    socket.on('dab_makeMove', (data) => this.makeMove(socket, data));
    socket.on('dab_requestRedo', (roomId) => this.requestRedo(socket, roomId));
    socket.on('dab_respondRedo', (data) => this.respondRedo(socket, data));
    socket.on('dab_restartGame', (roomId) => this.restartGame(socket, roomId));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  createRoom(socket, { mode, customRows, customCols, customPlayers, playerName }) {
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
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    socket.join(roomId);

    const room = {
      id: roomId,
      creator: socket.id,
      players: [{ id: socket.id, name: playerName || 'Player 1', connected: true }],
      gameState: 'waiting',
      currentTurn: 0,
      rows,
      cols,
      horizontalLines: Array(rows + 1).fill(null).map(() => Array(cols).fill(null)),
      verticalLines: Array(rows).fill(null).map(() => Array(cols + 1).fill(null)),
      boxes: Array(rows).fill(null).map(() => Array(cols).fill(null)),
      scores: Array(maxPlayers).fill(0),
      lastMove: null,
      redoRequest: null,
      emptyTimer: null,
      forfeitTimer: null,
      maxPlayers,
      startedWithPlayers: maxPlayers
    };

    this.rooms.set(roomId, room);
    this.sendRoomInfo(roomId);
  }

  joinRoom(socket, { roomId, playerName }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      socket.emit('dab_alert', { icon: 'error', title: 'Error', text: 'Room not found' });
      return;
    }
    if (room.gameState !== 'waiting') {
      socket.emit('dab_alert', { icon: 'error', title: 'Error', text: 'Game already in progress' });
      return;
    }
    if (room.players.length >= room.maxPlayers) {
      socket.emit('dab_alert', { icon: 'error', title: 'Error', text: 'Room is full' });
      return;
    }

    socket.join(room.id);
    room.players.push({ id: socket.id, name: playerName, connected: true });

    if (room.players.length >= room.maxPlayers) {
      room.gameState = 'playing';
      room.currentTurn = 0;
      this.io.to(room.id).emit('dab_gameStarted', { firstTurn: room.players[0].id });
    }

    this.sendRoomInfo(room.id);
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
        const canContinue = room.startedWithPlayers >= 4;
        if (!canContinue) {
          room.gameState = 'paused';
          this.io.to(room.id).emit('dab_gamePaused', { reason: 'Opponent disconnected' });
        }
      }

      this.io.to(room.id).emit('dab_playerLeft', { playerId: socket.id });
      this.sendRoomInfo(room.id);
    }
  }

  restartGame(socket, roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    if (room.creator !== socket.id) return;

    room.gameState = 'waiting';
    room.currentTurn = 0;
    room.horizontalLines = Array(room.rows + 1).fill(null).map(() => Array(room.cols).fill(null));
    room.verticalLines = Array(room.rows).fill(null).map(() => Array(room.cols + 1).fill(null));
    room.boxes = Array(room.rows).fill(null).map(() => Array(room.cols).fill(null));
    room.scores = Array(room.players.length).fill(0);
    room.lastMove = null;
    room.redoRequest = null;
    room.gameState = 'waiting';

    this.io.to(room.id).emit('dab_gameRestarted');
    this.sendRoomInfo(room.id);
  }

  requestRedo(socket, roomId) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room || room.gameState !== 'playing') return;
    if (room.lastMove === null) return;

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
    if (playerIndex === -1) return;

    const immediatePlayerIndex = room.currentTurn;
    if (playerIndex !== immediatePlayerIndex) {
      socket.emit('dab_alert', { icon: 'error', title: 'Not Allowed', text: 'Only the player who just moved can request a redo.' });
      return;
    }

    const prevPlayerIndex = (playerIndex + room.players.length - 1) % room.players.length;
    const prevPlayer = room.players[prevPlayerIndex];
    if (!prevPlayer || !prevPlayer.connected) {
      socket.emit('dab_alert', { icon: 'error', title: 'Error', text: 'Previous player not connected.' });
      return;
    }

    room.redoRequest = {
      requesterId: socket.id,
      requesterIndex: playerIndex,
      targetId: prevPlayer.id,
      targetIndex: prevPlayerIndex
    };

    this.io.to(room.id).emit('dab_redoRequest', {
      requesterId: socket.id,
      requesterName: room.players[playerIndex].name,
      targetId: prevPlayer.id
    });
  }

  respondRedo(socket, { roomId, accept }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room || room.gameState !== 'playing' || !room.redoRequest) return;

    if (socket.id !== room.redoRequest.targetId) {
      socket.emit('dab_alert', { icon: 'error', title: 'Not Allowed', text: 'Only the immediate player can respond to this redo request.' });
      return;
    }

    const requester = room.players[room.redoRequest.requesterIndex];
    if (!requester || !requester.connected) {
      room.redoRequest = null;
      this.io.to(room.id).emit('dab_redoResponse', { accepted: false, reason: 'Requester disconnected.' });
      return;
    }

    if (accept) {
      const { lineType, r, c } = room.redoRequest.lastMove;
      if (lineType === 'h') {
        room.horizontalLines[r][c] = null;
      } else {
        room.verticalLines[r][c] = null;
      }

      const claimedBox = room.redoRequest.claimedBox;
      if (claimedBox) {
        room.boxes[claimedBox.r][claimedBox.c] = null;
        room.scores[room.redoRequest.requesterIndex]--;
      }

      room.lastMove = null;
      room.currentTurn = room.redoRequest.targetIndex;

      this.io.to(room.id).emit('dab_redoAccepted', {
        lineType,
        r,
        c,
        claimedBox,
        scores: [...room.scores],
        currentTurn: room.currentTurn
      });
    } else {
      this.io.to(room.id).emit('dab_redoResponse', {
        accepted: false,
        requesterId: room.redoRequest.requesterId,
        requesterName: room.redoRequest.requesterName
      });
    }

    room.redoRequest = null;
    this.sendRoomInfo(room.id);
  }

  reconnect(socket, { roomId, playerId }) {
    const room = this.rooms.get(roomId?.toUpperCase());
    if (!room) {
      socket.emit('dab_alert', { icon: 'error', title: 'Error', text: 'Room not found' });
      return;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      socket.emit('dab_alert', { icon: 'error', title: 'Error', text: 'Player not found in room' });
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
        this.io.to(room.id).emit('dab_alert', { icon: 'success', title: 'Player Reconnected', text: 'Game resumed!' });
      }
    }

    this.sendRoomInfo(room.id);
  }

  makeMove(socket, { roomId, lineType, r, c }) {
    const room = this.rooms.get(roomId);
    if (!room || room.gameState !== 'playing') return;

    if (!room.players[room.currentTurn].connected) {
      room.currentTurn = this.getNextTurn(room);
    }

    const playerIndex = room.players.findIndex(p => p.id === socket.id);
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

    const claimedBoxes = this.checkBoxes(room, r, c, lineType, playerIndex);

    if (claimedBoxes.length === 0) {
      room.currentTurn = this.getNextTurn(room);
    }

    const currentPlayer = room.players[room.currentTurn];

    this.io.to(roomId).emit('dab_moveResult', {
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
        claimedBox: claimedBoxes.length > 0 ? claimedBoxes[0] : null
      }
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
    const activeCount = room.players.filter(p => p.connected).length;
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
      .filter(entry => entry.score === maxScore);

    if (winners.length === 1) {
      this.io.to(room.id).emit('dab_gameOver', {
        winner: winners[0].player.id,
        scores: [...room.scores]
      });
    } else {
      this.io.to(room.id).emit('dab_gameOver', {
        winner: null,
        scores: [...room.scores],
        winners: winners.map(w => w.player.id)
      });
    }

    if (room.forfeitTimer) {
      clearTimeout(room.forfeitTimer);
      room.forfeitTimer = null;
    }
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
          }, 5 * 60 * 1000);
        } else if (activeCount === 1) {
          const canContinue = room.startedWithPlayers >= 4;
          if (canContinue) {
            this.io.to(roomId).emit('dab_gamePaused', { reason: 'Only one player remaining - game continues!' });
          } else {
            room.gameState = 'paused';
            this.io.to(roomId).emit('dab_gamePaused', { reason: 'Opponent disconnected' });

            room.forfeitTimer = setTimeout(() => {
              if (room.gameState === 'paused') {
                const remainingPlayer = room.players.find(p => p.connected);
                if (remainingPlayer) {
                  const remainingIndex = room.players.indexOf(remainingPlayer);
                  room.scores[remainingIndex] += room.rows * room.cols - room.scores.reduce((sum, s) => sum + s, 0);
                }
                this.emitGameOver(room);
              }
            }, 5 * 60 * 1000);
          }
        } else {
          if (room.currentTurn === playerIndex) {
            room.currentTurn = this.getNextTurn(room);
          }
        }

        this.io.to(roomId).emit('dab_playerLeft', { playerId: socket.id });
        this.sendRoomInfo(roomId);
      }
    }
  }

  sendRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const { emptyTimer, forfeitTimer, ...sanitized } = room;
    this.io.to(roomId).emit('dab_roomInfo', sanitized);
  }
}

module.exports = DabManager;

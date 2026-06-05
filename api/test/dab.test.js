process.env.NODE_ENV = 'test';
const { server } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('Dots & Boxes (DAB) Game Logic', function () {
  let player1, player2, player3, player4;
  const port = 4001;

  before((done) => {
    server.listen(port, () => done());
  });

  after((done) => {
    server.close(() => done());
  });

  beforeEach((done) => {
    player1 = client(`http://localhost:${port}`);
    player2 = client(`http://localhost:${port}`);
    player3 = client(`http://localhost:${port}`);
    player4 = client(`http://localhost:${port}`);

    let connected = 0;
    const checkConnected = () => {
      connected++;
      if (connected === 4) done();
    };

    player1.on('connect', checkConnected);
    player2.on('connect', checkConnected);
    player3.on('connect', checkConnected);
    player4.on('connect', checkConnected);
  });

  afterEach((done) => {
    if (player1.connected) player1.disconnect();
    if (player2.connected) player2.disconnect();
    if (player3.connected) player3.disconnect();
    if (player4.connected) player4.disconnect();
    setTimeout(done, 100);
  });

  function setupRoom(mode = 'custom', customRows = 3, customCols = 3, customPlayers = 2) {
    return new Promise((resolve) => {
      player1.emit('dab_createRoom', { mode, customRows, customCols, customPlayers });
      player1.once('dab_roomInfo', (room) => {
        player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'Bob' });
        if (customPlayers >= 3) {
          player3.emit('dab_joinRoom', { roomId: room.id, playerName: 'Charlie' });
        }
        if (customPlayers >= 4) {
          player4.emit('dab_joinRoom', { roomId: room.id, playerName: 'Diana' });
        }
        player2.once('dab_roomInfo', () => {
          player1.emit('dab_startGame', { roomId: room.id });
          player1.once('dab_gameStarted', () => {
            resolve(room.id);
          });
        });
      });
    });
  }

  function makeMove(player, roomId, lineType, r, c) {
    return new Promise((resolve) => {
      const onResult = (data) => {
        if (data.lineType === lineType && data.r === r && data.c === c) {
          player1.off('dab_moveResult', onResult);
          player2.off('dab_moveResult', onResult);
          player3.off('dab_moveResult', onResult);
          player4.off('dab_moveResult', onResult);
          resolve(data);
        }
      };
      player1.on('dab_moveResult', onResult);
      player2.on('dab_moveResult', onResult);
      player3.on('dab_moveResult', onResult);
      player4.on('dab_moveResult', onResult);
      player.emit('dab_makeMove', { roomId, lineType, r, c });
    });
  }

  describe('Room Creation', () => {
    it('should create a room with valid params', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 5, customCols: 5, customPlayers: 2 });
      player1.once('dab_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        expect(room.rows).to.equal(5);
        expect(room.cols).to.equal(5);
        expect(room.gameState).to.equal('waiting');
        done();
      });
    });

    it('should clamp customRows to max 30', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 50, customCols: 5, customPlayers: 2 });
      player1.once('dab_roomInfo', (room) => {
        expect(room.rows).to.equal(30);
        done();
      });
    });

    it('should clamp customPlayers to max 4', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 10 });
      player1.once('dab_roomInfo', (room) => {
        expect(room.maxPlayers).to.equal(4);
        expect(room.scores).to.have.lengthOf(4);
        done();
      });
    });

    it('should create classic mode (9x9)', (done) => {
      player1.emit('dab_createRoom', { mode: 'classic' });
      player1.once('dab_roomInfo', (room) => {
        expect(room.rows).to.equal(9);
        expect(room.cols).to.equal(9);
        done();
      });
    });

    it('should create extended mode (14x14)', (done) => {
      player1.emit('dab_createRoom', { mode: 'extended' });
      player1.once('dab_roomInfo', (room) => {
        expect(room.rows).to.equal(14);
        expect(room.cols).to.equal(14);
        done();
      });
    });

    it('should create marathon mode (19x19)', (done) => {
      player1.emit('dab_createRoom', { mode: 'marathon' });
      player1.once('dab_roomInfo', (room) => {
        expect(room.rows).to.equal(19);
        expect(room.cols).to.equal(19);
        done();
      });
    });
  });

  describe('Join Room', () => {
    it('should join room and verify both players present', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 2 });
      player1.once('dab_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('dab_joinRoom', { roomId, playerName: 'Bob' });

        player2.once('dab_roomInfo', (updatedRoom) => {
          if (updatedRoom.players.length === 2) {
            expect(updatedRoom.players[0].name).to.equal('Player 1');
            expect(updatedRoom.players[1].name).to.equal('Bob');
            done();
          }
        });
      });
    });

    it('should start game when second player joins', (done) => {
      let timeout = setTimeout(() => done(new Error('timeout')), 1500);
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 2 });
      player1.once('dab_roomInfo', (room) => {
        player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('dab_roomInfo', () => {
          player1.emit('dab_startGame', { roomId: room.id });
          player1.once('dab_gameStarted', () => {
            clearTimeout(timeout);
            done();
          });
        });
      });
    });

    it('should reject join to non-existent room', (done) => {
      player1.emit('dab_joinRoom', { roomId: 'FAKE123', playerName: 'Bob' });
      player1.once('dab_alert', (data) => {
        expect(data.icon).to.equal('error');
        done();
      });
    });

    it('should reject join to full room', (done) => {
      let timeout = setTimeout(() => done(new Error('timeout')), 1500);
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 2 });
      player1.once('dab_roomInfo', (room) => {
        player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('dab_roomInfo', () => {
          player1.emit('dab_startGame', { roomId: room.id });
          player1.once('dab_gameStarted', () => {
            clearTimeout(timeout);
            player3.emit('dab_joinRoom', { roomId: room.id, playerName: 'Charlie' });
            player3.once('dab_alert', (data) => {
              expect(data.icon).to.equal('error');
              done();
            });
          });
        });
      });
    });
  });

  describe('Move Validation', () => {
    it('should place horizontal line and verify state', async () => {
      const roomId = await setupRoom();
      const result = await makeMove(player1, roomId, 'h', 0, 0);

      expect(result.lineType).to.equal('h');
      expect(result.r).to.equal(0);
      expect(result.c).to.equal(0);
    });

    it('should place vertical line and verify state', async () => {
      const roomId = await setupRoom();
      const result = await makeMove(player1, roomId, 'v', 0, 0);

      expect(result.lineType).to.equal('v');
      expect(result.r).to.equal(0);
      expect(result.c).to.equal(0);
    });

    it('should reject out-of-range horizontal line', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 5, c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject out-of-range vertical line', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'v', r: 0, c: 5 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject duplicate line placement', async () => {
      const roomId = await setupRoom();
      await makeMove(player1, roomId, 'h', 0, 0);

      const roomInfoPromise = new Promise((resolve) => {
        player1.once('dab_roomInfo', resolve);
      });
      player2.emit('dab_makeMove', { roomId, lineType: 'h', r: 0, c: 0 });
      player1.emit('dab_reconnect', { roomId, playerId: player1.id });

      const roomInfo = await roomInfoPromise;
      expect(roomInfo.horizontalLines[0][0]).to.equal(0);
    });

    it("should reject move when not player's turn", async () => {
      const roomId = await setupRoom();
      await makeMove(player1, roomId, 'h', 0, 0);

      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 1, c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });
  });

  describe('Box Completion', () => {
    it('should complete a box and verify score + same player turn', async () => {
      const roomId = await setupRoom();

      await makeMove(player1, roomId, 'h', 0, 0);
      await makeMove(player2, roomId, 'v', 0, 0);
      await makeMove(player1, roomId, 'v', 0, 1);
      const result = await makeMove(player2, roomId, 'h', 1, 0);

      expect(result.claimedBoxes).to.have.lengthOf(1);
      expect(result.claimedBoxes[0]).to.deep.equal({ r: 0, c: 0 });
      expect(result.scores[1]).to.equal(1);
      expect(result.currentTurn).to.equal(1);
    });

    it('should not double-score on idempotency', async () => {
      const roomId = await setupRoom();

      await makeMove(player1, roomId, 'h', 0, 0);
      await makeMove(player2, roomId, 'v', 0, 0);
      await makeMove(player1, roomId, 'v', 0, 1);
      await makeMove(player2, roomId, 'h', 1, 0);

      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 0, c: 1 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });
  });

  describe('Game Completion', () => {
    it('should play to completion and verify dab_gameOver', async () => {
      const roomId = await setupRoom('custom', 2, 2, 2);

      const moves = [
        { p: player1, type: 'h', r: 0, c: 0 },
        { p: player2, type: 'h', r: 0, c: 1 },
        { p: player1, type: 'v', r: 0, c: 0 },
        { p: player2, type: 'v', r: 0, c: 1 },
        { p: player1, type: 'v', r: 0, c: 2 },
        { p: player2, type: 'v', r: 1, c: 2 },
        { p: player1, type: 'h', r: 2, c: 0 },
        { p: player2, type: 'h', r: 2, c: 1 },
        { p: player1, type: 'h', r: 1, c: 0 },
        { p: player1, type: 'h', r: 1, c: 1 },
        { p: player1, type: 'v', r: 1, c: 0 },
        { p: player2, type: 'v', r: 1, c: 1 },
      ];

      const gameOverPromise = new Promise((resolve) => {
        player1.on('dab_gameOver', resolve);
      });

      for (const move of moves) {
        await makeMove(move.p, roomId, move.type, move.r, move.c);
      }

      const gameOver = await gameOverPromise;
      expect(gameOver).to.have.property('scores');
      expect(gameOver.scores.reduce((a, b) => a + b, 0)).to.equal(4);
    });
  });

  describe('Reconnection', () => {
    it('should handle reconnection flow', async () => {
      const roomId = await setupRoom();

      const roomInfoPromise = new Promise((resolve) => {
        player1.once('dab_roomInfo', resolve);
      });

      player1.emit('dab_reconnect', { roomId, playerId: player1.id });
      const roomInfo = await roomInfoPromise;

      expect(roomInfo.players[0].connected).to.equal(true);
    });
  });

  describe('Disconnected Player Turn Skip', () => {
    it('should skip disconnected players in turn rotation', async () => {
      const roomId = await setupRoom('custom', 3, 3, 3);

      await makeMove(player1, roomId, 'h', 0, 0);

      const playerLeftPromise = new Promise((resolve) => {
        player1.once('dab_playerLeft', ({ playerId }) => resolve(playerId));
      });
      player2.disconnect();
      await playerLeftPromise;

      const result = await makeMove(player3, roomId, 'h', 0, 1);
      expect(result.currentTurn).to.equal(0);
    });
  });

  describe('Payload Sanitization', () => {
    it('should reject move with string r value', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: '0', c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject move with string c value', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 0, c: '0' });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject move with invalid lineType', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'x', r: 0, c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject move with negative r', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: -1, c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject move with negative c', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 0, c: -1 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject move with undefined r', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject move with undefined c', async () => {
      const roomId = await setupRoom();
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });
  });

  describe('Game State Validation', () => {
    it('should reject moves when game is in waiting state', async () => {
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 2 });
      await new Promise((resolve) => {
        player1.once('dab_roomInfo', (room) => {
          player1.emit('dab_makeMove', { roomId: room.id, lineType: 'h', r: 0, c: 0 });
          resolve();
        });
      });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject moves after game has ended', async () => {
      const roomId = await setupRoom('custom', 1, 1, 2);

      await makeMove(player1, roomId, 'h', 0, 0);
      await makeMove(player2, roomId, 'v', 0, 0);
      await makeMove(player1, roomId, 'v', 0, 1);
      await makeMove(player2, roomId, 'h', 1, 0);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 0, c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject join to room already in progress', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 2 });
      player1.once('dab_roomInfo', (room) => {
        player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('dab_roomInfo', () => {
          player1.emit('dab_startGame', { roomId: room.id });
          player1.once('dab_gameStarted', () => {
            player3.emit('dab_joinRoom', { roomId: room.id, playerName: 'Charlie' });
            player3.once('dab_alert', (data) => {
              expect(data.icon).to.equal('error');
              expect(data.text).to.equal('Game already in progress');
              done();
            });
          });
        });
      });
    });
  });

  describe('Multiple Box Claims', () => {
    it('should claim 2 boxes with a single line', async () => {
      const roomId = await setupRoom('custom', 2, 1, 2);

      await makeMove(player1, roomId, 'h', 0, 0);
      await makeMove(player2, roomId, 'v', 0, 0);
      await makeMove(player1, roomId, 'v', 0, 1);
      await makeMove(player2, roomId, 'v', 1, 0);
      await makeMove(player1, roomId, 'v', 1, 1);
      await makeMove(player2, roomId, 'h', 2, 0);
      const result = await makeMove(player1, roomId, 'h', 1, 0);

      expect(result.claimedBoxes).to.have.lengthOf(2);
      expect(result.scores[0]).to.equal(2);
      expect(result.currentTurn).to.equal(0);
    });
  });

  describe('Score Tracking', () => {
    it('should initialize scores array with correct length', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3, customPlayers: 3 });
      player1.once('dab_roomInfo', (room) => {
        expect(room.scores).to.have.lengthOf(3);
        expect(room.scores.every((s) => s === 0)).to.equal(true);
        done();
      });
    });

    it('should track scores correctly across box claims', async () => {
      const roomId = await setupRoom('custom', 2, 1, 2);

      await makeMove(player1, roomId, 'h', 0, 0);
      await makeMove(player2, roomId, 'v', 0, 0);
      await makeMove(player1, roomId, 'v', 0, 1);
      const result1 = await makeMove(player2, roomId, 'h', 1, 0);

      expect(result1.scores[1]).to.equal(1);
      expect(result1.scores[0]).to.equal(0);

      await makeMove(player2, roomId, 'h', 2, 0);
      await makeMove(player1, roomId, 'v', 1, 0);
      const result2 = await makeMove(player2, roomId, 'v', 1, 1);

      expect(result2.scores[1]).to.equal(2);
      expect(result2.scores[0]).to.equal(0);
    });
  });

  describe('Last Move Tracking', () => {
    it('should track lastMove after each placement', async () => {
      const roomId = await setupRoom();

      await makeMove(player1, roomId, 'h', 0, 0);

      const roomInfoPromise = new Promise((resolve) => {
        player1.once('dab_roomInfo', resolve);
      });
      player1.emit('dab_reconnect', { roomId, playerId: player1.id });
      const roomInfo = await roomInfoPromise;

      expect(roomInfo.lastMove).to.deep.equal({ lineType: 'h', r: 0, c: 0 });
    });
  });

  describe('Player Disconnection During Game', () => {
    it('should emit dab_playerLeft when player disconnects', async () => {
      await setupRoom();
      const disconnectedId = player2.id;

      const playerLeftPromise = new Promise((resolve) => {
        player1.once('dab_playerLeft', resolve);
      });

      player2.disconnect();
      const data = await playerLeftPromise;

      expect(data).to.have.property('playerId');
      expect(data.playerId).to.equal(disconnectedId);
    });

    it('should emit dab_gamePaused when only one player remains', async () => {
      await setupRoom();

      const pausedPromise = new Promise((resolve) => {
        player1.once('dab_gamePaused', resolve);
      });

      player2.disconnect();
      const data = await pausedPromise;

      expect(data).to.have.property('reason');
      expect(data.reason).to.equal('Opponent disconnected');
    });
  });

  describe('Boundary Line Placements', () => {
    it('should allow horizontal line at r=rows (bottom edge)', async () => {
      const roomId = await setupRoom('custom', 2, 2, 2);

      const result = await makeMove(player1, roomId, 'h', 2, 0);
      expect(result.lineType).to.equal('h');
      expect(result.r).to.equal(2);
      expect(result.c).to.equal(0);
    });

    it('should allow vertical line at c=cols (right edge)', async () => {
      const roomId = await setupRoom('custom', 2, 2, 2);

      const result = await makeMove(player1, roomId, 'v', 0, 2);
      expect(result.lineType).to.equal('v');
      expect(result.r).to.equal(0);
      expect(result.c).to.equal(2);
    });

    it('should reject horizontal line at r=rows+1', async () => {
      const roomId = await setupRoom('custom', 2, 2, 2);
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 3, c: 0 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });

    it('should reject vertical line at c=cols+1', async () => {
      const roomId = await setupRoom('custom', 2, 2, 2);
      const resultPromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'v', r: 0, c: 3 });

      const result = await resultPromise;
      expect(result).to.equal('timeout');
    });
  });

  describe('Explicit Leave', () => {
    it('should handle dab_leaveRoom and mark player disconnected', async () => {
      const roomId = await setupRoom('custom', 3, 3, 2);

      const playerLeftPromise = new Promise((resolve) => {
        player2.once('dab_playerLeft', resolve);
      });

      player1.emit('dab_leaveRoom', roomId);

      const data = await playerLeftPromise;
      expect(data.playerId).to.equal(player1.id);
    });
  });

  describe('Restart Game', () => {
    it('should fully reset state on restartGame', async () => {
      const roomId = await setupRoom();

      // Make a move first
      await makeMove(player1, roomId, 'h', 0, 0);

      // Restart
      const roomInfoPromise = new Promise((resolve) => {
        player1.once('dab_roomInfo', resolve);
      });
      player1.emit('dab_restartGame', roomId);
      const room = await roomInfoPromise;

      // All lines should be null after restart
      const hEmpty = room.horizontalLines.every((row) => row.every((cell) => cell === null));
      const vEmpty = room.verticalLines.every((row) => row.every((cell) => cell === null));
      const boxesEmpty = room.boxes.every((row) => row.every((cell) => cell === null));
      const scoresZero = room.scores.every((s) => s === 0);

      expect(hEmpty).to.equal(true);
      expect(vEmpty).to.equal(true);
      expect(boxesEmpty).to.equal(true);
      expect(scoresZero).to.equal(true);
      expect(room.lastMove).to.equal(null);
      expect(room.currentTurn).to.equal(0);
    });
  });

  describe('Restart & Reconnect Flow', () => {
    it('should allow a restarted opponent to rejoin with new socket', async () => {
      const roomId = await setupRoom();

      await makeMove(player1, roomId, 'h', 0, 0);
      await makeMove(player2, roomId, 'v', 0, 0);

      // Restart from creator
      player1.emit('dab_restartGame', roomId);

      const roomInfoPromise = new Promise((resolve) => {
        player2.once('dab_roomInfo', resolve);
      });
      const restartedRoom = await roomInfoPromise;
      expect(restartedRoom.gameState).to.equal('waiting');

      // Player2 (new socket) can still reconnect
      const reconnectPromise = new Promise((resolve) => {
        player2.once('dab_roomInfo', resolve);
      });
      player2.emit('dab_reconnect', { roomId, playerId: player2.id });
      const newRoom = await reconnectPromise;
      expect(newRoom.players[0].connected).to.equal(true);
    });
  });
});

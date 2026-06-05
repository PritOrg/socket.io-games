process.env.NODE_ENV = 'test';
const { server } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('Cross-Game Integration Tests', function () {
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

  describe('Room Isolation', () => {
    it('Bingo player should not receive Dab game events', (done) => {
      player1.emit('bingo_createRoom', 'Alice');
      player1.once('bingo_roomInfo', (_bingoRoom) => {
        player2.emit('dab_createRoom', { mode: 'classic', playerName: 'Bob' });
        player2.once('dab_roomInfo', (dabRoom) => {
          const bingoGotDabEvent = new Promise((resolve) => {
            player1.once('dab_roomInfo', () => resolve(true));
            player1.once('dab_gameStarted', () => resolve(true));
            player1.once('dab_moveResult', () => resolve(true));
            setTimeout(() => resolve(false), 300);
          });

          player2.emit('dab_joinRoom', { roomId: dabRoom.id, playerName: 'Charlie' });
          player2.once('dab_roomInfo', () => {
            player2.emit('dab_startGame', { roomId: dabRoom.id });
            player2.once('dab_gameStarted', () => {
              bingoGotDabEvent.then((gotEvent) => {
                expect(gotEvent).to.equal(false);
                done();
              });
            });
          });
        });
      });
    });

    it('different games should not share room IDs', (done) => {
      player1.emit('bingo_createRoom', 'Alice');
      player1.once('bingo_roomInfo', (bingoRoom) => {
        player3.emit('ttt_createRoom', 'Charlie');
        player3.once('ttt_roomInfo', (tttRoom) => {
          expect(bingoRoom.id).to.not.equal(tttRoom.id);
          done();
        });
      });
    });

    it('should not allow join between different game types with same roomId', (done) => {
      player1.emit('bingo_createRoom', 'Alice');
      player1.once('bingo_roomInfo', (room) => {
        const bingoRoomId = room.id;

        const tttJoinResult = new Promise((resolve) => {
          player2.once('ttt_alert', (alert) => resolve(alert));
          setTimeout(() => resolve('timeout'), 500);
        });

        player2.emit('ttt_joinRoom', { roomId: bingoRoomId, playerName: 'Bob' });
        tttJoinResult.then((result) => {
          expect(result).to.not.equal('timeout');
          expect(result.text).to.include('Not found');
          done();
        });
      });
    });
  });

  describe('Concurrent Room Creation', () => {
    it('should create multiple concurrent rooms in different games', (done) => {
      let bingoRoomId, dabRoomId, tttRoomId, utttRoomId;

      player1.once('bingo_roomInfo', (room) => {
        bingoRoomId = room.id;
        player1.once('dab_roomInfo', (dabRoom) => {
          dabRoomId = dabRoom.id;
          player1.once('ttt_roomInfo', (tttRoom) => {
            tttRoomId = tttRoom.id;
            player1.once('uttt_roomInfo', (utttRoom) => {
              utttRoomId = utttRoom.id;
              expect(bingoRoomId).to.not.equal(dabRoomId);
              expect(tttRoomId).to.not.equal(utttRoomId);
              expect(dabRoomId).to.not.equal(utttRoomId);
              expect(bingoRoomId).to.not.equal(utttRoomId);
              done();
            });
            player1.emit('uttt_createRoom', 'UTTT Player');
          });
          player1.emit('ttt_createRoom', 'TTT Player');
        });
        player1.emit('dab_createRoom', { mode: 'classic' });
      });
      player1.emit('bingo_createRoom', 'Bingo Player');
    });

    it('should handle multiple players joining same game type concurrently', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room1) => {
        player2.emit('ttt_createRoom', 'Bob');
        player2.once('ttt_roomInfo', (room2) => {
          player3.emit('ttt_joinRoom', { roomId: room1.id, playerName: 'Charlie' });
          player3.once('ttt_gameStarted', () => {
            expect(room1.id).to.not.equal(room2.id);
            done();
          });
        });
      });
    });
  });

  describe('Manager Independence', () => {
    it('Bingo game over should not affect TTT games', async () => {
      const getBingoRoom = new Promise((resolve) => {
        player1.emit('bingo_createRoom', 'Alice');
        player1.once('bingo_roomInfo', (room) => {
          player2.emit('bingo_joinRoom', { roomId: room.id, playerName: 'Bob' });
          player2.once('bingo_roomInfo', () => {
            player1.emit('bingo_startGame', room.id);
            player1.once('bingo_gameStarted', () => resolve(room.id));
          });
        });
      });

      const getTttRoom = new Promise((resolve) => {
        player3.emit('ttt_createRoom', 'Charlie');
        player3.once('ttt_roomInfo', (room) => {
          player4.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Diana' });
          player4.once('ttt_gameStarted', () => resolve(room.id));
        });
      });

      const [bingoRoomId, tttRoomId] = await Promise.all([getBingoRoom, getTttRoom]);

      const tttStateBefore = new Promise((resolve) => {
        player3.once('ttt_roomInfo', (room) => resolve(room));
      });
      player3.emit('ttt_requestRoomInfo', tttRoomId);
      const tttState1 = await tttStateBefore;
      expect(tttState1.gameState).to.equal('playing');

      player1.emit('bingo_achieved', bingoRoomId);

      await new Promise((r) => setTimeout(r, 100));

      const tttStateAfter = new Promise((resolve) => {
        player3.once('ttt_roomInfo', (room) => resolve(room));
      });
      player3.emit('ttt_requestRoomInfo', tttRoomId);
      const tttState2 = await tttStateAfter;

      expect(tttState2.gameState).to.equal('playing');
      expect(tttState2.id).to.equal(tttRoomId);
    });

    it('DAB game over should not affect UTTT games', async () => {
      const getDabRoom = new Promise((resolve) => {
        player1.emit('dab_createRoom', {
          mode: 'custom',
          customRows: 2,
          customCols: 2,
          customPlayers: 2,
          playerName: 'P1',
        });
        player1.once('dab_roomInfo', (room) => {
          player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'P2' });
          player2.once('dab_roomInfo', () => {
            player1.emit('dab_startGame', { roomId: room.id });
            player1.once('dab_gameStarted', () => resolve(room.id));
          });
        });
      });

      const getUtRoom = new Promise((resolve) => {
        player3.emit('uttt_createRoom', 'U1');
        player3.once('uttt_roomInfo', (room) => {
          player4.emit('uttt_joinRoom', { roomId: room.id, playerName: 'U2' });
          player4.once('uttt_gameStarted', () => resolve(room.id));
        });
      });

      const [dabRoomId, utttRoomId] = await Promise.all([getDabRoom, getUtRoom]);

      const utttStateBefore = new Promise((resolve) => {
        player3.once('uttt_roomInfo', (room) => resolve(room));
      });
      player3.emit('uttt_requestRoomInfo', utttRoomId);
      const utttState1 = await utttStateBefore;
      expect(utttState1.id).to.equal(utttRoomId);

      player1.emit('dab_leaveRoom', dabRoomId);

      await new Promise((r) => setTimeout(r, 100));

      const utttStateAfter = new Promise((resolve) => {
        player3.once('uttt_roomInfo', (room) => resolve(room));
      });
      player3.emit('uttt_requestRoomInfo', utttRoomId);
      const utttState2 = await utttStateAfter;

      expect(utttState2.id).to.equal(utttRoomId);
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid position in TTT', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        player2.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('ttt_gameStarted', () => {
          const resultPromise = new Promise((resolve) => {
            player1.once('ttt_moveMade', resolve);
            setTimeout(() => resolve('timeout'), 500);
          });
          player1.emit('ttt_makeMove', { roomId: room.id, position: -1 });
          resultPromise.then((result) => {
            expect(result).to.equal('timeout');
            done();
          });
        });
      });
    });

    it('should reject invalid position string in TTT', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        player2.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('ttt_gameStarted', () => {
          const resultPromise = new Promise((resolve) => {
            player1.once('ttt_moveMade', resolve);
            setTimeout(() => resolve('timeout'), 500);
          });
          player1.emit('ttt_makeMove', { roomId: room.id, position: 'abc' });
          resultPromise.then((result) => {
            expect(result).to.equal('timeout');
            done();
          });
        });
      });
    });

    it('should reject out-of-range DAB move', async () => {
      const roomIdPromise = new Promise((resolve) => {
        player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3 });
        player1.once('dab_roomInfo', (room) => {
          player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'Bob' });
          player2.once('dab_roomInfo', () => {
            player1.emit('dab_startGame', { roomId: room.id });
            player1.once('dab_gameStarted', () => resolve(room.id));
          });
        });
      });

      const roomId = await roomIdPromise;
      const movePromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'h', r: 99, c: 0 });
      const result = await movePromise;
      expect(result).to.equal('timeout');
    });

    it('should reject invalid lineType in DAB', async () => {
      const roomIdPromise = new Promise((resolve) => {
        player1.emit('dab_createRoom', { mode: 'custom', customRows: 3, customCols: 3 });
        player1.once('dab_roomInfo', (room) => {
          player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'Bob' });
          player2.once('dab_roomInfo', () => {
            player1.emit('dab_startGame', { roomId: room.id });
            player1.once('dab_gameStarted', () => resolve(room.id));
          });
        });
      });

      const roomId = await roomIdPromise;
      const movePromise = new Promise((resolve) => {
        player1.once('dab_moveResult', resolve);
        setTimeout(() => resolve('timeout'), 500);
      });
      player1.emit('dab_makeMove', { roomId, lineType: 'x', r: 0, c: 0 });
      const result = await movePromise;
      expect(result).to.equal('timeout');
    });
  });

  describe('Room Case Sensitivity', () => {
    it('should join room regardless of case', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        const lowerId = room.id.toLowerCase();
        player2.emit('ttt_joinRoom', { roomId: lowerId, playerName: 'Bob' });
        player2.once('ttt_gameStarted', () => {
          done();
        });
      });
    });
  });

  describe('Game Restart Isolation', () => {
    it('TTT restart should not affect Bingo game', async () => {
      const bingoRoom = new Promise((resolve) => {
        player1.emit('bingo_createRoom', 'Alice');
        player1.once('bingo_roomInfo', (room) => {
          player2.emit('bingo_joinRoom', { roomId: room.id, playerName: 'Bob' });
          player2.once('bingo_roomInfo', () => {
            player1.emit('bingo_startGame', room.id);
            player1.once('bingo_gameStarted', () => resolve(room.id));
          });
        });
      });

      const tttRoom = new Promise((resolve) => {
        player3.emit('ttt_createRoom', 'Charlie');
        player3.once('ttt_roomInfo', (room) => {
          player4.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Diana' });
          player4.once('ttt_roomInfo', () => resolve(room.id));
        });
      });

      const [bingoRoomId, tttRoomId] = await Promise.all([bingoRoom, tttRoom]);

      const bingoStateBefore = new Promise((resolve) => {
        player1.once('bingo_roomInfo', (room) => resolve(room));
      });
      player1.emit('bingo_requestRoomInfo', bingoRoomId);
      const bingoState1 = await bingoStateBefore;
      expect(bingoState1.gameState).to.equal('playing');

      player3.emit('ttt_restartGame', tttRoomId);

      await new Promise((r) => setTimeout(r, 100));

      const bingoStateAfter = new Promise((resolve) => {
        player1.once('bingo_roomInfo', (room) => resolve(room));
      });
      player1.emit('bingo_requestRoomInfo', bingoRoomId);
      const bingoState2 = await bingoStateAfter;

      expect(bingoState2.id).to.equal(bingoRoomId);
      expect(bingoState2.gameState).to.equal('playing');
    });
  });

  describe('Settings Object Normalization', () => {
    it('all games should include settings object in room', async () => {
      const bingoRoom = new Promise((resolve) => {
        player1.emit('bingo_createRoom', 'Alice');
        player1.once('bingo_roomInfo', (room) => resolve(room));
      });

      const tttRoom = new Promise((resolve) => {
        player2.emit('ttt_createRoom', 'Bob');
        player2.once('ttt_roomInfo', (room) => resolve(room));
      });

      const c4Room = new Promise((resolve) => {
        player3.emit('c4_createRoom', 'Charlie');
        player3.once('c4_roomInfo', (room) => resolve(room));
      });

      const utttRoom = new Promise((resolve) => {
        player4.emit('uttt_createRoom', 'Diana');
        player4.once('uttt_roomInfo', (room) => resolve(room));
      });

      const [bRoom, tRoom, cRoom, uRoom] = await Promise.all([bingoRoom, tttRoom, c4Room, utttRoom]);

      expect(bRoom).to.have.property('settings');
      expect(tRoom).to.have.property('settings');
      expect(cRoom).to.have.property('settings');
      expect(uRoom).to.have.property('settings');

      expect(bRoom.settings).to.deep.equal({});
      expect(tRoom.settings).to.deep.equal({});
      expect(cRoom.settings).to.deep.equal({});
      expect(uRoom.settings).to.deep.equal({});
    });

    it('DAB should include settings object (backward compat)', (done) => {
      player1.emit('dab_createRoom', { mode: 'custom', customRows: 5, customCols: 4, customPlayers: 3 });
      player1.once('dab_roomInfo', (room) => {
        expect(room.settings).to.deep.equal({});
        done();
      });
    });

    it('SOS should include settings with size', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 7 });
      player1.once('sos_roomInfo', (room) => {
        expect(room.settings).to.deep.equal({ size: 7 });
        done();
      });
    });
  });
});

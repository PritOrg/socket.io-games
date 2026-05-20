process.env.NODE_ENV = 'test';
const { server, io } = require('../index');
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
    done();
  });

  describe('Room Isolation', () => {
    it('Bingo player should not receive Dab game events', (done) => {
      player1.emit('bingo_createRoom', 'Alice');
      player1.once('bingo_roomInfo', (room) => {
        const roomId = room.id;

        const wrongEventPromise = new Promise((resolve) => {
          player2.once('dab_alert', () => resolve('got dab event'));
          setTimeout(() => resolve('timeout'), 500);
        });

        player2.emit('dab_joinRoom', { roomId, playerName: 'Bob' });
        wrongEventPromise.then((result) => {
          expect(result).to.equal('timeout');
          done();
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

        player3.emit('ttt_createRoom', 'Charlie');
        player3.once('ttt_roomInfo', (tttRoom) => {
          const tttRoomId = tttRoom.id;

          const tttJoinBingoPromise = new Promise((resolve) => {
            player2.once('ttt_alert', resolve);
            setTimeout(() => resolve('timeout'), 500);
          });
          player2.emit('ttt_joinRoom', { roomId: bingoRoomId, playerName: 'Bob' });
          tttJoinBingoPromise.then((result) => {
            expect(result).to.equal('timeout');
            done();
          });
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

      const tttStateAfterBingo = new Promise((resolve) => {
        player3.once('ttt_roomInfo', (room) => resolve(room));
      });

      player1.emit('bingo_achieved', bingoRoomId);
      const tttState = await tttStateAfterBingo;

      expect(tttState.gameState).to.equal('playing');
      expect(tttState.id).to.equal(tttRoomId);
    });

    it('DAB game over should not affect UTTT games', async () => {
      const getDabRoom = new Promise((resolve) => {
        player1.emit('dab_createRoom', { mode: 'classic', customPlayers: 2, playerName: 'P1' });
        player1.once('dab_roomInfo', (room) => {
          player2.emit('dab_joinRoom', { roomId: room.id, playerName: 'P2' });
          player2.once('dab_gameStarted', () => resolve(room.id));
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

      const utttStateAfterDab = new Promise((resolve) => {
        player3.once('uttt_roomInfo', (room) => resolve(room));
      });

      player3.emit('dab_leaveRoom', dabRoomId);
      const utttState = await utttStateAfterDab;

      expect(utttState.id).to.equal(utttRoomId);
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
          player2.once('dab_gameStarted', () => resolve(room.id));
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
          player2.once('dab_gameStarted', () => resolve(room.id));
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
        const upperId = room.id.toUpperCase();
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

      const bingoStateAfterTttRestart = new Promise((resolve) => {
        player1.once('bingo_roomInfo', (room) => resolve(room));
      });

      player3.emit('ttt_restartGame', tttRoomId);
      const bingoState = await bingoStateAfterTttRestart;

      expect(bingoState.id).to.equal(bingoRoomId);
      expect(bingoState.gameState).to.equal('playing');
    });
  });
});
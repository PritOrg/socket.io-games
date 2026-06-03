process.env.NODE_ENV = 'test';
const { server } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('SOS Game Logic', function () {
  this.timeout(5000);
  let player1, player2, spectator;
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
    spectator = client(`http://localhost:${port}`);

    let connected = 0;
    const checkConnected = () => {
      connected++;
      if (connected === 3) done();
    };

    player1.on('connect', checkConnected);
    player2.on('connect', checkConnected);
    spectator.on('connect', checkConnected);
  });

  afterEach((done) => {
    if (player1) player1.removeAllListeners();
    if (player2) player2.removeAllListeners();
    if (spectator) spectator.removeAllListeners();
    if (player1.connected) player1.disconnect();
    if (player2.connected) player2.disconnect();
    if (spectator.connected) spectator.disconnect();
    setTimeout(done, 100);
  });

  describe('Room Creation', () => {
    it('should create a room with default size 6', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice' });
      player1.once('sos_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        expect(room.size).to.equal(6);
        expect(room.gameState).to.equal('waiting');
        done();
      });
    });

    it('should create a room with custom size', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 5 });
      player1.once('sos_roomInfo', (room) => {
        expect(room.size).to.equal(5);
        done();
      });
    });

    it('should clamp size between 4 and 8', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 10 });
      player1.once('sos_roomInfo', (room) => {
        expect(room.size).to.equal(8);
        done();
      });
    });
  });

  describe('Join Room', () => {
    it('should join as player', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice' });
      player1.once('sos_roomInfo', (room) => {
        player2.emit('sos_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player1.once('sos_roomInfo', (room2) => {
          expect(room2.players).to.have.lengthOf(2);
          done();
        });
      });
    });

    it('should join as spectator', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice' });
      player1.once('sos_roomInfo', (room) => {
        player2.emit('sos_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player1.once('sos_roomInfo', (room2) => {
          spectator.emit('sos_joinRoom', { roomId: room2.id, playerName: 'Spectator', asSpectator: true });
          player1.once('sos_roomInfo', (room3) => {
            expect(room3.spectators).to.have.lengthOf(1);
            done();
          });
        });
      });
    });
  });

  describe('Game Flow', () => {
    it('should start game when host clicks start', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice' });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          player1.once('sos_gameStarted', () => {
            done();
          });
        });
      });
    });
  });

  describe('Move Validation', () => {
    it('should place S and O on valid moves', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 4 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          player1.once('sos_gameStarted', () => {
            player1.emit('sos_makeMove', { roomId, row: 0, col: 0, value: 'S' });
          });
          player1.once('sos_moveMade', (data) => {
            expect(data.value).to.equal('S');
            expect(data.row).to.equal(0);
            expect(data.col).to.equal(0);
            done();
          });
        });
      });
    });

    it('should reject move out of turn', (done) => {
      let timeout = setTimeout(() => done(new Error('timeout')), 1500);
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 4 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          player1.once('sos_gameStarted', () => {
            clearTimeout(timeout);
            player2.emit('sos_makeMove', { roomId, row: 0, col: 0, value: 'S' });
            timeout = setTimeout(() => done(new Error('timeout')), 1500);
          });
          player2.once('sos_moveMade', () => {
            clearTimeout(timeout);
            done(new Error('Should not have received moveMade'));
          });
          player2.once('sos_alert', (alert) => {
            clearTimeout(timeout);
            expect(alert.icon).to.equal('error');
            done();
          });
        });
      });
    });
  });

  describe('SOS Pattern Detection', () => {
    it('should detect SOS pattern when placing O completes it', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 6 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          let moveCount = 0;
          player1.on('sos_moveMade', (data) => {
            moveCount++;
            if (moveCount === 1) {
              player2.emit('sos_makeMove', { roomId, row: 0, col: 2, value: 'S' });
            }
            if (moveCount === 2) {
              player1.emit('sos_makeMove', { roomId, row: 0, col: 1, value: 'O' });
            }
            if (moveCount === 3) {
              expect(data.patterns).to.be.an('array');
              expect(data.patterns.length).to.be.at.least(1);
              expect(data.patterns[0].cells).to.have.lengthOf(3);
              done();
            }
          });
          player2.on('sos_moveMade', () => {
            // player2 move confirmation
          });
          player1.emit('sos_makeMove', { roomId, row: 0, col: 0, value: 'S' });
        });
      });
    });
  });

  describe('Score Increment', () => {
    it('should increment score when SOS is formed', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 6 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          let moveCount = 0;
          player1.on('sos_moveMade', (data) => {
            moveCount++;
            if (moveCount === 1) {
              player2.emit('sos_makeMove', { roomId, row: 0, col: 2, value: 'S' });
            }
            if (moveCount === 2) {
              player1.emit('sos_makeMove', { roomId, row: 0, col: 1, value: 'O' });
            }
            if (moveCount === 3) {
              expect(data.scores[0]).to.be.at.least(1);
              done();
            }
          });
          player2.on('sos_moveMade', () => {});
          player1.emit('sos_makeMove', { roomId, row: 0, col: 0, value: 'S' });
        });
      });
    });
  });

  describe('Extra Turn on Score', () => {
    it('should keep turn when player scores', (done) => {
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 6 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          let moveCount = 0;
          player1.on('sos_moveMade', (data) => {
            moveCount++;
            if (moveCount === 1) {
              player2.emit('sos_makeMove', { roomId, row: 0, col: 2, value: 'S' });
            }
            if (moveCount === 2) {
              player1.emit('sos_makeMove', { roomId, row: 0, col: 1, value: 'O' });
            }
            if (moveCount === 3) {
              expect(data.currentTurn).to.equal(0);
              done();
            }
          });
          player2.on('sos_moveMade', () => {});
          player1.emit('sos_makeMove', { roomId, row: 0, col: 0, value: 'S' });
        });
      });
    });
  });

  describe('Game Over', () => {
    it('should emit gameOver when board is full', function (done) {
      this.timeout(10000);
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 4 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('sos_roomInfo', () => {
          player1.emit('sos_startGame', { roomId });
          // Generate all 16 coordinates for the full 4x4 board
          const moves = [];
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              moves.push({ row: r, col: c });
            }
          }
          let moveIdx = 0;
          const makeNextMove = () => {
            if (moveIdx >= moves.length) return;
            const m = moves[moveIdx];
            const player = moveIdx % 2 === 0 ? player1 : player2;
            moveIdx++;
            player.emit('sos_makeMove', { roomId, row: m.row, col: m.col, value: 'O' });
          };
          player1.once('sos_gameOver', (data) => {
            expect(data).to.have.property('winner');
            expect(data).to.have.property('scores');
            done();
          });
          player1.on('sos_moveMade', makeNextMove);
          makeNextMove();
        });
      });
    });
  });
});

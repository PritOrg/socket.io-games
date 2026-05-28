process.env.NODE_ENV = 'test';
const { server } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('Connect4 Game Logic', function () {
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
    if (player1.connected) player1.disconnect();
    if (player2.connected) player2.disconnect();
    if (spectator.connected) spectator.disconnect();
    setTimeout(done, 100);
  });

  describe('Room Creation', () => {
    it('should create a room with 6x7 board', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        expect(room.board).to.have.lengthOf(6);
        expect(room.board[0]).to.have.lengthOf(7);
        expect(room.gameState).to.equal('waiting');
        done();
      });
    });
  });

  describe('Join Room', () => {
    it('should join as player', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', (room2) => {
          expect(room2.players).to.have.lengthOf(2);
          done();
        });
      });
    });

    it('should join as spectator when room full', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          spectator.emit('c4_joinRoom', { roomId, playerName: 'Spectator', asSpectator: true });
          player1.once('c4_roomInfo', (room3) => {
            expect(room3.spectators).to.have.lengthOf(1);
            done();
          });
        });
      });
    });
  });

  describe('Game Flow', () => {
    it('should start game when host clicks start', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            done();
          });
        });
      });
    });
  });

  describe('Move Validation', () => {
    it('should drop disc in column', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            player1.emit('c4_makeMove', { roomId, column: 3 });
          });
          player1.once('c4_moveMade', (data) => {
            expect(data.col).to.equal(3);
            expect(data.row).to.equal(5);
            done();
          });
        });
      });
    });

    it('should alternate turns', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            player1.emit('c4_makeMove', { roomId, column: 0 });
          });
          let moveCount = 0;
          player1.on('c4_moveMade', (data) => {
            moveCount++;
            if (moveCount === 1) {
              expect(data.playerIndex).to.equal(0);
              player2.emit('c4_makeMove', { roomId, column: 1 });
            }
            if (moveCount === 2) {
              expect(data.playerIndex).to.equal(1);
              done();
            }
          });
        });
      });
    });
  });

  describe('Win Detection - Vertical', () => {
    it('should detect vertical win', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            for (let i = 0; i < 4; i++) {
              player1.emit('c4_makeMove', { roomId, column: 0 });
              player2.emit('c4_makeMove', { roomId, column: 1 });
            }
          });
          player1.once('c4_gameOver', (data) => {
            expect(data.winner).to.equal(player1.id);
            expect(data.winLine).to.be.an('array');
            expect(data.winLine).to.have.lengthOf(4);
            done();
          });
        });
      });
    });
  });

  describe('Win Detection - Horizontal', () => {
    it('should detect horizontal win', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            player1.emit('c4_makeMove', { roomId, column: 0 });
            player2.emit('c4_makeMove', { roomId, column: 0 });
            player1.emit('c4_makeMove', { roomId, column: 1 });
            player2.emit('c4_makeMove', { roomId, column: 1 });
            player1.emit('c4_makeMove', { roomId, column: 2 });
            player2.emit('c4_makeMove', { roomId, column: 2 });
            player1.emit('c4_makeMove', { roomId, column: 3 });
          });
          player1.once('c4_gameOver', (data) => {
            expect(data.winner).to.equal(player1.id);
            expect(data.winLine).to.be.an('array');
            done();
          });
        });
      });
    });
  });

  describe('Draw Detection', () => {
    it('should detect draw when board is full with no winner', (done) => {
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            let moves = 0;
            const columns = [0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6];
            columns.forEach((col, i) => {
              setTimeout(() => {
                const player = i % 2 === 0 ? player1 : player2;
                player.emit('c4_makeMove', { roomId, column: col });
              }, i * 20);
            });
          });
          player1.once('c4_gameOver', (data) => {
            expect(data.winner).to.be.null;
            done();
          });
        });
      });
    });
  });

  describe('Column Full Rejection', () => {
    it('should reject move in full column', (done) => {
      let timeout = setTimeout(() => done(new Error('timeout')), 2000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            for (let i = 0; i < 6; i++) {
              player1.emit('c4_makeMove', { roomId, column: 0 });
              player2.emit('c4_makeMove', { roomId, column: 1 });
            }
          });
          player1.once('c4_moveMade', () => {
            clearTimeout(timeout);
            player1.emit('c4_makeMove', { roomId, column: 0 });
            timeout = setTimeout(() => done(new Error('timeout')), 1000);
          });
          player1.once('c4_alert', (alert) => {
            clearTimeout(timeout);
            expect(alert.text).to.include('full');
            done();
          });
        });
      });
    });

    it('should emit c4_columnFull alert on full column click', (done) => {
      let timeout = setTimeout(() => done(new Error('timeout')), 2000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            for (let i = 0; i < 6; i++) {
              player1.emit('c4_makeMove', { roomId, column: 3 });
              player2.emit('c4_makeMove', { roomId, column: 2 });
            }
          });
          player1.once('c4_moveMade', () => {
            clearTimeout(timeout);
            player1.emit('c4_makeMove', { roomId, column: 3 });
            timeout = setTimeout(() => done(new Error('timeout')), 1000);
          });
          player1.once('c4_alert', (alert) => {
            clearTimeout(timeout);
            expect(alert.text).to.include('full');
            done();
          });
        });
      });
    });
  });
});

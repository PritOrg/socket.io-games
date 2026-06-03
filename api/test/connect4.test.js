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
    if (player1) player1.removeAllListeners();
    if (player2) player2.removeAllListeners();
    if (spectator) spectator.removeAllListeners();
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

    it('should alternate turns', function (done) {
      this.timeout(5000);
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
    it('should detect vertical win', function (done) {
      this.timeout(5000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            let moveIdx = 0;
            const makeMove = () => {
              if (moveIdx >= 7) return;
              const p = moveIdx % 2 === 0 ? player1 : player2;
              const col = moveIdx % 2 === 0 ? 0 : 1;
              p.emit('c4_makeMove', { roomId, column: col });
              moveIdx++;
            };
            player1.once('c4_gameOver', (data) => {
              expect(data.winner).to.equal(player1.id);
              expect(data.winLine).to.be.an('array');
              expect(data.winLine).to.have.lengthOf(4);
              done();
            });
            player1.on('c4_moveMade', makeMove);
            makeMove();
          });
        });
      });
    });
  });

  describe('Win Detection - Horizontal', () => {
    it('should detect horizontal win', function (done) {
      this.timeout(5000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            let moveIdx = 0;
            const makeMove = () => {
              if (moveIdx >= 7) return;
              const p = moveIdx % 2 === 0 ? player1 : player2;
              const col = moveIdx % 2 === 0 ? Math.floor(moveIdx / 2) : 6;
              p.emit('c4_makeMove', { roomId, column: col });
              moveIdx++;
            };
            player1.once('c4_gameOver', (data) => {
              expect(data.winner).to.equal(player1.id);
              expect(data.winLine).to.be.an('array');
              done();
            });
            player1.on('c4_moveMade', makeMove);
            makeMove();
          });
        });
      });
    });
  });

  describe('Draw Detection', () => {
    it('should detect draw when board is full with no winner', function (done) {
      this.timeout(20000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            const drawMoves = [
              0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 4, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5,
              5, 6, 6, 6, 6, 6, 6,
            ];
            let moveIdx = 0;
            const nextMove = () => {
              if (moveIdx >= 42) return;
              const col = drawMoves[moveIdx];
              const p = moveIdx % 2 === 0 ? player1 : player2;
              p.emit('c4_makeMove', { roomId, column: col });
              moveIdx++;
            };
            player1.once('c4_gameOver', (data) => {
              expect(data.winner).to.be.null;
              done();
            });
            player1.on('c4_moveMade', nextMove);
            nextMove();
          });
        });
      });
    });
  });

  describe('Column Full Rejection', () => {
    it('should reject move in full column', function (done) {
      this.timeout(5000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            let moveIdx = 0;
            const makeMove = () => {
              // Fill column 0 completely with 6 items
              if (moveIdx < 6) {
                const p = moveIdx % 2 === 0 ? player1 : player2;
                p.emit('c4_makeMove', { roomId, column: 0 });
                moveIdx++;
              } else if (moveIdx === 6) {
                // Try to make a 7th move in full column 0
                player1.emit('c4_makeMove', { roomId, column: 0 });
                moveIdx++;
              }
            };
            player1.once('c4_alert', (alert) => {
              expect(alert.text).to.include('full');
              done();
            });
            player1.on('c4_moveMade', makeMove);
            makeMove();
          });
        });
      });
    });

    it('should emit c4_columnFull alert on full column click', function (done) {
      this.timeout(5000);
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        player1.once('c4_roomInfo', () => {
          player1.emit('c4_startGame', { roomId });
          player1.once('c4_gameStarted', () => {
            let moveIdx = 0;
            const makeMove = () => {
              // Fill column 3 completely with 6 items
              if (moveIdx < 6) {
                const p = moveIdx % 2 === 0 ? player1 : player2;
                p.emit('c4_makeMove', { roomId, column: 3 });
                moveIdx++;
              } else if (moveIdx === 6) {
                // Try to make a 7th move in full column 3
                player1.emit('c4_makeMove', { roomId, column: 3 });
                moveIdx++;
              }
            };
            player1.once('c4_alert', (alert) => {
              expect(alert.text).to.include('full');
              done();
            });
            player1.on('c4_moveMade', makeMove);
            makeMove();
          });
        });
      });
    });
  });
});

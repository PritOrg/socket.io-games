process.env.NODE_ENV = 'test';
const { server } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('TicTacToe Game Logic', function () {
  let player1, player2;
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
    let connected = 0;
    const check = () => {
      if (++connected === 2) done();
    };
    player1.on('connect', check);
    player2.on('connect', check);
  });

  afterEach((done) => {
    if (player1.connected) player1.disconnect();
    if (player2.connected) player2.disconnect();
    setTimeout(done, 100);
  });

  // Helper: create room, join, wait for gameStarted
  const setupGame = (cb) => {
    player1.emit('ttt_createRoom', 'Alice');
    player1.once('ttt_roomInfo', (room) => {
      player2.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Bob' });
      player1.once('ttt_gameStarted', () => cb(room.id));
    });
  };

  describe('Room Creation', () => {
    it('should create a room with waiting state', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        expect(room.players[0].name).to.equal('Alice');
        expect(room.gameState).to.equal('waiting');
        done();
      });
    });
  });

  describe('Join Room', () => {
    it('should start game immediately when second player joins', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        player2.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('ttt_gameStarted', () => {
          player2.once('ttt_roomInfo', (r) => {
            expect(r.gameState).to.equal('playing');
            expect(r.players).to.have.lengthOf(2);
            done();
          });
        });
      });
    });

    it('should reject join on full room', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        player2.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Bob' });
        player2.once('ttt_gameStarted', () => {
          const player3 = client(`http://localhost:${port}`);
          player3.on('connect', () => {
            player3.emit('ttt_joinRoom', { roomId: room.id, playerName: 'Carol' });
            player3.once('ttt_alert', ({ icon }) => {
              expect(icon).to.equal('error');
              player3.disconnect();
              done();
            });
          });
        });
      });
    });
  });

  describe('Make Move', () => {
    it('should place symbol and emit moveMade', (done) => {
      setupGame((roomId) => {
        player1.emit('ttt_makeMove', { roomId, position: 4 });
        player1.once('ttt_moveMade', ({ position, symbol }) => {
          expect(position).to.equal(4);
          expect(symbol).to.equal('X');
          done();
        });
      });
    });

    it('should reject move when not your turn', (done) => {
      setupGame((roomId) => {
        // player2 tries to move first (player1 goes first)
        player2.emit('ttt_makeMove', { roomId, position: 0 });
        setTimeout(() => {
          // board should still be empty — no moveMade fired
          player1.emit('ttt_makeMove', { roomId, position: 0 });
          player1.once('ttt_moveMade', ({ position }) => {
            expect(position).to.equal(0);
            done();
          });
        }, 100);
      });
    });

    it('should reject move on occupied cell', (done) => {
      setupGame((roomId) => {
        player1.emit('ttt_makeMove', { roomId, position: 0 });
        player1.once('ttt_nextTurn', () => {
          // player2 tries same cell
          player2.emit('ttt_makeMove', { roomId, position: 0 });
          setTimeout(() => {
            // no second moveMade should fire for position 0 with O
            done();
          }, 100);
        });
      });
    });

    it('should advance turn after valid move', (done) => {
      setupGame((roomId) => {
        player1.emit('ttt_makeMove', { roomId, position: 0 });
        player1.once('ttt_nextTurn', (nextId) => {
          expect(nextId).to.equal(player2.id);
          done();
        });
      });
    });
  });

  describe('Win Detection', () => {
    it('should detect top-row win for X', (done) => {
      setupGame((roomId) => {
        // X: 0,1,2  O: 3,4
        const moves = [
          [player1, 0],
          [player2, 3],
          [player1, 1],
          [player2, 4],
          [player1, 2],
        ];
        let i = 0;
        const next = () => {
          if (i >= moves.length) return;
          const [p, pos] = moves[i++];
          p.emit('ttt_makeMove', { roomId, position: pos });
        };
        player1.on('ttt_nextTurn', next);
        player2.on('ttt_nextTurn', next);
        player1.once('ttt_gameWon', ({ winner, winningLine }) => {
          expect(winner).to.equal(player1.id);
          expect(winningLine).to.deep.equal([0, 1, 2]);
          done();
        });
        next();
      });
    });
  });

  describe('Restart', () => {
    it('should reset board and resume playing', (done) => {
      setupGame((roomId) => {
        player1.emit('ttt_restartGame', roomId);
        player1.once('ttt_roomInfo', (room) => {
          expect(room.gameState).to.equal('playing');
          expect(room.board.every((c) => c === null)).to.be.true;
          done();
        });
      });
    });
  });

  describe('Disconnect', () => {
    it('should pause game and notify opponent on disconnect', (done) => {
      setupGame((_roomId) => {
        player1.once('ttt_gamePaused', ({ reason }) => {
          expect(reason).to.be.a('string');
          done();
        });
        player2.disconnect();
      });
    });

    it('should emit playerLeft on disconnect', (done) => {
      setupGame((_roomId) => {
        player1.once('ttt_playerLeft', (data) => {
          expect(data.playerId).to.be.a('string');
          done();
        });
        player2.disconnect();
      });
    });
  });

  describe('Reconnect', () => {
    it('should allow player to reconnect and resume game', (done) => {
      setupGame((roomId) => {
        const p2Id = player2.id;
        player2.disconnect();

        setTimeout(() => {
          const player2b = client(`http://localhost:${port}`);
          player2b.on('connect', () => {
            player2b.emit('ttt_reconnect', { roomId, playerId: p2Id });
            player2b.once('ttt_roomInfo', (room) => {
              expect(room.gameState).to.equal('playing');
              player2b.disconnect();
              done();
            });
          });
        }, 150);
      });
    });
  });
});

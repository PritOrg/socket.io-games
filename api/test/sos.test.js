process.env.NODE_ENV = 'test';
const { server } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('SOS Game Logic', function () {
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
      player1.emit('sos_createRoom', { playerName: 'Alice', size: 4 });
      player1.once('sos_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('sos_joinRoom', { roomId, playerName: 'Bob' });
        player2.once('sos_roomInfo', () => {
          player1.once('sos_roomInfo', () => {
            player1.emit('sos_startGame', { roomId });
            player1.once('sos_gameStarted', () => {
              player2.emit('sos_makeMove', { roomId, row: 0, col: 0, value: 'S' });
            });
            player2.once('sos_moveMade', () => {
              done(new Error('Should not have received moveMade'));
            });
            player2.once('sos_alert', (alert) => {
              expect(alert.icon).to.equal('error');
              done();
            });
          });
        });
      });
    });
  });
});

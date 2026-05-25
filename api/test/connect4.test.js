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
      let roomId;
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
      });
      player1.once('c4_roomInfo', (room) => {
        expect(room.players).to.have.lengthOf(2);
        done();
      });
    });

    it('should join as spectator when room full', (done) => {
      let roomId;
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
        spectator.emit('c4_joinRoom', { roomId, playerName: 'Spectator', asSpectator: true });
      });
      player1.once('c4_roomInfo', (room) => {
        expect(room.spectators).to.have.lengthOf(1);
        done();
      });
    });
  });

  describe('Game Flow', () => {
    it('should start game when host clicks start', (done) => {
      let roomId;
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
      });
      player1.once('c4_roomInfo', () => {
        player1.emit('c4_startGame', { roomId });
      });
      player1.once('c4_gameStarted', () => {
        done();
      });
    });
  });

  describe('Move Validation', () => {
    it('should drop disc in column', (done) => {
      let roomId;
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
      });
      player1.once('c4_roomInfo', () => {
        player1.emit('c4_startGame', { roomId });
      });
      player1.once('c4_gameStarted', () => {
        player1.emit('c4_makeMove', { roomId, column: 3 });
      });
      player1.once('c4_moveMade', (data) => {
        expect(data.col).to.equal(3);
        expect(data.row).to.equal(5);
        done();
      });
    });

    it('should alternate turns', (done) => {
      let roomId;
      player1.emit('c4_createRoom', { playerName: 'Alice' });
      player1.once('c4_roomInfo', (room) => {
        roomId = room.id;
        player2.emit('c4_joinRoom', { roomId, playerName: 'Bob' });
      });
      player1.once('c4_roomInfo', () => {
        player1.emit('c4_startGame', { roomId });
      });
      player1.once('c4_gameStarted', () => {
        player1.emit('c4_makeMove', { roomId, column: 0 });
      });
      let moveCount = 0;
      player1.on('c4_moveMade', (data) => {
        moveCount++;
        if (moveCount === 2) {
          expect(data.playerIndex).to.equal(1);
          done();
        }
      });
    });
  });
});

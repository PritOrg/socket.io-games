process.env.NODE_ENV = 'test';
const { server, io } = require('../index');
const client = require('socket.io-client');
const { expect } = require('chai');

describe('PaperParty Backend Tests', function () {
  let player1, player2;
  const port = 4001; // Use a different port for tests

  before((done) => {
    server.listen(port, () => {
      done();
    });
  });

  after((done) => {
    server.close(() => {
      done();
    });
  });

  beforeEach((done) => {
    player1 = client(`http://localhost:${port}`);
    player2 = client(`http://localhost:${port}`);
    
    let connected = 0;
    const checkConnected = () => {
      connected++;
      if (connected === 2) done();
    };

    player1.on('connect', checkConnected);
    player2.on('connect', checkConnected);
  });

  afterEach((done) => {
    if (player1.connected) player1.disconnect();
    if (player2.connected) player2.disconnect();
    done();
  });

  describe('Bingo Game Logic', () => {
    it('should create a bingo room', (done) => {
      player1.emit('bingo_createRoom', 'Alice');
      player1.once('bingo_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        expect(room.players[0].name).to.equal('Alice');
        done();
      });
    });

    it('should join a bingo room', (done) => {
      player1.emit('bingo_createRoom', 'Alice');
      player1.once('bingo_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('bingo_joinRoom', { roomId, playerName: 'Bob' });
        
        const onRoomInfo = (updatedRoom) => {
          if (updatedRoom.players.length === 2) {
            player2.off('bingo_roomInfo', onRoomInfo);
            expect(updatedRoom.players[1].name).to.equal('Bob');
            expect(updatedRoom.gameState).to.equal('ready');
            done();
          }
        };
        player2.on('bingo_roomInfo', onRoomInfo);
      });
    });
  });

  describe('TicTacToe Game Logic', () => {
    it('should create a tictactoe room', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        done();
      });
    });

    it('should start tictactoe when second player joins', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('ttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player2.once('ttt_gameStarted', () => {
          done();
        });
      });
    });

    it('should handle moves correctly', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('ttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player1.once('ttt_gameStarted', () => {
          player1.emit('ttt_makeMove', { roomId, position: 0 });
        });

        player1.once('ttt_moveMade', ({ position, symbol }) => {
          expect(position).to.equal(0);
          expect(symbol).to.equal('X');
          done();
        });
      });
    });

    it('should detect a winner in TicTacToe', (done) => {
      player1.emit('ttt_createRoom', 'Alice');
      player1.once('ttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('ttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player1.once('ttt_gameStarted', () => {
          // Alice: 0, 1, 2 (Win)
          // Bob: 3, 4
          player1.emit('ttt_makeMove', { roomId, position: 0 });
          
          player2.once('ttt_nextTurn', () => {
            player2.emit('ttt_makeMove', { roomId, position: 3 });
            
            player1.once('ttt_nextTurn', () => {
              player1.emit('ttt_makeMove', { roomId, position: 1 });
              
              player2.once('ttt_nextTurn', () => {
                player2.emit('ttt_makeMove', { roomId, position: 4 });
                
                player1.once('ttt_nextTurn', () => {
                  player1.emit('ttt_makeMove', { roomId, position: 2 });
                });
              });
            });
          });
        });

        player1.on('ttt_gameWon', ({ winner }) => {
          expect(winner).to.equal(player1.id);
          done();
        });
      });
    });
  });

  describe('Ultimate TicTacToe Game Logic', () => {
    it('should create a uttt room', (done) => {
      player1.emit('uttt_createRoom', 'Alice');
      player1.once('uttt_roomInfo', (room) => {
        expect(room).to.have.property('id');
        expect(room.players).to.have.lengthOf(1);
        expect(room.players[0].name).to.equal('Alice');
        done();
      });
    });

    it('should join a uttt room and start game', (done) => {
      player1.emit('uttt_createRoom', 'Alice');
      player1.once('uttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('uttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player2.once('uttt_gameStarted', () => {
          done();
        });
      });
    });

    it('should handle moves correctly and update activeGrid', (done) => {
      player1.emit('uttt_createRoom', 'Alice');
      player1.once('uttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('uttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player1.once('uttt_gameStarted', () => {
          // Alice plays in grid 4, square 2
          player1.emit('uttt_makeMove', { roomId, gridIndex: 4, squareIndex: 2 });
        });

        player1.on('uttt_gameState', (state) => {
          if (state.lastMove && state.lastMove.gridIndex === 4 && state.lastMove.squareIndex === 2) {
              expect(state.board[4][2]).to.equal('X');
              expect(state.activeGrid).to.equal(2);
              done();
          }
        });
      });
    });

    it('should reject moves in wrong grid', (done) => {
      player1.emit('uttt_createRoom', 'Alice');
      player1.once('uttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('uttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player1.once('uttt_gameStarted', () => {
          // Alice plays in grid 4, square 2
          player1.emit('uttt_makeMove', { roomId, gridIndex: 4, squareIndex: 2 });
          
          player2.once('uttt_gameState', (state) => {
              expect(state.activeGrid).to.equal(2);
              // Bob tries to play in grid 0 instead of 2
              player2.emit('uttt_makeMove', { roomId, gridIndex: 0, squareIndex: 0 });
          });

          player2.once('uttt_error', (error) => {
              expect(error.message).to.contain('Must play in grid 2');
              done();
          });
        });
      });
    });

    it('should detect inner win and update macroBoard', (done) => {
      player1.emit('uttt_createRoom', 'Alice');
      player1.once('uttt_roomInfo', (room) => {
        const roomId = room.id;
        player2.emit('uttt_joinRoom', { roomId, playerName: 'Bob' });
        
        player1.once('uttt_gameStarted', () => {
          // Alice: (4,0), (0,4), (4,1), (1,4), (4,2) -> Alice wins grid 4
          player1.emit('uttt_makeMove', { roomId, gridIndex: 4, squareIndex: 0 });
          
          player2.once('uttt_gameState', () => {
              player2.emit('uttt_makeMove', { roomId, gridIndex: 0, squareIndex: 4 });
              
              player1.once('uttt_gameState', () => {
                  player1.emit('uttt_makeMove', { roomId, gridIndex: 4, squareIndex: 1 });
                  
                  player2.once('uttt_gameState', () => {
                      player2.emit('uttt_makeMove', { roomId, gridIndex: 1, squareIndex: 4 });
                      
                      player1.once('uttt_gameState', () => {
                          player1.emit('uttt_makeMove', { roomId, gridIndex: 4, squareIndex: 2 });
                      });
                  });
              });
          });

          player1.on('uttt_gameState', (state) => {
              if (state.macroBoard[4] === 'X') {
                  expect(state.scores.X).to.equal(1);
                  done();
              }
          });
        });
      });
    });
  });
});

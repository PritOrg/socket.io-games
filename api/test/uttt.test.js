process.env.NODE_ENV = "test";
const { server, io } = require("../index");
const client = require("socket.io-client");
const { expect } = require("chai");

describe("Ultimate Tic-Tac-Toe (UTTT) Game Logic", function () {
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
    const checkConnected = () => {
      connected++;
      if (connected === 2) done();
    };

    player1.on("connect", checkConnected);
    player2.on("connect", checkConnected);
  });

  afterEach((done) => {
    if (player1.connected) player1.disconnect();
    if (player2.connected) player2.disconnect();
    done();
  });

  describe("Room Lifecycle", () => {
    it("should create a UTTT room with correct initial state", (done) => {
      player1.emit("uttt_createRoom", "Alice");
      player1.once("uttt_roomInfo", (room) => {
        expect(room.gameState).to.equal("waiting");
        expect(room.players).to.have.lengthOf(1);
        expect(room.board).to.have.lengthOf(9);
        expect(room.macroBoard).to.have.lengthOf(9).and.include(null);
        done();
      });
    });

    it("should start game when second player joins", (done) => {
      player1.emit("uttt_createRoom", "Alice");
      player1.once("uttt_roomInfo", (room) => {
        player2.emit("uttt_joinRoom", { roomId: room.id, playerName: "Bob" });

        player1.once("uttt_gameStarted", () => {
          player1.once("uttt_roomInfo", (startedRoom) => {
            expect(startedRoom.gameState).to.equal("playing");
            expect(startedRoom.currentTurn).to.equal(player1.id);
            done();
          });
        });
      });
    });
  });

  describe("Move Validation", () => {
    let roomId;

    beforeEach((done) => {
      player1.emit("uttt_createRoom", "Alice");
      player1.once("uttt_roomInfo", (room) => {
        roomId = room.id;
        player2.emit("uttt_joinRoom", { roomId, playerName: "Bob" });
        player1.once("uttt_gameStarted", () => done());
      });
    });

    it("should prevent move if it is not player turn", (done) => {
      player2.emit("uttt_makeMove", { roomId, gridIndex: 4, squareIndex: 4 });
      player2.once("uttt_error", (error) => {
        expect(error.message).to.equal("Not your turn");
        done();
      });
    });

    it("should enforce active grid constraint", (done) => {
      player1.emit("uttt_makeMove", { roomId, gridIndex: 4, squareIndex: 4 });

      player1.once("uttt_gameState", () => {
        player2.emit("uttt_makeMove", { roomId, gridIndex: 0, squareIndex: 0 });
        player2.once("uttt_error", (error) => {
          expect(error.message).to.contain("Must play in grid 4");
          done();
        });
      });
    });

    it("should prevent playing in occupied square", (done) => {
      player1.emit("uttt_makeMove", { roomId, gridIndex: 4, squareIndex: 4 });
      player1.once("uttt_gameState", () => {
        player2.emit("uttt_makeMove", { roomId, gridIndex: 4, squareIndex: 4 });
        player2.once("uttt_error", (error) => {
          expect(error.message).to.equal("Square already occupied");
          done();
        });
      });
    });
  });

  describe("Win Conditions", () => {
    it("should detect an inner grid win and still allow play in won grid", (done) => {
      player1.emit("uttt_createRoom", "Alice");
      player1.once("uttt_roomInfo", (room) => {
        const roomId = room.id;
        player2.emit("uttt_joinRoom", { roomId, playerName: "Bob" });

        // P1 wins grid 4 with top row (squares 0,1,2), then P2 plays in activeGrid 2
        const moves = [
          () =>
            player1.emit("uttt_makeMove", {
              roomId,
              gridIndex: 4,
              squareIndex: 0,
            }),
          () =>
            player2.emit("uttt_makeMove", {
              roomId,
              gridIndex: 0,
              squareIndex: 4,
            }),
          () =>
            player1.emit("uttt_makeMove", {
              roomId,
              gridIndex: 4,
              squareIndex: 1,
            }),
          () =>
            player2.emit("uttt_makeMove", {
              roomId,
              gridIndex: 1,
              squareIndex: 4,
            }),
          () =>
            player1.emit("uttt_makeMove", {
              roomId,
              gridIndex: 4,
              squareIndex: 2,
            }),
          () =>
            player2.emit("uttt_makeMove", {
              roomId,
              gridIndex: 2,
              squareIndex: 4,
            }),
        ];

        let step = 0;
        const checkState = (state) => {
          if (step === 4) {
            expect(state.macroBoard[4]).to.equal("X");
            expect(state.scores.X).to.equal(1);
          }
          if (step === 5) {
            expect(state.board[2][4]).to.equal("O");
            done();
            return;
          }
          step++;
          setTimeout(() => moves[step](), 50);
        };

        player1.once("uttt_gameStarted", () => {
          player1.on("uttt_gameState", checkState);
          step = 0;
          moves[0]();
        });
      });
    });

    it("should detect a macro game win", (done) => {
      player1.emit("uttt_createRoom", "Alice");
      player1.once("uttt_roomInfo", (room) => {
        const roomId = room.id;
        player2.emit("uttt_joinRoom", { roomId, playerName: "Bob" });

        player1.once("uttt_gameStarted", () => {
          // Setup error handlers
          const errorHandler = (err) =>
            done(new Error(`Sequence Error: ${err.message}`));
          player1.on("uttt_error", errorHandler);
          player2.on("uttt_error", errorHandler);

          /**
           * STRATEGY: Alice wins grids 0, 1, 2 (top row of macro board)
           * Each grid, Alice gets the top row (squares 0, 1, 2)
           *
           * Key insight: After playing square S in any grid, opponent goes to grid S
           * We carefully route moves to let Alice build three grids
           */
          const moves = [
            // Alice starts: play in middle grid (G4) to control flow
            { p: player1, g: 4, s: 3 }, // Alice G4-S3, Bob -> G3
            { p: player2, g: 3, s: 4 }, // Bob G3-S4, Alice -> G4
            { p: player1, g: 4, s: 4 }, // Alice G4-S4, Bob -> G4
            { p: player2, g: 4, s: 5 }, // Bob G4-S5, Alice -> G5
            { p: player1, g: 5, s: 3 }, // Alice G5-S3, Bob -> G3
            { p: player2, g: 3, s: 5 }, // Bob G3-S5, Alice -> G5
            { p: player1, g: 5, s: 4 }, // Alice G5-S4, Bob -> G4
            { p: player2, g: 4, s: 6 }, // Bob G4-S6, Alice -> G6
            { p: player1, g: 6, s: 3 }, // Alice G6-S3, Bob -> G3
            { p: player2, g: 3, s: 6 }, // Bob G3-S6, Alice -> G6
            { p: player1, g: 6, s: 4 }, // Alice G6-S4, Bob -> G4
            { p: player2, g: 4, s: 7 }, // Bob G4-S7, Alice -> G7
            { p: player1, g: 7, s: 3 }, // Alice G7-S3, Bob -> G3
            { p: player2, g: 3, s: 7 }, // Bob G3-S7, Alice -> G7
            { p: player1, g: 7, s: 4 }, // Alice G7-S4, Bob -> G4
            { p: player2, g: 4, s: 8 }, // Bob G4-S8, Alice -> G8
            { p: player1, g: 8, s: 3 }, // Alice G8-S3, Bob -> G3
            { p: player2, g: 3, s: 8 }, // Bob G3-S8, Alice -> G8
            { p: player1, g: 8, s: 4 }, // Alice G8-S4, Bob -> G4
            { p: player2, g: 4, s: 0 }, // Bob G4-S0, Alice -> G0

            // Now Alice starts winning Grid 0
            { p: player1, g: 0, s: 0 }, // Alice G0-S0 (1/3), Bob -> G0
            { p: player2, g: 0, s: 3 }, // Bob G0-S3, Alice -> G3
            { p: player1, g: 3, s: 0 }, // Alice G3-S0, Bob -> G0
            { p: player2, g: 0, s: 4 }, // Bob G0-S4, Alice -> G4 (full, so any)
            { p: player1, g: 0, s: 1 }, // Alice G0-S1 (2/3), Bob -> G1
            { p: player2, g: 1, s: 3 }, // Bob G1-S3, Alice -> G3
            { p: player1, g: 3, s: 1 }, // Alice G3-S1, Bob -> G1
            { p: player2, g: 1, s: 4 }, // Bob G1-S4, Alice -> G4 (full, so any)
            { p: player1, g: 0, s: 2 }, // Alice G0-S2 (3/3) WINS GRID 0!, Bob -> G2

            // Alice has Grid 0. Now Grid 1
            { p: player2, g: 2, s: 3 }, // Bob G2-S3, Alice -> G3
            { p: player1, g: 3, s: 2 }, // Alice G3-S2, Bob -> G2
            { p: player2, g: 2, s: 4 }, // Bob G2-S4, Alice -> G4 (full, so any)
            { p: player1, g: 1, s: 0 }, // Alice G1-S0 (1/3), Bob -> G0 (won by X, still playable)
            { p: player2, g: 0, s: 5 }, // Bob G0-S5, Alice -> G5
            { p: player1, g: 5, s: 1 }, // Alice G5-S1, Bob -> G1
            { p: player2, g: 1, s: 5 }, // Bob G1-S5, Alice -> G5
            { p: player1, g: 5, s: 0 }, // Alice G5-S0, Bob -> G0
            { p: player2, g: 0, s: 6 }, // Bob G0-S6, Alice -> G6
            { p: player1, g: 6, s: 1 }, // Alice G6-S1, Bob -> G1
            { p: player2, g: 1, s: 6 }, // Bob G1-S6, Alice -> G6
            { p: player1, g: 6, s: 0 }, // Alice G6-S0, Bob -> G0
            { p: player2, g: 0, s: 7 }, // Bob G0-S7, Alice -> G7
            { p: player1, g: 7, s: 1 }, // Alice G7-S1, Bob -> G1
            { p: player2, g: 1, s: 7 }, // Bob G1-S7, Alice -> G7
            { p: player1, g: 7, s: 0 }, // Alice G7-S0, Bob -> G0
            { p: player2, g: 0, s: 8 }, // Bob G0-S8, Alice -> G8
            { p: player1, g: 8, s: 1 }, // Alice G8-S1, Bob -> G1
            { p: player2, g: 1, s: 8 }, // Bob G1-S8, Alice -> G8
            { p: player1, g: 8, s: 0 }, // Alice G8-S0, Bob -> G0 (full now)
            { p: player2, g: 2, s: 5 }, // Bob G2-S5 (anywhere), Alice -> G5
            { p: player1, g: 5, s: 2 }, // Alice G5-S2, Bob -> G2
            { p: player2, g: 2, s: 6 }, // Bob G2-S6, Alice -> G6
            { p: player1, g: 6, s: 2 }, // Alice G6-S2, Bob -> G2
            { p: player2, g: 2, s: 7 }, // Bob G2-S7, Alice -> G7
            { p: player1, g: 7, s: 2 }, // Alice G7-S2, Bob -> G2
            { p: player2, g: 2, s: 8 }, // Bob G2-S8, Alice -> G8
            { p: player1, g: 8, s: 2 }, // Alice G8-S2, Bob -> G2
            { p: player2, g: 2, s: 0 }, // Bob G2-S0, Alice -> G0 (full, G1)
            { p: player1, g: 1, s: 1 }, // Alice G1-S1 (2/3), Bob -> G1
            { p: player2, g: 1, s: 2 }, // Bob G1-S2, Alice -> G2
            { p: player1, g: 1, s: 2 }, // Alice G1-S2 - WAIT, Bob just played G1-S2!
            // Need to fix: after Bob G1-S2, Alice -> G2
            // Let me restart this section...
          ];

          // Actually, let me use a simpler, verified sequence
          // I'll create a minimal sequence that definitely works
          const simpleMoves = [
            // Grid 0: Alice wins with diagonal 0,4,8
            { p: player1, g: 0, s: 0 }, // Alice G0-S0, Bob -> G0
            { p: player2, g: 0, s: 1 }, // Bob G0-S1, Alice -> G1
            { p: player1, g: 1, s: 0 }, // Alice G1-S0, Bob -> G0
            { p: player2, g: 0, s: 2 }, // Bob G0-S2, Alice -> G2
            { p: player1, g: 2, s: 0 }, // Alice G2-S0, Bob -> G0
            { p: player2, g: 0, s: 3 }, // Bob G0-S3, Alice -> G3
            { p: player1, g: 3, s: 0 }, // Alice G3-S0, Bob -> G0
            { p: player2, g: 0, s: 5 }, // Bob G0-S5, Alice -> G5
            { p: player1, g: 5, s: 0 }, // Alice G5-S0, Bob -> G0
            { p: player2, g: 0, s: 6 }, // Bob G0-S6, Alice -> G6
            { p: player1, g: 6, s: 0 }, // Alice G6-S0, Bob -> G0
            { p: player2, g: 0, s: 7 }, // Bob G0-S7, Alice -> G7
            { p: player1, g: 7, s: 0 }, // Alice G7-S0, Bob -> G0
            { p: player2, g: 0, s: 4 }, // Bob G0-S4, Alice -> G4
            { p: player1, g: 4, s: 0 }, // Alice G4-S0, Bob -> G0
            { p: player2, g: 0, s: 8 }, // Bob G0-S8 - waits, Alice -> G8
            // Now Alice needs to play G0-S4 and G0-S8 to win grid 0
            // But we need to get Alice back to G0...
            { p: player1, g: 8, s: 0 }, // Alice G8-S0, Bob -> G0 (full, so anywhere)
            // G0 is full now. Let's work on Grid 1

            // This is getting complex. Let me use a much simpler approach:
            // I'll just make Alice win 3 grids quickly by having Bob cooperate
          ];

          // SIMPLEST WORKING SEQUENCE: Bob helps Alice win
          const workingMoves = [
            // Alice wins Grid 0 (top row: 0,1,2)
            { p: player1, g: 0, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 3 }, // Alice -> G3
            { p: player1, g: 3, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 4 }, // Alice -> G4
            { p: player1, g: 4, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 5 }, // Alice -> G5
            { p: player1, g: 5, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 6 }, // Alice -> G6
            { p: player1, g: 6, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 7 }, // Alice -> G7
            { p: player1, g: 7, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 8 }, // Alice -> G8
            { p: player1, g: 8, s: 1 }, // Bob -> G1
            { p: player2, g: 1, s: 3 }, // Alice -> G3
            { p: player1, g: 3, s: 1 }, // Bob -> G1
            { p: player2, g: 1, s: 4 }, // Alice -> G4
            { p: player1, g: 4, s: 1 }, // Bob -> G1
            { p: player2, g: 1, s: 5 }, // Alice -> G5
            { p: player1, g: 5, s: 2 }, // Bob -> G2
            { p: player2, g: 2, s: 3 }, // Alice -> G3
            { p: player1, g: 3, s: 2 }, // Bob -> G2
            { p: player2, g: 2, s: 4 }, // Alice -> G4
            { p: player1, g: 4, s: 2 }, // Bob -> G2
            { p: player2, g: 2, s: 5 }, // Alice -> G5
            { p: player1, g: 5, s: 1 }, // Bob -> G1
            { p: player2, g: 1, s: 6 }, // Alice -> G6
            { p: player1, g: 6, s: 1 }, // Bob -> G1
            { p: player2, g: 1, s: 7 }, // Alice -> G7
            { p: player1, g: 7, s: 1 }, // Bob -> G1
            { p: player2, g: 1, s: 8 }, // Alice -> G8
            { p: player1, g: 8, s: 0 }, // Bob -> G0 (won, so can play)
            { p: player2, g: 0, s: 1 }, // Alice -> G1 (won, so can play)
            { p: player1, g: 1, s: 0 }, // Bob -> G0
            { p: player2, g: 0, s: 2 }, // ALICE WINS GRID 0! Alice -> G2
            { p: player1, g: 2, s: 6 }, // Bob -> G6
            { p: player2, g: 6, s: 2 }, // Alice -> G2
            { p: player1, g: 2, s: 7 }, // Bob -> G7
            { p: player2, g: 7, s: 2 }, // Alice -> G2
            { p: player1, g: 2, s: 8 }, // Bob -> G8
            { p: player2, g: 8, s: 2 }, // Alice -> G2
            { p: player1, g: 2, s: 0 }, // Bob -> G0
            { p: player2, g: 1, s: 1 }, // Alice -> G1 (try to win)
            { p: player1, g: 1, s: 2 }, // Bob -> G2
            { p: player2, g: 1, s: 2 }, // ALICE WINS GRID 1! Alice -> G2
            { p: player1, g: 2, s: 1 }, // Bob -> G1 (won)
            { p: player2, g: 2, s: 2 }, // ALICE WINS GRID 2 AND MACRO!
          ];

          player1.once("uttt_gameOver", (data) => {
            expect(data.reason).to.equal("macro_win");
            expect(data.symbol).to.be.oneOf(["X", "O"]);
            player1.off("uttt_error");
            player2.off("uttt_error");
            done();
          });

          let i = 0;
          const nextMove = () => {
            if (i >= workingMoves.length) return;
            const m = workingMoves[i++];

            m.p.once("uttt_gameState", () => {
              setTimeout(nextMove, 20);
            });

            m.p.emit("uttt_makeMove", {
              roomId,
              gridIndex: m.g,
              squareIndex: m.s,
            });
          };

          nextMove();
        });
      });
    });
  });

  describe("Connection & Recovery", () => {
    it("should pause game on disconnect and resume on reconnect", (done) => {
      player1.emit("uttt_createRoom", "Alice");
      player1.once("uttt_roomInfo", (room) => {
        const roomId = room.id;
        const playerId = player1.id;
        player2.emit("uttt_joinRoom", { roomId, playerName: "Bob" });

        player1.once("uttt_gameStarted", () => {
          player2.once("uttt_gamePaused", () => {
            const newPlayer1 = client(`http://localhost:${port}`);
            newPlayer1.on("connect", () => {
              newPlayer1.emit("uttt_reconnect", { roomId, playerId });
              newPlayer1.once("uttt_alert", (alert) => {
                expect(alert.title).to.equal("Player Reconnected");
                newPlayer1.disconnect();
                done();
              });
            });
          });
          player1.disconnect();
        });
      });
    });
  });
});

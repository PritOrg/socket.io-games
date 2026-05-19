const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const logger = require('./utils/logger');
const BingoManager = require('./game-logic/bingo');
const TicTacToeManager = require('./game-logic/tictactoe');
const UTTTManager = require('./game-logic/uttt');
const DabManager = require('./game-logic/dab');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.debug('HTTP', `${req.method} ${req.path}`);
  next();
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 4000;

const bingoManager = new BingoManager(io);
const tictactoeManager = new TicTacToeManager(io);
const utttManager = new UTTTManager(io);
const dabManager = new DabManager(io);

io.on('connection', (socket) => {
  logger.info('SERVER', `User connected: ${socket.id}`, { ip: socket.handshake.address });

  bingoManager.handleConnection(socket);
  tictactoeManager.handleConnection(socket);
  utttManager.handleConnection(socket);
  dabManager.handleConnection(socket);

  socket.on('disconnect', (reason) => {
    logger.warn('SERVER', `User disconnected: ${socket.id}`, { reason });
  });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.success('SERVER', `Unified Optimized Server running on port ${PORT}`);
  });
}

module.exports = { server, io, bingoManager, tictactoeManager, utttManager, dabManager };

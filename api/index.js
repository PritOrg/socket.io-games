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
const HOST = process.env.HOST || '0.0.0.0';

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

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/stats', (req, res) => {
  res.json({
    bingo: { rooms: bingoManager.rooms.size },
    tictactoe: { rooms: tictactoeManager.rooms.size },
    uttt: { rooms: utttManager.rooms.size },
    dab: { rooms: dabManager.rooms.size },
    connections: io.engine.clientsCount,
  });
});

app.post('/cleanup', (req, res) => {
  let cleaned = 0;
  for (const manager of [bingoManager, tictactoeManager, utttManager, dabManager]) {
    for (const [id, room] of manager.rooms) {
      const allGone = room.players.every((p) => !p.connected);
      if (allGone) {
        manager.rooms.delete(id);
        cleaned++;
      }
    }
  }
  res.json({ cleaned });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, HOST, () => {
    logger.success('SERVER', `Unified Optimized Server running on port ${PORT}`);
  });
}

module.exports = { server, io, bingoManager, tictactoeManager, utttManager, dabManager };

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const BingoManager = require('./game-logic/bingo');
const TicTacToeManager = require('./game-logic/tictactoe');
const UTTTManager = require('./game-logic/uttt');
const DabManager = require('./game-logic/dab');
const SOSManager = require('./game-logic/sos');
const Connect4Manager = require('./game-logic/connect4');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : [
      'http://localhost:5173',
      'http://localhost:4000',
      'http://10.0.15.194:5173',
      'http://10.42.0.0:5173',
      'http://10.42.0.1:5173',
    ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, error: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use((req, res, next) => {
  logger.debug('HTTP', `${req.method} ${req.path}`);
  next();
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

const bingoManager = new BingoManager(io);
const tictactoeManager = new TicTacToeManager(io);
const utttManager = new UTTTManager(io);
const dabManager = new DabManager(io);
const sosManager = new SOSManager(io);
const connect4Manager = new Connect4Manager(io);

io.on('connection', (socket) => {
  logger.info('SERVER', `User connected: ${socket.id}`, { ip: socket.handshake.address });

  bingoManager.handleConnection(socket);
  tictactoeManager.handleConnection(socket);
  utttManager.handleConnection(socket);
  dabManager.handleConnection(socket);
  sosManager.handleConnection(socket);
  connect4Manager.handleConnection(socket);

  socket.on('disconnect', (reason) => {
    logger.warn('SERVER', `User disconnected: ${socket.id}`, { reason });
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/health/ready', (req, res) => {
  res.json({ status: 'ok', ready: true });
});

app.get('/stats', (req, res) => {
  res.json({
    bingo: { rooms: bingoManager.rooms.size },
    tictactoe: { rooms: tictactoeManager.rooms.size },
    uttt: { rooms: utttManager.rooms.size },
    dab: { rooms: dabManager.rooms.size },
    sos: { rooms: sosManager.rooms.size },
    connect4: { rooms: connect4Manager.rooms.size },
    connections: io.engine.clientsCount,
  });
});

app.post('/cleanup', (req, res) => {
  let cleaned = 0;
  for (const manager of [bingoManager, tictactoeManager, utttManager, dabManager, sosManager, connect4Manager]) {
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

function shutdown() {
  logger.warn('SERVER', 'Shutting down gracefully...');

  for (const manager of [bingoManager, tictactoeManager, utttManager, dabManager, sosManager, connect4Manager]) {
    for (const [id] of manager.rooms) {
      io.to(id).emit('server_shutdown', { message: 'Server is shutting down' });
    }
    manager.timers.forEach((timerId) => {
      clearTimeout(timerId);
    });
    manager.timers.clear();
  }

  server.close();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, HOST, () => {
    logger.success('SERVER', `Unified Optimized Server running on port ${PORT}`);
  });
}

module.exports = {
  server,
  io,
  bingoManager,
  tictactoeManager,
  utttManager,
  dabManager,
  sosManager,
  connect4Manager,
  shutdown,
};

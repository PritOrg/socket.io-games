const { io } = require('socket.io-client');
const { SERVER_URL, stats, sleep } = require('../runner');

const PLAYER_NAMES = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
];

async function runScenario() {
  const name = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
  const opponentName = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];

  const p1 = await createConnectedClient(name);
  if (!p1.socket) return;

  const p2 = await createConnectedClient(opponentName);
  if (!p2.socket) {
    p1.socket.close();
    return;
  }

  const p1Socket = p1.socket;
  const p2Socket = p2.socket;

  try {
    let roomId = null;

    // P1 creates room
    await emitAndWait(p1Socket, 'ttt_createRoom', name, 'ttt_roomInfo');
    roomId = await getRoomId(p1Socket);

    if (!roomId) {
      p1Socket.close();
      p2Socket.close();
      return;
    }

    // P2 joins room
    await emitAndWait(p2Socket, 'ttt_joinRoom', { roomId, playerName: opponentName }, 'ttt_roomInfo');

    await sleep(300);

    // Play a few moves
    const moves = [4, 1, 2, 7, 6];
    for (let i = 0; i < moves.length; i++) {
      const isP1Turn = i % 2 === 0;
      const socket = isP1Turn ? p1Socket : p2Socket;
      const pos = moves[i];

      const moveStart = Date.now();
      socket.emit('ttt_makeMove', { roomId, position: pos });
      stats.totalMoves++;

      // Wait for move to be confirmed
      await new Promise((resolve) => {
        const onMove = () => {
          socket.off('ttt_moveMade', onMove);
          socket.off('ttt_gameWon', onMove);
          socket.off('ttt_gameDraw', onMove);
          stats.moveLatencies.push(Date.now() - moveStart);
          resolve();
        };
        socket.once('ttt_moveMade', onMove);
        socket.once('ttt_gameWon', onMove);
        socket.once('ttt_gameDraw', onMove);
        setTimeout(resolve, 2000);
      });

      await sleep(150);
    }
  } catch (err) {
    stats.failedMoves++;
    stats.errors.push(err.message);
  }

  // Cleanup
  setTimeout(() => {
    p1Socket.close();
    p2Socket.close();
  }, 500);
}

async function createConnectedClient(name) {
  const start = Date.now();
  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    forceNew: true,
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.close();
      resolve({ socket: null, latency: null });
    }, 5000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      stats.successfulConnections++;
      stats.connectionLatencies.push(Date.now() - start);
      resolve({ socket, latency: Date.now() - start });
    });

    socket.on('connect_error', () => {
      clearTimeout(timeout);
      stats.failedConnections++;
      resolve({ socket: null, latency: null });
    });
  });
}

function emitAndWait(socket, event, data, responseEvent) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(), 3000);
    socket.once(responseEvent, () => {
      clearTimeout(timeout);
      resolve();
    });
    socket.emit(event, data);
  });
}

function getRoomId(socket) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 3000);
    socket.once('ttt_roomInfo', (room) => {
      clearTimeout(timeout);
      resolve(room.id);
    });
  });
}

module.exports = { runScenario };

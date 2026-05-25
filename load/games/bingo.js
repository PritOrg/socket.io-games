const { io } = require('socket.io-client');
const { SERVER_URL, stats, sleep } = require('../runner');

const PLAYER_NAMES = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];

async function runScenario() {
  const p1 = await createClient();
  if (!p1.socket) return;

  const p2 = await createClient();
  if (!p2.socket) {
    p1.socket.close();
    return;
  }

  try {
    let roomId = null;

    // P1 creates room
    p1.socket.emit('bingo_createRoom', PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)]);

    roomId = await waitForRoomId(p1.socket, 'bingo_roomInfo');

    if (!roomId) {
      p1.socket.close();
      p2.socket.close();
      return;
    }

    await sleep(200);

    // P2 joins
    p2.socket.emit('bingo_joinRoom', {
      roomId,
      playerName: PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)],
    });

    await waitForRoomId(p2.socket, 'bingo_roomInfo');

    await sleep(300);

    // Start game
    p1.socket.emit('bingo_startGame', roomId);
    await sleep(500);

    // P1 marks some numbers
    for (let i = 0; i < 3; i++) {
      const moveStart = Date.now();
      p1.socket.emit('bingo_markNumber', { roomId, number: i + 1 });
      stats.totalMoves++;

      await new Promise((resolve) => {
        const onMarked = () => {
          stats.moveLatencies.push(Date.now() - moveStart);
          resolve();
        };
        p1.socket.once('bingo_numberMarked', onMarked);
        setTimeout(resolve, 2000);
      });

      await sleep(200);
    }
  } catch (err) {
    stats.failedMoves++;
    stats.errors.push(err.message);
  }

  setTimeout(() => {
    p1.socket.close();
    p2.socket.close();
  }, 300);
}

function createClient() {
  const start = Date.now();
  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    forceNew: true,
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.close();
      resolve({ socket: null });
    }, 5000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      stats.successfulConnections++;
      stats.connectionLatencies.push(Date.now() - start);
      resolve({ socket });
    });

    socket.on('connect_error', () => {
      clearTimeout(timeout);
      stats.failedConnections++;
      resolve({ socket: null });
    });
  });
}

function waitForRoomId(socket, event) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 3000);
    socket.once(event, (data) => {
      clearTimeout(timeout);
      resolve(data.id);
    });
  });
}

module.exports = { runScenario };

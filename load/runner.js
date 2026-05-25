const { io } = require('socket.io-client');
const { createServer } = require('http');
const path = require('path');

const SERVER_URL = process.env.LOAD_SERVER_URL || 'http://localhost:4000';
const DEFAULT_CONNECTIONS = parseInt(process.env.LOAD_CONNECTIONS || '20', 10);
const DEFAULT_DURATION = parseInt(process.env.LOAD_DURATION || '30', 10);

const stats = {
  totalConnections: 0,
  successfulConnections: 0,
  failedConnections: 0,
  totalMoves: 0,
  failedMoves: 0,
  moveLatencies: [],
  connectionLatencies: [],
  errors: [],
  startTime: null,
  endTime: null,
};

function createClient(options = {}) {
  const start = Date.now();
  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    forceNew: true,
    ...options,
  });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.close();
      resolve({ socket: null, latency: null, error: 'Connection timeout' });
    }, 5000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      const latency = Date.now() - start;
      stats.successfulConnections++;
      stats.connectionLatencies.push(latency);
      resolve({ socket, latency });
    });

    socket.on('connect_error', (err) => {
      clearTimeout(timeout);
      stats.failedConnections++;
      stats.errors.push(err.message);
      resolve({ socket: null, latency: null, error: err.message });
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateGame(scenarioFn, numConnections, durationSec) {
  stats.startTime = Date.now();
  stats.totalConnections = numConnections;

  console.log(`\n========================================`);
  console.log(`  LOAD TEST: ${scenarioFn.name || 'custom'}`);
  console.log(`  Connections: ${numConnections}`);
  console.log(`  Duration: ${durationSec}s`);
  console.log(`  Server: ${SERVER_URL}`);
  console.log(`========================================\n`);

  const endTime = Date.now() + durationSec * 1000;
  const results = [];

  while (Date.now() < endTime) {
    const batchSize = Math.min(4, numConnections - stats.totalConnections);
    if (batchSize <= 0) break;

    const batch = [];
    for (let i = 0; i < batchSize; i++) {
      batch.push(scenarioFn());
    }

    const batchResults = await Promise.allSettled(batch);
    for (const r of batchResults) {
      if (r.status === 'fulfilled') results.push(r.value);
    }

    const elapsed = ((Date.now() - stats.startTime) / 1000).toFixed(1);
    const active = stats.successfulConnections - stats.failedConnections;
    process.stdout.write(
      `\r  [${elapsed}s] Connected: ${stats.successfulConnections} | Failed: ${stats.failedConnections} | Active: ${active} | Moves: ${stats.totalMoves}`,
    );

    await sleep(200);
  }

  stats.endTime = Date.now();

  printReport();
  cleanup();
}

function printReport() {
  const elapsed = ((stats.endTime - stats.startTime) / 1000).toFixed(2);
  const avgConnLatency =
    stats.connectionLatencies.length > 0
      ? (stats.connectionLatencies.reduce((a, b) => a + b, 0) / stats.connectionLatencies.length).toFixed(1)
      : 'N/A';
  const avgMoveLatency =
    stats.moveLatencies.length > 0
      ? (stats.moveLatencies.reduce((a, b) => a + b, 0) / stats.moveLatencies.length).toFixed(1)
      : 'N/A';

  console.log(`\n\n========================================`);
  console.log(`  LOAD TEST REPORT`);
  console.log(`========================================`);
  console.log(`  Duration:           ${elapsed}s`);
  console.log(`  Connections:        ${stats.totalConnections}`);
  console.log(`  Successful:         ${stats.successfulConnections}`);
  console.log(`  Failed:             ${stats.failedConnections}`);
  console.log(`  Total Moves:        ${stats.totalMoves}`);
  console.log(`  Failed Moves:       ${stats.failedMoves}`);
  console.log(`  Avg Conn Latency:   ${avgConnLatency}ms`);
  console.log(`  Avg Move Latency:   ${avgMoveLatency}ms`);
  console.log(`  Errors:             ${stats.errors.length}`);
  if (stats.errors.length > 0) {
    const topErrors = [...new Set(stats.errors)].slice(0, 5);
    for (const e of topErrors) {
      console.log(`    - ${e}`);
    }
  }
  console.log(`========================================\n`);
}

function cleanup() {
  process.exit(0);
}

async function ensureServer() {
  try {
    const res = await fetch(`${SERVER_URL}/health`);
    const data = await res.json();
    if (data.status === 'ok') {
      console.log(`✓ Server is running at ${SERVER_URL}`);
      return true;
    }
  } catch {
    console.log(`✗ Server not running at ${SERVER_URL}`);
    console.log('  Start the API server first: cd api && npm start');
    console.log('  Or set LOAD_SERVER_URL env var');
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const gameArg = parseArg(args, '--game');
  const connectionsArg = parseInt(parseArg(args, '--connections') || String(DEFAULT_CONNECTIONS), 10);
  const durationArg = parseInt(parseArg(args, '--duration') || String(DEFAULT_DURATION), 10);
  const httpOnly = args.includes('--http-only');

  const running = await ensureServer();
  if (!running) process.exit(1);

  if (httpOnly) {
    await runHttpLoad();
    return;
  }

  let scenarioFn;
  const game = gameArg || 'tictactoe';

  switch (game) {
    case 'tictactoe':
      scenarioFn = require('./games/tictactoe').runScenario;
      break;
    case 'bingo':
      scenarioFn = require('./games/bingo').runScenario;
      break;
    default:
      console.error(`Unknown game: ${game}`);
      process.exit(1);
  }

  if (scenarioFn) {
    await simulateGame(scenarioFn, connectionsArg, durationArg);
  }
}

function parseArg(args, name) {
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return null;
}

async function runHttpLoad() {
  try {
    const autocannon = require('autocannon');
    console.log(`\n  Running HTTP load test against ${SERVER_URL}...\n`);

    const result = await autocannon({
      url: SERVER_URL,
      connections: 20,
      duration: 15,
      requests: [
        { method: 'GET', path: '/health' },
        { method: 'GET', path: '/stats' },
      ],
    });

    console.log(`  Requests/sec: ${result.requests.average.toFixed(0)}`);
    console.log(`  Latency avg:  ${result.latency.average.toFixed(1)}ms`);
    console.log(`  Latency p99:  ${result.latency.p99.toFixed(1)}ms`);
    console.log(`  Errors:       ${result.errors}`);
    console.log(`========================================\n`);
  } catch {
    console.log('  autocannon not available. Install: npm install autocannon');
    console.log('  Falling back to simple HTTP test...\n');

    const http = require('http');
    const start = Date.now();
    let success = 0;
    let fail = 0;

    for (let i = 0; i < 50; i++) {
      try {
        await new Promise((resolve, reject) => {
          http
            .get(`${SERVER_URL}/health`, (res) => {
              let data = '';
              res.on('data', (chunk) => (data += chunk));
              res.on('end', () => {
                if (res.statusCode === 200) success++;
                else fail++;
                resolve();
              });
            })
            .on('error', reject);
        });
      } catch {
        fail++;
      }
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`  Requests: 50 in ${elapsed}s`);
    console.log(`  Success:  ${success}`);
    console.log(`  Failed:   ${fail}`);
    console.log(`  RPS:      ${(50 / parseFloat(elapsed)).toFixed(0)}`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Load test failed:', err.message);
    process.exit(1);
  });
}

module.exports = { simulateGame, createClient, stats, sleep, SERVER_URL };

# Industry-Grade Plan — PaperParty / socket.io-games

This plan covers the gap between the current state and an industry-grade real-time multiplayer gaming platform.

**Constraint**: No database/storage — all state remains in-memory.

---

## Phase P0 — Hotfix (Critical Bugs)

### P0.1 Fix dab.js duplicated methods

- **Problem**: `requestRedo`, `respondRedo`, `handleDisconnect`, `sendRoomInfo` each defined twice (lines 189-302 duped at 304-393, 581-625 duped at 635-697, 627-633 duped at 699-705). Second definition wins. Logic differs:
  - `handleDisconnect` v1 (line 597): `if (canContinue)` emits "game continues". v2 (line 651): `if (!canContinue)` starts forfeit timer. Inverted.
  - `sendRoomInfo` v1 uses dynamic prefix, v2 hardcodes `dab_roomInfo`
- **Action**: Remove second definitions. Fix inverted logic in v1 `handleDisconnect`.

### P0.2 Fix ErrorBoundary.jsx

- **Problem**: Imports `@mui/material` (not installed). Crashes on error.
- **Action**: Rewrite with plain HTML + Tailwind classes.

### P0.3 Write real TicTacToe.test.jsx

- **Problem**: Placeholder `expect(true).toBe(true)`.
- **Action**: Real tests matching UTTTGame.test.jsx pattern.

### P0.4 Remove dead dependencies

- `api/`: `mongoose`, `jsonwebtoken`, `body-parser`, `sweetalert2`
- `pro/`: `web-vitals`

---

## Phase P1 — CI + Quality Tooling

### P1.1 ESLint + Prettier (both packages)

- Install `eslint`, `prettier` configs.
- Node-aware for api/, React-aware for pro/.
- `scripts.lint` + `scripts.format`.

### P1.2 Pre-commit hooks

- `husky` + `lint-staged` at root.
- Run lint + format on staged files.

### P1.3 GitHub Actions CI (`.github/workflows/ci.yml`)

- `push` + `pull_request` on all branches.
- Jobs: `api` (mocha), `pro` (vitest).

### P1.4 `.editorconfig`

- Root level: 2-space indent, LF endings.

---

## Phase P2 — Security

### P2.1 Helmet.js

- `npm install helmet`. Apply to Express app.

### P2.2 Restrict CORS

- Replace `origin: '*'` with env-configured list.
- Same for Express and Socket.IO.

### P2.3 Rate limiting

- HTTP: `express-rate-limit`.
- Socket.IO: per-socket event rate limiter.

### P2.4 HTTPS/WSS protocol detection

- `GameContext.jsx`: Use `window.location.protocol` for secure connections.

### P2.5 Input validation hardening

- TTT `makeMove`: add bounds check on `position`.

---

## Phase P3 — Operational Excellence

### P3.1 Dockerfiles + docker-compose

- `api/Dockerfile`: node:20-alpine
- `pro/Dockerfile`: multi-stage build with nginx
- `docker-compose.yml`: api + pro services with healthchecks

### P3.2 Graceful shutdown

- `SIGTERM`/`SIGINT` handlers: drain connections, broadcast alerts, clear timers.

### P3.3 Structured logging

- Replace custom logger with `pino`. Keep same API. Output JSON.
- `pino-http` for request logging.

### P3.4 Periodic garbage collection

- `setInterval` every 5 min to remove stale rooms.
- Track last-active timestamps.

### P3.5 Improved health checks

- `/health`: include socket.io connection status.
- Add `/health/ready` (readiness probe).

---

## Phase P4 — Testing Completeness

### P4.1 Frontend game component tests

- **Bingo**: board rendering, mark, bingo detection display.
- **TicTacToe**: full rewrite with board, moves, win/draw, restart.
- **UTTT**: move execution, macro grid, active grid.
- **DAB**: line placement, box completion, redo flow, game over.

### P4.2 E2E tests with Playwright

- Full game flow: create → join → play → game over.
- Disconnect/reconnect scenarios.
- Cross-game isolation.

### P4.3 Load/stress tests

- `k6` or `autocannon`: 100 concurrent clients, rapid moves.

---

## Phase P5 — Scalability

### P5.1 Socket.IO Redis adapter

- `@socket.io/redis-adapter` + `ioredis` for multi-process pub/sub.

### P5.2 Horizontal scaling config

- docker-compose replicas, nginx sticky sessions.

### P5.3 Prometheus metrics

- `prom-client`: expose `/metrics` with room counts, event rates, latency.

---

## Effort Summary

| Phase             | Files changed | New files | Est. time |
| ----------------- | :-----------: | :-------: | :-------: |
| P0 — Hotfix       |       4       |     0     |   1-2h    |
| P1 — CI + Quality |      10+      |     8     |   3-4h    |
| P2 — Security     |       5       |     0     |   2-3h    |
| P3 — Operational  |       8       |     5     |   4-6h    |
| P4 — Testing      |      20+      |    5+     |   8-12h   |
| P5 — Scalability  |       5       |     4     |   3-4h    |

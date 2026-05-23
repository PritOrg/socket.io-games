# AGENTS.md — PaperParty / socket.io-games

## Project Overview

A monorepo with two packages (separate `package.json`, separate lockfiles):

- **`api/`** — Node.js (Express + Socket.IO) server, CommonJS modules.
  Entrypoint: `api/index.js` (exports `{ server, io, bingoManager, tictactoeManager, utttManager, dabManager }`).
  Game managers under `api/game-logic/`, each extends `BaseManager` (`api/game-logic/BaseManager.js`).
  Tests: `api/test/*.test.js` using Mocha + Chai + socket.io-client. Port **4001** during tests.
- **`pro/`** — React 18 + Vite frontend, ES Modules.
  Entrypoint: `pro/src/index.jsx`. Routing in `pro/src/App.jsx` (`/`, `/bingo`, `/tictactoe`, `/uttt`, `/dab`).
  Socket connection managed in `pro/src/context/GameContext.jsx` (wraps app at root).
  Tests: Vitest + Testing Library. Config in `pro/vite.config.js` — `globals: true`, `jsdom`, `./src/test-setup.js`.

**Quirky / stale leftovers:**

- `prosrcdab/` — empty directory, ignore.
- `.kilo/` — tool directory, in `.eslintignore`.

---

## Commands

### Root-level (shared tooling)

```bash
npm run lint          # eslint . --ext .js,.jsx  (uses local eslint@8, NOT npx)
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

**IMPORTANT:** Always use `npm run lint` or `npx eslint` from the repo root after `npm install`. The project uses ESLint v8 with `.eslintrc.js`. Running `npx eslint` without local install pulls the latest ESLint (v10+) which requires flat config (`eslint.config.js`) and will fail.

Pre-commit hook (`.husky/pre-commit`): `npx lint-staged` — runs eslint --fix + prettier --write on staged `*.{js,jsx}`.

### Server (`cd api`)

```
npm start         # node index.js, binds 0.0.0.0:4000
npm test          # mocha test/*.test.js
npx mocha test/dab.test.js --grep "Room Creation"   # single describe block
```

Tests set `NODE_ENV=test` at the top of each file. Server auto-skips `server.listen()` when `NODE_ENV === 'test'`.

### Frontend (`cd pro`)

```
npm run dev        # vite dev server (VITE_PORT or 5173)
npm run build      # vite build → dist/
npm test           # vitest (watch mode)
npx vitest run                                        # single run, no watch
npx vitest run src/context/GameContext.test.jsx        # single file
npx vitest run ... --testNamePattern="provides and "   # single describe/it
```

---

## CI Pipeline (`.github/workflows/ci.yml`)

On push to `main`/`fix/*`/`feat/*` and PRs to `main`:

| Job      | Working dir | Steps                                                                                     |
| -------- | ----------- | ----------------------------------------------------------------------------------------- |
| API      | `api/`      | `npm ci` → `npx eslint --ext .js . --max-warnings 50` (from root) → `npm test`            |
| Frontend | `pro/`      | `npm ci` → `npx eslint --ext .js,.jsx . --max-warnings 50` (from root) → `npx vitest run` |

---

## Architecture & Conventions

### Server (`api/`)

- **CommonJS** — `require()` / `module.exports`. No `import`/`export`.
- All game managers extend `BaseManager` (provides: `sanitizeRoomId`, `sanitizePlayerName`, `handleReconnection`, `handlePlayerLeave`, `registerEmptyTimer`, `clearTimer`).
- Room state stored in `Map` — `this.rooms = new Map()`.
- Socket events use `<game>_` prefix: `bingo_*`, `ttt_*`, `uttt_*`, `dab_*`.
  - All events registered in `handleConnection(socket)` — one listener per event.
  - Broadcast room changes with `this.io.to(roomId).emit(...)`.
  - Alert client on error: `socket.emit('<game>_alert', { icon, title, text })`.
- Early-return on invalid input (`if (!room) return;`), no thrown errors.
- HTTP endpoints: `/health` (GET), `/stats` (GET — room counts + connections), `/cleanup` (POST — removes empty rooms).
- Logger utility (`api/utils/logger.js`): `logger.info/warn/error/success/debug/category, msg`; `logger.socket(direction, event, socketId, data)` for tracing; `debug` only shown when `process.env.DEBUG` is set.
- Formatting per `.prettierrc` (120 width, single quotes, **trailing commas required**). Formatter is `prettier` (run `npm run format` at root). Some files may use double quotes — run formatter before committing.

### Frontend (`pro/`)

- **ES Modules** — `import` / `export`.
- Imports order: React → external → internal (relative).
- Styling: **Tailwind CSS v4** via `@tailwindcss/vite`. Custom classes (`glass`, `rounded-3xl`, `paper-font`) in `index.css`.
- Components: `PascalCase`, default-exported; hooks: `useX` prefix.
- Socket listeners cleaned up in `useEffect` return. Destructure context via `useGameContext()`.
- Dev server port: `VITE_PORT` env var or 5173. Backend port: `VITE_PORT` env var or 4000 (configured in `GameContext.jsx`).

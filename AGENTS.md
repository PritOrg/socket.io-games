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
npx mocha test/bingo.test.js --grep "Player Reconnection"  # specific test
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
npx vitest run --reporter=verbose                     # detailed output
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

## Code Style Guidelines

### Import Order

**Frontend (pro/):** React → external → internal (relative)

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useGameContext } from '../context/GameContext';
import './Component.css';
```

**Server (api/):** Node built-ins → external → local (alphabetical within groups)

```js
const express = require('express');
const socketIo = require('socket.io');
const logger = require('./utils/logger');
const BingoManager = require('./game-logic/bingo');
```

### Naming Conventions

- **Components:** PascalCase, default export (`Bingo.jsx`, `GameBoard.jsx`)
- **Hooks:** `useX` prefix (`useGameContext`, `useSocketListener`)
- **Files:** kebab-case for utilities, PascalCase for components
- **Socket events:** `<game>_` prefix (e.g., `bingo_join`, `ttt_move`, `uttt_alert`)
- **Variables:** camelCase (`roomId`, `playerName`, `hasWon`)
- **Constants:** UPPER_CASE_WITH_UNDERSCORES (`MAX_PLAYERS`, `DEFAULT_ROOM_ID`)

### Formatting

- Prettier: 120 print width, 2 spaces, single quotes, trailing commas (required)
- Semicolons required
- No console.log in production code (allowed in tests)
- JSX attributes: double quotes for consistency with HTML
- Curly braces in JSX: no spaces (`{variable}` not `{ variable }`)

### Error Handling

- Server: Early-return on invalid input, no thrown errors. Alert clients via `<game>_alert` event
- Frontend: Destructure context via `useGameContext()`; socket listeners cleaned up in `useEffect` return
- Error boundaries: Used in frontend for graceful error recovery
- Validation: Input validation at API level before processing

### State Management

- Server rooms: `Map` stored in `this.rooms` on manager instances
- Timers: Stored in `this.timers = new Map()` with `registerEmptyTimer`/`clearTimer` helpers
- Frontend: React state with hooks (`useState`, `useReducer` for complex state)
- Context API: Used for global state like socket connection and game selection

### Testing

- API: Mocha + Chai + socket.io-client. Use `--grep` for single describe blocks
- Frontend: Vitest + React Testing Library. Use `--testNamePattern` for single tests
- Test organization: Group related tests in `describe` blocks, use `beforeEach`/`afterEach` for setup/teardown
- Mocking: Use `jest.mock()` or manual mocks for external dependencies
- Assertions: Prefer `expect` from Chai (API) or Vitest expect (frontend) over raw assertions

### Project Structure

```
api/
├── index.js              # Server entrypoint
├── game-logic/
│   ├── BaseManager.js    # Base class for all game managers
│   ├── bingo.js          # Bingo game logic
│   ├── tictactoe.js      # TicTacToe game logic
│   ├── uttt.js           # Ultimate TicTacToe game logic
│   └── dab.js            # Dab game logic
├── test/
│   ├── bingo.test.js     # Bingo game tests
│   ├── tictactoe.test.js # TicTacToe game tests
│   ├── uttt.test.js      # Ultimate TicTacToe game tests
│   ├── dab.test.js       # Dab game tests
│   ├── base-manager.test.js # Base manager tests
│   ├── integration.test.js # Cross-game integration tests
│   ├── game.test.js      # General game logic tests
│   └── operations.test.js # Utility operation tests
├── utils/
│   └── logger.js         # Logging utility
pro/
├── src/
│   ├── index.jsx         # Application entrypoint
│   ├── App.jsx           # Main routing component
│   ├── index.css         # Tailwind directives and custom classes
│   ├── context/
│   │   └── GameContext.jsx # Socket connection and game state management
│   ├── components/
│   │   ├── layout/       # Layout components (Header, Footer, etc.)
│   │   ├── ui/           # Reusable UI components (Button, Input, etc.)
│   │   └── game/         # Game-specific components
│   ├── bingo/
│   │   ├── Bingo.jsx     # Main bingo game page
│   │   ├── components/   # Bingo-specific components
│   │   └── hooks/        # Bingo-specific custom hooks
│   ├── tictactoe/
│   │   ├── TicTacToe.jsx # Main tic-tac-toe game page
│   │   ├── components/   # Tic-tac-toe-specific components
│   │   └── hooks/        # Tic-tac-toe-specific custom hooks
│   ├── uttt/
│   │   ├── UltimateTTT.jsx # Main ultimate tic-tac-toe game page
│   │   ├── components/   # Ultimate tic-tac-toe-specific components
│   │   └── hooks/        # Ultimate tic-tac-toe-specific custom hooks
│   └── dab/
│       ├── Dab.jsx       # Main dots and boxes game page
│       ├── components/   # Dots and boxes-specific components
│       └── hooks/        # Dots and boxes-specific custom hooks
└── vite.config.js        # Vite configuration
```

## Development Workflow

1. **Feature Development:**
   - Create feature branch from `main`
   - Implement changes in both `api/` and `pro/` as needed
   - Write tests for new functionality
   - Run linting and formatting before committing
   - Submit PR for review

2. **Bug Fixes:**
   - Create fix branch from `main`
   - Reproduce bug in test if possible
   - Implement minimal fix
   - Add regression test
   - Run full test suite
   - Submit PR for review

3. **Testing Strategy:**
   - Unit tests: Test individual functions and components
   - Integration tests: Test interactions between modules
   - E2E tests: Located in `e2e/` directory (Cypress)
   - Run tests frequently during development

4. **Code Review Checklist:**
   - [ ] Code follows established style guidelines
   - [ ] Tests cover new functionality
   - [ ] No console.log in production code
   - [ ] Proper error handling implemented
   - [ ] Socket listeners properly cleaned up
   - [ ] Components follow React best practices
   - [ ] API endpoints handle edge cases
   - [ ] Documentation updated if needed

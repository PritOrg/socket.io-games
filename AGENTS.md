# AGENTS.md — PaperParty / socket.io-games

## Project Overview

A monorepo with two packages:

- **`api/`** — Node.js (Express + Socket.IO) server, each game in its own manager class under `api/game-logic/`.
- **`pro/`** — React 18 + Vite frontend, each game in its own folder under `pro/src/`.

Both `api/` and `pro/` have their own package.json and lockfile. Run commands from the relevant package directory.

---

## Build / Lint / Test Commands

### Server (`cd api`)

```
npm start          # Start server on port 4000
npm test           # Run ALL mocha tests: mocha test/*.test.js
```

**Run a single server test file:**

```
npx mocha test/game.test.js
npx mocha test/dab.test.js
```

**Run a single `describe` / `it` block** — use `--grep`:

```
npx mocha test/dab.test.js --grep "Room Creation"
npx mocha test/game.test.js --grep "should create a bingo room"
```

Tests require `NODE_ENV=test` (already set at the top of each test file via `process.env.NODE_ENV = 'test'`). The server binds to port `4001` during tests.

### Frontend (`cd pro`)

```
npm run dev        # Vite dev server
npm run build      # Production build → dist/
npm run preview    # Preview built output
npm test           # Run vitest (watch mode)
```

**Run a single frontend test file:**

```
npx vitest run src/context/GameContext.test.jsx
```

**Run a single `describe` / `it` block** — use `--testNamePattern`:

```
npx vitest run src/context/GameContext.test.jsx --testNamePattern="provides and updates playerName"
```

**Run tests once (no watch):**

```
npx vitest run
```

Vitest config is in `pro/vite.config.js` — `globals: true`, environment `jsdom`, setup file `./src/test-setup.js`.

---

## Code Style — Server (`api/`, Node.js)

### Module system
- **CommonJS** only — `require()` / `module.exports`. Do **not** use `import` / `export`.

### Imports
- Built-in modules first (`const express = require('express')`), then external, then relative local paths.
- Order inside `index.js`: express → http → socket.io → cors → local utils → game-logic managers.

### Formatting
- 2-space indentation (as observed across all `.js` files).
- Single-quoted strings throughout.
- Semicolons at end of statements.
- No trailing commas in object/array literals (historical style; match existing files).
- No standalone comments unless explicitly needed.

### Naming
- Constructor / class names: `PascalCase` (e.g. `BingoManager`, `DabManager`).
- Methods and variables: `camelCase`.
- Socket event prefixes: `<game>_` lowerCamelCase (`bingo_createRoom`, `ttt_makeMove`, `dab_reconnect`).
- Constants / config keys: `camelCase`.

### Types / patterns
- Room state stored in `Map` — use `this.rooms = new Map()` in each manager constructor.
- No TypeScript — plain JavaScript. Use runtime guard checks (`if (!room || ...) return;`).
- `UUID` used for Bingo room IDs (`uuidv4().slice(0, 6).toUpperCase()`); DAB/TTT use `Math.random().toString(36)...`

### Error handling
- Early-return on invalid input — `if (!room) return;`, no thrown errors.
- Alert the client via `socket.emit('<game>_alert', { icon, title, text })`.
- Destructure incoming socket payloads: `({ roomId, playerName })` or `({ roomId, lineType, r, c })`.

### Socket patterns
- Register all events in `handleConnection(socket)` — one listener per event name.
- Broadcast room changes with `this.io.to(roomId).emit(...)`.

---

## Code Style — Frontend (`pro/`, React)

### Module system
- **ES Modules** — `import` / `export`.
- React components default-export as `export default ComponentName`.

### Imports order
1. React (`import React, { ... } from 'react'`)
2. External libraries
3. Internal paths (relative)

### Formatting
- 2-space indentation.
- Single-quoted strings.
- Component files end with `export default ComponentName;`.
- Inline event callbacks in body (not in a separate handed-off file) unless reused.

### Naming
- Components: `PascalCase` (`DabGame`, `RetroButton`, `GameContext`).
- Hooks: `useX` prefix (`useGameContext`, `useCallback`).
- Contexts: `XxxContext`, `useXxx` accessor hook.

### State patterns
- `useState` for component-local state.
- `useCallback` for stable handler references (especially with socket `on`/`off` or `useEffect` deps).
- Clean up socket listeners in `useEffect` return.
- Destructure context: `const { socket, playerName, roomId } = useGameContext()`.

### Styling
- Tailwind CSS v4 (`@tailwindcss/vite`). Use utility-first classes.
- Custom CSS classes: `glass`, `rounded-3xl`, `paper-font` — defined in `index.css`.
- Inline SVG uses 2-space indent.

### Vitest / Testing Library conventions
- `@testing-library/jest-dom` matchers available globally.
- Use `screen`, `render`, `fireEvent` from `@testing-library/react`.
- `vi` from `vitest` for mocks.
- Destructure helpers: `const { GameProvider, useGameContext } = require('./GameContext');`

---

## Repo-wide Rules

- **No `.cursor/` or Copilot config files** exist in this repo; these instructions are authoritative.
- `.env` and credential files never committed — no hardcoded secrets in source.
- Ports: API dev = `4000`, API tests = `4001`.
- Socket event naming uniqueness: `bingo_*`, `ttt_*`, `uttt_*`, `dab_*` prefixes across all game types.

# Dots & Boxes (DAB) — Implementation Plan

## Data Model

Box dimensions: `rows × cols` (inferred from dots per side — 1)
Dots grid: `(rows+1) × (cols+1)` (inferred, not stored)

### Grid Sizing

| Mode         | rows | cols | total boxes | dots per side |
| ------------ | ---- | ---- | ----------- | ------------- |
| Classic      | 9    | 9    | 81          | 10×10         |
| Extended     | 14   | 14   | 196         | 15×15         |
| Marathon     | 19   | 19   | 361         | 20×20         |
| Custom (min) | 1    | 1    | 1           | 2×2           |
| Custom (max) | 30   | 30   | 900         | 31×31         |

### Board Arrays

```
boxes[r][c]            = playerIndex | null    // rows × cols
horizontalLines[r][c]  = playerIndex | null    // (rows+1) × cols  — line above box[r][c]
verticalLines[r][c]    = playerIndex | null    // rows × (cols+1)  — line left of box[r][c]
```

### Player Colors (Sequential Palette)

| Seat         | Tailwind     | Hex       |
| ------------ | ------------ | --------- |
| P1 (index 0) | `blue-500`   | `#3B82F6` |
| P2 (index 1) | `red-500`    | `#EF4444` |
| P3 (index 2) | `green-500`  | `#22C55E` |
| P4 (index 3) | `orange-500` | `#F97316` |

---

## File Manifest

```
api/
  game-logic/dab.js       — DabManager class
  index.js                — import + instantiate DabManager
  test/dab.test.js        — Backend integration tests

pro/src/
  dab/DabGame.jsx         — Main frontend component (lobby + board + zoom)
  App.jsx                 — +1 route /dab
  components/PaperPartyLanding.jsx — +1 GameCard for DAB
```

---

## Socket Events

| Event             | Direction | Payload                                                                |
| ----------------- | --------- | ---------------------------------------------------------------------- |
| `dab_createRoom`  | C→S       | `{ mode, customRows?, customCols?, customPlayers? }`                   |
| `dab_joinRoom`    | C→S       | `{ roomId, playerName }`                                               |
| `dab_reconnect`   | C→S       | `{ roomId, playerId }`                                                 |
| `dab_makeMove`    | C→S       | `{ roomId, lineType: 'h'\|'v', r, c }`                                 |
| `dab_roomInfo`    | S→C       | Full room state                                                        |
| `dab_gameStarted` | S→C       | `{ firstTurn }`                                                        |
| `dab_moveResult`  | S→C       | `{ lineType, r, c, claimedBoxes, scores, currentTurn, currentPlayer }` |
| `dab_gameOver`    | S→C       | `{ winner, scores, winners? }`                                         |
| `dab_playerLeft`  | S→C       | `{ playerId }`                                                         |
| `dab_gamePaused`  | S→C       | `{ reason }`                                                           |
| `dab_alert`       | S→C       | `{ icon, title, text }`                                                |

---

## Box Check Algorithm

Triggered after every valid line placement.

### After placing `horizontalLines[r][c]`:

```
check box ABOVE: boxes[r-1][c] if r > 0
check box BELOW: boxes[r][c]   if r < rows
```

### After placing `verticalLines[r][c]`:

```
check box LEFT:  boxes[r][c-1] if c > 0
check box RIGHT: boxes[r][c]   if c < cols
```

### A box `[r][c]` is COMPLETE when all 4 sides are non-null:

```
top:    horizontalLines[r][c]
bottom: horizontalLines[r+1][c]
left:   verticalLines[r][c]
right:  verticalLines[r][c+1]
```

### Idempotency Guard

Before awarding a box point, check `if (boxes[boxR][boxC] !== null)` — if already claimed by a duplicate delayed event, skip. This prevents double-score exploits during high latency.

### Turn Decision

```
if claimedBoxes > 0 → same player goes again (score incremented)
if claimedBoxes === 0 → advance turn, SKIPPING disconnected players:

  do {
    currentTurn = (currentTurn + 1) % players.length;
  } while (!players[currentTurn].connected && activePlayerCount > 1);
```

### Win Condition

```
if sum(scores) === rows * cols → emit dab_gameOver
winner = player with highest score
tie possible if multiple players tie for highest score
```

---

## ⚠️ Critical Engineering Safeguards

### 1. Rendering: SVG over CSS Grid

CSS Grid produces ~3,721 DOM nodes for a 30×30 custom game (961 dots + 1,860 lines + 900 boxes). On mobile this causes severe lag.

**Fix:** Render the board as a single `<svg>` element with a `viewBox`:

- Dots → `<circle cx={c * spacing} cy={r * spacing} r={radius} vector-effect="non-scaling-stroke" />`
- Lines → `<line x1 y1 x2 y2 vector-effect="non-scaling-stroke" />` with a transparent wider stroke for hit target
- Boxes → `<rect x y width height fill={playerColor} opacity={0.3} />`
- SVG scales perfectly via `viewBox`, no CSS Grid math needed
- **Critical:** Add `vector-effect="non-scaling-stroke"` on every `<line>` and `<circle>`. Without it, zooming 300% into a Marathon board makes strokes balloon and overlap boxes. This keeps lines exactly 3px at any zoom level.

### 2. Ghost Turn Blocker

A disconnected player in a Marathon game permanently stalls the loop.

**Fix:** Player objects store `connected: boolean`. Turn advancement skips disconnected players:

```javascript
do {
  currentTurn = (currentTurn + 1) % players.length;
} while (!players[currentTurn].connected && activeCount > 1);
```

If all but one player disconnects, emit `dab_gamePaused` and start a 5-min forfeit timer.

### 3. Reconnection Protocol

A 5-second wifi drop should not end the game.

**Fix:** Add `dab_reconnect` event.

Frontend side:

- On successful `dab_createRoom` or `dab_joinRoom`, save `{ roomId, playerId }` to `sessionStorage`
- On `DabGame.jsx` mount, check `sessionStorage`. If values exist, auto-emit `dab_reconnect` instead of showing the lobby
- Session storage is cleared on explicit leave/room close but survives accidental tab refresh

Backend side:

- Server matches the provided `playerId` to an existing room (if `playerId` matches a stored player in the room)
- Clears any pending `emptyTimer`
- Updates the socket reference: `player.id = socket.id` (new socket ID from refresh)
- Sets `player.connected = true`
- Emits `dab_roomInfo` to sync full state
- Resumes game if it was paused

### 4. Strict Payload Sanitization

Malicious or malformed payloads must never reach array accesses.

**Fix:** At the top of `makeMove`, validate every field:

```javascript
if (typeof r !== 'number' || typeof c !== 'number') return;
if (typeof roomId !== 'string') return;
if (!['h', 'v'].includes(lineType)) return;
if (lineType === 'h' && (r < 0 || r > rows || c < 0 || c >= cols)) return;
if (lineType === 'v' && (r < 0 || r >= rows || c < 0 || c > cols)) return;
```

### 5. Box Claiming Idempotency

Duplicate `dab_makeMove` events from high-latency jitter must not double-claim a box.

**Fix:** In `checkBoxes`, before marking `boxes[br][bc] = playerIndex`, check it is still `null`. If already claimed, do not award a point.

---

## Implementation Order (10 Steps)

### Phase 1 — Server Foundation

**Step 1** — `api/game-logic/dab.js`: DabManager class skeleton

- `constructor(io)` — `this.rooms = new Map()`
- `handleConnection(socket)` — register event listeners
- `createRoom(socket, { mode, customRows, customCols, customPlayers })` — bounds check, init arrays
- `joinRoom(socket, { roomId, playerName })` — add player with `connected: true`, start game when min players ready
- `handleDisconnect(socket)` — set `player.connected = false`, skip turn if needed, start forfeit timer
- `reconnect(socket, { roomId, playerId })` — restore `connected: true`, clear timer, re-emit state
- `sendRoomInfo(roomId)` — emit `dab_roomInfo`

**Step 2** — `api/game-logic/dab.js`: Core logic

- `makeMove(socket, { roomId, lineType, r, c })` — strict bounds validation, validate turn, validate line is null
- `checkBoxes(room, r, c, lineType)` — returns count of newly completed boxes (with idempotency guard)
- `isBoxComplete(room, boxR, boxC)` — checks all 4 sides
- Turn advancement with disconnected-player skip loop
- Score update
- Win detection → emit `dab_gameOver`

**Step 3** — `api/test/dab.test.js`: Backend tests

- Create room with valid params
- Reject `customRows > 30`
- Reject `customPlayers > 4`
- Join room → verify both players present
- Place horizontal line → verify state
- Place vertical line → verify state
- Complete a box → verify score + same player turn
- Play to completion → verify `dab_gameOver`
- Test bounds validation (out-of-range r/c rejected)
- Test idempotency (duplicate move does not double-score)
- Test reconnection flow
- Test disconnected-player turn skip

**Step 4** — `api/index.js`: Wire DabManager

- `const DabManager = require('./game-logic/dab')`
- `const dabManager = new DabManager(io)`
- `dabManager.handleConnection(socket)` inside `io.on('connection')`

### Phase 2 — Frontend

**Step 5** — `pro/src/dab/DabGame.jsx`: Lobby UI

- Create/join room interface (mirror TicTacToe pattern)
- Mode selector: Classic / Extended / Marathon / Custom
- Custom mode reveals: rows input, cols input, players input (2-4)
- Scoreboard: maps over `Object.keys(scores)`, color-coded per seat index
- Turn indicator with player name + pulsing icon
- Reconnection badge if returning to an active game

**Step 6** — `pro/src/dab/DabGame.jsx`: SVG Board rendering

- Single `<svg>` element with `viewBox` computed from grid dimensions
- `<circle>` elements at every dot intersection
- `<line>` elements for every horizontal and vertical line slot
- Transparent wider `<line>` on top of each visible line as click hit target
- `<rect>` elements for claimed boxes with fill color + opacity
- No CSS Grid, no DOM explosion — SVG `viewBox` handles all scaling

**Step 7** — Zoom wrapper

- `npm install react-zoom-pan-pinch`
- `<TransformWrapper>` wraps SVG board
- Constrained to viewport (`limitToBounds`, `minScale`, `maxScale`)
- Mobile-friendly pan/zoom — SVG redraws natively, no layout thrashing

**Step 8** — Click handlers

- Click on transparent hit-target lines triggers `dab_makeMove` emit
- On `dab_moveResult`: update local state, highlight claimed box fill
- Disconnected player indicator on scoreboard (grayed out)
- Paused game overlay if opponent disconnects

### Phase 3 — Polish

**Step 9** — Routing + Landing

- Add `/dab` route in `App.jsx`
- Add DAB GameCard to `PaperPartyLanding.jsx`

**Step 10** — FX & Edge Cases

- `use-sound`: scratch on line placement, ding on box claim
- `dab_gameOver` → canvas-confetti + SweetAlert (winner/tie)
- 5-minute forfeit timer when all remaining players disconnect
- SVG element handling for mobile touch events
- Loading/error states for all async flows

---

## Backend State Shape (Room)

```javascript
{
  id: string,
  players: [
    {
      id: string,         // socket.id
      name: string,
      connected: boolean  // false if disconnected mid-game
    }
  ],
  gameState: 'waiting' | 'playing' | 'paused' | 'ended',
  currentTurn: number,           // index into players[]
  rows: number,                  // box rows
  cols: number,                  // box cols
  horizontalLines: number[][],   // (rows+1) × cols, values = playerIndex | null
  verticalLines: number[][],     // rows × (cols+1), values = playerIndex | null
  boxes: number[][],             // rows × cols, values = playerIndex | null
  scores: number[],              // one score per player
  lastMove: { lineType: 'h'|'v', r: number, c: number } | null,
  emptyTimer: NodeJS.Timeout | null,
  forfeitTimer: NodeJS.Timeout | null
}
```

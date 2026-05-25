# Project: PaperParty

A multi-game platform featuring real-time multiplayer games built with Socket.io, Express, and React. The project follows a "Modern Retro" (Glassmorphism) aesthetic with a nostalgic grid-paper theme.

## Project Structure

- `api/`: Unified Backend Node.js server.
  - `index.js`: Main server entry point and orchestrator.
  - `game-logic/`: Modular game managers.
    - `bingo.js`: Encapsulated Bingo room and turn logic.
    - `tictactoe.js`: Encapsulated TicTacToe room and move logic.
    - `uttt.js`: **NEW** Ultimate Tic-Tac-Toe room and move logic.
  - `test/`: Backend integration tests using Mocha and Socket.io-client.
- `pro/`: Frontend React application migrated to **Vite** and **Tailwind CSS v4**.
  - `src/components/`: Reusable UI library (`RetroButton`, `TextInput`) and `PaperPartyLanding`.
  - `src/context/`: Global `GameContext` for state and socket management.
  - `src/bingo/` & `src/tictactoe/`: Overhauled game environments with hand-drawn fonts and animations.
  - `src/uttt/`: **NEW** Ultimate Tic-Tac-Toe game components.

## Technologies

- **Backend:** Node.js, Express, Socket.io 4, UUID.
- **Frontend:** React 18, Vite, **Tailwind CSS v4** (no PostCSS), Vitest (TDD), SweetAlert2, canvas-confetti, use-sound, Lucide React.

## Getting Started

### Backend (`api/`)

1. Navigate to the `api` directory: `cd api`
2. Start the server: `npm start` (Runs on port 4000)

### Frontend (`pro/`)

1. Navigate to the `pro` directory: `cd pro`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Run tests (TDD): `npm test`

## Development Conventions

- **TDD Workflow:** Features are implemented using a Red-Green-Refactor loop with vertical tracer-bullet slices.
- **Aesthetic:** Glassmorphism (`.glass`), Grid-paper background, and hand-drawn fonts (`Permanent Marker`, `Schoolbell`).
- **State Management:** Centralized in `GameContext`.
- **UI Components:** Strictly Tailwind-based; Material UI has been removed.
- **Event Namespacing:** All UTTT events use `uttt_` prefix (e.g., `uttt_makeMove`, `uttt_gameState`).

## Implemented Features

### Ultimate Tic-Tac-Toe (UTTT) ✅

**Backend** (`api/game-logic/uttt.js`):

- UTTTManager class with full game state management
- Win detection: Inner → Macro → Tiebreaker sequence
- Active grid tracking based on last move
- Option B scoring (points for winning inner grids)
- Last move tracking for UX
- Reconnection support
- Garbage collection (5-minute timer for empty rooms)
- Error handling with `uttt_error` events

**Frontend** (`pro/src/uttt/`):

- UTTTGame.jsx - Main game container with socket handling
- MacroGrid.jsx - 3x3 outer grid container
- InnerGrid.jsx - 3x3 inner grid with states:
  - Active: pulsing blue border
  - Inactive: grayscale, reduced opacity
  - Won: large overlay symbol
  - Dead: X marks in all cells
  - Last move highlight (yellow glow)

**Routes**:

- `/uttt` - Ultimate Tic-Tac-Toe game
- Added to PaperPartyLanding game selection

---

# Ultimate Tic-Tac-Toe Implementation Plan

## Overview

Ultimate Tic-Tac-Toe (UTTT) is a complex recursive game where players play on a 9x9 grid divided into nine 3x3 sub-grids. The game features **Option B** scoring (points for winning inner grids) and visual state indicators to reduce cognitive load.

## Game Rules Summary

- Players take turns placing X or O in any empty cell of the active grid.
- Winning an inner 3x3 grid (3-in-a-row) awards 1 point and marks that grid on the macro-board.
- If a player sends their opponent to a grid that is already won or full, the opponent can play anywhere.
- **Win Condition:** First to get 3-in-a-row on the macro-board (like regular Tic-Tac-Toe).
- **Option B Tiebreaker:** If all 81 squares are filled with no macro winner, the player with higher score wins.

---

## Phase 1: Backend Implementation (`api/game-logic/uttt.js`)

### 1.1 State Structure

```javascript
{
  id: string,              // 6-character uppercase room ID
  players: [{ id: string, name: string }],  // Max 2 players
  symbols: { 'socketId1': 'X', 'socketId2': 'O' },
  currentTurn: 'socketId1',
  gameState: 'waiting' | 'playing' | 'paused' | 'ended',

  // The 81 small squares: 9 inner grids, each with 9 squares
  board: Array(9).fill(null).map(() => Array(9).fill(null)),

  // The 9 large outer grids: 'X', 'O', 'DEAD', or null
  macroBoard: Array(9).fill(null),

  // 0-8 indicates forced grid; null means player can play anywhere
  activeGrid: null,

  // Option B scoring
  scores: { X: 0, O: 0 },

  // For UX: track last move to highlight on frontend
  lastMove: { gridIndex: number, squareIndex: number } | null,

  // Garbage collection
  emptyTimer: NodeJS.Timeout | null
}
```

### 1.2 Socket Events

| Event              | Direction     | Payload                                    |
| ------------------ | ------------- | ------------------------------------------ |
| `uttt_createRoom`  | Client→Server | `{ playerName }`                           |
| `uttt_joinRoom`    | Client→Server | `{ roomId, playerName }`                   |
| `uttt_makeMove`    | Client→Server | `{ roomId, gridIndex, squareIndex }`       |
| `uttt_restartGame` | Client→Server | `{ roomId }`                               |
| `uttt_roomInfo`    | Server→Client | Full state object                          |
| `uttt_gameStarted` | Server→Client | -                                          |
| `uttt_gameState`   | Server→Client | Full state after each move                 |
| `uttt_gameOver`    | Server→Client | `{ winner, scores, reason, winningLine? }` |
| `uttt_error`       | Server→Client | `{ message }` - invalid move rejection     |
| `uttt_playerLeft`  | Server→Client | `{ playerId }`                             |

### 1.3 Server Validation Rules

For each `uttt_makeMove` request, validate:

1. **Room exists** - Room not found returns `uttt_error`
2. **Game state is 'playing'** - Returns `uttt_error`
3. **Player's turn** - Returns `uttt_error`
4. **Target square is empty** - Returns `uttt_error`
5. **Grid matches activeGrid (or activeGrid is null)** - Returns `uttt_error`

### 1.4 Core Game Logic (Correct Sequence)

When processing a move, execute in this exact order:

```javascript
// 1. UPDATE: Place symbol in board
board[gridIndex][squareIndex] = symbol;

// 2. INNER WIN CHECK: Check board[gridIndex] for 3-in-a-row
const innerWinner = checkInnerWin(board[gridIndex]);
if (innerWinner.winner) {
  macroBoard[gridIndex] = symbol;
  scores[symbol]++;
} else if (board[gridIndex].every(cell => cell !== null)) {
  macroBoard[gridIndex] = 'DEAD';
}

// 3. MACRO WIN CHECK: Check macroBoard for 3-in-a-row
const macroWinner = checkMacroWin(macroBoard);
if (macroWinner) {
  // GAME OVER - Victory
  gameState = 'ended';
  emit uttt_gameOver({ winner, scores, reason: 'macro_win' });
  return;
}

// 4. TIEBREAKER CHECK: All 81 squares full?
if (board.every(grid => grid.every(cell => cell !== null))) {
  // GAME OVER - Option B
  const winner = scores.X > scores.O ? 'X' : 'O';
  gameState = 'ended';
  emit uttt_gameOver({ winner, scores, reason: 'tiebreaker' });
  return;
}

// 5. DETERMINE NEXT ACTIVE GRID
const nextGrid = squareIndex;
// If next grid is full or dead, set activeGrid to null (free choice)
if (macroBoard[nextGrid] !== null) {
  activeGrid = null;
} else {
  activeGrid = nextGrid;
}

// 6. UPDATE LAST MOVE
lastMove = { gridIndex, squareIndex };

// 7. SWITCH TURN
currentTurn = otherPlayerId;

// 8. BROADCAST
emit uttt_gameState(room);
```

### 1.5 Reconnection & Garbage Collection

**Reconnection:**

- In `handleConnection(socket)`, check if socket.id already exists in any room
- If found: emit `uttt_gameState` with current game state
- If game was 'paused', set back to 'playing'

**Garbage Collection:**

- On player disconnect: if only 1 player remains, start 5-minute timer
- If timer expires and room empty: delete room from memory
- On each valid move: clear any pending timer for that room

---

## Phase 2: Frontend Implementation (`pro/src/uttt/`)

### 2.1 Component Structure

```
uttt/
├── UTTTGame.jsx          # Main container + socket handling
├── components/
│   ├── MacroGrid.jsx     # 3x3 outer grid container
│   └── InnerGrid.jsx     # Individual 3x3 inner board
└── uttt.css              # Tailwind + custom animations
```

### 2.2 UTTTGame.jsx

**Responsibilities:**

- Initialize socket connection
- Manage local game state (sync with server)
- Render: Scoreboard, Turn Indicator, MacroGrid

**Socket Event Listeners:**

- `uttt_roomInfo` - Initialize state on join
- `uttt_gameStarted` - Show game begin animation
- `uttt_gameState` - Full state update after each move
- `uttt_gameOver` - Trigger confetti + SweetAlert
- `uttt_error` - Show error toast

**User Actions:**

- `uttt_createRoom` - Create new room
- `uttt_joinRoom` - Join existing room
- `uttt_makeMove` - Send move to server
- `uttt_restartGame` - Request new round

### 2.3 InnerGrid.jsx (Core UI Component)

**Props:**

- `gridData` - Array of 9 cells from `board[gridIndex]`
- `isActive` - Boolean (true if this is the active grid)
- `macroWinner` - 'X', 'O', 'DEAD', or null
- `isLastMoveGrid` - Boolean (true if this grid contains lastMove)
- `lastMoveSquare` - Index of last move within this grid (for highlight)
- `onSquareClick(squareIndex)` - Callback

**Visual States:**

| State                            | CSS/Tailwind Classes                            |
| -------------------------------- | ----------------------------------------------- |
| **Active** (isActive=true)       | `ring-2 ring-blue-400 animate-pulse`            |
| **Inactive** (isActive=false)    | `opacity-40 grayscale pointer-events-none`      |
| **Won** (macroWinner='X' or 'O') | Overlay with large semi-transparent symbol      |
| **Dead** (macroWinner='DEAD')    | Darkened, show X in all cells                   |
| **Last Move**                    | `bg-yellow-100` or subtle glow on specific cell |

### 2.4 MacroGrid.jsx

**Layout:** 3x3 CSS Grid with gap

**Props:**

- `macroBoard` - Array of 9 (macro winners)
- `activeGrid` - Number (0-8) or null
- `board` - Full 9x9 board
- `lastMove` - `{ gridIndex, squareIndex }` or null
- `onCellClick(gridIndex, squareIndex)` - Callback

---

## Phase 3: Edge Cases & Error Handling

| Scenario                 | Server Response                 | Client Response              |
| ------------------------ | ------------------------------- | ---------------------------- |
| Join full room           | `uttt_error: "Room is full"`    | SweetAlert "Room is full"    |
| Move out of turn         | `uttt_error: "Not your turn"`   | Console warning              |
| Click disabled grid      | `uttt_error: "Invalid grid"`    | Show toast                   |
| Click occupied square    | `uttt_error: "Square occupied"` | Show toast                   |
| Player disconnects       | `uttt_playerLeft`               | Show "Waiting for player..." |
| Reconnect to active game | Emit `uttt_gameState`           | Restore game state           |

---

## Implementation Checklist

### Backend

- [ ] Create `api/game-logic/uttt.js` with UTTTManager class
- [ ] Implement `checkInnerWin()` helper
- [ ] Implement `checkMacroWin()` helper
- [ ] Add UTTT handler to `api/index.js`
- [ ] Add reconnection logic
- [ ] Add garbage collection
- [ ] Write tests for win detection and move validation

### Frontend

- [ ] Create `pro/src/uttt/UTTTGame.jsx`
- [ ] Create `pro/src/uttt/components/MacroGrid.jsx`
- [ ] Create `pro/src/uttt/components/InnerGrid.jsx`
- [ ] Add route in `App.jsx` → `/uttt`
- [ ] Style with Tailwind (active/inactive/won/dead states)
- [ ] Add last move highlighting
- [ ] Add confetti on win
- [ ] Add SweetAlert for game over and errors

---

## Styling Guidelines (Tailwind)

```jsx
// Inner Grid - Active
<div className="border-2 border-blue-400 animate-pulse bg-white/80">
// Inner Grid - Inactive
<div className="opacity-40 grayscale pointer-events-none">
// Inner Grid - Won (X)
<div className="relative">
  <div className="absolute inset-0 flex items-center justify-center opacity-30">
    <span className="text-6xl text-red-500">X</span>
  </div>
  {/* Original grid visible underneath */}
// Cell - Last Move Highlight
<div className="bg-yellow-100 ring-2 ring-yellow-400">
```

---

This plan is ready for implementation. Run `npm start` in `api/` and `npm run dev` in `pro/` to begin development.

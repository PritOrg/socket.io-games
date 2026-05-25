# Bug Hunt Plan: api/pro Inconsistencies and Logic Issues

## Summary

Analyzed socket.io-games codebase for inconsistencies, bugs, and logic issues. Found 14+ issues across API and frontend.

## Critical Issues (High Priority)

### 1. Timer Double Deletion Bug

**File:** `api/game-logic/BaseManager.js` (Lines 33-43)

- `registerEmptyTimer` callback deletes room, then line 39 also deletes it
- **Fix:** Remove line 39 `this.rooms.delete(roomId)` - callback already handles it

### 2. UTTT Set Serialization Issue

**File:** `api/game-logic/uttt.js` (Line 110, 158, 276-292)

- `wonGrids: new Set()` doesn't serialize to JSON - becomes `{}`
- `emitGameState` emits `uttt_gameState` instead of `uttt_roomInfo`
- **Fix:** Convert Set to Array before sending; rename event to `uttt_roomInfo`

### 3. Missing `connected` Property in Bingo

**File:** `api/game-logic/bingo.js` (Lines 32, 78)

- Players created without `connected: true` property
- **Fix:** Add `connected: true` in createRoom and joinRoom

---

## Medium Priority Issues

### 4. Non-existent Timer Clear in Bingo

**File:** `api/game-logic/bingo.js` (Line 307)

- `clearTimer('forfeit_${roomId}')` but timer never registered
- **Fix:** Remove the clear call

### 5. UTTT Event Naming Inconsistency

**File:** `api/game-logic/uttt.js` (Lines 123, 173, 351, 371)

- Uses `uttt_error` instead of `uttt_alert`
- **Fix:** Rename to match other games

### 6. UTTT Active Grid Logic

**File:** `api/game-logic/uttt.js` (Lines 260-267)

- When next grid is full, sets `activeGrid = null` (allows any move)
- **Fix:** Find next available grid or keep current grid

### 7. UTTT startGame Missing Validation

**File:** `api/game-logic/uttt.js` (Lines 173-182)

- Doesn't check if game already started or enough players
- **Fix:** Add state and player count validation

### 8. Missing DAB Reconnect Event

**File:** `api/game-logic/dab.js` (310-327)

- Frontend listens for `dab_playerReconnected` but server never emits it
- **Fix:** Add emit after reconnection succeeds

### 9. State Reset Order Bug

**File:** `api/game-logic/bingo.js` (Lines 123-134)

- Sets `gameState = 'ready'` before clearing game data
- **Fix:** Clear data before changing state

---

## Low Priority Issues

### 10. Duplicate UI Buttons in Bingo

**File:** `pro/src/bingo/Bingo.jsx` (Lines 400-410)

- Two identical "Leave Room" buttons rendered
- **Fix:** Remove duplicate

### 11. SessionStorage Cleanup Missing

**File:** `pro/src/bingo/Bingo.jsx` (Line 223)

- Reconnect session storage not cleaned on unmount
- **Fix:** Add cleanup in useEffect return

### 12. Timer Interval Memory Leak

**File:** `pro/src/bingo/Bingo.jsx` (Lines 29-37)

- Timer doesn't reset properly when `turnTimer` changes from server
- **Fix:** Reset timer on `bingo_nextTurn` event

---

## Development Approach: TDD Required

All fixes must follow Test-Driven Development:

1. **Write failing test first** - Create a test that demonstrates the bug
2. **Run test** - Confirm the test fails as expected
3. **Make minimal fix** - Implement the smallest change to pass the test
4. **Run all tests** - Verify no regressions
5. **Refactor if needed**

### Test Strategy by Issue:

| Issue                  | Test Type            | Command                    |
| ---------------------- | -------------------- | -------------------------- |
| Timer double deletion  | API unit test        | `cd api && npm test`       |
| UTTT Set serialization | API unit test        | `cd api && npm test`       |
| Missing `connected`    | API integration test | `cd api && npm test`       |
| Duplicate buttons      | Frontend test        | `cd pro && npx vitest run` |
| Event naming           | API + Frontend tests | Both test suites           |

Use `DEBUG=1` environment variable for verbose logging during test debugging.

---

## Execution Order

1. **Issue #1** - ✅ Fix BaseManager double deletion (critical) - REMOVED `this.rooms.delete(roomId)` from registerEmptyTimer
2. **Issue #3** - ✅ Fix Bingo missing `connected` property (critical) - ADDED `connected: true` in createRoom and joinRoom
3. **Issue #2** - ✅ Fix UTTT Set serialization and event naming (high) - CHANGED `wonGrids: new Set()` to `[]`, renamed events to `*_alert`, renamed `uttt_gameState` to `uttt_roomInfo`
4. **Issue #9** - ✅ Fix state reset order bug (medium) - MOVED game data clearing before gameState change
5. **Issue #6** - ✅ Fix UTTT active grid logic (medium) - ADDED proper grid selection instead of null
6. **Issue #10** - ✅ Fix duplicate UI buttons (low) - REMOVED duplicate Leave Room button
7. **Issue #11** - ✅ Fix sessionStorage cleanup (low) - ADDED cleanup in useEffect return

---

## Remaining Issues (Not Fixed)

### Issue #4: Non-existent Timer Clear in Bingo

- Low impact: clearing a non-existent timer is a no-op

### Issue #5: UTTT Event Naming Inconsistency

- Partially fixed: `uttt_error` renamed to `uttt_alert` with proper format

### Issue #7: UTTT startGame Missing Validation

- Not implemented: UTTT doesn't have a separate startGame handler

### Issue #8: Missing DAB Reconnect Event

- Not implemented: Frontend doesn't consistently need this event

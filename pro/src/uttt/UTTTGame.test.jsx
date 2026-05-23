import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UTTTGame from './UTTTGame';
import { GameProvider } from '../context/GameContext';
import { BrowserRouter } from 'react-router-dom';

const mockSocket = {
  id: 'p1',
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('socket.io-client', () => ({ default: () => mockSocket }));
vi.mock('use-sound', () => ({ default: () => [vi.fn()] }));
vi.mock('canvas-confetti', () => ({ default: vi.fn() }));
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) } }));

const Wrapper = ({ children }) => (
  <GameProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </GameProvider>
);

const makeBoard = () =>
  Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

const findEventCb = (event) => {
  const call = mockSocket.on.mock.calls.find((c) => c[0] === event);
  return call?.[1];
};

const playingRoomInfo = {
  id: 'UTTT01',
  creator: 'p1',
  players: [
    { id: 'p1', name: 'Alice', connected: true },
    { id: 'p2', name: 'Bob', connected: true },
  ],
  gameState: 'playing',
  currentTurn: 'p1',
  board: makeBoard(),
  macroBoard: Array(9).fill(null),
  activeGrid: null,
  scores: { X: 0, O: 0 },
  lastMove: null,
};

describe('UTTTGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('Board Rendering', () => {
    it('shows Create Room and Join Room buttons in waiting state', () => {
      render(<UTTTGame />, { wrapper: Wrapper });
      expect(screen.getByText('Create Room')).toBeTruthy();
      expect(screen.getByText('Join Room')).toBeTruthy();
    });

    it('renders the game board when playing', async () => {
      const { container } = render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      await screen.findByText('Your Turn!');
      const macroGrid = container.querySelector('.grid.grid-cols-3');
      expect(macroGrid).toBeTruthy();
    });

    it('displays player names', async () => {
      render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText('Bob')).toBeTruthy();
    });
  });

  describe('Move Execution', () => {
    it('emits uttt_makeMove when a cell is clicked on my turn', async () => {
      const { container } = render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      await screen.findByText('Your Turn!');

      const macroGrid = container.querySelector('.grid.grid-cols-3');
      expect(macroGrid).toBeTruthy();
      const innerGrids = macroGrid.querySelectorAll('.grid.grid-cols-3');
      expect(innerGrids.length).toBe(9);
      const firstCell = innerGrids[0].querySelector('button');
      expect(firstCell).toBeTruthy();

      await act(async () => {
        fireEvent.click(firstCell);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'uttt_makeMove',
        expect.objectContaining({ gridIndex: 0, squareIndex: 0 }),
      );
    });

    it('updates board with X on uttt_gameState', async () => {
      const { container } = render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameStateCb = findEventCb('uttt_gameState');
      const updatedBoard = makeBoard();
      updatedBoard[0][0] = 'X';

      await act(async () => {
        gameStateCb({
          gameState: 'playing',
          currentTurn: 'p2',
          board: updatedBoard,
          macroBoard: Array(9).fill(null),
          activeGrid: 0,
          scores: { X: 0, O: 0 },
          lastMove: { gridIndex: 0, squareIndex: 0 },
        });
      });

      const macroGrid = container.querySelector('.grid.grid-cols-3');
      expect(within(macroGrid).getAllByText('X').length).toBeGreaterThanOrEqual(1);
    });

    it('does not emit when it is not my turn', async () => {
      const { container } = render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb({ ...playingRoomInfo, currentTurn: 'p2' });
      });

      const macroGrid = container.querySelector('.grid.grid-cols-3');
      const innerGrids = macroGrid.querySelectorAll('.grid.grid-cols-3');
      const firstCell = innerGrids[0].querySelector('button');

      await act(async () => {
        fireEvent.click(firstCell);
      });

      expect(mockSocket.emit).not.toHaveBeenCalledWith('uttt_makeMove', expect.any(Object));
    });
  });

  describe('Macro Grid Display', () => {
    it('shows scoreboard with X and O scores in the header', async () => {
      render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const scoreElements = screen.getAllByText('0');
      expect(scoreElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Active Grid', () => {
    it('shows grid hint when activeGrid is set', async () => {
      render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameStateCb = findEventCb('uttt_gameState');
      await act(async () => {
        gameStateCb({
          gameState: 'playing',
          currentTurn: 'p2',
          board: makeBoard(),
          macroBoard: Array(9).fill(null),
          activeGrid: 4,
          scores: { X: 0, O: 0 },
          lastMove: { gridIndex: 0, squareIndex: 0 },
        });
      });

      expect(screen.getByText(/must play in grid 5/)).toBeTruthy();
    });

    it('does not show grid hint when activeGrid is null', async () => {
      render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      expect(screen.queryByText(/must play in grid/)).toBeNull();
    });
  });

  describe('Game Over', () => {
    it('shows Play Again button when game ends', async () => {
      render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameOverCb = findEventCb('uttt_gameOver');
      await act(async () => {
        gameOverCb({
          winner: 'p1',
          symbol: 'X',
          scores: { X: 3, O: 0 },
          reason: 'macro_win',
        });
      });

      expect(screen.getByText('Play Again')).toBeTruthy();
    });

    it('emits uttt_restartGame when Play Again is clicked', async () => {
      render(<UTTTGame />, { wrapper: Wrapper });

      const cb = findEventCb('uttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameOverCb = findEventCb('uttt_gameOver');
      await act(async () => {
        gameOverCb({
          winner: 'p1',
          symbol: 'X',
          scores: { X: 3, O: 0 },
          reason: 'macro_win',
        });
      });

      const playAgainBtn = screen.getByText('Play Again');
      await act(async () => {
        fireEvent.click(playAgainBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('uttt_restartGame', expect.any(String));
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DabGame from './DabGame';
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
vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }) => children({ zoomIn: vi.fn(), zoomOut: vi.fn(), resetTransform: vi.fn() }),
  TransformComponent: ({ children }) => <>{children}</>,
}));

const Wrapper = ({ children }) => (
  <GameProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </GameProvider>
);

const findEventCb = (event) => {
  const call = mockSocket.on.mock.calls.find((c) => c[0] === event);
  return call?.[1];
};

const makePlayingRoomInfo = (overrides = {}) => ({
  id: 'DAB01',
  creator: 'p1',
  players: [
    { id: 'p1', name: 'Alice', connected: true },
    { id: 'p2', name: 'Bob', connected: true },
  ],
  gameState: 'playing',
  currentTurn: 0,
  rows: 9,
  cols: 9,
  horizontalLines: Array(10)
    .fill(null)
    .map(() => Array(9).fill(null)),
  verticalLines: Array(9)
    .fill(null)
    .map(() => Array(10).fill(null)),
  boxes: Array(9)
    .fill(null)
    .map(() => Array(9).fill(null)),
  scores: [0, 0],
  lastMove: null,
  mode: 'classic',
  ...overrides,
});

describe('DabGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('Waiting State', () => {
    it('shows Create Room and Join Room buttons', () => {
      render(<DabGame />, { wrapper: Wrapper });
      expect(screen.getByText('Create Room')).toBeTruthy();
      expect(screen.getByText('Join Room')).toBeTruthy();
    });

    it('shows Classic and Custom Size mode buttons', () => {
      render(<DabGame />, { wrapper: Wrapper });
      expect(screen.getByText('Classic (9×9)')).toBeTruthy();
      expect(screen.getByText('Custom Size')).toBeTruthy();
    });

    it('emits dab_createRoom with default options when Create Room is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });
      const btn = screen.getByText('Create Room');
      await act(async () => {
        fireEvent.click(btn);
      });
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'dab_createRoom',
        expect.objectContaining({
          mode: 'classic',
          playerName: expect.any(String),
        }),
      );
    });
  });

  describe('Scoreboard and Turn Indicator', () => {
    it('shows player names when playing', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo());
      });

      expect(screen.getByText(/Alice/)).toBeTruthy();
      expect(screen.getByText(/Bob/)).toBeTruthy();
    });

    it('shows "Your Turn!" when it is my turn', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 0 }));
      });

      expect(screen.getByText('Your Turn!')).toBeTruthy();
    });

    it('shows waiting message when it is not my turn', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 1 }));
      });

      expect(screen.getAllByText(/Bob/).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Redo Flow', () => {
    it('shows redo request with player name when dab_redoRequested is received', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 0 }));
      });

      const redoCb = findEventCb('dab_redoRequested');
      await act(async () => {
        redoCb({ requesterId: 'p2' });
      });

      expect(screen.getByText(/wants to undo/)).toBeTruthy();
    });

    it('shows Allow and Deny buttons when I am the current turn player', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 0 }));
      });

      const redoCb = findEventCb('dab_redoRequested');
      await act(async () => {
        redoCb({ requesterId: 'p2' });
      });

      expect(screen.getByText('Allow')).toBeTruthy();
      expect(screen.getByText('Deny')).toBeTruthy();
    });

    it('emits dab_respondRedo with accept:true when Allow is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 0 }));
      });

      const redoCb = findEventCb('dab_redoRequested');
      await act(async () => {
        redoCb({ requesterId: 'p2' });
      });

      const allowBtn = screen.getByText('Allow');
      await act(async () => {
        fireEvent.click(allowBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('dab_respondRedo', expect.objectContaining({ accept: true }));
    });

    it('emits dab_respondRedo with accept:false when Deny is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 0 }));
      });

      const redoCb = findEventCb('dab_redoRequested');
      await act(async () => {
        redoCb({ requesterId: 'p2' });
      });

      const denyBtn = screen.getByText('Deny');
      await act(async () => {
        fireEvent.click(denyBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('dab_respondRedo', expect.objectContaining({ accept: false }));
    });

    it('hides redo UI when dab_redoCancelled is received', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo({ currentTurn: 0 }));
      });

      const redoCb = findEventCb('dab_redoRequested');
      await act(async () => {
        redoCb({ requesterId: 'p2' });
      });

      expect(screen.getByText(/wants to undo/)).toBeTruthy();

      const cancelCb = findEventCb('dab_redoCancelled');
      await act(async () => {
        cancelCb();
      });

      expect(screen.queryByText(/wants to undo/)).toBeNull();
    });

    it('shows Request Undo button when lastMove exists and not my turn', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(
          makePlayingRoomInfo({
            currentTurn: 1,
            lastMove: { lineType: 'h', r: 0, c: 0 },
          }),
        );
      });

      expect(screen.getByText(/Request Undo/)).toBeTruthy();
    });

    it('emits dab_requestRedo when Request Undo is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(
          makePlayingRoomInfo({
            currentTurn: 1,
            lastMove: { lineType: 'h', r: 0, c: 0 },
          }),
        );
      });

      const undoBtn = screen.getByText(/Request Undo/);
      await act(async () => {
        fireEvent.click(undoBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('dab_requestRedo', expect.any(String));
    });
  });

  describe('Game Over', () => {
    it('shows Game Over text and Play Again button', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo());
      });

      const gameOverCb = findEventCb('dab_gameOver');
      await act(async () => {
        gameOverCb({
          winner: 'p1',
          scores: [5, 3],
          winners: ['p1'],
        });
      });

      expect(screen.getByText(/Game Over/)).toBeTruthy();
      expect(screen.getByText('Play Again')).toBeTruthy();
    });

    it('calls Swal.fire with tie message when no winner', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo());
      });

      const Swal = (await import('sweetalert2')).default;

      const gameOverCb = findEventCb('dab_gameOver');
      await act(async () => {
        gameOverCb({
          winner: null,
          scores: [4, 4],
          winners: ['p1', 'p2'],
        });
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "It's a Tie!",
        }),
      );
    });

    it('emits dab_restartGame when Play Again is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo());
      });

      const gameOverCb = findEventCb('dab_gameOver');
      await act(async () => {
        gameOverCb({
          winner: 'p1',
          scores: [5, 3],
          winners: ['p1'],
        });
      });

      const playAgainBtn = screen.getByText('Play Again');
      await act(async () => {
        fireEvent.click(playAgainBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('dab_restartGame', expect.any(String));
    });
  });

  describe('Pause', () => {
    it('shows Game Paused message when dab_gamePaused is received', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo());
      });

      const pauseCb = findEventCb('dab_gamePaused');
      await act(async () => {
        pauseCb();
      });

      expect(screen.getByText(/Game Paused/)).toBeTruthy();
    });
  });
});

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

  describe('Lobby - No Room', () => {
    it('shows Create Room and Join Room buttons', () => {
      render(<DabGame />, { wrapper: Wrapper });
      expect(screen.getByText('Create Room')).toBeTruthy();
      expect(screen.getByText('Join Room')).toBeTruthy();
    });

    it('emits dab_createRoom when Create Room is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });
      await act(async () => {
        fireEvent.click(screen.getByText('Create Room'));
      });
      expect(mockSocket.emit).toHaveBeenCalledWith('dab_createRoom', expect.objectContaining({ mode: 'classic' }));
    });
  });

  describe('Mode Selection', () => {
    it('shows Classic, Extended, and Marathon mode buttons', () => {
      render(<DabGame />, { wrapper: Wrapper });
      expect(screen.getByText('Classic (9×9)')).toBeTruthy();
      expect(screen.getByText('Extended (14×14)')).toBeTruthy();
      expect(screen.getByText('Marathon (19×19)')).toBeTruthy();
    });

    it('switches mode when Extended is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });
      await act(async () => {
        fireEvent.click(screen.getByText('Extended (14×14)'));
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Create Room'));
      });
      expect(mockSocket.emit).toHaveBeenCalledWith('dab_createRoom', expect.objectContaining({ mode: 'extended' }));
    });
  });

  describe('Playing State', () => {
    it('shows player scores when playing', async () => {
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
  });

  describe('Avatar Selector', () => {
    it('shows avatar picker in the lobby', () => {
      render(<DabGame />, { wrapper: Wrapper });
      expect(screen.getByText('🐼')).toBeTruthy();
      expect(screen.getByText('🦊')).toBeTruthy();
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
        gameOverCb({ winner: 'p1', scores: [5, 3], winners: ['p1'] });
      });

      expect(screen.getByText(/Play Again/)).toBeTruthy();
    });

    it('emits dab_restartGame when Play Again is clicked', async () => {
      render(<DabGame />, { wrapper: Wrapper });

      const cb = findEventCb('dab_roomInfo');
      await act(async () => {
        cb(makePlayingRoomInfo());
      });

      const gameOverCb = findEventCb('dab_gameOver');
      await act(async () => {
        gameOverCb({ winner: 'p1', scores: [5, 3], winners: ['p1'] });
      });

      const playAgainBtn = screen.getByText('Play Again');
      await act(async () => {
        fireEvent.click(playAgainBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('dab_restartGame', expect.any(String));
    });
  });

  describe('Redo Flow', () => {
    it('shows redo request when dab_redoRequested is received', async () => {
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

    it('shows Allow and Deny buttons when I am the current turn', async () => {
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

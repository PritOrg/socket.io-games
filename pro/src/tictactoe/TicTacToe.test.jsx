import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicTacToe from './TicTacToe';
import { GameProvider } from '../context/GameContext';
import { ThemeProvider } from '../context/ThemeContext';
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
  <ThemeProvider>
    <GameProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </GameProvider>
  </ThemeProvider>
);

const findEventCb = (event) => {
  const call = mockSocket.on.mock.calls.find((c) => c[0] === event);
  return call?.[1];
};

const playingRoomInfo = {
  id: 'TTT01',
  players: [
    { id: 'p1', name: 'Alice', connected: true, avatarIcon: 'cat', color: '#2a2a3e' },
    { id: 'p2', name: 'Bob', connected: true, avatarIcon: 'dog', color: '#c73e1d' },
  ],
  gameState: 'playing',
  currentTurn: 'p1',
  board: Array(9).fill(null),
};

describe('TicTacToe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('Lobby - No Room', () => {
    it('shows Create and Join buttons when no room', () => {
      render(<TicTacToe />, { wrapper: Wrapper });
      expect(screen.getByText('Create')).toBeTruthy();
      expect(screen.getByText('Join')).toBeTruthy();
    });

    it('emits ttt_createRoom when Create is clicked', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });
      await act(async () => {
        fireEvent.click(screen.getByText('Create'));
      });
      expect(mockSocket.emit).toHaveBeenCalledWith(
        'ttt_createRoom',
        expect.objectContaining({ playerName: expect.any(String) }),
      );
    });
  });

  describe('Board Rendering', () => {
    it('renders the game board when roomInfo received with playing state', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      expect(screen.getByText('Your turn!')).toBeTruthy();
    });

    it('shows player initials in nav', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      expect(screen.getByText('Al')).toBeTruthy();
      expect(screen.getByText('Bo')).toBeTruthy();
    });

    it('shows Rematch button when game ends with win', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameWonCb = findEventCb('ttt_gameWon');
      await act(async () => {
        gameWonCb({ winner: 'p1', winningLine: [0, 1, 2] });
      });

      expect(screen.getByText('Rematch')).toBeTruthy();
    });

    it('shows Rematch button when game ends with draw', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameDrawCb = findEventCb('ttt_gameDraw');
      await act(async () => {
        gameDrawCb();
      });

      expect(screen.getByText('Rematch')).toBeTruthy();
    });
  });

  describe('Making Moves', () => {
    it('emits ttt_makeMove when a cell is clicked on my turn', async () => {
      const { container } = render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      await screen.findByText('Your turn!');

      const boardGrid = container.querySelector('.grid.grid-cols-3');
      expect(boardGrid).toBeTruthy();
      const cells = boardGrid.querySelectorAll('button');

      await act(async () => {
        fireEvent.click(cells[0]);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('ttt_makeMove', expect.objectContaining({ position: 0 }));
    });
  });

  describe('Avatar Selector', () => {
    it('shows avatar icon selector in the lobby when no room', () => {
      render(<TicTacToe />, { wrapper: Wrapper });
      const avatarButtons = screen.getAllByRole('button').filter((b) => b.querySelector('svg'));
      expect(avatarButtons.length).toBe(12);
    });

    it('allows selecting an avatar icon', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });
      const avatarButtons = screen.getAllByRole('button').filter((b) => b.querySelector('svg'));
      await act(async () => {
        fireEvent.click(avatarButtons[1]);
      });
      expect(avatarButtons[1].className).toContain('border-ink');
    });
  });
});

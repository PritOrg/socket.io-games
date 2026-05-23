import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicTacToe from './TicTacToe';
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

const findEventCb = (event) => {
  const call = mockSocket.on.mock.calls.find((c) => c[0] === event);
  return call?.[1];
};

const playingRoomInfo = {
  id: 'TTT01',
  players: [
    { id: 'p1', name: 'Alice', connected: true },
    { id: 'p2', name: 'Bob', connected: true },
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

  describe('Board Rendering', () => {
    it('shows Create and Join buttons in waiting state', () => {
      render(<TicTacToe />, { wrapper: Wrapper });
      expect(screen.getByText('Create')).toBeTruthy();
      expect(screen.getByText('Join')).toBeTruthy();
    });

    it('renders the game board when playing', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      expect(screen.getByText('Your turn!')).toBeTruthy();
    });

    it('shows player names', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      expect(screen.getByText('Alice')).toBeTruthy();
      expect(screen.getByText('Bob')).toBeTruthy();
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
      const cells = within(boardGrid).getAllByRole('button');

      await act(async () => {
        fireEvent.click(cells[0]);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('ttt_makeMove', expect.objectContaining({ position: 0 }));
    });

    it('does not emit when it is not my turn', async () => {
      const { container } = render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb({ ...playingRoomInfo, currentTurn: 'p2' });
      });

      const boardGrid = container.querySelector('.grid.grid-cols-3');
      const cells = within(boardGrid).getAllByRole('button');

      await act(async () => {
        fireEvent.click(cells[0]);
      });

      expect(mockSocket.emit).not.toHaveBeenCalledWith('ttt_makeMove', expect.any(Object));
    });

    it('does not emit when cell is occupied', async () => {
      const { container } = render(<TicTacToe />, { wrapper: Wrapper });

      const board = Array(9).fill(null);
      board[0] = 'X';

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb({ ...playingRoomInfo, board });
      });

      const boardGrid = container.querySelector('.grid.grid-cols-3');
      const cells = within(boardGrid).getAllByRole('button');

      await act(async () => {
        fireEvent.click(cells[0]);
      });

      expect(mockSocket.emit).not.toHaveBeenCalledWith('ttt_makeMove', expect.any(Object));
    });
  });

  describe('Board Updates', () => {
    it('displays X and O after ttt_moveMade', async () => {
      const { container } = render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const moveMadeCb = findEventCb('ttt_moveMade');
      const updatedBoard = Array(9).fill(null);
      updatedBoard[0] = 'X';
      updatedBoard[4] = 'O';

      await act(async () => {
        moveMadeCb({ position: 0, symbol: 'X', board: updatedBoard });
      });

      const boardGrid = container.querySelector('.grid.grid-cols-3');
      expect(within(boardGrid).getByText('X')).toBeTruthy();

      await act(async () => {
        moveMadeCb({ position: 4, symbol: 'O', board: [...updatedBoard] });
      });

      expect(within(boardGrid).getByText('O')).toBeTruthy();
    });
  });

  describe('Game End', () => {
    it('shows Play Again button when game ends with win', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameWonCb = findEventCb('ttt_gameWon');
      await act(async () => {
        gameWonCb({ winner: 'p1', winningLine: [0, 1, 2] });
      });

      expect(screen.getByText('Play Again')).toBeTruthy();
    });

    it('shows Play Again button when game ends with draw', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameDrawCb = findEventCb('ttt_gameDraw');
      await act(async () => {
        gameDrawCb();
      });

      expect(screen.getByText('Play Again')).toBeTruthy();
    });

    it('emits ttt_restartGame when Play Again is clicked', async () => {
      render(<TicTacToe />, { wrapper: Wrapper });

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb(playingRoomInfo);
      });

      const gameWonCb = findEventCb('ttt_gameWon');
      await act(async () => {
        gameWonCb({ winner: 'p1', winningLine: [0, 1, 2] });
      });

      const playAgainBtn = screen.getByText('Play Again');
      await act(async () => {
        fireEvent.click(playAgainBtn);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('ttt_restartGame', expect.any(String));
    });

    it('clears board on ttt_gameRestarted', async () => {
      const { container } = render(<TicTacToe />, { wrapper: Wrapper });

      const boardWithMove = Array(9).fill(null);
      boardWithMove[0] = 'X';

      const cb = findEventCb('ttt_roomInfo');
      await act(async () => {
        cb({ ...playingRoomInfo, board: boardWithMove });
      });

      const boardGrid = container.querySelector('.grid.grid-cols-3');
      expect(within(boardGrid).getByText('X')).toBeTruthy();

      const restartCb = findEventCb('ttt_gameRestarted');
      await act(async () => {
        restartCb();
      });

      expect(within(boardGrid).queryByText('X')).toBeNull();
    });
  });
});

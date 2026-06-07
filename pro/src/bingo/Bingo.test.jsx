import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Bingo from './Bingo';
import { GameProvider } from '../context/GameContext';
import { ThemeProvider } from '../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

const mockSocket = {
  id: 'mock-id',
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

describe('Bingo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Board Rendering', () => {
    it('shows Create Room and Join Room buttons in waiting state', () => {
      render(<Bingo />, { wrapper: Wrapper });
      expect(screen.getByText('Create Room')).toBeTruthy();
      expect(screen.getByText('Join Room')).toBeTruthy();
    });

    it('renders 25 number cells when playing', async () => {
      render(<Bingo />, { wrapper: Wrapper });

      const cb = findEventCb('bingo_roomInfo');
      await act(async () => {
        cb({
          id: 'BINGO1',
          creator: 'mock-id',
          players: [
            { id: 'mock-id', name: 'Alice', connected: true },
            { id: 'bob-id', name: 'Bob', connected: true },
          ],
          gameState: 'playing',
          currentTurn: 'mock-id',
          turnOrder: ['mock-id', 'bob-id'],
        });
      });

      const buttons = screen.getAllByRole('button');
      const numberCells = buttons.filter((b) => {
        const n = parseInt(b.textContent);
        return n >= 1 && n <= 25;
      });
      expect(numberCells.length).toBe(25);
    });

    it('shows BINGO progress display', async () => {
      render(<Bingo />, { wrapper: Wrapper });

      const cb = findEventCb('bingo_roomInfo');
      await act(async () => {
        cb({
          id: 'BINGO1',
          creator: 'mock-id',
          players: [
            { id: 'mock-id', name: 'Alice', connected: true },
            { id: 'bob-id', name: 'Bob', connected: true },
          ],
          gameState: 'playing',
          currentTurn: 'mock-id',
          turnOrder: ['mock-id', 'bob-id'],
        });
      });

      for (const letter of 'BINGO') {
        expect(screen.getByText(letter)).toBeTruthy();
      }
    });
  });

  describe('Mark Numbers', () => {
    it('emits bingo_markNumber when a cell is clicked on my turn', async () => {
      render(<Bingo />, { wrapper: Wrapper });

      const cb = findEventCb('bingo_roomInfo');
      await act(async () => {
        cb({
          id: 'BINGO1',
          creator: 'mock-id',
          players: [
            { id: 'mock-id', name: 'Alice', connected: true },
            { id: 'bob-id', name: 'Bob', connected: true },
          ],
          gameState: 'playing',
          currentTurn: 'mock-id',
          turnOrder: ['mock-id', 'bob-id'],
        });
      });

      const buttons = screen.getAllByRole('button');
      const numberCell = buttons.find((b) => {
        const n = parseInt(b.textContent);
        return n >= 1 && n <= 25;
      });
      expect(numberCell).toBeDefined();
      const number = parseInt(numberCell.textContent);

      await act(async () => {
        fireEvent.click(numberCell);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith('bingo_markNumber', expect.objectContaining({ number }));
    });

    it('does not emit when it is not my turn', async () => {
      render(<Bingo />, { wrapper: Wrapper });

      const cb = findEventCb('bingo_roomInfo');
      await act(async () => {
        cb({
          id: 'BINGO1',
          creator: 'other-id',
          players: [
            { id: 'mock-id', name: 'Alice', connected: true },
            { id: 'bob-id', name: 'Bob', connected: true },
          ],
          gameState: 'playing',
          currentTurn: 'bob-id',
          turnOrder: ['mock-id', 'bob-id'],
        });
      });

      const buttons = screen.getAllByRole('button');
      const numberCell = buttons.find((b) => {
        const n = parseInt(b.textContent);
        return n >= 1 && n <= 25;
      });

      await act(async () => {
        fireEvent.click(numberCell);
      });

      expect(mockSocket.emit).not.toHaveBeenCalledWith('bingo_markNumber', expect.any(Object));
    });

    it('shows striked cells as stars after bingo_numberMarked', async () => {
      render(<Bingo />, { wrapper: Wrapper });

      const cb = findEventCb('bingo_roomInfo');
      await act(async () => {
        cb({
          id: 'BINGO1',
          creator: 'mock-id',
          players: [
            { id: 'mock-id', name: 'Alice', connected: true },
            { id: 'bob-id', name: 'Bob', connected: true },
          ],
          gameState: 'playing',
          currentTurn: 'mock-id',
          turnOrder: ['mock-id', 'bob-id'],
        });
      });

      const numberMarkedCb = findEventCb('bingo_numberMarked');
      await act(async () => {
        numberMarkedCb({
          number: 5,
          nextTurn: 'bob-id',
          strikedNumbers: [5],
        });
      });

      const stars = screen.getAllByText('★');
      expect(stars.length).toBeGreaterThanOrEqual(1);
    });
  });
});

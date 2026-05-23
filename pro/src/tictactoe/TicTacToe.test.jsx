import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicTacToe from './TicTacToe';
import { GameProvider } from '../context/GameContext';
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

const Wrapper = ({ children }) => (
  <GameProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </GameProvider>
);

describe('TicTacToe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('registers ttt socket event listeners on mount', () => {
    render(<TicTacToe />, { wrapper: Wrapper });
    const events = mockSocket.on.mock.calls.map((c) => c[0]);
    expect(events).toContain('ttt_roomInfo');
    expect(events).toContain('ttt_gameStarted');
    expect(events).toContain('ttt_gameWon');
    expect(events).toContain('ttt_gameDraw');
  });

  it('shows Create and Join buttons in waiting state', () => {
    render(<TicTacToe />, { wrapper: Wrapper });
    expect(screen.getByText('Create')).toBeTruthy();
    expect(screen.getByText('Join')).toBeTruthy();
  });

  it('emits ttt_createRoom when Create is clicked', async () => {
    render(<TicTacToe />, { wrapper: Wrapper });
    const btn = screen.getByText('Create');
    await act(async () => {
      btn.click();
    });
    expect(mockSocket.emit).toHaveBeenCalledWith('ttt_createRoom', expect.any(String));
  });

  it('shows board and players when ttt_roomInfo has game in playing state', async () => {
    render(<TicTacToe />, { wrapper: Wrapper });

    const roomInfoCb = mockSocket.on.mock.calls.find((c) => c[0] === 'ttt_roomInfo')?.[1];
    expect(roomInfoCb).toBeDefined();

    await act(async () => {
      roomInfoCb({
        id: 'TTT01',
        players: [
          { id: 'p1', name: 'Alice', connected: true },
          { id: 'p2', name: 'Bob', connected: true },
        ],
        gameState: 'playing',
        currentTurn: 0,
        board: Array(9).fill(null),
      });
    });

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });
});

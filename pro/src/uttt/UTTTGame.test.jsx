import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UTTTGame from './UTTTGame';
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
  <GameProvider><BrowserRouter>{children}</BrowserRouter></GameProvider>
);

const makeBoard = () => Array(9).fill(null).map(() => Array(9).fill(null));

describe('UTTTGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('registers uttt socket event listeners on mount', () => {
    render(<UTTTGame />, { wrapper: Wrapper });
    const events = mockSocket.on.mock.calls.map(c => c[0]);
    expect(events).toContain('uttt_roomInfo');
    expect(events).toContain('uttt_gameStarted');
    expect(events).toContain('uttt_gameOver');
  });

  it('shows Create Room and Join Room buttons in waiting state', () => {
    render(<UTTTGame />, { wrapper: Wrapper });
    expect(screen.getByText('Create Room')).toBeTruthy();
    expect(screen.getByText('Join Room')).toBeTruthy();
  });

  it('updates player list when uttt_roomInfo is received', async () => {
    render(<UTTTGame />, { wrapper: Wrapper });

    const roomInfoCb = mockSocket.on.mock.calls.find(c => c[0] === 'uttt_roomInfo')?.[1];
    expect(roomInfoCb).toBeDefined();

    await act(async () => {
      roomInfoCb({
        id: 'UTTT01',
        creator: 'mock-id',
        players: [
          { id: 'mock-id', name: 'Alice', connected: true },
          { id: 'bob-id', name: 'Bob', connected: true },
        ],
        gameState: 'waiting',
        currentTurn: null,
        board: makeBoard(),
        macroBoard: Array(9).fill(null),
        activeGrid: null,
        scores: { X: 0, O: 0 },
        lastMove: null,
      });
    });

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('emits uttt_createRoom when Create Room is clicked', async () => {
    render(<UTTTGame />, { wrapper: Wrapper });
    const btn = screen.getByText('Create Room');
    await act(async () => { btn.click(); });
    expect(mockSocket.emit).toHaveBeenCalledWith('uttt_createRoom', expect.any(String));
  });
});

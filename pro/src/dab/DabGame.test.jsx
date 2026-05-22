import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DabGame from './DabGame';
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
vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({ children }) => children({ zoomIn: vi.fn(), zoomOut: vi.fn(), resetTransform: vi.fn() }),
  TransformComponent: ({ children }) => children,
}));

const Wrapper = ({ children }) => (
  <GameProvider><BrowserRouter>{children}</BrowserRouter></GameProvider>
);

describe('DabGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('registers dab socket event listeners on mount', () => {
    render(<DabGame />, { wrapper: Wrapper });
    const events = mockSocket.on.mock.calls.map(c => c[0]);
    expect(events).toContain('dab_roomInfo');
    expect(events).toContain('dab_gameStarted');
    expect(events).toContain('dab_gameOver');
  });

  it('shows Create Room and Join Room buttons in waiting state', () => {
    render(<DabGame />, { wrapper: Wrapper });
    expect(screen.getByText('Create Room')).toBeTruthy();
    expect(screen.getByText('Join Room')).toBeTruthy();
  });

  it('updates player list when dab_roomInfo is received', async () => {
    render(<DabGame />, { wrapper: Wrapper });

    const roomInfoCb = mockSocket.on.mock.calls.find(c => c[0] === 'dab_roomInfo')?.[1];
    expect(roomInfoCb).toBeDefined();

    await act(async () => {
      roomInfoCb({
        id: 'DAB01',
        creator: 'mock-id',
        players: [
          { id: 'mock-id', name: 'Alice', connected: true },
          { id: 'bob-id', name: 'Bob', connected: true },
        ],
        gameState: 'waiting',
        currentTurn: 0,
        rows: 9, cols: 9,
        horizontalLines: [], verticalLines: [], boxes: [],
        scores: [0, 0],
        mode: 'classic',
      });
    });

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('emits dab_createRoom when Create Room is clicked', async () => {
    render(<DabGame />, { wrapper: Wrapper });
    const btn = screen.getByText('Create Room');
    await act(async () => { btn.click(); });
    expect(mockSocket.emit).toHaveBeenCalledWith('dab_createRoom', expect.any(Object));
  });
});

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Bingo from './Bingo';
import { GameProvider } from '../context/GameContext';
import { BrowserRouter } from 'react-router-dom';

// Mock Socket.io
const mockSocket = {
  id: 'mock-id',
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('socket.io-client', () => ({
  default: () => mockSocket
}));

describe('Bingo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('emits markNumber when a cell is clicked', async () => {
    render(
      <GameProvider>
        <BrowserRouter>
          <Bingo />
        </BrowserRouter>
      </GameProvider>
    );

    // Simulate being in a game and it being our turn
    const roomInfoCall = mockSocket.on.mock.calls.find(call => call[0] === 'bingo_roomInfo');
    if (!roomInfoCall) throw new Error('bingo_roomInfo listener not registered');
    
    const roomInfoCallback = roomInfoCall[1];
    
    await act(async () => {
      roomInfoCallback({
        id: '123456',
        creator: 'mock-id',
        players: [{ id: 'mock-id', name: 'Alice' }, { id: 'bob-id', name: 'Bob' }],
        gameState: 'playing',
        currentTurn: 'mock-id',
        turnOrder: ['mock-id', 'bob-id']
      });
    });

    // Find Bingo number cells - they're buttons with numeric text content
    const allButtons = screen.getAllByRole('button');
    const numberCell = allButtons.find(c => {
      const n = parseInt(c.textContent);
      return n >= 1 && n <= 25;
    });
    if (!numberCell) throw new Error('Bingo number cell not found');

    const number = parseInt(numberCell.textContent);

    await act(async () => {
      fireEvent.click(numberCell);
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('bingo_markNumber', expect.objectContaining({
      number: number
    }));
  });
});

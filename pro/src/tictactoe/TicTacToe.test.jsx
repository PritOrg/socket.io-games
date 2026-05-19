import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicTacToe from './TicTacToe';
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

describe('TicTacToe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('emits ttt_makeMove when a cell is clicked', async () => {
    render(
      <GameProvider>
        <BrowserRouter>
          <TicTacToe />
        </BrowserRouter>
      </GameProvider>
    );

    // Simulate being in a game and it being our turn
    const roomInfoCall = mockSocket.on.mock.calls.find(call => call[0] === 'ttt_roomInfo');
    if (!roomInfoCall) throw new Error('ttt_roomInfo listener not registered');
    
    const roomInfoCallback = roomInfoCall[1];
    
    await act(async () => {
      roomInfoCallback({
        id: '123456',
        players: [{ id: 'mock-id', name: 'Alice' }, { id: 'bob-id', name: 'Bob' }],
        gameState: 'playing',
        currentTurn: 'mock-id',
        board: Array(9).fill(null)
      });
    });

    const cells = screen.getAllByRole('button');
    // The first few buttons might be navigation, but the board cells have numbers or are empty
    // Our TicTacToe board uses <button> for cells.
    // Let's click the first cell.
    
    await act(async () => {
      fireEvent.click(cells[1]); // cells[0] is the Back button
    });

    expect(mockSocket.emit).toHaveBeenCalledWith('ttt_makeMove', expect.objectContaining({
      position: 0
    }));
  });
});

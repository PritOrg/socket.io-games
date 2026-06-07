import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameLayout from './GameLayout';
import { GameContext } from '../../context/GameContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { BrowserRouter } from 'react-router-dom';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

const mockSocket = { emit: vi.fn(), on: vi.fn(), off: vi.fn(), disconnect: vi.fn() };
const mockNavigate = vi.fn();
const mockClearRoomId = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const baseContextValue = {
  socket: mockSocket,
  roomId: 'ABC123',
  gamePrefix: 'ttt',
  clearRoomId: mockClearRoomId,
  setRoomId: vi.fn(),
  setGamePrefix: vi.fn(),
  leaveRoom: vi.fn(),
  clearReconnect: vi.fn(),
  playerName: 'Test',
  profile: { name: 'Test', avatarIcon: 'cat', color: '#2a2a3e' },
  setPlayerName: vi.fn(),
  setProfile: vi.fn(),
};

const renderLayout = (overrides = {}) =>
  render(
    <ThemeProvider>
      <BrowserRouter>
        <GameContext.Provider value={{ ...baseContextValue, ...overrides }}>
          <GameLayout>
            <div data-testid="game-content">Board</div>
          </GameLayout>
        </GameContext.Provider>
      </BrowserRouter>
    </ThemeProvider>,
  );

describe('GameLayout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders children in the canvas zone', () => {
    renderLayout();
    expect(screen.getByTestId('game-content')).toBeInTheDocument();
  });

  it('displays the roomId badge', () => {
    renderLayout();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('renders player avatars when players prop is provided', () => {
    renderLayout();
    const { rerender } = render(
      <ThemeProvider>
        <BrowserRouter>
          <GameContext.Provider value={{ ...baseContextValue }}>
            <GameLayout
              players={[
                { id: 'p1', name: 'Alice' },
                { id: 'p2', name: 'Bob' },
              ]}
            >
              <div data-testid="game-content">Board</div>
            </GameLayout>
          </GameContext.Provider>
        </BrowserRouter>
      </ThemeProvider>,
    );
    expect(screen.getByText('Al')).toBeInTheDocument();
    expect(screen.getByText('Bo')).toBeInTheDocument();
  });

  it('back button triggers leave confirmation', async () => {
    const Swal = (await import('sweetalert2')).default;
    renderLayout();
    const backBtn = screen.getByRole('button', { name: /back|leave/i });
    await act(async () => fireEvent.click(backBtn));
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('disconnects and navigates to / on confirmed leave', async () => {
    renderLayout();
    const backBtn = screen.getByRole('button', { name: /back|leave/i });
    await act(async () => fireEvent.click(backBtn));
    expect(mockSocket.emit).toHaveBeenCalledWith('ttt_leaveRoom', 'ABC123');
    expect(mockClearRoomId).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('copies roomId to clipboard when badge is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderLayout();
    await act(async () => fireEvent.click(screen.getByText('ABC123')));
    expect(writeText).toHaveBeenCalledWith('ABC123');
  });
});

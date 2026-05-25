import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameLayout from './GameLayout';
import { BrowserRouter } from 'react-router-dom';

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

const mockSocket = { emit: vi.fn(), disconnect: vi.fn() };
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderLayout = (props = {}) =>
  render(
    <BrowserRouter>
      <GameLayout socket={mockSocket} roomId="ABC123" gamePrefix="ttt" {...props}>
        <div data-testid="game-content">Board</div>
      </GameLayout>
    </BrowserRouter>,
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
    renderLayout({
      players: [
        { id: 'p1', name: 'Alice' },
        { id: 'p2', name: 'Bob' },
      ],
    });
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
    expect(mockSocket.disconnect).toHaveBeenCalled();
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

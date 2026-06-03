import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SOSGame from './SOSGame';

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connected: true,
  })),
}));

vi.mock('../context/GameContext', () => ({
  useGameContext: () => ({
    socket: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    playerName: 'TestPlayer',
    setPlayerName: vi.fn(),
    clearRoomId: vi.fn(),
    profile: { name: 'TestPlayer', avatarIcon: 'cat', color: '#2a2a3e' },
    setProfile: vi.fn(),
  }),
}));

vi.mock('use-sound', () => ({
  default: vi.fn(() => [vi.fn()]),
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('sweetalert2', () => ({
  fire: vi.fn(),
}));

describe('SOSGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders landing UI when not in room', () => {
    render(
      <MemoryRouter>
        <SOSGame />
      </MemoryRouter>,
    );
    expect(screen.getByText('SOS')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('has board size selector', () => {
    render(
      <MemoryRouter>
        <SOSGame />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Board Size/)).toBeInTheDocument();
  });
});

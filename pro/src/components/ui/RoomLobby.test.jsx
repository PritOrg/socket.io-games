import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RoomLobby from './RoomLobby';

const players2 = [
  { id: '1', name: 'Alice', connected: true },
  { id: '2', name: 'Bob', connected: true },
];

describe('RoomLobby', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('displays the room code', () => {
    render(<RoomLobby roomId="ABC123" players={[]} isHost={true} onLeave={vi.fn()} />);
    expect(screen.getByText('ABC123')).toBeTruthy();
  });

  it('shows "Waiting for players" when below minPlayers', () => {
    render(<RoomLobby roomId="X" players={[{ id: '1', name: 'Alice', connected: true }]} isHost={true} onLeave={vi.fn()} />);
    expect(screen.getByText(/Waiting for players/)).toBeTruthy();
  });

  it('shows "Ready to start!" when minPlayers met', () => {
    render(<RoomLobby roomId="X" players={players2} isHost={true} onLeave={vi.fn()} />);
    expect(screen.getByText('✅ Ready to start!')).toBeTruthy();
  });

  it('renders player names in checklist', () => {
    render(<RoomLobby roomId="X" players={players2} isHost={true} onLeave={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('shows Start Game button for host when ready', () => {
    render(<RoomLobby roomId="X" players={players2} isHost={true} onStart={vi.fn()} onLeave={vi.fn()} />);
    expect(screen.getByText('🚀 Start Game')).toBeTruthy();
  });

  it('calls onStart when Start Game is clicked', () => {
    const onStart = vi.fn();
    render(<RoomLobby roomId="X" players={players2} isHost={true} onStart={onStart} onLeave={vi.fn()} />);
    fireEvent.click(screen.getByText('🚀 Start Game'));
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('shows "Waiting for host" message for non-host', () => {
    render(<RoomLobby roomId="X" players={players2} isHost={false} onLeave={vi.fn()} />);
    expect(screen.getByText(/Waiting for host/)).toBeTruthy();
  });

  it('calls onLeave when Leave Room is clicked', () => {
    const onLeave = vi.fn();
    render(<RoomLobby roomId="X" players={[]} isHost={true} onLeave={onLeave} />);
    fireEvent.click(screen.getByText('Leave Room'));
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it('shows CountdownOverlay when showCountdown is true', () => {
    render(<RoomLobby roomId="X" players={players2} isHost={true} onLeave={vi.fn()} showCountdown={true} onCountdownComplete={vi.fn()} />);
    expect(screen.getByText('3')).toBeTruthy();
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useGameHandlers from './useGameHandlers';

const mockSocket = {
  emit: vi.fn(),
  disconnect: vi.fn(),
};

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}));

describe('useGameHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('handleCreateRoom emits <prefix>_createRoom with options', () => {
    const { result } = renderHook(() =>
      useGameHandlers(mockSocket, 'room1', 'ttt')
    );
    act(() => result.current.handleCreateRoom({ playerName: 'Alice' }));
    expect(mockSocket.emit).toHaveBeenCalledWith('ttt_createRoom', { playerName: 'Alice' });
  });

  it('handleJoinRoom emits <prefix>_joinRoom with options', () => {
    const { result } = renderHook(() =>
      useGameHandlers(mockSocket, 'room1', 'ttt')
    );
    act(() => result.current.handleJoinRoom({ roomId: 'ABC', playerName: 'Bob' }));
    expect(mockSocket.emit).toHaveBeenCalledWith('ttt_joinRoom', { roomId: 'ABC', playerName: 'Bob' });
  });

  it('handleStartGame emits <prefix>_startGame with roomId', () => {
    const { result } = renderHook(() =>
      useGameHandlers(mockSocket, 'room1', 'ttt')
    );
    act(() => result.current.handleStartGame());
    expect(mockSocket.emit).toHaveBeenCalledWith('ttt_startGame', 'room1');
  });

  it('handleLeaveRoom shows confirmation and disconnects on confirm', async () => {
    const { result } = renderHook(() =>
      useGameHandlers(mockSocket, 'room1', 'ttt')
    );
    await act(async () => {
      await result.current.handleLeaveRoom();
    });
    expect(mockSocket.disconnect).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handleLeaveRoom does nothing when user cancels', async () => {
    const Swal = (await import('sweetalert2')).default;
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    const { result } = renderHook(() =>
      useGameHandlers(mockSocket, 'room1', 'ttt')
    );
    await act(async () => {
      await result.current.handleLeaveRoom();
    });
    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not emit when socket is null', () => {
    const { result } = renderHook(() =>
      useGameHandlers(null, 'room1', 'ttt')
    );
    act(() => result.current.handleCreateRoom({ playerName: 'Alice' }));
    act(() => result.current.handleStartGame());
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});

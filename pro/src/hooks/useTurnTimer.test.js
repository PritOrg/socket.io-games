import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useTurnTimer from './useTurnTimer';

describe('useTurnTimer', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns full duration initially when isMyTurn is true', () => {
    const { result } = renderHook(() => useTurnTimer(true, 30, vi.fn()));
    expect(result.current).toBe(30);
  });

  it('returns full duration when isMyTurn is false', () => {
    const { result } = renderHook(() => useTurnTimer(false, 30, vi.fn()));
    expect(result.current).toBe(30);
  });

  it('counts down each second when isMyTurn is true', () => {
    const { result } = renderHook(() => useTurnTimer(true, 30, vi.fn()));
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current).toBe(27);
  });

  it('does not count down when isMyTurn is false', () => {
    const { result } = renderHook(() => useTurnTimer(false, 30, vi.fn()));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current).toBe(30);
  });

  it('calls onExpire when timer reaches 0', () => {
    const onExpire = vi.fn();
    renderHook(() => useTurnTimer(true, 3, onExpire));
    act(() => { vi.advanceTimersByTime(3000); });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('resets timer when isMyTurn changes to true', () => {
    const { result, rerender } = renderHook(
      ({ isMyTurn }) => useTurnTimer(isMyTurn, 10, vi.fn()),
      { initialProps: { isMyTurn: true } }
    );
    act(() => { vi.advanceTimersByTime(4000); });
    expect(result.current).toBe(6);

    rerender({ isMyTurn: false });
    rerender({ isMyTurn: true });
    expect(result.current).toBe(10);
  });
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import usePlayerAvatars from './usePlayerAvatars';

describe('usePlayerAvatars', () => {
  beforeEach(() => { sessionStorage.clear(); });

  it('returns default avatar and color on first use', () => {
    const { result } = renderHook(() => usePlayerAvatars());
    expect(result.current.avatar).toBe('🐼');
    expect(result.current.color).toBe('#2a2a3e');
  });

  it('persists avatar to sessionStorage when setAvatar is called', () => {
    const { result } = renderHook(() => usePlayerAvatars());
    act(() => { result.current.setAvatar('🦊'); });
    expect(result.current.avatar).toBe('🦊');
    const stored = JSON.parse(sessionStorage.getItem('player_avatar'));
    expect(stored.avatar).toBe('🦊');
  });

  it('persists color to sessionStorage when setColor is called', () => {
    const { result } = renderHook(() => usePlayerAvatars());
    act(() => { result.current.setColor('#ff0000'); });
    expect(result.current.color).toBe('#ff0000');
    const stored = JSON.parse(sessionStorage.getItem('player_avatar'));
    expect(stored.color).toBe('#ff0000');
  });

  it('restores avatar and color from sessionStorage on mount', () => {
    sessionStorage.setItem('player_avatar', JSON.stringify({ avatar: '🐯', color: '#123456' }));
    const { result } = renderHook(() => usePlayerAvatars());
    expect(result.current.avatar).toBe('🐯');
    expect(result.current.color).toBe('#123456');
  });

  it('exposes setAvatar and setColor functions', () => {
    const { result } = renderHook(() => usePlayerAvatars());
    expect(typeof result.current.setAvatar).toBe('function');
    expect(typeof result.current.setColor).toBe('function');
  });
});

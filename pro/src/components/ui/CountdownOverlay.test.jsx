import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CountdownOverlay from './CountdownOverlay';

describe('CountdownOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at 3', () => {
    render(<CountdownOverlay onComplete={vi.fn()} />);
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('counts down to 2 after 1 second', () => {
    render(<CountdownOverlay onComplete={vi.fn()} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('counts down to 1 after 2 seconds', () => {
    render(<CountdownOverlay onComplete={vi.fn()} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('calls onComplete and renders nothing after 3 ticks', () => {
    const onComplete = vi.fn();
    const { container } = render(<CountdownOverlay onComplete={onComplete} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });
});

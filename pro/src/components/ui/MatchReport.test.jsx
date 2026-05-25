import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MatchReport from './MatchReport';

describe('MatchReport', () => {
  it('shows "You Win!" when isWinner is true', () => {
    render(<MatchReport winner="Alice" isWinner={true} onRematch={vi.fn()} onNewRoom={vi.fn()} />);
    expect(screen.getByText('You Win!')).toBeTruthy();
  });

  it('shows winner name when isWinner is false', () => {
    render(<MatchReport winner="Bob" isWinner={false} onRematch={vi.fn()} onNewRoom={vi.fn()} />);
    expect(screen.getByText('Bob Wins!')).toBeTruthy();
  });

  it('shows stats when provided', () => {
    render(<MatchReport winner="Alice" isWinner={true} stats={{ moves: 12, time: '1m 23s' }} />);
    expect(screen.getByText('Moves: 12')).toBeTruthy();
    expect(screen.getByText('Time: 1m 23s')).toBeTruthy();
  });

  it('calls onRematch when Rematch is clicked', () => {
    const onRematch = vi.fn();
    render(<MatchReport winner="Alice" isWinner={true} onRematch={onRematch} />);
    fireEvent.click(screen.getByText('Rematch'));
    expect(onRematch).toHaveBeenCalledTimes(1);
  });

  it('calls onNewRoom when New Room is clicked', () => {
    const onNewRoom = vi.fn();
    render(<MatchReport winner="Alice" isWinner={false} onNewRoom={onNewRoom} />);
    fireEvent.click(screen.getByText('New Room'));
    expect(onNewRoom).toHaveBeenCalledTimes(1);
  });

  it('does not render Rematch button when onRematch is not provided', () => {
    render(<MatchReport winner="Alice" isWinner={true} />);
    expect(screen.queryByText('Rematch')).toBeNull();
  });
});

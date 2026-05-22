import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TurnIndicator from './TurnIndicator';

describe('TurnIndicator', () => {
  it('renders player avatar with initials', () => {
    render(<TurnIndicator playerName="Alice" isActive={true} />);
    expect(screen.getByText('Al')).toBeInTheDocument();
  });

  it('shows pulse animation when it is my turn', () => {
    render(<TurnIndicator playerName="Bob" isActive={true} isMyTurn={true} />);
    const avatar = screen.getByText('Bo');
    expect(avatar).toHaveClass('animate-pulse');
  });

  it('does not show pulse when not my turn', () => {
    render(<TurnIndicator playerName="Charlie" isActive={true} isMyTurn={false} />);
    const avatar = screen.getByText('Ch');
    expect(avatar).not.toHaveClass('animate-pulse');
  });

  it('dims when not active', () => {
    render(<TurnIndicator playerName="Dave" isActive={false} />);
    const avatar = screen.getByText('Da');
    expect(avatar).toHaveClass('opacity-50');
  });

  it('shows timer progress when turnTimer is provided', () => {
    render(<TurnIndicator playerName="Eve" isActive={true} turnTimer={15} />);
    const avatar = screen.getByText('Ev');
    expect(avatar).toHaveAttribute('data-timer', '0.5');
  });
});

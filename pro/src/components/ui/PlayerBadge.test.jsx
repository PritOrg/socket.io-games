import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PlayerBadge from './PlayerBadge';

describe('PlayerBadge', () => {
  it('renders player name', () => {
    render(<PlayerBadge player={{ name: 'Alice' }} index={0} isConnected={true} />);
    expect(screen.getByText(/Alice/)).toBeTruthy();
  });

  it('shows disconnected label when isConnected is false', () => {
    render(<PlayerBadge player={{ name: 'Bob' }} index={1} isConnected={false} />);
    expect(screen.getByText(/disconnected/)).toBeTruthy();
  });

  it('does not show disconnected label when connected', () => {
    render(<PlayerBadge player={{ name: 'Alice' }} index={0} isConnected={true} />);
    expect(screen.queryByText(/disconnected/)).toBeNull();
  });

  it('applies reduced opacity when disconnected', () => {
    const { container } = render(<PlayerBadge player={{ name: 'Bob' }} index={0} isConnected={false} />);
    expect(container.firstChild.style.opacity).toBe('0.4');
  });

  it('applies full opacity when connected', () => {
    const { container } = render(<PlayerBadge player={{ name: 'Alice' }} index={0} isConnected={true} />);
    expect(container.firstChild.style.opacity).toBe('1');
  });
});

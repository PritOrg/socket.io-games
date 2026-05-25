import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RetroButton from './RetroButton';

describe('RetroButton', () => {
  it('renders children and handles clicks', () => {
    const handleClick = vi.fn();
    render(<RetroButton onClick={handleClick}>Click Me</RetroButton>);

    const button = screen.getByText('Click Me');
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(
      <RetroButton onClick={handleClick} disabled>
        Disabled
      </RetroButton>,
    );

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

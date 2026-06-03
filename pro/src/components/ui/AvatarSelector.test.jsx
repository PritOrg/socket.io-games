import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import AvatarSelector from './AvatarSelector';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('lucide-react', () => ({
  Cat: () => <span data-testid="cat-icon">🐱</span>,
  Dog: () => <span data-testid="dog-icon">🐶</span>,
  Bird: () => <span data-testid="bird-icon">🐦</span>,
  Fish: () => <span data-testid="fish-icon">🐟</span>,
  Mouse: () => <span data-testid="monkey-icon">🐵</span>,
  PawPrint: () => <span data-testid="panda-icon">🐼</span>,
  Rabbit: () => <span data-testid="frog-icon">🐸</span>,
  Turtle: () => <span data-testid="tiger-icon">🐯</span>,
  Squirrel: () => <span data-testid="tiger-icon">🐯</span>,
}));

describe('AvatarSelector', () => {
  it('renders all 12 avatar icon options', () => {
    render(<AvatarSelector avatarIcon="cat" color="#2a2a3e" onAvatarChange={vi.fn()} onColorChange={vi.fn()} />);
    const avatarButtons = screen.getAllByRole('button');
    expect(avatarButtons.length).toBeGreaterThanOrEqual(12);
  });

  it('calls onAvatarChange with clicked avatar id', () => {
    const onAvatarChange = vi.fn();
    render(<AvatarSelector avatarIcon="cat" color="#2a2a3e" onAvatarChange={onAvatarChange} onColorChange={vi.fn()} />);
    const avatarButtons = screen.getAllByRole('button').slice(0, 12);
    fireEvent.click(avatarButtons[1]);
    expect(onAvatarChange).toHaveBeenCalledWith('dog');
  });

  it('calls onColorChange with clicked color', () => {
    const onColorChange = vi.fn();
    render(<AvatarSelector avatarIcon="cat" color="#2a2a3e" onAvatarChange={vi.fn()} onColorChange={onColorChange} />);
    const colorButtons = screen.getAllByRole('button').slice(12);
    fireEvent.click(colorButtons[1]);
    expect(onColorChange).toHaveBeenCalled();
  });

  it('highlights the selected avatar', () => {
    render(<AvatarSelector avatarIcon="frog" color="#2a2a3e" onAvatarChange={vi.fn()} onColorChange={vi.fn()} />);
    const avatarButtons = screen.getAllByRole('button');
    const frogButton = avatarButtons.find((b) => b.className.includes('border-ink'));
    expect(frogButton).toBeTruthy();
  });
});

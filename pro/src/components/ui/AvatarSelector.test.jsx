import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AvatarSelector from './AvatarSelector';

describe('AvatarSelector', () => {
  it('renders all 6 avatar options', () => {
    render(<AvatarSelector avatar="🐼" color="#2a2a3e" onAvatarChange={vi.fn()} onColorChange={vi.fn()} />);
    ['🐼', '🦊', '🐸', '🐙', '🦁', '🐧'].forEach((a) => {
      expect(screen.getByText(a)).toBeTruthy();
    });
  });

  it('calls onAvatarChange with clicked avatar', () => {
    const onAvatarChange = vi.fn();
    render(<AvatarSelector avatar="🐼" color="#2a2a3e" onAvatarChange={onAvatarChange} onColorChange={vi.fn()} />);
    fireEvent.click(screen.getByText('🦊'));
    expect(onAvatarChange).toHaveBeenCalledWith('🦊');
  });

  it('calls onColorChange with clicked color', () => {
    const onColorChange = vi.fn();
    render(<AvatarSelector avatar="🐼" color="#2a2a3e" onAvatarChange={vi.fn()} onColorChange={onColorChange} />);
    const colorBtns = screen.getAllByRole('button').filter(b => !b.textContent);
    fireEvent.click(colorBtns[1]);
    expect(onColorChange).toHaveBeenCalled();
  });

  it('highlights the selected avatar', () => {
    render(<AvatarSelector avatar="🐸" color="#2a2a3e" onAvatarChange={vi.fn()} onColorChange={vi.fn()} />);
    const frogBtn = screen.getByText('🐸');
    expect(frogBtn.className).toContain('border-ink');
  });
});

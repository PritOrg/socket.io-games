import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ModeSelector from './ModeSelector';

const defaults = { mode: 'classic', onModeChange: vi.fn(), customRows: 5, customCols: 5, onRowsChange: vi.fn(), onColsChange: vi.fn() };

describe('ModeSelector', () => {
  it('renders Classic and Custom buttons', () => {
    render(<ModeSelector {...defaults} />);
    expect(screen.getByText('Classic (9×9)')).toBeTruthy();
    expect(screen.getByText('Custom Size')).toBeTruthy();
  });

  it('calls onModeChange with "custom" when Custom is clicked', () => {
    const onModeChange = vi.fn();
    render(<ModeSelector {...defaults} onModeChange={onModeChange} />);
    fireEvent.click(screen.getByText('Custom Size'));
    expect(onModeChange).toHaveBeenCalledWith('custom');
  });

  it('calls onModeChange with "classic" when Classic is clicked', () => {
    const onModeChange = vi.fn();
    render(<ModeSelector {...defaults} onModeChange={onModeChange} />);
    fireEvent.click(screen.getByText('Classic (9×9)'));
    expect(onModeChange).toHaveBeenCalledWith('classic');
  });

  it('shows row/col sliders only in custom mode', () => {
    render(<ModeSelector {...defaults} mode="custom" />);
    expect(screen.getByText(/Rows:/)).toBeTruthy();
    expect(screen.getByText(/Columns:/)).toBeTruthy();
  });

  it('does not show sliders in classic mode', () => {
    render(<ModeSelector {...defaults} mode="classic" />);
    expect(screen.queryByText(/Rows:/)).toBeNull();
  });

  it('calls onRowsChange when row slider changes', () => {
    const onRowsChange = vi.fn();
    render(<ModeSelector {...defaults} mode="custom" onRowsChange={onRowsChange} />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '7' } });
    expect(onRowsChange).toHaveBeenCalledWith(7);
  });
});

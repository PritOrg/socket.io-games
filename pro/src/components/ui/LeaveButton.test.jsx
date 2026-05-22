import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LeaveButton from './LeaveButton';

vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));

describe('LeaveButton', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders a button', () => {
    render(<LeaveButton onLeave={vi.fn()} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('calls onLeave when confirmed', async () => {
    const onLeave = vi.fn();
    render(<LeaveButton onLeave={onLeave} />);
    await fireEvent.click(screen.getByRole('button'));
    await vi.waitFor(() => expect(onLeave).toHaveBeenCalledTimes(1));
  });

  it('does not call onLeave when cancelled', async () => {
    const Swal = (await import('sweetalert2')).default;
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    const onLeave = vi.fn();
    render(<LeaveButton onLeave={onLeave} />);
    await fireEvent.click(screen.getByRole('button'));
    await vi.waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(onLeave).not.toHaveBeenCalled();
  });
});

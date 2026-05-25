import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextInput from './TextInput';

describe('TextInput', () => {
  it('updates value on change', () => {
    const handleChange = vi.fn();
    render(<TextInput label="Name" value="" onChange={handleChange} />);

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'Bob' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders label and placeholder', () => {
    render(<TextInput label="Room ID" placeholder="Enter code" />);

    expect(screen.getByText('Room ID')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter code')).toBeDefined();
  });
});

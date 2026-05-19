import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaperPartyLanding from './PaperPartyLanding';
import { GameProvider } from '../context/GameContext';
import { BrowserRouter } from 'react-router-dom';

// Mock SweetAlert2
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true, value: 'Alice' })
  }
}));

describe('PaperPartyLanding', () => {
  it('renders game titles', () => {
    render(
      <GameProvider>
        <BrowserRouter>
          <PaperPartyLanding />
        </BrowserRouter>
      </GameProvider>
    );

    expect(screen.getByText('Bingo')).toBeDefined();
    expect(screen.getByText('Tic Tac Toe')).toBeDefined();
  });
});

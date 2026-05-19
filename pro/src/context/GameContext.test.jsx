import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameProvider, useGameContext } from './GameContext';

const TestComponent = () => {
  const { playerName, setPlayerName } = useGameContext();
  return (
    <div>
      <span data-testid="player-name">{playerName}</span>
      <button onClick={() => setPlayerName('Alice')}>Set Name</button>
    </div>
  );
};

describe('GameContext', () => {
  it('provides and updates playerName', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    const nameDisplay = screen.getByTestId('player-name');
    expect(nameDisplay.textContent).toBe('');

    const setButton = screen.getByText('Set Name');
    fireEvent.click(setButton);

    expect(nameDisplay.textContent).toBe('Alice');
  });
});

import React from 'react';

const TurnIndicator = ({ playerName, isActive, isMyTurn = false, turnTimer = null }) => {
  const initials = playerName.slice(0, 2);
  const timerProgress = turnTimer !== null ? turnTimer / 30 : null;

  return (
    <div
      className={`
        flex items-center justify-center w-12 h-12 rounded-full bg-ink text-paper
        font-sketch text-sm
        ${isActive ? 'opacity-100' : 'opacity-50'}
        ${isMyTurn ? 'animate-pulse ring-2 ring-ink/20' : ''}
      `}
      data-timer={timerProgress}
    >
      {initials}
    </div>
  );
};

export default TurnIndicator;

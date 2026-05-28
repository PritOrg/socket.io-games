import React from 'react';

const PlayerAvatar = ({ playerName, isActive, isMyTurn, turnTimer, isCurrentPlayer = false }) => {
  if (!playerName) return null;
  const initials = playerName.slice(0, 2);
  const timerProgress = turnTimer !== null ? turnTimer / 30 : undefined;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          flex items-center justify-center w-12 h-12 rounded-full bg-ink text-paper
          font-sketch text-sm
          ${isActive ? 'opacity-100' : 'opacity-50'}
          ${isMyTurn ? 'animate-pulse ring-2 ring-ink/20' : ''}
          ${isCurrentPlayer && !isMyTurn ? 'ring-2 ring-yellow-400' : ''}
        `}
        data-timer={timerProgress}
      >
        {initials}
      </div>
      <span className="paper-font text-xs text-ink/80">{playerName}</span>
      {isCurrentPlayer && <span className="paper-font text-xs text-yellow-600">(You)</span>}
    </div>
  );
};

const TurnIndicator = ({ playerName, isActive, isMyTurn, turnTimer, players, currentTurn }) => {
  if (players && Array.isArray(players)) {
    return (
      <div className="flex gap-2">
        {players.map((player, index) => {
          const isActiveTurn = typeof currentTurn === 'number' ? index === currentTurn : player.id === currentTurn;
          return (
            <PlayerAvatar
              key={player.id}
              playerName={player.name}
              isActive={isActiveTurn}
              isMyTurn={isActiveTurn}
              isCurrentPlayer={isActiveTurn}
            />
          );
        })}
      </div>
    );
  }

  return <PlayerAvatar playerName={playerName} isActive={isActive} isMyTurn={isMyTurn} turnTimer={turnTimer} />;
};

export default TurnIndicator;

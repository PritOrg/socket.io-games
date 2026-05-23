import React from 'react';

const PLAYER_COLORS = ['#1a1a2e', '#c73e1d', '#2d4a8f', '#2f5233'];

const PlayerBadge = ({ player, index, isConnected }) => {
  return (
    <div
      className="player-badge"
      style={{
        color: PLAYER_COLORS[index] || PLAYER_COLORS[0],
        opacity: isConnected ? 1 : 0.4,
      }}
    >
      {player.name} {!isConnected && '(disconnected)'}
    </div>
  );
};

export default PlayerBadge;

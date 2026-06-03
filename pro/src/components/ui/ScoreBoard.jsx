import React from 'react';
import { Trophy } from 'lucide-react';
import { PlayerAvatar } from './AvatarSelector';

const PLAYER_COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233', '#7b2d8f', '#b5651d'];

const ScoreBoard = ({ players, scores, currentTurn, myPlayerIndex, lastMove, orientation = 'horizontal' }) => {
  if (!players || players.length === 0) return null;

  const containerClass = orientation === 'vertical' ? 'flex flex-col gap-3' : 'flex gap-3';

  // Normalize scores to array format if object (X/O) format
  const normalizedScores = Array.isArray(scores)
    ? scores
    : players.map((_, idx) => {
        if (scores && typeof scores === 'object') {
          if (idx === 0 && scores.X !== undefined) return scores.X;
          if (idx === 1 && scores.O !== undefined) return scores.O;
        }
        return scores?.[idx] || 0;
      });

  return (
    <div className={`sketch-card p-4 ${containerClass}`}>
      {players.map((p, idx) => {
        const isCurrentTurn = currentTurn === p.id;
        const isLastMovePlayer = lastMove && lastMove.playerIndex === idx;
        const playerColor = p.color || PLAYER_COLORS[idx % PLAYER_COLORS.length];

        return (
          <div
            key={p.id}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              isCurrentTurn ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''
            }`}
            style={{ transform: isCurrentTurn ? 'scale(1.03)' : undefined }}
          >
            <PlayerAvatar avatarIcon={p.avatarIcon || 'cat'} color={playerColor} size={20} />
            <span className="font-handwriting text-sm text-ink flex-1 truncate">
              {p.name}
              {idx === myPlayerIndex && <span className="text-xs ml-1 opacity-60">(You)</span>}
            </span>
            {normalizedScores && (
              <span className="font-sketch text-lg font-bold" style={{ color: playerColor }}>
                {normalizedScores[idx] || 0}
              </span>
            )}
            {isCurrentTurn && <Trophy size={16} className="text-yellow-500 animate-pulse" />}
            {isLastMovePlayer && !isCurrentTurn && (
              <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScoreBoard;

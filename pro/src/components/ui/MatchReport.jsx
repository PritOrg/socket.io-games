import React from 'react';
import { Trophy } from 'lucide-react';
import SketchButton from './SketchButton';
import SketchCard from './SketchCard';

const MatchReport = ({ winner, isWinner, stats = {}, onRematch, onNewRoom }) => {
  return (
    <SketchCard className="p-6 max-w-sm w-full text-center">
      <div className="text-4xl mb-2">{isWinner ? '🏆' : '😔'}</div>
      <h2 className="text-2xl font-sketch mb-1 text-ink">
        {isWinner ? 'You Win!' : `${winner} Wins!`}
      </h2>
      {(stats.moves || stats.time) && (
        <div className="text-sm font-handwriting text-ink/70 mb-4 space-y-1">
          {stats.moves && <div>Moves: {stats.moves}</div>}
          {stats.time && <div>Time: {stats.time}</div>}
        </div>
      )}
      <div className="flex gap-3 justify-center mt-4">
        {onRematch && (
          <SketchButton onClick={onRematch}>Rematch</SketchButton>
        )}
        {onNewRoom && (
          <SketchButton onClick={onNewRoom}>New Room</SketchButton>
        )}
      </div>
    </SketchCard>
  );
};

export default MatchReport;

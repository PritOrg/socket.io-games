import React from 'react';
import { Trophy, Frown, Award } from 'lucide-react';
import SketchButton from './SketchButton';
import SketchCard from './SketchCard';

const MatchReport = ({ winner, isWinner, stats = {}, scores, onRematch, onNewRoom, players = [] }) => {
  const getScoreDisplay = () => {
    if (!scores) return null;

    const p1Score = scores[0] || 0;
    const p2Score = scores[1] || 0;
    const p1Name = players[0]?.name || 'Player 1';
    const p2Name = players[1]?.name || 'Player 2';

    return (
      <div className="flex justify-center items-center gap-6 mb-4">
        <div className="flex flex-col items-center">
          <span className="paper-font text-sm text-ink/70">{p1Name}</span>
          <span className={`font-sketch text-3xl ${p1Score > p2Score ? 'text-yellow-600' : ''}`}>{p1Score}</span>
        </div>
        <Award size={24} className="text-ink/50" />
        <div className="flex flex-col items-center">
          <span className="paper-font text-sm text-ink/70">{p2Name}</span>
          <span className={`font-sketch text-3xl ${p2Score > p1Score ? 'text-yellow-600' : ''}`}>{p2Score}</span>
        </div>
      </div>
    );
  };

  const getWinnerDisplay = () => {
    if (scores) {
      const p1Score = scores[0] || 0;
      const p2Score = scores[1] || 0;
      if (p1Score === p2Score) {
        return <h2 className="text-2xl font-sketch mb-1 text-ink">It&apos;s a Tie!</h2>;
      }
      const winnerName = p1Score > p2Score ? players[0]?.name || 'Player 1' : players[1]?.name || 'Player 2';
      return (
        <>
          <div className="flex justify-center mb-2">
            <Trophy size={40} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-sketch mb-1 text-ink">{winnerName} Wins!</h2>
        </>
      );
    }

    if (!winner) {
      return (
        <>
          <div className="flex justify-center mb-2">
            <Frown size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-sketch mb-1 text-ink">It&apos;s a Tie!</h2>
        </>
      );
    }

    if (isWinner) {
      return (
        <>
          <div className="flex justify-center mb-2">
            <Trophy size={40} className="text-yellow-500" />
          </div>
          <h2 className="text-2xl font-sketch mb-1 text-ink">You Win!</h2>
        </>
      );
    }

    return (
      <>
        <div className="flex justify-center mb-2">
          <Trophy size={40} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-sketch mb-1 text-ink">{winner} Wins!</h2>
      </>
    );
  };

  return (
    <SketchCard className="p-6 max-w-sm w-full text-center">
      {getScoreDisplay()}
      {getWinnerDisplay()}
      {(stats.moves || stats.time) && (
        <div className="text-sm font-handwriting text-ink/70 mb-4 space-y-1">
          {stats.moves && <div>Moves: {stats.moves}</div>}
          {stats.time && <div>Time: {stats.time}</div>}
        </div>
      )}
      <div className="flex gap-3 justify-center mt-4">
        {onRematch && <SketchButton onClick={onRematch}>Rematch</SketchButton>}
        {onNewRoom && <SketchButton onClick={onNewRoom}>New Room</SketchButton>}
      </div>
    </SketchCard>
  );
};

export default MatchReport;

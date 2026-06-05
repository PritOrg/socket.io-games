import React from 'react';
import { Trophy, Frown, Award, Users } from 'lucide-react';
import SketchButton from './SketchButton';
import SketchCard from './SketchCard';

const normalizeScores = (scores, players = []) => {
  if (!scores) return [];
  if (Array.isArray(scores)) {
    return scores.map((score, idx) => {
      const raw = score;
      let value = typeof raw === 'number' ? raw : (raw?.value ?? raw?.score ?? 0);
      const name = (typeof raw === 'object' && raw?.name) || players[idx]?.name || `Player ${idx + 1}`;
      return { name, score: value };
    });
  }
  return Object.entries(scores).map(([name, value], idx) => ({
    name,
    score: typeof value === 'number' ? value : (value?.value ?? 0),
    ...(players[idx] ? { profileName: players[idx].name } : {}),
  }));
};

const MatchReport = ({ winner, isWinner, stats = {}, scores, onRematch, onNewRoom, players = [] }) => {
  const scoreList = normalizeScores(scores, players);

  const getScoreDisplay = () => {
    if (!scoreList.length) return null;

    if (scoreList.length === 2) {
      const [p1, p2] = scoreList;
      return (
        <div className="flex justify-center items-center gap-6 mb-4">
          <div className="flex flex-col items-center">
            <span className="paper-font text-sm text-ink/70">{p1.name}</span>
            <span className={`font-sketch text-3xl ${p1.score > p2.score ? 'text-yellow-600' : ''}`}>{p1.score}</span>
          </div>
          <Award size={24} className="text-ink/50" />
          <div className="flex flex-col items-center">
            <span className="paper-font text-sm text-ink/70">{p2.name}</span>
            <span className={`font-sketch text-3xl ${p2.score > p1.score ? 'text-yellow-600' : ''}`}>{p2.score}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-center gap-2 text-ink/70 mb-1">
          <Users size={18} />
          <span className="paper-font text-sm">Standings</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 justify-items-center">
          {scoreList.map((entry, idx) => {
            const maxScore = Math.max(...scoreList.map((item) => item.score));
            const isTop = scoreList.length > 1 && entry.score === maxScore;
            return (
              <div
                key={`${entry.name}-${idx}`}
                className={`flex flex-col items-center p-2 rounded-lg border-2 ${
                  isTop ? 'border-yellow-400/70 bg-yellow-50/60' : 'border-gray-200/70 bg-white/60'
                }`}
              >
                <span className="paper-font text-xs text-ink/70 truncate max-w-[7rem]">{entry.name}</span>
                <span className={`font-sketch text-3xl ${isTop ? 'text-yellow-700' : ''}`}>{entry.score}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getWinnerDisplay = () => {
    if (!winner && !isWinner && scoreList.length > 1) {
      const topScore = Math.max(...scoreList.map((item) => item.score));
      const winners = scoreList.filter((item) => item.score === topScore);
      if (winners.length > 1) {
        return (
          <>
            <div className="flex justify-center mb-2">
              <Frown size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-sketch mb-1 text-ink">It&apos;s a Tie!</h2>
            <p className="paper-font text-sm text-ink/70">{winners.map((w) => w.name).join(' & ')}</p>
          </>
        );
      }
    }

    if (scores && scoreList.length > 1) {
      const topScore = Math.max(...scoreList.map((item) => item.score));
      const winnerEntry = scoreList.find((item) => item.score === topScore);
      if (winnerEntry) {
        const displayName = winnerEntry.profileName || winnerEntry.name;
        return (
          <>
            <div className="flex justify-center mb-2">
              <Trophy size={40} className="text-yellow-500" />
            </div>
            <h2 className="text-2xl font-sketch mb-1 text-ink">{displayName} Wins!</h2>
          </>
        );
      }
    }

    if (!winner && !isWinner) {
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

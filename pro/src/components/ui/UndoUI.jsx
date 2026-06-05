import React, { useState, useEffect } from 'react';
import SketchButton from './SketchButton';
import SketchCard from './SketchCard';

const UndoUI = ({ requesterId, players = [], currentTurn, myPlayerIndex, onRequest, onAllow, onDeny }) => {
  const requester = players.find((p) => p.id === requesterId);
  const requesterName = requester?.name || 'Someone';
  const [timeRemaining, setTimeRemaining] = useState(15);

  useEffect(() => {
    if (!requesterId) {
      setTimeRemaining(0);
      return;
    }
    setTimeRemaining(15);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [requesterId]);

  if (!requesterId) return null;

  const isTargetPlayer = myPlayerIndex === currentTurn;
  const progressPercent = (timeRemaining / 15) * 100;

  return (
    <SketchCard className="p-4 bg-yellow-50">
      <p className="font-handwriting text-ink mb-3">
        <span className="font-bold">{requesterName}</span> wants to undo the last move
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
      </div>
      {isTargetPlayer && (
        <div className="flex gap-2">
          <SketchButton onClick={onAllow} className="flex-1 bg-green-50">
            Allow
          </SketchButton>
          <SketchButton onClick={onDeny} className="flex-1 bg-red-50">
            Deny
          </SketchButton>
        </div>
      )}
    </SketchCard>
  );
};

export default UndoUI;

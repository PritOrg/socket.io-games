import React, { useState, useEffect } from 'react';
import SketchButton from './SketchButton';
import CountdownOverlay from './CountdownOverlay';

const RoomLobby = ({
  roomId,
  players = [],
  isHost,
  minPlayers = 2,
  onStart,
  onLeave,
  gameName = 'Game',
  showCountdown = false,
  onCountdownComplete,
}) => {
  const [dots, setDots] = useState('');
  const [shareSupported] = useState(() => !!navigator.share);

  // Animated "Waiting..." dots
  useEffect(() => {
    if (players.length >= minPlayers) return;
    const id = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(id);
  }, [players.length, minPlayers]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Join my ${gameName} room!`,
        text: `Use room code: ${roomId}`,
        url: window.location.href,
      });
    } catch {
      // user cancelled or not supported
    }
  };

  const canStart = players.length >= minPlayers;

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      {showCountdown && <CountdownOverlay onComplete={onCountdownComplete} />}

      <div className="sketch-card p-8 max-w-sm w-full space-y-6">
        {/* Room ID */}
        <div className="text-center">
          <p className="text-sm text-ink/60 paper-font">Room Code</p>
          <p className="text-3xl font-sketch text-ink tracking-widest">{roomId}</p>
        </div>

        {/* Animated status banner */}
        <div
          className="sketch-border text-center py-3"
          style={{ animation: canStart ? 'none' : 'sketch-wiggle 2s ease-in-out infinite' }}
        >
          {canStart ? (
            <span className="paper-font text-green-700 font-semibold">✅ Ready to start!</span>
          ) : (
            <span className="paper-font text-ink/70">Waiting for players{dots}</span>
          )}
        </div>

        {/* Player ready checklist */}
        <div className="space-y-2">
          <p className="paper-font text-sm text-ink/60">
            Players ({players.length}/{minPlayers} min)
          </p>
          {players.map((p, i) => (
            <div
              key={p.id || i}
              className="flex items-center gap-2 player-badge"
              style={{ transform: 'none', border: 'none', padding: '0.25rem 0' }}
            >
              <span className="text-lg">{p.connected !== false ? '☑️' : '☐'}</span>
              <span className="paper-font text-ink">{p.name}</span>
              {i === 0 && <span className="text-xs text-ink/50 ml-auto paper-font">host</span>}
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, minPlayers - players.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex items-center gap-2" style={{ opacity: 0.4 }}>
              <span className="text-lg">☐</span>
              <span className="paper-font text-ink/50">Waiting...</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Web Share API invite */}
          {shareSupported && (
            <SketchButton onClick={handleShare} className="w-full">
              📤 Invite Friends
            </SketchButton>
          )}

          {isHost && (
            <SketchButton
              onClick={onStart}
              disabled={!canStart}
              className="w-full"
              style={{ opacity: canStart ? 1 : 0.5, cursor: canStart ? 'pointer' : 'not-allowed' }}
            >
              {canStart ? '🚀 Start Game' : `Need ${minPlayers - players.length} more player(s)`}
            </SketchButton>
          )}

          {!isHost && <p className="paper-font text-center text-sm text-ink/50">Waiting for host to start…</p>}

          <SketchButton onClick={onLeave} className="w-full" style={{ background: '#fff0f0' }}>
            Leave Room
          </SketchButton>
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;

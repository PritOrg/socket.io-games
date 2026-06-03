import React from 'react';
import { Users, Copy, Share2 } from 'lucide-react';
import { SketchButton, PlayerAvatar } from './index';

const WaitingLobby = ({ roomId, players, isHost, minPlayers, onStart, onLeave, onProfileChange, gameSettings }) => {
  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join my game room!',
        text: `Use room code: ${roomId}`,
        url: window.location.href,
      });
    }
  };

  const canStart = players.length >= minPlayers;

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="sketch-card p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <p className="text-sm font-handwriting text-ink/60">Room Code</p>
          <p className="text-3xl font-sketch text-ink tracking-widest">{roomId}</p>
          <div className="flex gap-2 justify-center mt-2">
            <button onClick={handleCopyRoomId} className="sketch-button px-3 py-1 text-xs flex items-center gap-1">
              <Copy size={14} /> Copy
            </button>
            {navigator.share && (
              <button onClick={handleShare} className="sketch-button px-3 py-1 text-xs flex items-center gap-1">
                <Share2 size={14} /> Share
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-handwriting text-ink flex items-center gap-2">
            <Users size={18} /> Players ({players.length}/{minPlayers} min)
          </span>
          {isHost && <span className="sketch-button text-xs px-2 py-1 bg-green-50">Host</span>}
        </div>

        <div className="space-y-2">
          {players.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 sketch-border px-3 py-2">
              <PlayerAvatar avatarIcon={p.avatarIcon} color={p.color} size={24} />
              <span className="font-handwriting text-ink flex-1 truncate">{p.name}</span>
              {p.connected !== false ? (
                <span className="text-green-600 text-xs">✓</span>
              ) : (
                <span className="text-red-500 text-xs">disconnected</span>
              )}
            </div>
          ))}
        </div>

        {gameSettings && <div className="sketch-border p-4">{gameSettings}</div>}

        {isHost && (
          <SketchButton onClick={onStart} disabled={!canStart} className="w-full">
            {canStart ? 'Start Game' : `Need ${minPlayers - players.length} more player(s)`}
          </SketchButton>
        )}

        {!isHost && <p className="text-center font-handwriting text-sm text-ink/60">Waiting for host to start...</p>}

        <SketchButton onClick={onLeave} className="w-full" style={{ background: '#fff0f0' }}>
          Leave Room
        </SketchButton>
      </div>
    </div>
  );
};

export default WaitingLobby;

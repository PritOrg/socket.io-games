import React, { useState, useEffect } from 'react';
import { ThumbsUp, Sparkles, Flame, Heart, Zap, PartyPopper } from 'lucide-react';
import { PlayerAvatar } from './AvatarSelector';

const REACTION_ICONS = [
  { id: 'thumbsup', Icon: ThumbsUp, label: 'Like' },
  { id: 'sparkles', Icon: Sparkles, label: 'Nice' },
  { id: 'flame', Icon: Flame, label: 'Fire' },
  { id: 'heart', Icon: Heart, label: 'Love' },
  { id: 'zap', Icon: Zap, label: 'Wow' },
  { id: 'party', Icon: PartyPopper, label: 'Party' },
];

const AvatarReactionBar = ({ socket, roomId, gamePrefix, players }) => {
  const [visible, setVisible] = useState(false);
  const [recentReactions, setRecentReactions] = useState([]);
  const [myProfile, setMyProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('playerProfile');
    if (saved) {
      setMyProfile(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      const player = players.find((p) => p.id === data.playerId);
      setRecentReactions((prev) => [
        ...prev,
        { ...data, playerName: player?.name || 'Someone', avatarIcon: player?.avatarIcon, color: player?.color },
      ]);
    };

    socket.on(`${gamePrefix}_reaction`, handler);
    return () => socket.off(`${gamePrefix}_reaction`, handler);
  }, [socket, gamePrefix, players]);

  useEffect(() => {
    if (recentReactions.length === 0) return;

    const timer = setTimeout(() => {
      setRecentReactions((prev) => prev.slice(1));
    }, 3000);

    return () => clearTimeout(timer);
  }, [recentReactions]);

  const handleReaction = (reactionId) => {
    if (!socket || !roomId) return;
    socket.emit('game_reaction', { roomId, reaction: reactionId, gamePrefix });
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onTouchStart={() => setVisible(true)}
    >
      <div
        className={`sketch-card p-2 flex gap-1 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'}`}
      >
        {REACTION_ICONS.map((r) => (
          <button
            key={r.id}
            onClick={() => handleReaction(r.id)}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
            title={r.label}
          >
            <r.Icon size={18} className="text-ink" />
          </button>
        ))}
      </div>

      {/* Recent reactions popups */}
      <div className="absolute bottom-full left-0 flex flex-col gap-2 mb-2">
        {recentReactions.map((r, i) => {
          const ReactionIcon = REACTION_ICONS.find((icon) => icon.id === r.reaction)?.Icon;
          return (
            <div
              key={i}
              className="sketch-card px-3 py-1 rounded-full animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center gap-2">
                {r.avatarIcon && r.color ? <PlayerAvatar avatarIcon={r.avatarIcon} color={r.color} size={16} /> : null}
                <span className="font-handwriting text-xs text-ink">{r.playerName}</span>
                {ReactionIcon && <ReactionIcon size={14} className="text-ink" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarReactionBar;

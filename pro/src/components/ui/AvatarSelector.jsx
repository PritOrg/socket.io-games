import React from 'react';

const AVATARS = ['🐼', '🦊', '🐸', '🐙', '🦁', '🐧'];
const COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233', '#7b2d8f', '#b5651d'];

const AvatarSelector = ({ avatar, color, onAvatarChange, onColorChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center flex-wrap">
        {AVATARS.map((a) => (
          <button
            key={a}
            onClick={() => onAvatarChange(a)}
            className={`text-2xl w-10 h-10 rounded-full border-2 transition-all
              ${avatar === a ? 'border-ink scale-110' : 'border-transparent hover:border-ink/40'}`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-center">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onColorChange(c)}
            style={{ background: c }}
            className={`w-6 h-6 rounded-full border-2 transition-all
              ${color === c ? 'border-ink scale-110' : 'border-transparent'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;

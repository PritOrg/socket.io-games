import React from 'react';
import { Cat, Dog, Bird, Fish, PawPrint, Mouse, Rabbit, Turtle, Squirrel } from 'lucide-react';

const AVATAR_ICON_MAP = {
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  monkey: Mouse,
  panda: PawPrint,
  frog: Rabbit,
  tiger: Squirrel,
  lion: Cat,
  bear: Dog,
  koala: Fish,
  fox: Turtle,
};

const AVATAR_IDS = Object.keys(AVATAR_ICON_MAP);

const COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233', '#7b2d8f', '#b5651d'];

const AvatarSelector = ({ avatarIcon, color, onAvatarChange, onColorChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-center flex-wrap">
        {AVATAR_IDS.map((id) => {
          const Icon = AVATAR_ICON_MAP[id];
          return (
            <button
              key={id}
              onClick={() => onAvatarChange(id)}
              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                ${avatarIcon === id ? 'border-ink scale-110' : 'border-transparent hover:border-ink/40'}`}
              style={{ backgroundColor: color }}
            >
              <Icon size={20} className="text-white/90" />
            </button>
          );
        })}
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

export const PlayerAvatar = ({ avatarIcon, color, size = 20 }) => {
  const Icon = AVATAR_ICON_MAP[avatarIcon] || Cat;

  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ backgroundColor: color, width: size, height: size }}
    >
      <Icon size={size * 0.7} className="text-white/90" />
    </div>
  );
};

import React from 'react';
import { SketchButton, SketchCard, AvatarSelector } from '.';

const RoomActionButtons = ({ onCreateRoom, onJoinRoom, profile, onProfileChange, children }) => {
  const { name, avatarIcon, color } = profile;

  return (
    <div className="flex flex-col items-center gap-4">
      <SketchCard className="p-6 max-w-md w-full">
        <AvatarSelector
          avatarIcon={avatarIcon}
          color={color}
          onAvatarChange={(icon) => onProfileChange({ ...profile, avatarIcon: icon })}
          onColorChange={(c) => onProfileChange({ ...profile, color: c })}
        />
      </SketchCard>

      <SketchCard className="p-8 max-w-md w-full">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => onProfileChange({ ...profile, name: e.target.value })}
            placeholder="Enter your name"
            className="flex-1 sketch-border font-handwriting text-ink px-3 py-2 rounded"
          />
        </div>

        <div className="flex gap-4">
          <SketchButton onClick={onCreateRoom} className="flex-1">
            Create Room
          </SketchButton>
          <SketchButton onClick={onJoinRoom} className="flex-1">
            Join Room
          </SketchButton>
        </div>

        {children && <div className="mt-4">{children}</div>}
      </SketchCard>
    </div>
  );
};

export default RoomActionButtons;

import React, { useCallback } from 'react';
import { SketchButton, SketchCard, sketchPopupClass, AvatarSelector } from '../components/ui';
import Swal from 'sweetalert2';

const DabPreGame = ({
  profile,
  setProfile,
  mode,
  setMode,
  customRows,
  setCustomRows,
  customCols,
  setCustomCols,
  onStart,
  onJoin,
}) => {
  const sizeMap = { classic: 9, extended: 14, marathon: 19 };
  const gameRows = mode === 'custom' ? customRows : sizeMap[mode] || 9;
  const gameCols = mode === 'custom' ? customCols : sizeMap[mode] || 9;

  const handleStart = useCallback(() => {
    onStart({ rows: gameRows, cols: gameCols });
  }, [gameRows, gameCols, onStart]);

  const handleJoin = useCallback(async () => {
    const { value: joinRoomId } = await Swal.fire({
      title: 'Join DAB Room',
      input: 'text',
      inputPlaceholder: 'Enter Room ID',
      showCancelButton: true,
      customClass: { popup: sketchPopupClass },
    });
    if (joinRoomId) onJoin(joinRoomId.trim().toUpperCase());
  }, [onJoin]);

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <SketchCard className="p-6 max-w-md w-full mb-4">
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your name"
          className="w-full sketch-border font-handwriting text-ink px-3 py-2 rounded mb-4"
        />
        <AvatarSelector
          avatarIcon={profile.avatarIcon}
          color={profile.color}
          onAvatarChange={(icon) => setProfile((prev) => ({ ...prev, avatarIcon: icon }))}
          onColorChange={(color) => setProfile((prev) => ({ ...prev, color }))}
        />
      </SketchCard>

      <SketchCard className="p-8 max-w-md w-full space-y-4">
        <div>
          <p className="paper-font text-sm text-ink/60 mb-2">Game Mode</p>
          <div className="grid grid-cols-3 gap-2">
            <SketchButton onClick={() => setMode('classic')} className={mode === 'classic' ? 'bg-ink text-white' : ''}>
              Classic
            </SketchButton>
            <SketchButton
              onClick={() => setMode('extended')}
              className={mode === 'extended' ? 'bg-ink text-white' : ''}
            >
              Extended
            </SketchButton>
            <SketchButton
              onClick={() => setMode('marathon')}
              className={mode === 'marathon' ? 'bg-ink text-white' : ''}
            >
              Marathon
            </SketchButton>
          </div>
          <SketchButton
            onClick={() => setMode('custom')}
            className={`w-full mt-2 ${mode === 'custom' ? 'bg-ink text-white' : ''}`}
          >
            Custom Size
          </SketchButton>
        </div>

        {mode === 'custom' && (
          <div className="space-y-3">
            <div>
              <label className="paper-font text-sm text-ink/70">Rows: {customRows}</label>
              <input
                type="range"
                min="3"
                max="30"
                value={customRows}
                onChange={(e) => setCustomRows(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="paper-font text-sm text-ink/70">Columns: {customCols}</label>
              <input
                type="range"
                min="3"
                max="30"
                value={customCols}
                onChange={(e) => setCustomCols(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}

        <p className="paper-font text-xs text-ink/60">
          Selected size: {gameRows} × {gameCols}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <SketchButton onClick={handleStart} className="w-full">
            Start Game
          </SketchButton>
          <SketchButton onClick={handleJoin} className="w-full">
            Join Room
          </SketchButton>
        </div>
      </SketchCard>
    </div>
  );
};

export default DabPreGame;

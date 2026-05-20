import React from 'react';
import { SwatchBook } from 'lucide-react';
import ModeSelector from './ModeSelector';
import SketchButton from './SketchButton';

const RoomLobby = ({ mode, onModeChange, customRows, customCols, onRowsChange, onColsChange, onCreateRoom, onJoinRoom }) => {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="sketch-card p-8 max-w-md w-full">
        <h2 className="text-3xl font-sketch mb-4 text-center text-ink">
          Dots &amp; Boxes
        </h2>
        <div className="flex gap-3 mb-4">
          <SketchButton onClick={onCreateRoom} className="flex-1">
            Create Room
          </SketchButton>
          <SketchButton onClick={onJoinRoom} className="flex-1">
            Join Room
          </SketchButton>
        </div>
        <ModeSelector
          mode={mode}
          onModeChange={onModeChange}
          customRows={customRows}
          customCols={customCols}
          onRowsChange={onRowsChange}
          onColsChange={onColsChange}
        />
      </div>
    </div>
  );
};

export default RoomLobby;
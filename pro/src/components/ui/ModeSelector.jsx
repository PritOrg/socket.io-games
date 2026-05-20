import React from 'react';
import { SwatchBook } from 'lucide-react';

const ModeSelector = ({ mode, onModeChange, customRows, customCols, onRowsChange, onColsChange }) => {
  return (
    <div className="sketch-border">
      <div className="flex items-center gap-2 mb-3">
        <SwatchBook size={20} className="text-ink" />
        <span className="font-handwriting text-lg text-ink">
          Game Mode
        </span>
      </div>
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => onModeChange('classic')}
          className={`sketch-button flex-1 ${mode === 'classic' ? 'bg-ink text-white' : ''}`}
        >
          Classic (9×9)
        </button>
        <button
          onClick={() => onModeChange('custom')}
          className={`sketch-button flex-1 ${mode === 'custom' ? 'bg-ink text-white' : ''}`}
        >
          Custom Size
        </button>
      </div>
      {mode === 'custom' && (
        <div className="space-y-3 pt-3 border-t-2 border-dashed border-ink/20">
          <div>
            <label className="font-handwriting text-ink block mb-1">
              Rows: {customRows}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={customRows}
              onChange={(e) => onRowsChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="font-handwriting text-ink block mb-1">
              Columns: {customCols}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={customCols}
              onChange={(e) => onColsChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
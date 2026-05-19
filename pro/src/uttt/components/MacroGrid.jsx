import React from 'react';
import InnerGrid from './InnerGrid';

const MacroGrid = ({ board, macroBoard, activeGrid, lastMove, onCellClick }) => {
  return (
    <div className="relative p-3 sm:p-4 bg-white/90 rounded-2xl shadow-xl border-4 border-gray-800/10">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3">
        {Array(9).fill(null).map((_, gridIndex) => (
          <InnerGrid
            key={gridIndex}
            gridIndex={gridIndex}
            gridData={board[gridIndex]}
            macroWinner={macroBoard[gridIndex]}
            isActive={activeGrid === null || activeGrid === gridIndex}
            isLastMoveGrid={lastMove?.gridIndex === gridIndex}
            lastMoveSquare={lastMove?.gridIndex === gridIndex ? lastMove?.squareIndex : null}
            onSquareClick={(squareIndex) => onCellClick(gridIndex, squareIndex)}
          />
        ))}
      </div>
      <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-800/10" />
      <div className="absolute top-2/3 left-0 w-full h-1 bg-gray-800/10" />
      <div className="absolute left-1/3 top-0 h-full w-1 bg-gray-800/10" />
      <div className="absolute left-2/3 top-0 h-full w-1 bg-gray-800/10" />
    </div>
  );
};

export default MacroGrid;
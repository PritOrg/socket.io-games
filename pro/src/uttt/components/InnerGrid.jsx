import React from 'react';

const InnerGrid = ({ 
  gridIndex, 
  gridData, 
  macroWinner, 
  isActive, 
  isLastMoveGrid, 
  lastMoveSquare, 
  onSquareClick 
}) => {
  const getContainerClasses = () => {
    let base = "relative rounded transition-all duration-300";
    
    if (macroWinner === 'DEAD') {
      return `${base} bg-gray-100/80`;
    }
    
    if (macroWinner) {
      return `${base} ${macroWinner === 'X' ? 'bg-blue-50/80' : 'bg-red-50/80'}`;
    }
    
    if (isActive) {
      return `${base} bg-white/90 ring-2 ring-blue-400 shadow-lg`;
    }
    
    return `${base} bg-white/40 opacity-60`;
  };

  const renderCell = (squareIndex) => {
    const value = gridData[squareIndex];
    const isLastMove = isLastMoveGrid && lastMoveSquare === squareIndex;
    
    return (
      <button
        key={squareIndex}
        onClick={() => onSquareClick(squareIndex)}
        disabled={!isActive || value !== null || macroWinner !== null}
        className={`
          relative aspect-square flex items-center justify-center
          text-xs sm:text-sm md:text-2xl font-bold hand-drawn transition-all duration-150
          ${!isActive || value !== null || macroWinner !== null 
            ? 'cursor-not-allowed' 
            : 'hover:bg-blue-200/50 cursor-pointer active:scale-95'}
          ${isLastMove ? 'bg-yellow-300/70 ring-2 ring-yellow-500' : ''}
          ${value === 'X' ? 'text-blue-600' : value === 'O' ? 'text-red-600' : 'text-transparent'}
        `}
      >
        {value || ''}
      </button>
    );
  };

  const renderOverlay = () => {
    if (macroWinner === 'DEAD') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="grid grid-cols-3 gap-0 opacity-40">
            {Array(9).fill(null).map((_, i) => (
              <span key={i} className="text-[8px] sm:text-xs md:text-base text-gray-400 font-bold">×</span>
            ))}
          </div>
        </div>
      );
    }
    
    if (macroWinner === 'X' || macroWinner === 'O') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-2xl sm:text-4xl md:text-7xl font-bold opacity-25 ${
            macroWinner === 'X' ? 'text-blue-600' : 'text-red-600'
          }`}>
            {macroWinner}
          </span>
        </div>
      );
    }
    
    return null;
  };

  const renderGridLines = () => (
    <>
      <div className="absolute top-1/3 left-0 w-full h-px bg-gray-400/40" />
      <div className="absolute top-2/3 left-0 w-full h-px bg-gray-400/40" />
      <div className="absolute left-1/3 top-0 h-full w-px bg-gray-400/40" />
      <div className="absolute left-2/3 top-0 h-full w-px bg-gray-400/40" />
    </>
  );

  return (
    <div className={`${getContainerClasses()} p-0.5 sm:p-1`}>
      <div className="relative grid grid-cols-3 gap-0">
        {Array(9).fill(null).map((_, i) => renderCell(i))}
        {renderGridLines()}
      </div>
      {renderOverlay()}
    </div>
  );
};

export default InnerGrid;
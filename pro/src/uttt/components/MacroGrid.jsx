import React from 'react';
import InnerGrid from './InnerGrid';

const MacroGrid = ({ board, macroBoard, activeGrid, lastMove, onCellClick }) => {
  const getContainerClasses = () => {
    let base = 'relative rounded-xl transition-all duration-300 shadow-lg';
    return `${base} bg-white/95 border-2 border-gray-800/10`;
  };

  const renderGridLines = () => (
    <>
      <div
        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent"
        style={{ top: 'calc(33.333% - 0.5px)', boxShadow: '0 0.5px 0 rgba(0,0,0,0.05)' }}
      />
      <div
        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent"
        style={{ top: 'calc(66.666% - 0.5px)', boxShadow: '0 0.5px 0 rgba(0,0,0,0.05)' }}
      />
      <div
        className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent"
        style={{ left: 'calc(33.333% - 0.5px)', boxShadow: '0.5px 0 0 rgba(0,0,0,0.05)' }}
      />
      <div
        className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent"
        style={{ left: 'calc(66.666% - 0.5px)', boxShadow: '0.5px 0 0 rgba(0,0,0,0.05)' }}
      />
    </>
  );

  return (
    <div className={`${getContainerClasses()} p-1.5 sm:p-2 md:p-3 overflow-hidden`}>
      <div className="relative grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
        {Array(9).fill(null).map((_, gridIndex) => (
          <InnerGrid
            key={gridIndex}
            gridIndex={gridIndex}
            gridData={board[gridIndex]}
            macroWinner={macroBoard[gridIndex]}
            isActive={activeGrid === null || activeGrid === gridIndex || macroBoard[gridIndex] === 'DEAD'}
            isLastMoveGrid={lastMove?.gridIndex === gridIndex}
            lastMoveSquare={lastMove?.gridIndex === gridIndex ? lastMove?.squareIndex : null}
            onSquareClick={(squareIndex) => onCellClick(gridIndex, squareIndex)}
          />
        ))}
        {renderGridLines()}
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};

export default MacroGrid;
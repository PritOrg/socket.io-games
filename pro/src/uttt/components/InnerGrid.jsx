import React from "react";

const InnerGrid = ({
  gridIndex,
  gridData,
  macroWinner,
  isActive,
  isLastMoveGrid,
  lastMoveSquare,
  onSquareClick,
}) => {
  const getContainerClasses = () => {
    let base = "relative rounded-lg transition-all duration-300 shadow-sm";

    if (macroWinner === "DEAD") {
      return `${base} bg-gray-100/90 border border-gray-300/50`;
    }

    if (macroWinner) {
      const bgColor =
        macroWinner === "X"
          ? "bg-blue-50/80 border-blue-200/50"
          : "bg-red-50/80 border-red-200/50";
      return `${base} ${bgColor} border-2`;
    }

    if (isActive) {
      return `${base} bg-white/95 ring-2 ring-blue-400 ring-offset-1 shadow-lg scale-[1.02]`;
    }

    return `${base} bg-white/60 border border-gray-300/30 opacity-70`;
  };

  const renderCell = (squareIndex) => {
    const value = gridData[squareIndex];
    const isLastMove = isLastMoveGrid && lastMoveSquare === squareIndex;

    return (
      <button
        key={squareIndex}
        onClick={() => onSquareClick(squareIndex)}
        disabled={!isActive || value !== null || macroWinner === "DEAD"}
        className={`
          relative aspect-square flex items-center justify-center
          text-xs sm:text-base md:text-xl lg:text-2xl font-bold font-sketch transition-all duration-200
          ${
            !isActive || value !== null || macroWinner === "DEAD"
              ? "cursor-not-allowed"
              : "hover:bg-blue-100/40 cursor-pointer active:scale-95 hover:scale-105"
          }
          ${isLastMove ? "bg-yellow-200/70 ring-2 ring-yellow-400 animate-pulse" : ""}
          ${value === "X" ? "text-[#1a1a2e]" : value === "O" ? "text-[#c73e1d]" : "text-transparent"}
        `}
        style={{
          textShadow: value ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {value && (
          <span className="relative">
            {value}
            {/* Hand-drawn effect - slight rotation */}
            <span
              className="absolute inset-0 opacity-20"
              style={{ transform: "rotate(2deg)" }}
            >
              {value}
            </span>
          </span>
        )}
      </button>
    );
  };

  const renderOverlay = () => {
    if (macroWinner === "DEAD") {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="grid grid-cols-3 gap-0.5 opacity-30">
            {Array(9)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="text-[6px] sm:text-[8px] md:text-xs text-gray-500 font-bold"
                >
                  ×
                </span>
              ))}
          </div>
        </div>
      );
    }

    if (macroWinner === "X" || macroWinner === "O") {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative">
            <span
              className={`text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sketch opacity-20 ${
                macroWinner === "X" ? "text-[#1a1a2e]" : "text-[#c73e1d]"
              }`}
            >
              {macroWinner}
            </span>
            {/* Sketch wobble effect */}
            <span
              className={`absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-sketch opacity-10 ${
                macroWinner === "X" ? "text-[#1a1a2e]" : "text-[#c73e1d]"
              }`}
              style={{ transform: "rotate(-3deg) translateX(1px)" }}
            >
              {macroWinner}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderGridLines = () => (
    <>
      {/* Horizontal lines with slight wobble */}
      <div
        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent"
        style={{
          top: "calc(33.333% - 0.5px)",
          boxShadow: "0 0.5px 0 rgba(0,0,0,0.05)",
        }}
      />
      <div
        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent"
        style={{
          top: "calc(66.666% - 0.5px)",
          boxShadow: "0 0.5px 0 rgba(0,0,0,0.05)",
        }}
      />
      {/* Vertical lines with slight wobble */}
      <div
        className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent"
        style={{
          left: "calc(33.333% - 0.5px)",
          boxShadow: "0.5px 0 0 rgba(0,0,0,0.05)",
        }}
      />
      <div
        className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-gray-400/40 to-transparent"
        style={{
          left: "calc(66.666% - 0.5px)",
          boxShadow: "0.5px 0 0 rgba(0,0,0,0.05)",
        }}
      />
    </>
  );

  return (
    <div className={`${getContainerClasses()} p-0.5 sm:p-1 overflow-hidden`}>
      <div className="relative grid grid-cols-3 gap-0">
        {Array(9)
          .fill(null)
          .map((_, i) => renderCell(i))}
        {renderGridLines()}
      </div>
      {renderOverlay()}

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
};

export default InnerGrid;

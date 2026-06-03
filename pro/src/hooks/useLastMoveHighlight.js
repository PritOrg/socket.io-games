import { useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

export const useLastMoveHighlight = (lastMove, playerColor, celebrate = false) => {
  const lastMoveRef = useRef(null);

  useEffect(() => {
    if (lastMove && celebrate) {
      const celebrationConfig = {
        particleCount: 25,
        spread: 35,
        origin: { y: 0.6 },
        colors: [playerColor || '#2a2a3e'],
        decay: 0.85,
        gravity: 0.5,
      };
      confetti(celebrationConfig);
      lastMoveRef.current = lastMove;
    }
  }, [lastMove, playerColor, celebrate]);

  return { lastMoveRef };
};

export default useLastMoveHighlight;

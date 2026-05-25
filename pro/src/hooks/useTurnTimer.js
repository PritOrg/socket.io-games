import { useState, useEffect, useRef } from 'react';

const useTurnTimer = (isMyTurn, duration = 30, onExpire) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    setTimeLeft(duration);
    if (!isMyTurn) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          expireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isMyTurn, duration]);

  return timeLeft;
};

export default useTurnTimer;

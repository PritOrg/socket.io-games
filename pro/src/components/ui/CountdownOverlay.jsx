import React, { useState, useEffect, useRef } from 'react';

const CountdownOverlay = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (count === 0) {
      if (mountedRef.current) onComplete?.();
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onComplete]);

  if (count === 0) return null;

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50">
      <span
        key={count}
        className="text-9xl font-sketch text-paper animate-ping"
        style={{ animationDuration: '0.8s', animationIterationCount: 1 }}
      >
        {count}
      </span>
    </div>
  );
};

export default CountdownOverlay;

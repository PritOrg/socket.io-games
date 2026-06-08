import { useEffect, useRef } from 'react';
import { reportRuntimeError } from '../utils/runtimeError';

const useSocketListeners = (socket, listeners = {}) => {
  const listenersRef = useRef(listeners);
  listenersRef.current = listeners;

  useEffect(() => {
    if (!socket) return;

    const handlerMap = {};
    Object.entries(listenersRef.current).forEach(([event]) => {
      const wrapped = (...args) => {
        try {
          const handler = listenersRef.current[event];
          if (!handler) return;
          const result = handler(...args);
          if (result && typeof result.then === 'function') {
            result.catch((error) => reportRuntimeError(`Socket event ${event}`, error));
          }
        } catch (error) {
          reportRuntimeError(`Socket event ${event}`, error);
        }
      };
      handlerMap[event] = wrapped;
      socket.on(event, wrapped);
    });

    return () => {
      Object.entries(handlerMap).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);
};

export default useSocketListeners;

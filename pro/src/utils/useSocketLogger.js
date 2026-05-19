import { useEffect, useRef } from 'react';
import logger from './logger';

export const useSocketLogger = (socket, events = {}) => {
  const handlersRef = useRef({});

  useEffect(() => {
    if (!socket) return;

    const wrappedHandlers = {};
    
    Object.entries(events).forEach(([event, handler]) => {
      const wrappedHandler = (...args) => {
        logger.socket('⬅️', event, args.length === 1 ? args[0] : args);
        handler(...args);
      };
      
      wrappedHandlers[event] = wrappedHandler;
      socket.on(event, wrappedHandler);
    });

    handlersRef.current = wrappedHandlers;

    return () => {
      Object.entries(wrappedHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, events]);
};

export const useEmitWithLogging = (socket) => {
  if (!socket) return null;

  return (event, data) => {
    logger.socket('➡️', event, data);
    socket.emit(event, data);
  };
};
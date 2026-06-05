import { useEffect } from 'react';

const useSocketListeners = (socket, listeners = {}, deps = []) => {
  useEffect(() => {
    if (!socket) return;

    Object.entries(listeners).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(listeners).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSocketListeners;

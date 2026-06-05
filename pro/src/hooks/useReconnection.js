import { useEffect, useRef } from 'react';

const useReconnection = ({ socket, gamePrefix, roomId, onRestore }) => {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!socket) return;

    const key = `${gamePrefix}_reconnect`;
    const saved = sessionStorage.getItem(key);

    if (saved && !attemptedRef.current) {
      attemptedRef.current = true;
      try {
        const parsed = JSON.parse(saved);
        socket.emit(`${gamePrefix}_reconnect`, {
          roomId: parsed.roomId,
          playerId: parsed.playerId,
        });
      } catch {
        // ignore corrupt data
      }
    }
  }, [socket, gamePrefix]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!socket) return;

    const handleRoomInfo = (room) => {
      if (socket.id && room.players) {
        const myPlayer = room.players.find((p) => p.id === socket.id) || room.players[room.currentTurn];
        if (myPlayer && onRestore) {
          onRestore(room, myPlayer);
        }
      }
    };

    socket.on(`${gamePrefix}_roomInfo`, handleRoomInfo);
    return () => socket.off(`${gamePrefix}_roomInfo`, handleRoomInfo);
  }, [socket, gamePrefix, onRestore]);

  const clearReconnect = () => {
    sessionStorage.removeItem(`${gamePrefix}_reconnect`);
  };

  return { clearReconnect };
};

export default useReconnection;

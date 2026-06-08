import { useEffect, useRef, useCallback } from 'react';

const useReconnection = ({ socket, gamePrefix, onRestore, onReconnectFailure }) => {
  const attemptedRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const lastDisconnectTimeRef = useRef(null);

  const clearReconnect = useCallback(() => {
    sessionStorage.removeItem(`${gamePrefix}_reconnect`);
  }, [gamePrefix]);

  const handleReconnectFailure = useCallback(
    (reason, roomId) => {
      reconnectAttemptsRef.current++;
      if (onReconnectFailure) {
        onReconnectFailure(reason, roomId);
      }
    },
    [onReconnectFailure],
  );

  useEffect(() => {
    if (!socket) return;

    const key = `${gamePrefix}_reconnect`;
    const saved = sessionStorage.getItem(key);

    if (saved && !attemptedRef.current) {
      attemptedRef.current = true;
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.roomId || !parsed.playerId) {
          clearReconnect();
          return;
        }
        socket.emit(`${gamePrefix}_reconnect`, {
          roomId: parsed.roomId,
          playerId: parsed.playerId,
        });
      } catch {
        clearReconnect();
      }
    }
  }, [socket, gamePrefix, clearReconnect]);

  useEffect(() => {
    if (!socket) return;

    const handleRoomInfo = (room) => {
      reconnectAttemptsRef.current = 0;
      if (socket.id && room.players) {
        const myPlayer = room.players.find((p) => p.id === socket.id) || room.players[room.currentTurn];
        if (myPlayer && onRestore) {
          onRestore(room, myPlayer);
        }
      }
    };

    const handleReconnectFailed = ({ reason, roomId }) => {
      reconnectAttemptsRef.current++;

      if (reason === 'room_not_found' || reason === 'player_not_found' || reason === 'game_already_ended') {
        clearReconnect();
      }

      handleReconnectFailure(reason, roomId);
    };

    socket.on(`${gamePrefix}_roomInfo`, handleRoomInfo);
    socket.on(`${gamePrefix}_reconnectFailed`, handleReconnectFailed);
    return () => {
      socket.off(`${gamePrefix}_roomInfo`, handleRoomInfo);
      socket.off(`${gamePrefix}_reconnectFailed`, handleReconnectFailed);
    };
  }, [socket, gamePrefix, onRestore, clearReconnect, handleReconnectFailure]);

  return { clearReconnect };
};

export default useReconnection;

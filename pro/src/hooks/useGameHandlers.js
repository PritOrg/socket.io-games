import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { sketchPopupClass } from '../components/ui';

const useGameHandlers = (socket, roomId, gamePrefix, options = {}) => {
  const navigate = useNavigate();
  const { onLeave, softLeave = false } = options;

  const handleCreateRoom = useCallback(
    (options) => {
      if (!socket) return;
      socket.emit(`${gamePrefix}_createRoom`, options);
    },
    [socket, gamePrefix],
  );

  const handleJoinRoom = useCallback(
    (options) => {
      if (!socket) return;
      socket.emit(`${gamePrefix}_joinRoom`, options);
    },
    [socket, gamePrefix],
  );

  const handleStartGame = useCallback(() => {
    if (!socket) return;
    socket.emit(`${gamePrefix}_startGame`, roomId);
  }, [socket, gamePrefix, roomId]);

  const handleLeaveRoom = useCallback(async () => {
    const result = await Swal.fire({
      title: 'Leave Game?',
      text: 'Your progress will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Leave',
      cancelButtonText: 'Stay',
      customClass: { popup: sketchPopupClass },
    });
    if (!result.isConfirmed) return;

    if (softLeave && roomId) {
      socket?.emit(`${gamePrefix}_leaveRoom`, roomId);
    }

    onLeave?.();
    if (!softLeave) {
      socket?.disconnect();
    }
    navigate('/');
  }, [socket, navigate, roomId, gamePrefix, onLeave, softLeave]);

  return { handleCreateRoom, handleJoinRoom, handleStartGame, handleLeaveRoom };
};

export default useGameHandlers;

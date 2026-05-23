import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useGameHandlers = (socket, roomId, gamePrefix) => {
  const navigate = useNavigate();

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
    });
    if (!result.isConfirmed) return;
    socket?.disconnect();
    navigate('/');
  }, [socket, navigate]);

  return { handleCreateRoom, handleJoinRoom, handleStartGame, handleLeaveRoom };
};

export default useGameHandlers;

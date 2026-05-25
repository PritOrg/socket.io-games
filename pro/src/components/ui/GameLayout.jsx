import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { sketchPopupClass } from './SketchPopup';

const GameLayout = ({ socket, roomId, _gamePrefix, players = [], children }) => {
  const navigate = useNavigate();

  const handleLeave = async () => {
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
    socket?.disconnect();
    navigate('/');
  };

  const handleCopyRoomId = () => {
    navigator.clipboard?.writeText(roomId);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Info Zone */}
      <nav className="flex items-center justify-between px-4 py-2 border-b border-ink/10">
        <button onClick={handleLeave} aria-label="Back" className="sketch-button text-red-600 hover:bg-red-50">
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={handleCopyRoomId}
          className="font-sketch text-sm px-3 py-1 sketch-border rounded cursor-pointer hover:bg-ink/5"
          title="Click to copy room ID"
        >
          {roomId}
        </button>

        <div className="flex gap-1">
          {players.map((p) => (
            <span
              key={p.id}
              className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-sketch"
            >
              {p.name.slice(0, 2)}
            </span>
          ))}
        </div>
      </nav>

      {/* Canvas Zone */}
      <main className="flex-1 flex items-center justify-center p-4">{children}</main>
    </div>
  );
};

export default GameLayout;

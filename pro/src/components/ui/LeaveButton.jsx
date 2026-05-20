import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { sketchPopupClass } from './SketchPopup';

const LeaveButton = ({ onLeave, className = '' }) => {
  const handleClick = async () => {
    const result = await Swal.fire({
      title: 'Leave Game?',
      text: 'Are you sure you want to leave?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Leave',
      cancelButtonText: 'Stay',
      customClass: { popup: sketchPopupClass },
    });
    if (result.isConfirmed) {
      onLeave();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`sketch-button text-red-600 hover:bg-red-50 ${className}`}
    >
      <ArrowLeft className="inline" size={20} />
    </button>
  );
};

export default LeaveButton;
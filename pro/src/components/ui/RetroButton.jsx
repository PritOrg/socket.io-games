import React from 'react';

const RetroButton = ({ children, onClick, disabled, className = '', variant = 'primary' }) => {
  const baseStyles =
    'px-6 py-2 rounded-lg font-bold transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none glass';

  const variants = {
    primary: 'bg-blue-500/40 hover:bg-blue-500/60 text-blue-900 border-blue-400/50',
    secondary: 'bg-purple-500/40 hover:bg-purple-500/60 text-purple-900 border-purple-400/50',
    success: 'bg-green-500/40 hover:bg-green-500/60 text-green-900 border-green-400/50',
    danger: 'bg-red-500/40 hover:bg-red-500/60 text-red-900 border-red-400/50',
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default RetroButton;

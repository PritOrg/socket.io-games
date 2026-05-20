import React from 'react';

const SketchBorder = ({ children, className = '' }) => {
  return (
    <div className={`sketch-border ${className}`}>
      {children}
    </div>
  );
};

export default SketchBorder;
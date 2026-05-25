import React from 'react';

const SketchCard = ({ children, className = '' }) => {
  return <div className={`sketch-card ${className}`}>{children}</div>;
};

export default SketchCard;

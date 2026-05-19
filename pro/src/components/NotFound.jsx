import React from 'react';
import { useNavigate } from 'react-router-dom';
import RetroButton from './ui/RetroButton';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-9xl hand-drawn text-red-500 mb-4 animate-bounce">404</h1>
      <p className="text-2xl paper-font text-gray-600 mb-8">Oops! This page got lost in the notebook.</p>
      <RetroButton onClick={() => navigate('/')}>Take me Home</RetroButton>
    </div>
  );
};

export default NotFound;

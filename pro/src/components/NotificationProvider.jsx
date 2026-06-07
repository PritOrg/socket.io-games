import React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from '../context/ThemeContext';

export default function NotificationProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      expand
      toastOptions={{
        classNamefont: 'sketch-card font-handwriting',
        style: {
          background: theme === 'dark' ? '#1e1e1e' : '#fffef9',
          color: theme === 'dark' ? '#e0e0e0' : '#2a2a3e',
          border: `2px solid ${theme === 'dark' ? '#e0e0e0' : '#2a2a3e'}`,
          borderRadius: '4px',
        },
      }}
    />
  );
}

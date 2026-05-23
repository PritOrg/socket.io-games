import { useState, useEffect } from 'react';

const STORAGE_KEY = 'player_avatar';

const usePlayerAvatars = () => {
  const saved = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  })();

  const [avatar, setAvatar] = useState(saved.avatar || '🐼');
  const [color, setColor] = useState(saved.color || '#2a2a3e');

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ avatar, color }));
  }, [avatar, color]);

  return { avatar, color, setAvatar, setColor };
};

export default usePlayerAvatars;

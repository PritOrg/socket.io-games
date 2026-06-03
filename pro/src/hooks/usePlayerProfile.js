import { useState, useEffect, useCallback } from 'react';
import { Cat, Dog, Bird, Fish, Monkey, PawPrint, Frog, Ticket, Lion, Bear, Koala, Fox } from 'lucide-react';

export const AVATAR_ICONS = [
  { id: 'cat', Icon: Cat },
  { id: 'dog', Icon: Dog },
  { id: 'bird', Icon: Bird },
  { id: 'fish', Icon: Fish },
  { id: 'monkey', Icon: Monkey },
  { id: 'panda', Icon: PawPrint },
  { id: 'frog', Icon: Frog },
  { id: 'tiger', Icon: Ticket },
  { id: 'lion', Icon: Lion },
  { id: 'bear', Icon: Bear },
  { id: 'koala', Icon: Koala },
  { id: 'fox', Icon: Fox },
];

export const PLAYER_COLORS = ['#2a2a3e', '#c73e1d', '#2d4a8f', '#2f5233', '#7b2d8f', '#b5651d'];

export const usePlayerProfile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('playerProfile');
    return saved
      ? JSON.parse(saved)
      : {
          name: localStorage.getItem('playerName') || '',
          avatarIcon: 'cat',
          color: '#2a2a3e',
        };
  });

  useEffect(() => {
    localStorage.setItem('playerProfile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (profile.name) {
      localStorage.setItem('playerName', profile.name);
    }
  }, [profile.name]);

  const setAvatarIcon = useCallback((icon) => {
    setProfile((prev) => ({ ...prev, avatarIcon: icon }));
  }, []);

  const setColor = useCallback((color) => {
    setProfile((prev) => ({ ...prev, color }));
  }, []);

  const setName = useCallback((name) => {
    setProfile((prev) => ({ ...prev, name }));
  }, []);

  return {
    ...profile,
    setAvatarIcon,
    setColor,
    setName,
    AVATAR_ICONS,
    PLAYER_COLORS,
  };
};

export default usePlayerProfile;

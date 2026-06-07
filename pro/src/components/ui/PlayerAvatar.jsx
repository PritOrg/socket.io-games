import React from 'react';
import { User, Smile, Star, Heart, Sun, Zap } from 'lucide-react';

const ICON_MAP = {
  User,
  Smile,
  Star,
  Heart,
  Sun,
  Zap,
};

const PlayerAvatar = ({ avatar, color, size = 20 }) => {
  const IconComp = ICON_MAP[avatar] || User;
  return <IconComp size={size} style={color ? { color } : undefined} />;
};

export default PlayerAvatar;

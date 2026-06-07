import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Avatar styles from dicebear
export const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'avataaars-neutral',
  'big-ears',
  'big-smile',
  'bottts',
  'bottts-neutral',
  'croodles',
  'croodles-neutral',
  'micah',
  'notionists',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
];

export const AVATAR_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B88B', // Peach
  '#82E0AA', // Light Green
];

export const useAvatarStore = create(
  persist(
    (set, get) => ({
      avatar: {
        style: 'adventurer',
        seed: Math.random().toString(36).substring(7),
        backgroundColor: AVATAR_COLORS[0],
      },
      setAvatar: (style, seed, backgroundColor) => {
        set({
          avatar: {
            style,
            seed: seed || Math.random().toString(36).substring(7),
            backgroundColor,
          },
        });
      },
      generateNewAvatar: () => {
        const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
        const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
        const randomSeed = Math.random().toString(36).substring(7);
        set({
          avatar: {
            style: randomStyle,
            seed: randomSeed,
            backgroundColor: randomColor,
          },
        });
      },
      getAvatarUrl: () => {
        const { avatar } = get();
        return `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}&backgroundColor=${avatar.backgroundColor.replace('#', '')}`;
      },
    }),
    {
      name: 'avatar-store',
      storage: localStorage,
    },
  ),
);

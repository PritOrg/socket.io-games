import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { useAvatarStore, AVATAR_STYLES, AVATAR_COLORS } from '../store/avatarStore';

export default function AvatarSelector() {
  const { avatar, setAvatar, generateNewAvatar, getAvatarUrl } = useAvatarStore();
  const [showStylePicker, setShowStylePicker] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const avatarVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const colorGridVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  const colorItemVariants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' },
    }),
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  const currentStyleIndex = AVATAR_STYLES.indexOf(avatar.style);
  const prevStyle = AVATAR_STYLES[(currentStyleIndex - 1 + AVATAR_STYLES.length) % AVATAR_STYLES.length];
  const nextStyle = AVATAR_STYLES[(currentStyleIndex + 1) % AVATAR_STYLES.length];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center gap-6 p-6 rounded-lg sketch-border"
    >
      {/* Avatar Display */}
      <motion.div variants={avatarVariants} initial="hidden" animate="visible" key={avatar.seed} className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-ink/20 overflow-hidden bg-paper shadow-lg">
          <img src={getAvatarUrl()} alt="Your Avatar" className="w-full h-full object-cover" />
        </div>
        <motion.button
          onClick={generateNewAvatar}
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
          title="Generate random avatar"
        >
          <RotateCw size={16} />
        </motion.button>
      </motion.div>

      {/* Avatar Style Navigation */}
      <div className="flex items-center gap-4 w-full">
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAvatar(prevStyle, undefined, avatar.backgroundColor)}
          className="sketch-button p-2"
          title="Previous style"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <div className="flex-1 text-center font-sketch">
          <p className="text-sm text-ink/60">Style</p>
          <p className="font-bold capitalize text-ink">{avatar.style.replace(/-/g, ' ')}</p>
        </div>

        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAvatar(nextStyle, undefined, avatar.backgroundColor)}
          className="sketch-button p-2"
          title="Next style"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Color Picker Toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowStylePicker(!showStylePicker)}
        className="sketch-button w-full font-sketch"
      >
        {showStylePicker ? 'Hide' : 'Show'} Colors
      </motion.button>

      {/* Color Grid */}
      <AnimatePresence>
        {showStylePicker && (
          <motion.div variants={colorGridVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
            <div className="grid grid-cols-5 gap-3">
              {AVATAR_COLORS.map((color, i) => (
                <motion.button
                  key={color}
                  custom={i}
                  variants={colorItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatar(avatar.style, undefined, color)}
                  className={`w-full aspect-square rounded-lg transition-all ${
                    avatar.backgroundColor === color ? 'ring-4 ring-ink/50' : 'ring-1 ring-ink/10'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Select color ${color}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Text */}
      <p className="text-xs text-ink/50 text-center font-handwriting">
        Your avatar is saved automatically. Choose a style and color you like!
      </p>
    </motion.div>
  );
}

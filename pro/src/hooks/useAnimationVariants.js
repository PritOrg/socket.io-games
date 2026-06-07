// Stagger container for animating children sequentially
export const useStaggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Item variants for use within stagger containers
export const useStaggerItem = () => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
});

// Fade in animation
export const useFadeIn = (duration = 0.4, delay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, delay },
  },
});

// Slide in from left
export const useSlideInLeft = (duration = 0.4, delay = 0) => ({
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: 'easeOut' },
  },
});

// Slide in from right
export const useSlideInRight = (duration = 0.4, delay = 0) => ({
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: 'easeOut' },
  },
});

// Scale and fade in
export const useScaleIn = (duration = 0.4, delay = 0) => ({
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, delay, ease: 'easeOut' },
  },
});

// Bounce in
export const useBounceIn = (duration = 0.6, delay = 0) => ({
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, delay, type: 'spring', stiffness: 300, damping: 20 },
  },
});

// Rotate in
export const useRotateIn = (duration = 0.4, delay = 0) => ({
  hidden: { opacity: 0, rotate: -180 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration, delay, ease: 'easeOut' },
  },
});

// Pulse animation for continuous effect
export const usePulse = () => ({
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

// Float animation (gentle up and down)
export const useFloat = (distance = 10) => ({
  animate: {
    y: [0, -distance, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
});

// Shake animation
export const useShake = () => ({
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 500,
      damping: 8,
    },
  },
});

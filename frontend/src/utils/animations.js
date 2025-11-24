/**
 * Animation utilities for micro-interactions and feedback
 */

// Success animation
export const successAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// Error animation
export const errorAnimation = {
  initial: { x: -10, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 400, damping: 25 }
};

// Pulse animation for important elements
export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

// Slide in from bottom
export const slideUpAnimation = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.3, ease: 'easeOut' }
};

// Fade in
export const fadeInAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

// Scale on hover
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
};

// Celebration animation for achievements
export const celebrationAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: {
    type: 'spring',
        stiffness: 200,
        damping: 15
  }
};

// Shake animation for errors
export const shakeAnimation = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
  },
  transition: {
    duration: 0.5,
    ease: 'easeInOut'
  }
};


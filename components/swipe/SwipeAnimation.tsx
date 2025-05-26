import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Heart, ArrowDown } from 'lucide-react';

interface SwipeAnimationProps {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  isVisible: boolean;
}

export function SwipeAnimation({ direction, isVisible }: SwipeAnimationProps) {
  // Get position based on direction
  const getPosition = () => {
    switch (direction) {
      case 'right':
        return 'top-1/2 right-8 -translate-y-1/2';
      case 'left':
        return 'top-1/2 left-8 -translate-y-1/2';
      case 'up':
        return 'top-8 left-1/2 -translate-x-1/2';
      case 'down':
        return 'bottom-8 left-1/2 -translate-x-1/2';
      default:
        return '';
    }
  };

  // Get background color based on direction
  const getBackgroundColor = () => {
    switch (direction) {
      case 'right':
        return 'bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_30px_rgba(34,197,94,0.5)]';
      case 'left':
        return 'bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
      case 'up':
        return 'bg-gradient-to-br from-pink-400 to-pink-600 shadow-[0_0_30px_rgba(236,72,153,0.5)]';
      case 'down':
        return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-[0_0_30px_rgba(107,114,128,0.5)]';
      default:
        return '';
    }
  };

  // Get icon based on direction
  const getIcon = () => {
    switch (direction) {
      case 'right':
        return <Check className="h-12 w-12 text-white drop-shadow-lg" />;
      case 'left':
        return <X className="h-12 w-12 text-white drop-shadow-lg" />;
      case 'up':
        return <Heart className="h-12 w-12 text-white drop-shadow-lg" />;
      case 'down':
        return <ArrowDown className="h-12 w-12 text-white drop-shadow-lg" />;
      default:
        return null;
    }
  };

  // Get text based on direction
  const getText = () => {
    switch (direction) {
      case 'right':
        return 'Intéressé';
      case 'left':
        return 'Passer';
      case 'up':
        return 'Favoris';
      case 'down':
        return 'Masquer';
      default:
        return '';
    }
  };

  // Get text color based on direction
  const getTextColor = () => {
    switch (direction) {
      case 'right':
        return 'text-green-600';
      case 'left':
        return 'text-red-600';
      case 'up':
        return 'text-pink-600';
      case 'down':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && direction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.8
          }}
          className={`absolute ${getPosition()} z-50 pointer-events-none`}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: direction === 'right' ? [0, 10, 0] : 
                     direction === 'left' ? [0, -10, 0] : 0
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.5 }}
            className={`rounded-full p-8 ${getBackgroundColor()} backdrop-blur-sm`}
          >
            {getIcon()}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
            className={`mt-4 text-center font-bold text-xl ${getTextColor()} text-shadow-sm`}
          >
            {getText()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
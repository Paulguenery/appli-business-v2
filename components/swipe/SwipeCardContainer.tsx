import React, { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { InvestorSwipeCard } from './InvestorSwipeCard';
import { ProjectOwnerSwipeCard } from './ProjectOwnerSwipeCard';
import { ProjectSeekerCard } from './ProjectSeekerCard';
import { SwipeAnimation } from './SwipeAnimation';
import { useAuth } from '@/hooks/use-auth';
import type { Project, UserProfile } from '@/lib/types';

interface SwipeCardContainerProps {
  item: Project | UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
  type: 'project' | 'talent';
}

export function SwipeCardContainer({ item, onSwipe, onViewDetails, type }: SwipeCardContainerProps) {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const controls = useAnimation();
  const { user } = useAuth();

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;

    // Determine if the swipe is primarily horizontal or vertical
    const isHorizontalSwipe = Math.abs(offsetX) > Math.abs(offsetY);
    
    // Check if the swipe is strong enough to trigger an action
    if (
      (isHorizontalSwipe && (Math.abs(velocityX) >= 500 || Math.abs(offsetX) >= 100)) ||
      (!isHorizontalSwipe && (Math.abs(velocityY) >= 500 || Math.abs(offsetY) >= 100))
    ) {
      let direction: 'left' | 'right' | 'up' | 'down';
      
      if (isHorizontalSwipe) {
        direction = offsetX > 0 ? 'right' : 'left';
        setExitX(direction === 'right' ? 1000 : -1000);
        setExitY(0);
      } else {
        direction = offsetY > 0 ? 'down' : 'up';
        setExitX(0);
        setExitY(direction === 'up' ? -1000 : 1000);
      }
      
      setSwipeDirection(direction);
      setShowAnimation(true);
      
      await controls.start({ 
        x: isHorizontalSwipe ? (direction === 'right' ? 1000 : -1000) : 0,
        y: !isHorizontalSwipe ? (direction === 'up' ? -1000 : 1000) : 0,
        rotate: isHorizontalSwipe ? (direction === 'right' ? 20 : -20) : 0,
        opacity: 0,
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      });
      
      // Only trigger horizontal swipes for now
      if (isHorizontalSwipe) {
        onSwipe(direction);
      } else {
        // Handle vertical swipes (up/down) here if needed
        console.log(`Vertical swipe: ${direction}`);
        
        // For now, just reset the card position
        controls.start({ 
          x: 0, 
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
          }
        });
      }
      
      setShowAnimation(false);
    } else {
      controls.start({ 
        x: 0, 
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      });
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    
    // Determine if the drag is primarily horizontal or vertical
    const isHorizontalDrag = Math.abs(offsetX) > Math.abs(offsetY);
    
    if (isHorizontalDrag) {
      const direction = offsetX > 0 ? 'right' : 'left';
      setSwipeDirection(Math.abs(offsetX) > 50 ? direction : null);
      
      const rotate = (offsetX / 100) * 10;
      const scale = Math.max(0.95, 1 - Math.abs(offsetX) / 2000);
      
      controls.set({ 
        x: offsetX,
        y: 0,
        rotate: rotate,
        scale: scale
      });
    } else {
      const direction = offsetY > 0 ? 'down' : 'up';
      setSwipeDirection(Math.abs(offsetY) > 50 ? direction : null);
      
      const scale = Math.max(0.95, 1 - Math.abs(offsetY) / 2000);
      
      controls.set({ 
        x: 0,
        y: offsetY,
        rotate: 0,
        scale: scale
      });
    }
  };

  // Détermine le type de carte à afficher en fonction du type d'utilisateur et du type d'élément
  const renderCard = () => {
    // Pour le mode admin, on utilise le type d'utilisateur de la session active
    // ou on simule un type d'utilisateur basé sur le type d'élément
    const userType = user?.user_type || (type === 'project' ? 'project_seeker' : 'project_owner');
    
    if (type === 'project') {
      if (userType === 'investor') {
        return (
          <InvestorSwipeCard
            project={item as Project}
            onSwipe={onSwipe}
            onViewDetails={onViewDetails}
          />
        );
      } else {
        return (
          <ProjectSeekerCard
            project={item as Project}
            onSwipe={onSwipe}
            onViewDetails={onViewDetails}
          />
        );
      }
    } else if (type === 'talent') {
      return (
        <ProjectOwnerSwipeCard
          talent={item as UserProfile}
          onSwipe={onSwipe}
          onViewDetails={onViewDetails}
        />
      );
    }
    
    return null;
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      exit={{ x: exitX, y: exitY }}
      className="absolute w-full cursor-grab active:cursor-grabbing"
      style={{ height: 'calc(100% - 160px)' }}
    >
      <SwipeAnimation 
        direction={swipeDirection} 
        isVisible={showAnimation} 
      />

      {renderCard()}
    </motion.div>
  );
}
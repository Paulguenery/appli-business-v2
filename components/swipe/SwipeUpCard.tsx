import React, { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { 
  ThumbsUp, ThumbsDown, Star, MapPin, Briefcase, 
  Calendar, Award, User, MessageSquare, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/lib/types';

interface SwipeUpCardProps {
  talent: UserProfile;
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function SwipeUpCard({ talent, onSwipe, onViewDetails }: SwipeUpCardProps) {
  const [exitY, setExitY] = useState(0);
  const [exitX, setExitX] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const offsetY = info.offset.y;
    const offsetX = info.offset.x;
    const velocityY = info.velocity.y;
    const velocityX = info.velocity.x;

    // Determine if the swipe is primarily vertical or horizontal
    const isVerticalSwipe = Math.abs(offsetY) > Math.abs(offsetX);
    
    if (
      (isVerticalSwipe && (Math.abs(velocityY) >= 500 || Math.abs(offsetY) >= 100)) ||
      (!isVerticalSwipe && (Math.abs(velocityX) >= 500 || Math.abs(offsetX) >= 100))
    ) {
      let direction: 'up' | 'down' | 'left' | 'right';
      
      if (isVerticalSwipe) {
        direction = offsetY < 0 ? 'up' : 'down';
        setExitY(direction === 'up' ? -1000 : 1000);
        setExitX(0);
      } else {
        direction = offsetX > 0 ? 'right' : 'left';
        setExitX(direction === 'right' ? 1000 : -1000);
        setExitY(0);
      }
      
      setSwipeDirection(direction);
      setShowAnimation(true);
      
      await controls.start({ 
        y: isVerticalSwipe ? (direction === 'up' ? -1000 : 1000) : 0,
        x: !isVerticalSwipe ? (direction === 'right' ? 1000 : -1000) : 0,
        rotate: !isVerticalSwipe ? (direction === 'right' ? 20 : -20) : 0,
        opacity: 0,
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      });
      
      onSwipe(direction);
      setShowAnimation(false);
    } else {
      controls.start({ 
        y: 0, 
        x: 0,
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
    const offsetY = info.offset.y;
    const offsetX = info.offset.x;
    
    // Determine if the drag is primarily vertical or horizontal
    const isVerticalDrag = Math.abs(offsetY) > Math.abs(offsetX);
    
    if (isVerticalDrag) {
      setSwipeDirection(offsetY < 0 ? 'up' : 'down');
      
      const scale = Math.max(0.95, 1 - Math.abs(offsetY) / 2000);
      
      controls.set({ 
        y: offsetY,
        x: 0,
        rotate: 0,
        scale: scale
      });
    } else {
      setSwipeDirection(offsetX > 0 ? 'right' : 'left');
      
      const rotate = (offsetX / 100) * 10;
      const scale = Math.max(0.95, 1 - Math.abs(offsetX) / 2000);
      
      controls.set({ 
        y: 0,
        x: offsetX,
        rotate: rotate,
        scale: scale
      });
    }
  };

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      exit={{ y: exitY, x: exitX, opacity: 0 }}
      className="absolute w-full h-full cursor-grab active:cursor-grabbing bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Swipe Animation Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: swipeDirection === 'up' ? 1 : 0,
          scale: swipeDirection === 'up' ? 1 : 0.5
        }}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-pink-500 text-white p-3 rounded-full"
      >
        <Heart className="h-8 w-8" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: swipeDirection === 'down' ? 1 : 0,
          scale: swipeDirection === 'down' ? 1 : 0.5
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white p-3 rounded-full"
      >
        <ThumbsDown className="h-8 w-8" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: swipeDirection === 'right' ? 1 : 0,
          scale: swipeDirection === 'right' ? 1 : 0.5
        }}
        className="absolute top-1/2 right-10 -translate-y-1/2 z-50 bg-green-500 text-white p-3 rounded-full"
      >
        <ThumbsUp className="h-8 w-8" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: swipeDirection === 'left' ? 1 : 0,
          scale: swipeDirection === 'left' ? 1 : 0.5
        }}
        className="absolute top-1/2 left-10 -translate-y-1/2 z-50 bg-gray-500 text-white p-3 rounded-full"
      >
        <ThumbsDown className="h-8 w-8" />
      </motion.div>

      {/* Header */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {'avatar_url' in talent && talent.avatar_url ? (
          <img 
            src={talent.avatar_url} 
            alt={talent.full_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{talent.full_name}</h2>
            {talent.is_verified && (
              <div className="bg-blue-500/30 px-2 py-1 rounded-full text-xs flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Vérifié
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{talent.city || 'France'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{talent.availability}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Experience Level Badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {talent.experience_level === 'junior' ? 'Junior' : 
             talent.experience_level === 'intermediaire' ? 'Intermédiaire' : 'Senior'}
          </span>
          
          {talent.user_type === 'project_seeker' && (
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              Chercheur de projet
            </span>
          )}
        </div>

        {/* Bio */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            À propos
          </h3>
          <p className={`text-gray-600 ${expanded ? '' : 'line-clamp-3'}`}>
            {talent.bio}
          </p>
          {talent.bio && talent.bio.length > 150 && (
            <button 
              onClick={toggleExpanded}
              className="text-blue-600 text-sm mt-1 hover:underline"
            >
              {expanded ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            Compétences
          </h3>
          <div className="flex flex-wrap gap-2">
            {talent.skills?.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={() => onSwipe('left')}
          >
            <ThumbsDown className="h-6 w-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-lg hover:bg-blue-50 hover:text-blue-500 transition-colors"
            onClick={onViewDetails}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-lg hover:bg-pink-50 hover:text-pink-500 transition-colors"
            onClick={() => onSwipe('up')}
          >
            <Heart className="h-6 w-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-lg hover:bg-green-50 hover:text-green-500 transition-colors"
            onClick={() => onSwipe('right')}
          >
            <ThumbsUp className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Swipe Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full shadow-md backdrop-blur-sm text-sm text-gray-600">
        Glissez vers le haut pour ajouter aux favoris
      </div>
    </motion.div>
  );
}
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SwipeUpCard } from './SwipeUpCard';
import { MatchModal } from './MatchModal';
import { Button } from '@/components/ui/button';
import { Crown, Rocket, Undo, Sparkles } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { Link } from 'react-router-dom';
import type { Project, UserProfile } from '@/lib/types';

interface SwipeUpInterfaceProps {
  items: (Project | UserProfile)[];
  type: 'project' | 'talent';
  onSwipe: (itemId: string, direction: 'up' | 'down' | 'left' | 'right') => void;
  remainingSwipes: number;
}

export function SwipeUpInterface({ items, type, onSwipe, remainingSwipes }: SwipeUpInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastSwipedItem, setLastSwipedItem] = useState<Project | UserProfile | null>(null);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const { isPremium } = useSubscription();

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isPremium && remainingSwipes <= 0) {
      return;
    }

    const currentItem = items[currentIndex];
    if (!currentItem) return;

    // Save last swiped item for undo functionality
    setLastSwipedItem(currentItem);
    setLastSwipeDirection(direction);
    
    onSwipe(currentItem.id, direction);

    if (direction === 'right' || direction === 'up') {
      setShowMatchModal(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleCloseMatch = () => {
    setShowMatchModal(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && lastSwipedItem) {
      setCurrentIndex(prev => prev - 1);
      setLastSwipedItem(null);
      setLastSwipeDirection(null);
    }
  };

  const handleBoost = () => {
    // Implement boost functionality
    console.log('Boost profile');
  };

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-xl font-semibold mb-2">
          Aucun {type === 'project' ? 'projet' : 'profil'} dans cette zone
        </h3>
        <p className="text-gray-600 mb-6">
          Essayez d'élargir votre zone de recherche ou de revenir plus tard
        </p>
      </div>
    );
  }

  if (currentIndex >= items.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-xl font-semibold mb-2">
          Plus de {type === 'project' ? 'projets' : 'profils'} pour aujourd'hui !
        </h3>
        <p className="text-gray-600 mb-6">
          Revenez plus tard pour découvrir de nouveaux {type === 'project' ? 'projets' : 'profils'}
        </p>
        {!isPremium && (
          <Button asChild>
            <Link to="/subscribe" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Passer à Premium
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (!isPremium && remainingSwipes <= 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <Crown className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Limite de swipes atteinte
        </h3>
        <p className="text-gray-600 mb-6">
          Passez à Premium pour des swipes illimités !
        </p>
        <Button asChild>
          <Link to="/subscribe" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Découvrir Premium
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Action buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {isPremium && (
          <Button 
            variant="outline" 
            size="icon"
            className="h-10 w-10 rounded-full bg-white shadow-md"
            onClick={handleBoost}
            title="Booster votre profil"
          >
            <Rocket className="h-5 w-5 text-blue-500" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-md"
          onClick={handleUndo}
          disabled={!lastSwipedItem || currentIndex === 0}
          title="Annuler le dernier swipe"
        >
          <Undo className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {type === 'talent' && (
          <SwipeUpCard
            key={items[currentIndex].id}
            talent={items[currentIndex] as UserProfile}
            onSwipe={handleSwipe}
            onViewDetails={() => setShowMatchModal(true)}
          />
        )}
      </AnimatePresence>

      {/* Swipe counter */}
      {!isPremium && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            {remainingSwipes} swipes restants aujourd'hui
          </p>
        </div>
      )}

      {/* Match modal */}
      {showMatchModal && (
        <MatchModal
          open={showMatchModal}
          onOpenChange={handleCloseMatch}
          item={items[currentIndex]}
          type={type}
        />
      )}
    </div>
  );
}
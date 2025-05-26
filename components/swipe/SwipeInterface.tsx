import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import { MatchModal } from './MatchModal';
import { Button } from '@/components/ui/button';
import { Crown, Rocket, Undo, Sparkles, Heart, X, MessageSquare, Info, Check, ArrowDown } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/use-favorites';
import { SwipeAnimation } from './SwipeAnimation';
import type { Project, UserProfile } from '@/lib/types';

interface SwipeInterfaceProps {
  items: (Project | UserProfile)[];
  type: 'project' | 'talent';
  onSwipe: (itemId: string, direction: 'left' | 'right') => void;
  remainingSwipes: number;
}

export function SwipeInterface({ items, type, onSwipe, remainingSwipes }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [lastSwipedItem, setLastSwipedItem] = useState<Project | UserProfile | null>(null);
  const [lastSwipeDirection, setLastSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { isPremium } = useSubscription();
  const [showTutorial, setShowTutorial] = useState(() => {
    // Vérifier si le tutoriel a déjà été vu
    const tutorialSeen = localStorage.getItem('swipeTutorialSeen');
    return !tutorialSeen;
  });
  const { addToFavorites } = useFavorites();
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!isPremium && remainingSwipes <= 0) {
      return;
    }

    const currentItem = items[currentIndex];
    if (!currentItem) return;

    // Save last swiped item for undo functionality
    setLastSwipedItem(currentItem);
    setLastSwipeDirection(direction);
    
    // Show swipe animation
    setSwipeAnimation(direction);
    setShowSwipeIndicator(true);
    
    // Delay to allow animation to complete
    setTimeout(() => {
      setShowSwipeIndicator(false);
      setSwipeAnimation(null);
      
      onSwipe(currentItem.id, direction);

      if (direction === 'right') {
        setShowMatchModal(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 500);
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

  const handleAddToFavorites = () => {
    const currentItem = items[currentIndex];
    if (currentItem) {
      // Show heart animation
      setSwipeAnimation('up');
      setShowSwipeIndicator(true);
      
      setTimeout(() => {
        setShowSwipeIndicator(false);
        setSwipeAnimation(null);
        
        addToFavorites({
          itemId: currentItem.id,
          itemType: type === 'project' ? 'project' : 'profile'
        });
        
        // Move to next item
        setCurrentIndex(prev => prev + 1);
      }, 500);
    }
  };

  const handleHideForever = () => {
    const currentItem = items[currentIndex];
    if (currentItem) {
      // Show down animation
      setSwipeAnimation('down');
      setShowSwipeIndicator(true);
      
      setTimeout(() => {
        setShowSwipeIndicator(false);
        setSwipeAnimation(null);
        
        // In a real app, you would add this to a "hidden" list
        // For now, just move to the next item
        setCurrentIndex(prev => prev + 1);
      }, 500);
    }
  };

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('swipeTutorialSeen', 'true');
  };

  // Reset index when items change
  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mx-auto w-16 h-16 mb-6 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <Info className="h-8 w-8 text-blue-500" />
          </motion.div>
          
          <h3 className="text-xl font-semibold mb-2">
            Aucun {type === 'project' ? 'projet' : 'profil'} dans cette zone
          </h3>
          <p className="text-gray-600 mb-6">
            Essayez d'élargir votre zone de recherche ou de modifier vos filtres
          </p>
        </motion.div>
      </div>
    );
  }

  if (currentIndex >= items.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md"
        >
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            className="mb-6"
          >
            <Sparkles className="h-16 w-16 text-blue-500 mx-auto" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-4">
            Plus de {type === 'project' ? 'projets' : 'profils'} pour aujourd'hui !
          </h3>
          <p className="text-gray-600 mb-8">
            Revenez plus tard pour découvrir de nouveaux {type === 'project' ? 'projets' : 'profils'} qui correspondent à vos critères.
          </p>
          
          {!isPremium && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700">
                <Link to="/subscribe" className="flex items-center justify-center gap-2 py-6">
                  <Crown className="h-5 w-5" />
                  <span className="text-lg">Passer à Premium</span>
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  if (!isPremium && remainingSwipes <= 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md"
        >
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="mb-6"
          >
            <Crown className="h-16 w-16 text-yellow-500 mx-auto" />
          </motion.div>
          
          <h3 className="text-2xl font-bold mb-4">
            Limite de swipes atteinte
          </h3>
          <p className="text-gray-600 mb-8">
            Passez à Premium pour des swipes illimités et bien plus encore !
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700">
              <Link to="/subscribe" className="flex items-center justify-center gap-2 py-6">
                <Crown className="h-5 w-5" />
                <span className="text-lg">Découvrir Premium</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Action buttons */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 z-10 flex gap-2"
      >
        {isPremium && (
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md"
              onClick={() => {}}
              title="Booster votre profil"
            >
              <Rocket className="h-5 w-5 text-blue-500" />
            </Button>
          </motion.div>
        )}
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
        </motion.div>
      </motion.div>

      {/* Swipe indicators */}
      <SwipeAnimation 
        direction={swipeAnimation}
        isVisible={showSwipeIndicator}
      />

      {/* Main card */}
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {items[currentIndex] && (
              <SwipeCard
                key={items[currentIndex].id}
                item={items[currentIndex]}
                onSwipe={handleSwipe}
                type={type}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons at bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-4"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-xl hover:bg-red-50 hover:text-red-500 transition-colors"
            onClick={() => handleSwipe('left')}
          >
            <X className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-xl hover:bg-blue-50 hover:text-blue-500 transition-colors"
            onClick={() => setShowMatchModal(true)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-xl hover:bg-pink-50 hover:text-pink-500 transition-colors"
            onClick={handleAddToFavorites}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full bg-white shadow-xl hover:bg-green-50 hover:text-green-500 transition-colors"
            onClick={() => handleSwipe('right')}
          >
            <Check className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Swipe counter */}
      {!isPremium && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full shadow-md backdrop-blur-sm"
        >
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>{remainingSwipes} swipes restants</span>
          </p>
        </motion.div>
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

      {/* Tutorial overlay */}
      {showTutorial && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-lg p-6 max-w-md"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Comment ça marche
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Swipe à gauche ou bouton X</p>
                  <p className="text-sm text-gray-600">Pour passer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Bouton message</p>
                  <p className="text-sm text-gray-600">Pour voir les détails</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="font-medium">Bouton cœur</p>
                  <p className="text-sm text-gray-600">Pour ajouter aux favoris</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-full">
                  <ArrowDown className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Swipe vers le bas</p>
                  <p className="text-sm text-gray-600">Pour masquer définitivement</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Swipe à droite ou bouton check</p>
                  <p className="text-sm text-gray-600">Pour manifester votre intérêt</p>
                </div>
              </div>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={dismissTutorial}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700"
              >
                Compris !
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
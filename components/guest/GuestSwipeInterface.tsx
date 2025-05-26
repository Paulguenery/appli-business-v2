import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/stores/location';
import { GuestProjectCard } from './GuestProjectCard';
import { GuestTalentCard } from './GuestTalentCard';
import { GuestInvestorCard } from './GuestInvestorCard';
import { GuestMatchModal } from './GuestMatchModal';
import { Button } from '@/components/ui/button';
import { Crown, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project, UserProfile, UserRole } from '@/lib/types';

interface GuestSwipeInterfaceProps {
  userType: UserRole;
  filters: {
    sector: string;
    duration: string;
    stage: string;
    skills: string[];
  };
}

export function GuestSwipeInterface({ userType, filters }: GuestSwipeInterfaceProps) {
  const { selectedCity, radius } = useLocationStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<(Project | UserProfile)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [remainingSwipes, setRemainingSwipes] = useState(5); // Limite pour les invités
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Fetch data based on user type
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!selectedCity) return;

        if (userType === 'project_owner') {
          // Fetch talents
          const { data, error } = await supabase.rpc('search_profiles_by_location', {
            center_lat: selectedCity.latitude,
            center_lon: selectedCity.longitude,
            radius_km: radius,
            role_filter: 'project_seeker'
          });

          if (error) throw error;
          setItems(data || []);
        } else {
          // Fetch projects for project seekers and investors
          const { data, error } = await supabase.rpc('search_projects_by_location', {
            center_lat: selectedCity.latitude,
            center_lon: selectedCity.longitude,
            radius_km: radius
          });

          if (error) throw error;
          setItems(data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCity, radius, userType]);

  // Apply filters
  const filteredItems = React.useMemo(() => {
    if (userType === 'project_owner') {
      // Filter talents
      return items.filter((talent: any) => {
        // Filter by sector
        if (filters.sector && (!talent.sectors || !talent.sectors.some((s: string) => s.includes(filters.sector)))) {
          return false;
        }
        
        // Filter by skills
        if (filters.skills.length > 0 && (!talent.skills || !filters.skills.some(skill => 
          talent.skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
        ))) {
          return false;
        }
        
        // Filter by availability (duration)
        if (filters.duration && talent.availability !== filters.duration) {
          return false;
        }
        
        // Filter by experience level (stage)
        if (filters.stage) {
          const stageMap: Record<string, string> = {
            'Idée / Concept': 'junior',
            'Prototype / MVP': 'junior',
            'En développement': 'intermediaire',
            'Lancé / En croissance': 'senior',
            'Mature / Établi': 'senior'
          };
          
          if (talent.experience_level !== stageMap[filters.stage]) {
            return false;
          }
        }
        
        return true;
      });
    } else {
      // Filter projects
      return items.filter((project: any) => {
        // Filter by sector
        if (filters.sector && (!project.category || !project.category.includes(filters.sector))) {
          return false;
        }
        
        // Filter by collaboration type (duration)
        if (filters.duration && project.collaboration_type !== filters.duration) {
          return false;
        }
        
        // Filter by experience level (stage)
        if (filters.stage) {
          const stageMap: Record<string, string> = {
            'Idée / Concept': 'beginner',
            'Prototype / MVP': 'beginner',
            'En développement': 'any',
            'Lancé / En croissance': 'experienced',
            'Mature / Établi': 'experienced'
          };
          
          if (project.experience_level !== stageMap[filters.stage] && project.experience_level !== 'any') {
            return false;
          }
        }
        
        // Filter by skills
        if (filters.skills.length > 0 && (!project.required_skills || !filters.skills.some(skill => 
          project.required_skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
        ))) {
          return false;
        }
        
        return true;
      });
    }
  }, [items, filters, userType]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (remainingSwipes <= 0) {
      setShowLimitModal(true);
      return;
    }

    if (direction === 'right') {
      setShowMatchModal(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }

    setRemainingSwipes(prev => prev - 1);
  };

  const handleCloseMatch = () => {
    setShowMatchModal(false);
    setCurrentIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-xl font-semibold mb-2">
          Aucun {userType === 'project_owner' ? 'talent' : 'projet'} trouvé
        </h3>
        <p className="text-gray-600 mb-6">
          Essayez d'élargir votre zone de recherche ou de modifier vos filtres
        </p>
      </div>
    );
  }

  if (currentIndex >= filteredItems.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-xl font-semibold mb-2">
          Plus de {userType === 'project_owner' ? 'talents' : 'projets'} pour aujourd'hui !
        </h3>
        <p className="text-gray-600 mb-6">
          Créez un compte pour découvrir plus de {userType === 'project_owner' ? 'talents' : 'projets'}
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            Créer un compte
          </Link>
        </Button>
      </div>
    );
  }

  if (remainingSwipes <= 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <Crown className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Limite de swipes atteinte
        </h3>
        <p className="text-gray-600 mb-6">
          Créez un compte pour continuer à swiper !
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            Créer un compte
          </Link>
        </Button>
      </div>
    );
  }

  const currentItem = filteredItems[currentIndex];

  return (
    <div className="relative h-full">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Info className="h-4 w-4" />
          <span>Mode invité</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {userType === 'project_owner' && (
          <GuestTalentCard
            key={currentItem.id}
            talent={currentItem as UserProfile}
            onSwipe={handleSwipe}
            onViewDetails={() => setShowMatchModal(true)}
          />
        )}
        {userType === 'project_seeker' && (
          <GuestProjectCard
            key={currentItem.id}
            project={currentItem as Project}
            onSwipe={handleSwipe}
            onViewDetails={() => setShowMatchModal(true)}
          />
        )}
        {userType === 'investor' && (
          <GuestInvestorCard
            key={currentItem.id}
            project={currentItem as Project}
            onSwipe={handleSwipe}
            onViewDetails={() => setShowMatchModal(true)}
          />
        )}
      </AnimatePresence>

      {/* Swipe counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
        <p className="text-sm text-gray-600">
          {remainingSwipes} swipes restants en mode invité
        </p>
      </div>

      {/* Match modal */}
      {showMatchModal && (
        <GuestMatchModal
          open={showMatchModal}
          onOpenChange={handleCloseMatch}
          item={currentItem}
          type={userType === 'project_owner' ? 'talent' : 'project'}
        />
      )}

      {/* Limit modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">
              Limite atteinte
            </h3>
            <p className="text-gray-700 mb-6">
              Vous avez atteint la limite de swipes en mode invité. Créez un compte pour continuer à explorer !
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLimitModal(false)}
              >
                Fermer
              </Button>
              <Button
                className="flex-1"
                asChild
              >
                <Link to="/">
                  Créer un compte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
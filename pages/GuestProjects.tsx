import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/stores/location';
import { LocationFilter } from '@/components/search/LocationFilter';
import { FilterBar } from '@/components/search/FilterBar';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GuestProjectCard } from '@/components/guest/GuestProjectCard';
import { GuestInvestorCard } from '@/components/guest/GuestInvestorCard';
import { GuestMatchModal } from '@/components/guest/GuestMatchModal';
import type { Project } from '@/lib/types';
import { BackButton } from '@/components/BackButton';

interface GuestProjectsProps {
  userType?: 'project_seeker' | 'investor';
}

export function GuestProjects({ userType = 'project_seeker' }: GuestProjectsProps) {
  const { selectedCity, radius } = useLocationStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSwipes, setRemainingSwipes] = useState(5); // Limite pour les invités
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[]
  });

  // Fetch projects based on location
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['guest-projects', selectedCity?.id, radius],
    queryFn: async () => {
      if (!selectedCity) return [];
      
      const { data, error } = await supabase.rpc('search_projects_by_location', {
        center_lat: selectedCity.latitude,
        center_lon: selectedCity.longitude,
        radius_km: radius
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCity
  });

  // Apply filters
  const filteredProjects = React.useMemo(() => {
    return projects.filter(project => {
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
        project.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ))) {
        return false;
      }
      
      return true;
    });
  }, [projects, filters]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (remainingSwipes <= 0) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-xl font-semibold">
              {userType === 'investor' ? 'Opportunités d\'investissement' : 'Découvrir des projets'}
            </h1>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Mode invité</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LocationFilter />
            <FilterBar 
              filters={filters}
              onChange={setFilters}
              type="project"
            />
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ height: 'calc(100vh - 180px)' }}>
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : !selectedCity ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Commencez à explorer !
                </h3>
                <p className="text-gray-600">
                  Sélectionnez une ville pour découvrir les projets dans votre zone
                </p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez d'élargir votre zone de recherche ou de modifier vos filtres
                </p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({
                    sector: '',
                    duration: '',
                    stage: '',
                    skills: []
                  })}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : currentIndex >= filteredProjects.length ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Plus de projets pour aujourd'hui !
                </h3>
                <p className="text-gray-600 mb-6">
                  Créez un compte pour découvrir plus de projets
                </p>
                <Button asChild>
                  <a href="/">Créer un compte</a>
                </Button>
              </div>
            ) : remainingSwipes <= 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Limite de swipes atteinte
                </h3>
                <p className="text-gray-600 mb-6">
                  En mode invité, vous êtes limité à 5 swipes. Créez un compte pour continuer !
                </p>
                <Button asChild>
                  <a href="/">Créer un compte</a>
                </Button>
              </div>
            ) : (
              <div className="relative h-full">
                {userType === 'investor' ? (
                  <GuestInvestorCard
                    project={filteredProjects[currentIndex]}
                    onSwipe={handleSwipe}
                    onViewDetails={() => setShowMatchModal(true)}
                  />
                ) : (
                  <GuestProjectCard
                    project={filteredProjects[currentIndex]}
                    onSwipe={handleSwipe}
                    onViewDetails={() => setShowMatchModal(true)}
                  />
                )}
                
                {/* Swipe counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                  <p className="text-sm text-gray-600">
                    {remainingSwipes} swipes restants en mode invité
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Match modal */}
      {showMatchModal && filteredProjects[currentIndex] && (
        <GuestMatchModal
          open={showMatchModal}
          onOpenChange={handleCloseMatch}
          item={filteredProjects[currentIndex]}
          type="project"
        />
      )}
    </div>
  );
}
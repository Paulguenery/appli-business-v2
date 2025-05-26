import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/use-subscription';
import { useLocationStore } from '@/stores/location';
import { LocationFilter } from '@/components/search/LocationFilter';
import { FilterBar } from '@/components/search/FilterBar';
import { Button } from '@/components/ui/button';
import { ProjectDetailModal } from '@/components/swipe/ProjectDetailModal';
import { SwipeInterface } from '@/components/swipe/SwipeInterface';
import { BackButton } from '@/components/BackButton';
import type { UserProfile } from '@/lib/types';

export function ProjectOwnerSwipe() {
  const { selectedCity, radius } = useLocationStore();
  const { limits } = useSubscription();
  const [selectedTalent, setSelectedTalent] = useState<UserProfile | null>(null);
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[],
  });

  // Fetch talents based on location
  const { data: talents = [], isLoading } = useQuery({
    queryKey: ['owner-talents', selectedCity?.id, radius],
    queryFn: async () => {
      if (!selectedCity) return [];
      
      const { data, error } = await supabase.rpc('search_profiles_by_location', {
        center_lat: selectedCity.latitude,
        center_lon: selectedCity.longitude,
        radius_km: radius,
        role_filter: 'project_seeker'
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCity
  });

  // Apply filters
  const filteredTalents = React.useMemo(() => {
    return talents.filter(talent => {
      // Filter by sector
      if (filters.sector && (!talent.sectors || !talent.sectors.some(s => s.includes(filters.sector)))) {
        return false;
      }
      
      // Filter by skills
      if (filters.skills.length > 0 && (!talent.skills || !filters.skills.some(skill => 
        talent.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
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
  }, [talents, filters]);

  // Handle swipe action
  const handleSwipe = async (talentId: string, direction: 'left' | 'right') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Create a match if swiping right
      if (direction === 'right') {
        // Get the owner's projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('owner_id', profile.id)
          .limit(1);

        if (projects?.[0]) {
          await supabase
            .from('project_matches')
            .insert({
              project_id: projects[0].id,
              seeker_id: talentId,
              status: 'pending'
            });
        }
      }

      // Log the swipe history
      await supabase
        .from('swipe_history')
        .insert({
          user_id: profile.id,
          swiped_id: talentId,
          swipe_type: direction
        });
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <BackButton />
            <h1 className="text-2xl font-bold">Rechercher des talents</h1>
            <LocationFilter />
            <FilterBar 
              filters={filters}
              onChange={setFilters}
              type="talent"
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
                  Sélectionnez une ville pour découvrir les talents dans votre zone
                </p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Aucun talent trouvé
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
            ) : (
              <SwipeInterface
                items={filteredTalents}
                type="talent"
                onSwipe={handleSwipe}
                remainingSwipes={limits.dailySwipes}
              />
            )}
          </div>
        </div>
      </div>

      {selectedTalent && (
        <ProjectDetailModal
          open={!!selectedTalent}
          onOpenChange={(open) => !open && setSelectedTalent(null)}
          item={selectedTalent}
          type="talent"
        />
      )}
    </div>
  );
}
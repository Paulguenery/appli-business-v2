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
import type { Project } from '@/lib/types';

export function InvestorSwipe() {
  const { selectedCity, radius } = useLocationStore();
  const { limits } = useSubscription();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[],
  });

  // Fetch investment opportunities based on location
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['investor-projects', selectedCity?.id, radius],
    queryFn: async () => {
      if (!selectedCity) return [];
      
      const { data, error } = await supabase.rpc('search_projects_by_location', {
        center_lat: selectedCity.latitude,
        center_lon: selectedCity.longitude,
        radius_km: radius
      });

      if (error) throw error;
      
      // Pour les investisseurs, on ne montre que les projets ouverts à l'investissement
      const investmentProjects = data.filter((project: Project) => {
        // Utiliser la propriété open_to_investment si elle existe, sinon utiliser une heuristique
        if ('open_to_investment' in project) {
          return project.open_to_investment;
        }
        
        // Fallback: considérer que chaque 3ème projet est ouvert à l'investissement
        const projectIdNumber = parseInt(project.id.replace(/-/g, '').substring(0, 8), 16);
        return projectIdNumber % 3 === 0;
      });
      
      return investmentProjects;
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
      
      // Filter by stage (for investors, this is particularly important)
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
      
      // Other filters are less relevant for investors but still applied
      if (filters.duration && project.collaboration_type !== filters.duration) {
        return false;
      }
      
      if (filters.skills.length > 0 && (!project.required_skills || !filters.skills.some(skill => 
        project.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      ))) {
        return false;
      }
      
      return true;
    });
  }, [projects, filters]);

  // Handle swipe action
  const handleSwipe = async (projectId: string, direction: 'left' | 'right') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('user_id', user.id)
        .single();

      // For investors, we create a notification for the project owner when swiping right
      if (direction === 'right') {
        // Get project details
        const { data: project } = await supabase
          .from('projects')
          .select('owner_id, title')
          .eq('id', projectId)
          .single();

        if (project && profile) {
          // Get project owner's user ID
          const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('id', project.owner_id)
            .single();

          if (ownerProfile) {
            // Create a notification
            await supabase
              .from('notifications')
              .insert({
                user_id: ownerProfile.user_id,
                type: 'project',
                title: 'Intérêt d\'un investisseur',
                content: `L'investisseur ${profile.full_name} a manifesté son intérêt pour votre projet "${project.title}"`,
                data: {
                  project_id: projectId,
                  investor_id: profile.id,
                  investor_name: profile.full_name
                }
              });
          }
        }
      }

      // Log the swipe history
      await supabase
        .from('swipe_history')
        .insert({
          user_id: profile.id,
          swiped_id: projectId,
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
            <h1 className="text-2xl font-bold">Opportunités d'investissement</h1>
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
                  Sélectionnez une ville pour découvrir les opportunités d'investissement dans votre zone
                </p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Aucune opportunité trouvée
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
                items={filteredProjects}
                type="project"
                onSwipe={handleSwipe}
                remainingSwipes={limits.dailySwipes}
              />
            )}
          </div>
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailModal
          open={!!selectedProject}
          onOpenChange={(open) => !open && setSelectedProject(null)}
          item={selectedProject}
          type="project"
        />
      )}
    </div>
  );
}
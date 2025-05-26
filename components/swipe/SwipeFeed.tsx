import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SwipeInterface } from './SwipeInterface';
import { useSubscription } from '@/hooks/use-subscription';
import { useLocationStore } from '@/stores/location';
import { LocationFilter } from '@/components/search/LocationFilter';
import { FilterBar } from '@/components/search/FilterBar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '@/lib/types';

interface SwipeFeedProps {
  type: 'project' | 'talent';
}

export function SwipeFeed({ type }: SwipeFeedProps) {
  const { selectedCity, radius } = useLocationStore();
  const { limits } = useSubscription();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[],
  });

  const { data: items = [] } = useQuery({
    queryKey: ['swipe-items', type, selectedCity?.id, radius, filters],
    queryFn: async () => {
      if (!selectedCity) return [];

      const rpcName = type === 'project' 
        ? 'search_projects_by_location' 
        : 'search_profiles_by_location';

      const { data, error } = await supabase.rpc(rpcName, {
        center_lat: selectedCity.latitude,
        center_lon: selectedCity.longitude,
        radius_km: radius
      });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedCity
  });

  // Apply filters client-side since the RPC doesn't support them
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.sector && item.category !== filters.sector) return false;
      if (filters.duration && item.collaboration_type !== filters.duration) return false;
      if (filters.stage && item.experience_level !== filters.stage) return false;
      if (filters.skills.length && !filters.skills.every(skill => item.required_skills?.includes(skill))) return false;
      return true;
    });
  }, [items, filters]);

  const handleSwipe = async (itemId: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (type === 'project') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        await supabase
          .from('project_matches')
          .insert({
            project_id: itemId,
            seeker_id: profile.id,
            status: 'pending'
          });
      } else {
        // Handle talent match
        const { data: ownerProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('owner_id', ownerProfile.id)
          .limit(1);

        if (projects?.[0]) {
          await supabase
            .from('project_matches')
            .insert({
              project_id: projects[0].id,
              seeker_id: itemId,
              status: 'pending'
            });
        }
      }
    }

    // Log swipe history
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    await supabase
      .from('swipe_history')
      .insert({
        user_id: profile.id,
        swiped_id: itemId,
        swipe_type: direction
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">
                {type === 'project' ? 'Découvrir des projets' : 'Rechercher des talents'}
              </h1>
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
              type={type}
            />
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ height: 'calc(100vh - 180px)' }}>
            {selectedCity ? (
              <SwipeInterface
                items={filteredItems}
                type={type}
                onSwipe={handleSwipe}
                remainingSwipes={limits.dailySwipes}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Commencez à swiper !
                </h3>
                <p className="text-gray-600">
                  Sélectionnez une ville pour découvrir les {type === 'project' ? 'projets' : 'talents'} dans votre zone
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
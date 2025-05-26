import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SwipeInterface } from '@/components/swipe/SwipeInterface';
import { useSubscription } from '@/hooks/use-subscription';
import { useLocationStore } from '@/stores/location';
import { LocationFilter } from '@/components/search/LocationFilter';

export function TalentSearch() {
  const { selectedCity, radius } = useLocationStore();
  const { limits } = useSubscription();

  const { data: talents = [] } = useQuery({
    queryKey: ['talents', selectedCity?.id],
    queryFn: async () => {
      if (!selectedCity) return [];

      const { data, error } = await supabase.rpc('search_profiles_by_location', {
        center_lat: selectedCity.latitude,
        center_lon: selectedCity.longitude,
        radius_km: radius,
        role_filter: 'project_seeker'
      });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedCity
  });

  const handleSwipe = async (profileId: string, direction: 'left' | 'right') => {
    if (direction === 'right') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
            seeker_id: profileId,
            status: 'pending'
          });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <LocationFilter />
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ height: 'calc(100vh - 180px)' }}>
            {selectedCity ? (
              <SwipeInterface
                items={talents}
                type="talent"
                onSwipe={handleSwipe}
                remainingSwipes={limits.dailySwipes}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Commencez à swiper !
                </h3>
                <p className="text-gray-600">
                  Sélectionnez une ville pour découvrir les talents dans votre zone
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
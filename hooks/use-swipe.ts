import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/supabase';
import { useSubscription } from './use-subscription';

export function useSwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();
  const { limits } = useSubscription();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['swipe-projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_interest_links (
            interest_id
          ),
          profiles!projects_owner_id_fkey (
            full_name,
            city,
            is_verified
          )
        `)
        .not('project_matches.project_id', 'eq', 'id')
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  const { mutate: createMatch } = useMutation({
    mutationFn: async (projectId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('project_matches')
        .insert({
          project_id: projectId,
          seeker_id: profile.id,
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  const swipeLeft = () => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const swipeRight = async () => {
    if (limits.dailySwipes === 0) {
      throw new Error('Daily swipe limit reached');
    }

    const project = projects[currentIndex];
    if (project) {
      await createMatch(project.id);
    }

    if (currentIndex < projects.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  return {
    currentProject: projects[currentIndex],
    hasMore: currentIndex < projects.length - 1,
    swipeLeft,
    swipeRight,
    remainingSwipes: limits.dailySwipes,
  };
}
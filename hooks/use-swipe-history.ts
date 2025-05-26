import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface SwipeHistoryItem {
  id: string;
  user_id: string;
  swiped_id: string;
  swipe_type: 'left' | 'right';
  created_at: string;
  item_details?: any;
}

export function useSwipeHistory() {
  const queryClient = useQueryClient();

  const { data: history = [], isLoading } = useQuery<SwipeHistoryItem[]>({
    queryKey: ['swipe-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('swipe_history')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch details for each swiped item
      const enrichedData = await Promise.all(
        data.map(async (item) => {
          // Try to get project details
          const { data: projectData } = await supabase
            .from('projects')
            .select('title, brief_description, category, image_url')
            .eq('id', item.swiped_id)
            .single();

          if (projectData) {
            return { ...item, item_details: { ...projectData, type: 'project' } };
          }

          // Try to get profile details
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, bio, role, avatar_url')
            .eq('id', item.swiped_id)
            .single();

          if (profileData) {
            return { ...item, item_details: { ...profileData, type: 'profile' } };
          }

          return item;
        })
      );

      return enrichedData;
    }
  });

  const { mutate: undoLastSwipe } = useMutation({
    mutationFn: async () => {
      if (!history.length) return;
      
      const lastSwipe = history[0];
      
      const { error } = await supabase
        .from('swipe_history')
        .delete()
        .eq('id', lastSwipe.id);

      if (error) throw error;

      // If it was a right swipe, also delete the match
      if (lastSwipe.swipe_type === 'right') {
        if (lastSwipe.item_details?.type === 'project') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user?.id)
            .single();

          await supabase
            .from('project_matches')
            .delete()
            .match({
              project_id: lastSwipe.swiped_id,
              seeker_id: profile.id
            });
        } else {
          // Handle talent match undo
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', user?.id)
            .single();

          const { data: projects } = await supabase
            .from('projects')
            .select('id')
            .eq('owner_id', profile.id);

          if (projects?.length) {
            await supabase
              .from('project_matches')
              .delete()
              .match({
                project_id: projects[0].id,
                seeker_id: lastSwipe.swiped_id
              });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swipe-history'] });
    }
  });

  return {
    history,
    isLoading,
    undoLastSwipe
  };
}
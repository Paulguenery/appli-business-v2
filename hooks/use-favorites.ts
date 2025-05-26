import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return [];

      const { data, error } = await supabase.rpc('get_favorites', {
        p_user_id: profile.id,
        p_item_type: null
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { mutate: addToFavorites } = useMutation({
    mutationFn: async ({ itemId, itemType }: { itemId: string; itemType: 'project' | 'profile' }) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: profile.id,
          item_id: itemId,
          item_type: itemType
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });

  const { mutate: removeFromFavorites } = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({
          user_id: profile.id,
          item_id: itemId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });

  const isFavorite = (itemId: string) => {
    return favorites.some(favorite => favorite.item_id === itemId);
  };

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };
}
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ThumbsUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

interface Suggestion {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  _count: {
    likes: number;
  };
  has_liked: boolean;
}

export function SuggestionsPanel() {
  const [newSuggestion, setNewSuggestion] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('suggestions')
        .select(`
          *,
          profiles (
            full_name
          ),
          _count (
            likes: suggestion_likes(count)
          ),
          has_liked: suggestion_likes!inner(
            user_id
          )
        `)
        .eq('suggestion_likes.user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { mutate: createSuggestion } = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('suggestions')
        .insert({
          content,
          user_id: profile.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      setNewSuggestion('');
    },
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async ({ suggestionId, hasLiked }: { suggestionId: string; hasLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (hasLiked) {
        await supabase
          .from('suggestion_likes')
          .delete()
          .eq('suggestion_id', suggestionId)
          .eq('user_id', profile.id);
      } else {
        await supabase
          .from('suggestion_likes')
          .insert({
            suggestion_id: suggestionId,
            user_id: profile.id,
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim()) return;
    createSuggestion(newSuggestion);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-500" />
        <h2 className="text-xl font-semibold">Suggestions d'amélioration</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
            placeholder="Partagez votre suggestion pour améliorer l'application..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit">
            Suggérer
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-900">{suggestion.content}</p>
                <p className="text-sm text-gray-500">
                  Suggéré par {suggestion.profiles.full_name}
                </p>
              </div>
              <button
                onClick={() => toggleLike({
                  suggestionId: suggestion.id,
                  hasLiked: suggestion.has_liked,
                })}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                  suggestion.has_liked
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{suggestion._count.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
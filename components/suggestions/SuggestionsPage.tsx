import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Suggestion {
  id: string;
  content: string;
  is_public: boolean;
  user_type: string;
  created_at: string;
  profiles: {
    full_name: string;
  };
  _count: {
    likes: number;
  };
  has_liked: boolean;
}

const userTypeLabels = {
  project_owner: 'Porteur de projet',
  project_seeker: 'Chercheur de projet',
  investor: 'Investisseur'
};

const MIN_CHARS = 20;

export function SuggestionsPage() {
  const [newSuggestion, setNewSuggestion] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: suggestions = [] } = useQuery<Suggestion[]>({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, user_type')
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
          has_liked: suggestion_likes!left(
            user_id
          )
        `)
        .eq('suggestion_likes.user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to handle the left join results
      return data?.map(suggestion => ({
        ...suggestion,
        has_liked: suggestion.has_liked.length > 0
      })) || [];
    },
  });

  const { mutate: createSuggestion, isLoading } = useMutation({
    mutationFn: async ({ content, isPublic }: { content: string; isPublic: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, user_type')
        .eq('user_id', user.id)
        .single();

      const { error } = await supabase
        .from('suggestions')
        .insert({
          content,
          is_public: isPublic,
          user_id: profile.id,
          user_type: profile.user_type
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      setNewSuggestion('');
      setIsPublic(true);
      setError(null);
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
    
    if (newSuggestion.trim().length < MIN_CHARS) {
      setError(`La suggestion doit contenir au moins ${MIN_CHARS} caractères`);
      return;
    }

    createSuggestion({ content: newSuggestion.trim(), isPublic });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Suggestions d'amélioration</h1>
            <p className="text-gray-600">
              Partagez vos idées pour améliorer la plateforme
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre suggestion
              </label>
              <textarea
                value={newSuggestion}
                onChange={(e) => {
                  setNewSuggestion(e.target.value);
                  if (error) setError(null);
                }}
                rows={4}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  error 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={`Partagez votre suggestion pour améliorer l'application (minimum ${MIN_CHARS} caractères)...`}
              />
              {error && (
                <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="mt-1 text-sm text-gray-500">
                {newSuggestion.length} / {MIN_CHARS} caractères minimum
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-gray-600">
                Rendre cette suggestion publique
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || newSuggestion.trim().length < MIN_CHARS}
            >
              {isLoading ? 'Publication...' : 'Publier la suggestion'}
            </Button>
          </form>
        </div>

        {/* Real suggestions */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {suggestion.profiles.full_name}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {userTypeLabels[suggestion.user_type as keyof typeof userTypeLabels]}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(suggestion.created_at), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </span>
                  </div>
                  <p className="text-gray-900 mt-2">{suggestion.content}</p>
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
                  <ThumbsUp className="h-4 w-4" />
                  <span>{suggestion._count.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
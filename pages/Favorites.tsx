import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Calendar, Briefcase, Trash2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/use-favorites';

interface Favorite {
  favorite_id: string;
  item_id: string;
  item_type: 'project' | 'profile';
  created_at: string;
  item_details: any;
}

export function Favorites() {
  const navigate = useNavigate();
  const { favorites, isLoading, removeFromFavorites } = useFavorites();

  const handleViewItem = (favorite: Favorite) => {
    if (favorite.item_type === 'project') {
      navigate(`/projects/${favorite.item_id}`);
    } else {
      navigate(`/profiles/${favorite.item_id}`);
    }
  };

  const handleMessage = (favorite: Favorite) => {
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
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
            <h1 className="text-2xl font-bold">Mes favoris</h1>
            <p className="text-gray-600">
              {favorites.length} élément{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore ajouté d'éléments à vos favoris
            </p>
            <Button onClick={() => navigate('/search-projects')}>
              Découvrir des projets
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <div
                key={favorite.favorite_id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {favorite.item_type === 'project' 
                        ? favorite.item_details.title
                        : favorite.item_details.full_name}
                    </h3>
                    {favorite.item_type === 'project' ? (
                      <p className="text-gray-600 flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {favorite.item_details.collaboration_type}
                      </p>
                    ) : (
                      <p className="text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {favorite.item_details.availability}
                      </p>
                    )}
                  </div>
                  {favorite.item_details.is_verified && (
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      Vérifié
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {favorite.item_details.description || favorite.item_details.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {(favorite.item_type === 'project' 
                    ? favorite.item_details.required_skills 
                    : favorite.item_details.skills
                  )?.slice(0, 3).map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromFavorites(favorite.item_id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Retirer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMessage(favorite)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleViewItem(favorite)}
                    className="flex-1"
                  >
                    Voir le détail
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
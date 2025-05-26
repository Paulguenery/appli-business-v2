import { useQuery } from "@tanstack/react-query";
import { Project, ProjectMatch, supabase } from "@/lib/supabase";
import { StatsCard } from "./StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  ThumbsUp, 
  Eye, 
  TrendingUp, 
  Search,
  Crown,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { SubscriptionCard } from "../subscription/SubscriptionCard";

export function ProjectSeekerDashboard() {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();

  const { data: matches = [] } = useQuery<ProjectMatch[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const { data, error } = await supabase
        .from('project_matches')
        .select(`
          *,
          projects (
            id,
            title,
            description
          )
        `)
        .eq('seeker_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const totalMatches = matches.length;
  const projectsViewed = isPremium ? 156 : "Premium uniquement";
  const profileViews = isPremium ? 89 : "Premium uniquement";
  const responseRate = isPremium ? "73%" : "Premium uniquement";

  const handleSearchProjects = () => {
    navigate('/swipe');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-gray-600">Suivez vos opportunités et votre activité</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          {!isPremium && (
            <Button
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
            >
              <Link to="/subscribe" className="flex items-center justify-center gap-2">
                <Crown className="h-4 w-4" />
                <span>Premium</span>
              </Link>
            </Button>
          )}
          <Button 
            onClick={handleSearchProjects} 
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Découvrir des projets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Matches totaux"
          value={totalMatches}
          icon={ThumbsUp}
        />
        <StatsCard
          title="Projets consultés"
          value={projectsViewed}
          icon={Briefcase}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
        <StatsCard
          title="Vues de votre profil"
          value={profileViews}
          icon={Eye}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
        <StatsCard
          title="Taux de réponse"
          value={responseRate}
          icon={TrendingUp}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
      </div>

      {!isPremium && (
        <SubscriptionBanner userType="project_seeker" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Nouvelle interface de swipe</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link to="/swipe" className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Essayer
                  </Link>
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Découvrez notre nouvelle interface de swipe avec plus d'options pour trouver les projets qui vous correspondent.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium mb-1">Swipe Up</div>
                  <p className="text-sm text-gray-600">Ajoutez directement aux favoris</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium mb-1">Swipe Down</div>
                  <p className="text-sm text-gray-600">Masquez définitivement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Matches récents</h2>
              
              {matches.length > 0 ? (
                <div className="space-y-4">
                  {matches.slice(0, 3).map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{match.projects?.title}</div>
                        <div className="text-sm text-gray-500">
                          {match.status === 'pending' ? 'En attente' : 
                           match.status === 'accepted' ? 'Accepté' : 'Refusé'}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link to={`/messages`}>
                          Voir
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore de matches</p>
                  <Button 
                    onClick={handleSearchProjects}
                  >
                    Découvrir des projets
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <SubscriptionCard userType="project_seeker" />
        </div>
      </div>
    </div>
  );
}
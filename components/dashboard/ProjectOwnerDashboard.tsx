import { useQuery } from "@tanstack/react-query";
import { Project, ProjectMatch, supabase } from "@/lib/supabase";
import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Users, Eye, Star, TrendingUp, PlusCircle, Search, Crown, ArrowUpRight } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { SubscriptionCard } from "../subscription/SubscriptionCard";

function ProjectOwnerDashboard() {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['projects', user?.id],
    queryFn: async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', profile.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: matches = [] } = useQuery<ProjectMatch[]>({
    queryKey: ['matches', projects],
    queryFn: async () => {
      if (!projects.length) return [];
      
      const { data, error } = await supabase
        .from('project_matches')
        .select('*')
        .in('project_id', projects.map(p => p.id));
      
      if (error) throw error;
      return data;
    },
    enabled: projects.length > 0
  });

  const activeProjects = projects.length;
  const totalMatches = matches.length;
  const profileViews = isPremium ? 245 : "Premium uniquement";
  const matchRate = isPremium ? "68%" : "Premium uniquement";

  const handleSearchTalents = () => {
    navigate('/swipe');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-gray-600">Gérez vos projets et suivez vos performances</p>
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
          <Button asChild className="w-full sm:w-auto">
            <Link to="/new-project" className="flex items-center justify-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSearchTalents} 
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Rechercher des talents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Projets actifs"
          value={activeProjects}
          icon={Star}
        />
        <StatsCard
          title="Matches totaux"
          value={totalMatches}
          icon={Users}
        />
        <StatsCard
          title="Vues du profil"
          value={profileViews}
          icon={Eye}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
        <StatsCard
          title="Taux de match"
          value={matchRate}
          icon={TrendingUp}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
      </div>

      {!isPremium && (
        <SubscriptionBanner userType="project_owner" />
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
                Découvrez notre nouvelle interface de swipe avec plus d'options pour trouver les talents parfaits pour vos projets.
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
              <h2 className="text-xl font-semibold mb-4">Projets récents</h2>
              
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-500">{project.category}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {matches.filter(m => m.project_id === project.id).length} matches
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Vous n'avez pas encore de projets</p>
                  <Button asChild>
                    <Link to="/new-project">Créer un projet</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <SubscriptionCard userType="project_owner" />
        </div>
      </div>
    </div>
  );
}

export { ProjectOwnerDashboard };
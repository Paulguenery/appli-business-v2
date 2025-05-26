import { useQuery } from "@tanstack/react-query";
import { Project, ProjectMatch, supabase } from "@/lib/supabase";
import { StatsCard } from "./StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Eye, 
  Star, 
  TrendingUp,
  Search,
  Crown,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { SubscriptionCard } from "../subscription/SubscriptionCard";

export function InvestorDashboard() {
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
  const investmentRate = isPremium ? "73%" : "Premium uniquement";

  const handleSearchProjects = () => {
    navigate('/swipe');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-gray-600">Suivez vos opportunités d'investissement</p>
        </div>
        <div className="flex gap-2">
          {!isPremium && (
            <Button
              asChild
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white"
            >
              <Link to="/subscribe" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Premium</span>
              </Link>
            </Button>
          )}
          <Button onClick={handleSearchProjects} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Découvrir des projets
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Matches totaux"
          value={totalMatches}
          icon={Briefcase}
        />
        <StatsCard
          title="Projets consultés"
          value={projectsViewed}
          icon={Eye}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
        <StatsCard
          title="Vues de votre profil"
          value={profileViews}
          icon={Star}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
        <StatsCard
          title="Taux d'investissement"
          value={investmentRate}
          icon={TrendingUp}
          description={!isPremium ? "Passez à Premium pour voir vos statistiques" : undefined}
        />
      </div>

      {!isPremium && (
        <SubscriptionBanner userType="investor" />
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
                Découvrez notre nouvelle interface de swipe avec plus d'options pour trouver les opportunités d'investissement qui vous correspondent.
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
              <h2 className="text-xl font-semibold mb-4">Opportunités d'investissement</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Startup EdTech</div>
                      <div className="text-sm text-gray-500">Valorisation: 500K€ - 700K€</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to="/swipe">
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Plateforme SaaS B2B</div>
                      <div className="text-sm text-gray-500">Valorisation: 1.2M€ - 1.5M€</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to="/swipe">
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">App Fintech</div>
                      <div className="text-sm text-gray-500">Valorisation: 800K€ - 1M€</div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to="/swipe">
                        Voir
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <SubscriptionCard userType="investor" />
        </div>
      </div>
    </div>
  );
}
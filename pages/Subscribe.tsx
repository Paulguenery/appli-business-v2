import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ProjectOwnerPlans } from '@/components/subscription/ProjectOwnerPlans';
import { ProjectSeekerPlans } from '@/components/subscription/ProjectSeekerPlans';
import { InvestorPlans } from '@/components/subscription/InvestorPlans';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export function Subscribe() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!user
  });

  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const isLoading = isProfileLoading || isSubscriptionLoading;

  const renderPlans = () => {
    if (!profile?.user_type) return null;

    switch (profile.user_type) {
      case 'project_owner':
        return <ProjectOwnerPlans currentPlan={subscription?.plan} isLoading={isLoading} />;
      case 'project_seeker':
        return <ProjectSeekerPlans currentPlan={subscription?.plan} isLoading={isLoading} />;
      case 'investor':
        return <InvestorPlans currentPlan={subscription?.plan} isLoading={isLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold">Abonnements</h1>
            <p className="text-gray-600">
              Choisissez le forfait qui correspond à vos besoins
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !profile?.user_type ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">Profil incomplet</h2>
            <p className="text-yellow-700 mb-4">
              Vous devez compléter votre profil avant de pouvoir souscrire à un abonnement.
            </p>
            <Button onClick={() => navigate('/onboarding')}>
              Compléter mon profil
            </Button>
          </div>
        ) : (
          renderPlans()
        )}

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Questions fréquentes
          </h2>
          <dl className="space-y-8">
            <div>
              <dt className="text-lg font-semibold text-gray-900">
                Comment fonctionne le système de match ?
              </dt>
              <dd className="mt-2 text-gray-600">
                Le match est déclenché lorsque deux utilisateurs manifestent un intérêt mutuel (swipe à droite).
                C'est seulement après un match que les fonctionnalités de communication sont débloquées selon votre forfait.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-gray-900">
                Puis-je changer de forfait à tout moment ?
              </dt>
              <dd className="mt-2 text-gray-600">
                Oui, vous pouvez upgrader ou downgrader votre forfait à tout moment.
                Les changements prennent effet immédiatement.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-gray-900">
                Comment fonctionne le forfait Pay-per-conversation ?
              </dt>
              <dd className="mt-2 text-gray-600">
                Avec ce forfait, vous payez uniquement pour les conversations que vous souhaitez débloquer.
                Chaque paiement débloque une conversation spécifique avec messages illimités et appels visio.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-gray-900">
                Comment fonctionne le remboursement ?
              </dt>
              <dd className="mt-2 text-gray-600">
                Si vous n'êtes pas satisfait, nous vous remboursons intégralement
                dans les 14 jours suivant votre abonnement.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
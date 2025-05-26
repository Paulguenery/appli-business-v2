import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Rocket, Zap, Trophy, Star, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoostModal } from './BoostModal';
import { useAuth } from '@/hooks/use-auth';

export function PremiumFeatures() {
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const { user, isPremium } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: profileViews = [] } = useQuery({
    queryKey: ['profile-views', profile?.id],
    queryFn: async () => {
      if (!profile?.id) throw new Error('Profile not found');

      const { data, error } = await supabase
        .from('profile_views')
        .select('*, profiles!profile_views_viewer_id_fkey(full_name)')
        .eq('viewed_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id && isPremium
  });

  const features = [
    {
      title: 'Boost de profil',
      description: 'Augmentez votre visibilité pendant 7 jours',
      icon: Rocket,
      action: () => setIsBoostModalOpen(true),
      enabled: isPremium && (!profile?.boost_until || new Date(profile.boost_until) < new Date())
    },
    {
      title: 'Messages illimités',
      description: 'Envoyez autant de messages que vous voulez',
      icon: Zap,
      value: isPremium ? 'Illimité' : `${profile?.daily_messages_left || 0} restants`,
      enabled: isPremium
    },
    {
      title: 'Swipes illimités',
      description: 'Découvrez tous les projets sans limite',
      icon: Trophy,
      value: isPremium ? 'Illimité' : `${profile?.daily_swipes_left || 0} restants`,
      enabled: isPremium
    },
    {
      title: 'Vues du profil',
      description: 'Qui a consulté votre profil',
      icon: Eye,
      value: profileViews.length,
      enabled: isPremium,
      details: profileViews.slice(0, 5).map(view => ({
        name: view.profiles.full_name,
        date: new Date(view.created_at).toLocaleDateString()
      }))
    },
    {
      title: 'Badge Premium',
      description: 'Distinguez-vous avec un badge exclusif',
      icon: Star,
      enabled: isPremium
    },
    {
      title: 'Agenda RDV',
      description: 'Gérez vos rendez-vous professionnels',
      icon: Calendar,
      action: () => window.location.href = '/calendar',
      enabled: isPremium
    }
  ];

  if (!isPremium) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className={!feature.enabled ? 'opacity-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {feature.title}
              </CardTitle>
              <feature.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
              {feature.value && (
                <p className="mt-2 text-2xl font-bold">{feature.value}</p>
              )}
              {feature.details && (
                <div className="mt-2 space-y-1">
                  {feature.details.map((detail, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {detail.name} - {detail.date}
                    </p>
                  ))}
                </div>
              )}
              {feature.action && feature.enabled && (
                <Button
                  onClick={feature.action}
                  className="mt-4 w-full"
                  size="sm"
                >
                  Activer
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <BoostModal
        open={isBoostModalOpen}
        onOpenChange={setIsBoostModalOpen}
      />
    </>
  );
}
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type SubscriptionPlan = 
  | 'freemium_owner' | 'starter_owner' | 'premium_owner'
  | 'freemium_seeker' | 'pay_per_conversation' | 'standard_seeker' | 'premium_seeker'
  | 'basic_investor' | 'pro_investor';

interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'expired';
  starts_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

interface SubscriptionFeatures {
  daily_swipes_limit: number;
  daily_messages_limit: number;
  can_initiate_chat: boolean;
  can_view_documents: boolean;
  can_schedule_meetings: boolean;
  has_advanced_matching: boolean;
  has_profile_boost: boolean;
  has_premium_badge: boolean;
  max_active_projects?: number;
  max_active_conversations?: number;
}

export function useSubscription() {
  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery<Subscription>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: features, isLoading: isFeaturesLoading } = useQuery<SubscriptionFeatures>({
    queryKey: ['subscription-features', subscription?.plan],
    queryFn: async () => {
      if (!subscription?.plan) throw new Error('No subscription plan');

      const { data, error } = await supabase
        .from('subscription_features')
        .select('*')
        .eq('plan', subscription.plan)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!subscription?.plan
  });

  const isLoading = isSubscriptionLoading || isFeaturesLoading;
  const error = !subscription || !features;

  // Default limits based on freemium plan
  const defaultLimits = {
    dailySwipes: 5,
    dailyMessages: 3,
    canInitiateChat: false,
    canViewDocuments: false,
    canScheduleMeetings: false,
    hasAdvancedMatching: false,
    hasProfileBoost: false,
    hasPremiumBadge: false,
    maxActiveProjects: 1,
    maxActiveConversations: 1
  };

  // Map features to limits if available
  const limits = features ? {
    dailySwipes: features.daily_swipes_limit,
    dailyMessages: features.daily_messages_limit,
    canInitiateChat: features.can_initiate_chat,
    canViewDocuments: features.can_view_documents,
    canScheduleMeetings: features.can_schedule_meetings,
    hasAdvancedMatching: features.has_advanced_matching,
    hasProfileBoost: features.has_profile_boost,
    hasPremiumBadge: features.has_premium_badge,
    maxActiveProjects: features.max_active_projects,
    maxActiveConversations: features.max_active_conversations
  } : defaultLimits;

  return {
    subscription,
    isLoading,
    error,
    isPremium: subscription?.plan.includes('premium') || false,
    isStandard: subscription?.plan.includes('standard') || false,
    isActive: subscription?.status === 'active',
    limits
  };
}
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ProjectOwnerPlans } from './ProjectOwnerPlans';
import { ProjectSeekerPlans } from './ProjectSeekerPlans';
import { InvestorPlans } from './InvestorPlans';
import { Briefcase, Search, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/lib/types';

export function SubscriptionPlans() {
  const { user } = useAuth();
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: currentSubscription, isLoading: isSubscriptionLoading } = useQuery({
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

  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(
    (profile?.user_type as UserRole) || null
  );

  // Update selected user type when profile data loads
  React.useEffect(() => {
    if (profile?.user_type) {
      setSelectedUserType(profile.user_type as UserRole);
    }
  }, [profile]);

  const userTypes = [
    {
      id: 'project_owner',
      label: 'Porteur de projet',
      icon: Briefcase
    },
    {
      id: 'project_seeker',
      label: 'Chercheur de projet',
      icon: Search
    },
    {
      id: 'investor',
      label: 'Investisseur',
      icon: TrendingUp
    }
  ];

  const renderPlans = () => {
    if (!selectedUserType) return null;

    switch (selectedUserType) {
      case 'project_owner':
        return <ProjectOwnerPlans currentPlan={currentSubscription?.plan} isLoading={isSubscriptionLoading} />;
      case 'project_seeker':
        return <ProjectSeekerPlans currentPlan={currentSubscription?.plan} isLoading={isSubscriptionLoading} />;
      case 'investor':
        return <InvestorPlans currentPlan={currentSubscription?.plan} isLoading={isSubscriptionLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedUserType(type.id as UserRole)}
                className={`flex flex-col items-center px-6 py-3 rounded-lg ${
                  selectedUserType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <type.icon className="h-6 w-6 mb-1" />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {renderPlans()}
      </div>
    </div>
  );
}
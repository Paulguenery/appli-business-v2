import React from 'react';
import { Crown, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/lib/types';

interface SubscriptionBannerProps {
  userType: UserRole;
}

export function SubscriptionBanner({ userType }: SubscriptionBannerProps) {
  const { isPremium } = useSubscription();
  const { user } = useAuth();

  if (isPremium) return null;

  const getBannerContent = () => {
    switch (userType) {
      case 'project_owner':
        return {
          title: 'Passez à Premium Pro',
          description: 'Publiez des projets illimités et accédez aux investisseurs',
          icon: Crown,
          features: ['Projets illimités', 'Mise en avant', 'Accès aux investisseurs'],
          cta: 'Débloquer Premium Pro'
        };
      
      case 'project_seeker':
        return {
          title: 'Passez à Premium+',
          description: 'Matchs et messages illimités pour maximiser vos opportunités',
          icon: Rocket,
          features: ['Matchs illimités', 'Messagerie illimitée', 'Badge Premium'],
          cta: 'Débloquer Premium+'
        };
      
      case 'investor':
        return {
          title: 'Devenez Investisseur Pro',
          description: 'Contactez directement les porteurs de projets prometteurs',
          icon: Crown,
          features: ['Contact direct', 'Accès aux documents', 'Appels visio inclus'],
          cta: 'Débloquer Investisseur Pro'
        };
      
      default:
        return {
          title: 'Passez à Premium',
          description: 'Débloquez toutes les fonctionnalités',
          icon: Crown,
          features: ['Fonctionnalités avancées', 'Expérience optimisée', 'Support prioritaire'],
          cta: 'Débloquer Premium'
        };
    }
  };

  const content = getBannerContent();
  const Icon = content.icon;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 md:flex md:items-center md:justify-between">
        <div className="flex items-start md:items-center">
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{content.title}</h3>
            <p className="text-blue-100 mt-1">{content.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {content.features.map((feature, index) => (
                <div key={index} className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-6">
          <Button
            asChild
            className="w-full md:w-auto bg-white text-blue-700 hover:bg-blue-50"
          >
            <Link to="/subscribe" className="flex items-center gap-2">
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
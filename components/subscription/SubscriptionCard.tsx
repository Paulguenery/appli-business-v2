import React from 'react';
import { Check, X, Crown, Rocket, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/lib/types';

interface SubscriptionCardProps {
  userType: UserRole;
  compact?: boolean;
}

export function SubscriptionCard({ userType, compact = false }: SubscriptionCardProps) {
  const { subscription, isPremium } = useSubscription();
  const { user } = useAuth();

  const getPlanDetails = () => {
    switch (userType) {
      case 'project_owner':
        if (isPremium) {
          return {
            name: 'Premium Pro',
            features: ['Projets illimités', 'Mise en avant', 'Accès aux investisseurs'],
            icon: Crown,
            color: 'from-purple-500 to-indigo-600'
          };
        } else if (subscription?.plan === 'starter_owner') {
          return {
            name: 'Starter',
            features: ['Jusqu\'à 3 projets actifs', 'Discussions illimitées', 'Appels visio inclus'],
            icon: Rocket,
            color: 'from-blue-500 to-blue-600'
          };
        } else {
          return {
            name: 'Freemium',
            features: ['1 projet actif', 'Répondre uniquement', '5 profils/mois'],
            icon: Users,
            color: 'from-gray-500 to-gray-600'
          };
        }
      
      case 'project_seeker':
        if (isPremium) {
          return {
            name: 'Premium+',
            features: ['Matchs illimités', 'Messagerie illimitée', 'Badge Premium'],
            icon: Crown,
            color: 'from-purple-500 to-indigo-600'
          };
        } else if (subscription?.plan === 'standard_seeker') {
          return {
            name: 'Standard',
            features: ['10 discussions actives', 'Messages illimités', 'Appels visio inclus'],
            icon: MessageSquare,
            color: 'from-blue-500 to-blue-600'
          };
        } else if (subscription?.plan === 'pay_per_conversation') {
          return {
            name: 'Pay-per-conversation',
            features: ['Paiement par match', 'Messages illimités', 'Appels visio inclus'],
            icon: MessageSquare,
            color: 'from-green-500 to-green-600'
          };
        } else {
          return {
            name: 'Freemium',
            features: ['1 match actif', '3 messages maximum', 'Fonctionnalités limitées'],
            icon: Users,
            color: 'from-gray-500 to-gray-600'
          };
        }
      
      case 'investor':
        if (isPremium || subscription?.plan === 'pro_investor') {
          return {
            name: 'Investisseur Pro',
            features: ['Contacter les porteurs', 'Accès aux documents', 'Appels visio inclus'],
            icon: Crown,
            color: 'from-purple-500 to-indigo-600'
          };
        } else {
          return {
            name: 'Basic',
            features: ['Voir les projets ouverts', 'Contact si accepté', 'Fonctionnalités limitées'],
            icon: Users,
            color: 'from-gray-500 to-gray-600'
          };
        }
      
      default:
        return {
          name: 'Plan inconnu',
          features: [],
          icon: Users,
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const planDetails = getPlanDetails();
  const Icon = planDetails.icon;

  if (compact) {
    return (
      <div className={`bg-gradient-to-r ${planDetails.color} text-white rounded-lg shadow-md p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className="h-5 w-5 mr-2" />
            <span className="font-medium">{planDetails.name}</span>
          </div>
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="text-xs"
          >
            <Link to="/subscribe">
              {isPremium ? 'Gérer' : 'Améliorer'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`bg-gradient-to-r ${planDetails.color} text-white p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">{planDetails.name}</h3>
          </div>
          {!isPremium && (
            <div className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-medium">
              Améliorez
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <ul className="space-y-2">
          {planDetails.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button
          asChild
          className="w-full mt-4"
          variant={isPremium ? "outline" : "default"}
        >
          <Link to="/subscribe">
            {isPremium ? 'Gérer mon abonnement' : 'Passer à un forfait supérieur'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
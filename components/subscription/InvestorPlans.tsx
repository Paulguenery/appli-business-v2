import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { SubscriptionPlan } from '@/hooks/use-subscription';

interface InvestorPlansProps {
  currentPlan?: string;
  isLoading?: boolean;
}

export function InvestorPlans({ currentPlan, isLoading }: InvestorPlansProps) {
  const queryClient = useQueryClient();

  const { mutate: subscribe, isLoading: isSubscribing } = useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('subscriptions').upsert({
        user_id: user.id,
        plan,
        status: 'active',
        ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      alert('Abonnement mis à jour avec succès !');
    },
  });

  const plans = [
    {
      name: 'Basic',
      price: 0,
      description: 'Pour explorer les opportunités',
      features: [
        { name: 'Voir les projets ouverts à l\'investissement', included: true },
        { name: 'Contact possible uniquement si le porteur accepte', included: true },
        { name: 'Accès aux documents confidentiels', included: false },
        { name: 'Contacter directement les porteurs', included: false },
        { name: 'Appels visio', included: false }
      ],
      planId: 'basic_investor',
      popular: false,
      verification: true
    },
    {
      name: 'Investisseur Pro',
      price: 14.99,
      description: 'Pour les investisseurs sérieux',
      features: [
        { name: 'Voir tous les projets', included: true },
        { name: 'Contacter les porteurs ouverts', included: true },
        { name: 'Accès aux documents confidentiels post-acceptation', included: true },
        { name: 'Appels visio inclus', included: true },
        { name: 'Badge Investisseur Pro', included: true }
      ],
      planId: 'pro_investor',
      popular: true
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Forfaits Investisseur</h2>
        <p className="text-gray-600 mt-2">Choisissez le plan qui correspond à vos besoins d'investissement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.planId}
            className={`rounded-lg shadow-lg overflow-hidden ${
              plan.popular ? 'border-2 border-blue-500 relative' : 'border border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold uppercase transform translate-x-2 -translate-y-0 rotate-45 origin-bottom-left">
                Recommandé
              </div>
            )}
            {plan.verification && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm">
                Vérification du statut d'investisseur requise
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold">{plan.price}€</span>
                {plan.price > 0 && <span className="ml-1 text-xl text-gray-500">/mois</span>}
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <span className="ml-3 text-gray-700">{feature.name}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 w-full ${
                  plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
                onClick={() => subscribe(plan.planId as SubscriptionPlan)}
                disabled={isLoading || isSubscribing || currentPlan === plan.planId}
              >
                {currentPlan === plan.planId
                  ? 'Votre forfait actuel'
                  : isSubscribing
                  ? 'Chargement...'
                  : 'Choisir ce forfait'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2">Pourquoi devenir Investisseur Pro ?</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Accédez en priorité aux projets à fort potentiel avant qu'ils ne soient visibles par tous</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Contactez directement les porteurs de projets sans attendre leur validation</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span>Consultez les documents confidentiels pour une évaluation approfondie</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
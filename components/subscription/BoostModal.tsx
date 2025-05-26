import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const boostOptions = [
  {
    duration: '7 jours',
    price: '9,99 €',
    description: 'Boost de visibilité pendant une semaine',
  },
  {
    duration: '15 jours',
    price: '17,99 €',
    description: 'Boost de visibilité pendant deux semaines',
    popular: true,
  },
  {
    duration: '30 jours',
    price: '29,99 €',
    description: 'Boost de visibilité pendant un mois',
  },
];

interface BoostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoostModal({ open, onOpenChange }: BoostModalProps) {
  const handleBoost = async (duration: string) => {
    // TODO: Implement Stripe checkout for boost
    console.log('Boost for', duration);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="h-6 w-6 text-blue-600" />
            Booster votre visibilité
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            Augmentez vos chances de match en boostant votre profil
          </Dialog.Description>

          <div className="mt-6 space-y-4">
            {boostOptions.map((option) => (
              <div
                key={option.duration}
                className={`p-4 rounded-lg border ${
                  option.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{option.duration}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{option.price}</div>
                    <Button
                      onClick={() => handleBoost(option.duration)}
                      variant={option.popular ? 'default' : 'outline'}
                      size="sm"
                    >
                      Sélectionner
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Dialog.Close className="absolute top-4 right-4">
            <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BriefcaseIcon, SearchIcon, TrendingUpIcon } from 'lucide-react';

interface UserTypeStepProps {
  onComplete: (stepId: string, answers: { user_type: string }) => void;
}

export function UserTypeStep({ onComplete }: UserTypeStepProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const userTypes = [
    {
      id: 'project_owner',
      label: 'Porteur de projet',
      description: 'Je cherche des talents pour mon projet',
      icon: BriefcaseIcon
    },
    {
      id: 'project_seeker',
      label: 'Chercheur de projet',
      description: 'Je souhaite rejoindre des projets',
      icon: SearchIcon
    },
    {
      id: 'investor',
      label: 'Investisseur',
      description: 'Je souhaite investir dans des projets',
      icon: TrendingUpIcon
    }
  ];

  const handleContinue = () => {
    if (selectedType) {
      onComplete('user-type', { user_type: selectedType });
    }
  };

  return (
    <div className="space-y-4">
      {userTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => setSelectedType(type.id)}
          className={`w-full p-4 rounded-lg border-2 transition-colors ${
            selectedType === type.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <type.icon className={`h-6 w-6 ${
              selectedType === type.id ? 'text-blue-500' : 'text-gray-500'
            }`} />
            <div className="text-left">
              <div className="font-medium">{type.label}</div>
              <div className="text-sm text-gray-500">{type.description}</div>
            </div>
          </div>
        </button>
      ))}

      <Button
        className="w-full mt-6"
        onClick={handleContinue}
        disabled={!selectedType}
      >
        Continuer
      </Button>
    </div>
  );
}
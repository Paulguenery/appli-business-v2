import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ObjectivesStepProps {
  onComplete: (stepId: string, answers: { objectives: string[] }) => void;
  userType: string;
}

const objectivesByType = {
  project_owner: [
    {
      name: 'Trouver des collaborateurs',
      description: 'Recruter des talents pour mon projet'
    },
    {
      name: 'Obtenir des financements',
      description: 'Trouver des investisseurs'
    },
    {
      name: 'Développer mon réseau',
      description: 'Créer des connexions professionnelles'
    },
    {
      name: 'Valider mon concept',
      description: 'Tester mon idée auprès de la communauté'
    }
  ],
  project_seeker: [
    {
      name: 'Rejoindre un projet',
      description: 'Intégrer une équipe existante'
    },
    {
      name: 'Partager mes compétences',
      description: 'Mettre mon expertise au service des autres'
    },
    {
      name: 'Apprendre',
      description: 'Développer de nouvelles compétences'
    },
    {
      name: 'Créer des opportunités',
      description: 'Découvrir de nouvelles perspectives'
    }
  ],
  investor: [
    {
      name: 'Investir dans des projets',
      description: 'Financer des projets prometteurs'
    },
    {
      name: 'Diversifier mon portfolio',
      description: 'Explorer différents secteurs'
    },
    {
      name: 'Mentorer',
      description: 'Accompagner des entrepreneurs'
    },
    {
      name: 'Networking',
      description: 'Développer mon réseau d\'investissement'
    }
  ]
};

export function ObjectivesStep({ onComplete, userType }: ObjectivesStepProps) {
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

  const toggleObjective = (objective: string) => {
    setSelectedObjectives(prev =>
      prev.includes(objective)
        ? prev.filter(o => o !== objective)
        : [...prev, objective]
    );
  };

  const objectives = objectivesByType[userType as keyof typeof objectivesByType] || [];

  const handleContinue = () => {
    if (selectedObjectives.length > 0) {
      onComplete('objectives', { objectives: selectedObjectives });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {objectives.map((objective) => (
          <button
            key={objective.name}
            onClick={() => toggleObjective(objective.name)}
            className={`p-4 rounded-lg border-2 transition-colors text-left ${
              selectedObjectives.includes(objective.name)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{objective.name}</div>
                <div className="text-sm text-gray-500">{objective.description}</div>
              </div>
              {selectedObjectives.includes(objective.name) && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        className="w-full mt-6"
        onClick={handleContinue}
        disabled={selectedObjectives.length === 0}
      >
        Continuer
      </Button>
    </div>
  );
}
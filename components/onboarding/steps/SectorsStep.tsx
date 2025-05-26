import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface SectorsStepProps {
  onComplete: (stepId: string, answers: { sectors: string[] }) => void;
}

const sectors = [
  {
    name: 'Technology',
    description: 'Développement logiciel, IA, Cloud, etc.'
  },
  {
    name: 'E-commerce',
    description: 'Vente en ligne, marketplaces, D2C'
  },
  {
    name: 'Healthcare',
    description: 'Santé, bien-être, medtech'
  },
  {
    name: 'Education',
    description: 'Formation, edtech, e-learning'
  },
  {
    name: 'Finance',
    description: 'Fintech, assurance, investissement'
  },
  {
    name: 'Sustainability',
    description: 'Environnement, énergie verte'
  },
  {
    name: 'Social Impact',
    description: 'Impact social, ESS'
  },
  {
    name: 'AI/ML',
    description: 'Intelligence artificielle, machine learning'
  },
  {
    name: 'Blockchain',
    description: 'Crypto, NFT, Web3'
  },
  {
    name: 'Mobile Apps',
    description: 'Applications mobiles, IoT'
  }
];

export function SectorsStep({ onComplete }: SectorsStepProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleContinue = () => {
    if (selectedSectors.length > 0) {
      onComplete('sectors', { sectors: selectedSectors });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {sectors.map((sector) => (
          <button
            key={sector.name}
            onClick={() => toggleSector(sector.name)}
            className={`p-4 rounded-lg border-2 transition-colors text-left ${
              selectedSectors.includes(sector.name)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{sector.name}</div>
                <div className="text-sm text-gray-500">{sector.description}</div>
              </div>
              {selectedSectors.includes(sector.name) && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </button>
        ))}
      </div>

      <Button
        className="w-full mt-6"
        onClick={handleContinue}
        disabled={selectedSectors.length === 0}
      >
        Continuer
      </Button>
    </div>
  );
}
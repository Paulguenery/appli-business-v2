import React from 'react';
import { Filter, Briefcase, Clock, Star, Code } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { Button } from '@/components/ui/button';

interface FilterBarProps {
  filters: {
    sector: string;
    duration: string;
    stage: string;
    skills: string[];
  };
  onChange: (filters: any) => void;
  type: 'project' | 'talent';
}

export function FilterBar({ filters, onChange, type }: FilterBarProps) {
  const sectors = [
    '🧠 Technologie & Numérique',
    '📱 Communication & Marketing',
    '🛒 Commerce & Distribution',
    '🚀 Entrepreneuriat & Innovation',
    '🌿 Écologie & Impact',
    '🏥 Santé & Bien-être',
    '🎨 Création & Culture',
    '💼 Business & Finances',
    '📚 Éducation & Formation',
    '🌍 Voyage & Tourisme'
  ];

  const durations = [
    'Temps partiel',
    'Temps plein'
  ];

  const stages = [
    'Idée / Concept',
    'Prototype / MVP',
    'En développement',
    'Lancé / En croissance',
    'Mature / Établi'
  ];

  const techSkills = [
    'Développement web',
    'Développement mobile',
    'Intelligence artificielle',
    'Blockchain / Crypto',
    'Cybersécurité',
    'Réalité virtuelle / augmentée',
    'IOT (Objets connectés)',
    'Big Data & Data Science',
    'SaaS / Logiciels B2B'
  ];

  const businessSkills = [
    'Marketing digital',
    'Gestion de projet',
    'Design / UX',
    'Vente / Business development',
    'Finance / Comptabilité',
    'Juridique',
    'RH / Recrutement',
    'Communication',
    'Stratégie'
  ];

  const skills = [...techSkills, ...businessSkills];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>

      <Tabs.Root defaultValue="sector" className="space-y-6">
        <Tabs.List className="flex space-x-2 border-b">
          <Tabs.Trigger
            value="sector"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <Briefcase className="h-4 w-4 mb-1" />
            Secteur
          </Tabs.Trigger>
          <Tabs.Trigger
            value="duration"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <Clock className="h-4 w-4 mb-1" />
            Type
          </Tabs.Trigger>
          <Tabs.Trigger
            value="stage"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <Star className="h-4 w-4 mb-1" />
            Stade
          </Tabs.Trigger>
          <Tabs.Trigger
            value="skills"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <Code className="h-4 w-4 mb-1" />
            Compétences
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="sector" className="space-y-2">
          {sectors.map((sector) => (
            <Button
              key={sector}
              variant={filters.sector === sector ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => onChange({ ...filters, sector })}
            >
              {sector}
            </Button>
          ))}
        </Tabs.Content>

        <Tabs.Content value="duration" className="space-y-2">
          {durations.map((duration) => (
            <Button
              key={duration}
              variant={filters.duration === duration ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => onChange({ ...filters, duration })}
            >
              {duration}
            </Button>
          ))}
        </Tabs.Content>

        <Tabs.Content value="stage" className="space-y-2">
          {stages.map((stage) => (
            <Button
              key={stage}
              variant={filters.stage === stage ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => onChange({ ...filters, stage })}
            >
              {stage}
            </Button>
          ))}
        </Tabs.Content>

        <Tabs.Content value="skills" className="space-y-4">
          <h3 className="font-medium text-sm text-gray-700">Compétences techniques</h3>
          <div className="flex flex-wrap gap-2">
            {techSkills.map((skill) => (
              <Button
                key={skill}
                variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const newSkills = filters.skills.includes(skill)
                    ? filters.skills.filter(s => s !== skill)
                    : [...filters.skills, skill];
                  onChange({ ...filters, skills: newSkills });
                }}
              >
                {skill}
              </Button>
            ))}
          </div>
          
          <h3 className="font-medium text-sm text-gray-700 mt-4">Compétences business</h3>
          <div className="flex flex-wrap gap-2">
            {businessSkills.map((skill) => (
              <Button
                key={skill}
                variant={filters.skills.includes(skill) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const newSkills = filters.skills.includes(skill)
                    ? filters.skills.filter(s => s !== skill)
                    : [...filters.skills, skill];
                  onChange({ ...filters, skills: newSkills });
                }}
              >
                {skill}
              </Button>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {(filters.sector || filters.duration || filters.stage || filters.skills.length > 0) && (
        <div className="mt-6 pt-6 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onChange({
              sector: '',
              duration: '',
              stage: '',
              skills: []
            })}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
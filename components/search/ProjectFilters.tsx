import React, { useState } from 'react';
import { Filter, Briefcase, Clock, Star, Code, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Tabs from '@radix-ui/react-tabs';

interface ProjectFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export function ProjectFilters({ onApplyFilters }: ProjectFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[],
  });

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

  const handleApply = () => {
    onApplyFilters({
      ...filters,
      searchTerm
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      sector: '',
      duration: '',
      stage: '',
      skills: []
    });
    onApplyFilters({
      searchTerm: '',
      sector: '',
      duration: '',
      stage: '',
      skills: []
    });
  };

  const hasActiveFilters = searchTerm || filters.sector || filters.duration || filters.stage || filters.skills.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Filtres</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un projet..."
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <Tabs.Root defaultValue="sector" className="space-y-6">
        <Tabs.List className="flex space-x-2 border-b">
          <Tabs.Trigger
            value="sector"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <div className="flex flex-col items-center">
              <Briefcase className="h-4 w-4 mb-1" />
              <span>Secteur</span>
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="duration"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <div className="flex flex-col items-center">
              <Clock className="h-4 w-4 mb-1" />
              <span>Type</span>
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="stage"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <div className="flex flex-col items-center">
              <Star className="h-4 w-4 mb-1" />
              <span>Stade</span>
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="skills"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            <div className="flex flex-col items-center">
              <Code className="h-4 w-4 mb-1" />
              <span>Compétences</span>
            </div>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="sector" className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {sectors.map((sector) => (
              <Button
                key={sector}
                variant={filters.sector === sector ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                onClick={() => setFilters({ ...filters, sector })}
              >
                {sector}
              </Button>
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="duration" className="space-y-2">
          {durations.map((duration) => (
            <Button
              key={duration}
              variant={filters.duration === duration ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setFilters({ ...filters, duration })}
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
              onClick={() => setFilters({ ...filters, stage })}
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
                  setFilters({ ...filters, skills: newSkills });
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
                  setFilters({ ...filters, skills: newSkills });
                }}
              >
                {skill}
              </Button>
            ))}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <div className="mt-6 pt-6 border-t">
        <Button
          className="w-full"
          onClick={handleApply}
        >
          Appliquer les filtres
        </Button>
      </div>
    </div>
  );
}
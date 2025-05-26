import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, TrendingUp, ArrowRight, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationFilter } from '@/components/search/LocationFilter';
import { FilterBar } from '@/components/search/FilterBar';
import { useLocationStore } from '@/stores/location';
import { GuestSwipeInterface } from '@/components/guest/GuestSwipeInterface';
import { BackButton } from '@/components/BackButton';

export function GuestAccess() {
  const navigate = useNavigate();
  const { selectedCity } = useLocationStore();
  const [userType, setUserType] = useState<'project_owner' | 'project_seeker' | 'investor' | null>(null);
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[]
  });

  const userTypes = [
    {
      id: 'project_owner',
      label: 'Porteur de projet',
      description: 'Je cherche des talents pour mon projet',
      icon: Briefcase
    },
    {
      id: 'project_seeker',
      label: 'Chercheur de projet',
      description: 'Je souhaite rejoindre des projets',
      icon: Search
    },
    {
      id: 'investor',
      label: 'Investisseur',
      description: 'Je souhaite investir dans des projets',
      icon: TrendingUp
    }
  ];

  const handleContinue = () => {
    if (userType) {
      // Redirect to the appropriate swipe interface
      if (userType === 'project_owner') {
        navigate('/guest/talents');
      } else if (userType === 'project_seeker' || userType === 'investor') {
        navigate('/guest/projects');
      }
    }
  };

  const renderUserTypeSelection = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mymate</h1>
        <p className="mt-2 text-sm text-gray-600">
          Essayez notre plateforme sans créer de compte
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center mb-6">
            Qui êtes-vous ?
          </h2>

          <div className="space-y-4">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setUserType(type.id as any)}
                className={`w-full p-4 rounded-lg border-2 transition-colors ${
                  userType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <type.icon className={`h-6 w-6 ${
                    userType === type.id ? 'text-blue-500' : 'text-gray-500'
                  }`} />
                  <div className="text-left">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button
            className="w-full mt-6 flex items-center justify-center gap-2"
            onClick={handleContinue}
            disabled={!userType}
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-2">Vous avez déjà un compte ?</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          Se connecter
        </Button>
      </div>
    </div>
  );

  const renderLocationSelection = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mymate</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sélectionnez votre localisation
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Localisation</h2>
          </div>

          <LocationFilter />

          <Button
            className="w-full mt-6 flex items-center justify-center gap-2"
            onClick={handleContinue}
            disabled={!selectedCity}
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFiltersSelection = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mymate</h1>
        <p className="mt-2 text-sm text-gray-600">
          Affinez vos préférences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Filtres</h2>
          </div>

          <FilterBar 
            filters={filters}
            onChange={setFilters}
            type={userType === 'project_owner' ? 'talent' : 'project'}
          />

          <Button
            className="w-full mt-6 flex items-center justify-center gap-2"
            onClick={handleContinue}
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // If no user type is selected, show the user type selection
  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {renderUserTypeSelection()}
      </div>
    );
  }

  // If no location is selected, show the location selection
  if (!selectedCity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full">
          <div className="mb-4">
            <BackButton />
          </div>
          {renderLocationSelection()}
        </div>
      </div>
    );
  }

  // If filters are not set, show the filters selection
  if (!filters.sector && !filters.skills.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full">
          <div className="mb-4">
            <BackButton />
          </div>
          {renderFiltersSelection()}
        </div>
      </div>
    );
  }

  // Otherwise, show the swipe interface
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LocationFilter />
            <FilterBar 
              filters={filters}
              onChange={setFilters}
              type={userType === 'project_owner' ? 'talent' : 'project'}
            />
          </div>

          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4 sm:p-6" style={{ height: 'calc(100vh - 180px)' }}>
            <GuestSwipeInterface 
              userType={userType}
              filters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
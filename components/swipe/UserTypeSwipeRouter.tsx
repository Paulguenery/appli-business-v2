import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ProjectOwnerSwipe } from './ProjectOwnerSwipe';
import { ProjectSeekerSwipe } from './ProjectSeekerSwipe';
import { InvestorSwipe } from './InvestorSwipe';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function UserTypeSwipeRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Connectez-vous pour commencer</h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à cette fonctionnalité.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/">Se connecter</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/guest">Continuer en mode invité</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user.user_type) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Complétez votre profil</h2>
          <p className="text-gray-600 mb-6">
            Vous devez compléter votre profil pour accéder à cette fonctionnalité.
          </p>
          <Button asChild>
            <Link to="/onboarding">Compléter mon profil</Link>
          </Button>
        </div>
      </div>
    );
  }

  switch (user.user_type) {
    case 'project_owner':
      return <ProjectOwnerSwipe />;
    case 'project_seeker':
      return <ProjectSeekerSwipe />;
    case 'investor':
      return <InvestorSwipe />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Type de profil non reconnu</h2>
            <p className="text-gray-600 mb-6">
              Votre type de profil n'est pas reconnu. Veuillez contacter le support.
            </p>
          </div>
        </div>
      );
  }
}
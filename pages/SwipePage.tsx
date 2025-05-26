import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { ProjectOwnerSwipe } from '@/components/swipe/ProjectOwnerSwipe';
import { ProjectSeekerSwipe } from '@/components/swipe/ProjectSeekerSwipe';
import { InvestorSwipe } from '@/components/swipe/InvestorSwipe';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, Search, TrendingUp } from 'lucide-react';

export function SwipePage() {
  const { user, loading } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState<'project_owner' | 'project_seeker' | 'investor' | null>(null);

  // Pour le développement, on permet de choisir le type d'utilisateur
  const adminAccess = true;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si l'accès administrateur est activé, afficher le sélecteur de type d'utilisateur
  if (adminAccess && !selectedUserType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-blue-900 text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-bold">Mode Développement</h1>
            <p className="text-sm text-blue-200">Sélectionnez un type d'utilisateur pour tester l'interface</p>
          </div>

          <div className="bg-white rounded-b-lg shadow-lg p-6">
            <div className="space-y-4">
              <button
                onClick={() => setSelectedUserType('project_owner')}
                className="w-full p-4 rounded-lg border-2 transition-colors hover:border-blue-500 hover:bg-blue-50 flex items-center gap-3"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Porteur de projet</div>
                  <div className="text-sm text-gray-500">Voir les talents disponibles</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedUserType('project_seeker')}
                className="w-full p-4 rounded-lg border-2 transition-colors hover:border-blue-500 hover:bg-blue-50 flex items-center gap-3"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Chercheur de projet</div>
                  <div className="text-sm text-gray-500">Voir les projets disponibles</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedUserType('investor')}
                className="w-full p-4 rounded-lg border-2 transition-colors hover:border-blue-500 hover:bg-blue-50 flex items-center gap-3"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Investisseur</div>
                  <div className="text-sm text-gray-500">Voir les opportunités d'investissement</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !adminAccess) {
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
          </div>
        </div>
      </div>
    );
  }

  // Afficher l'interface de swipe appropriée en fonction du type d'utilisateur
  const userType = selectedUserType || user?.user_type;
  
  if (userType === 'project_owner') {
    return <ProjectOwnerSwipe />;
  } else if (userType === 'project_seeker') {
    return <ProjectSeekerSwipe />;
  } else if (userType === 'investor') {
    return <InvestorSwipe />;
  } else {
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
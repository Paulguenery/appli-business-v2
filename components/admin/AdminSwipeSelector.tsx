import React, { useState } from 'react';
import { Briefcase, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectOwnerSwipe } from '@/components/swipe/ProjectOwnerSwipe';
import { ProjectSeekerSwipe } from '@/components/swipe/ProjectSeekerSwipe';
import { InvestorSwipe } from '@/components/swipe/InvestorSwipe';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { UserRole } from '@/lib/types';

export function AdminSwipeSelector() {
  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'project_owner',
      label: 'Porteur de projet',
      description: 'Voir les talents disponibles',
      icon: Briefcase
    },
    {
      id: 'project_seeker',
      label: 'Chercheur de projet',
      description: 'Voir les projets disponibles',
      icon: Search
    },
    {
      id: 'investor',
      label: 'Investisseur',
      description: 'Voir les opportunités d\'investissement',
      icon: TrendingUp
    }
  ];

  if (selectedUserType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-blue-900 text-white p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Mode Admin</span>
              <span className="bg-blue-700 px-2 py-1 rounded text-xs">
                Vue: {selectedUserType === 'project_owner' ? 'Porteur de projet' : 
                      selectedUserType === 'project_seeker' ? 'Chercheur de projet' : 'Investisseur'}
              </span>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setSelectedUserType(null)}
            >
              Changer de vue
            </Button>
          </div>
        </div>

        <div className="p-4">
          {selectedUserType === 'project_owner' ? (
            <ProjectOwnerSwipe />
          ) : selectedUserType === 'project_seeker' ? (
            <ProjectSeekerSwipe />
          ) : (
            <InvestorSwipe />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Mode Administrateur</h1>
          <p className="text-blue-200 mt-2">Sélectionnez un type d'utilisateur pour tester l'interface</p>
        </div>

        <div className="bg-white rounded-b-lg shadow-lg p-6">
          <div className="space-y-4">
            {userTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setSelectedUserType(type.id as UserRole)}
                className="w-full p-4 rounded-lg border-2 transition-colors hover:border-blue-500 hover:bg-blue-50 flex items-center gap-3"
                whileHover={{ scale: 1.02, borderColor: '#3b82f6' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  <type.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-gray-500">{type.description}</div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
              </motion.button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
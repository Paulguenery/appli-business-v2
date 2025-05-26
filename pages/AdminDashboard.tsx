import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, TrendingUp, ArrowRight, ShieldCheck, Users, FileText, Settings, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminSwipeSelector } from '@/components/admin/AdminSwipeSelector';
import { AdminSubscriptionViewer } from '@/components/admin/AdminSubscriptionViewer';
import { ProjectOwnerDashboard } from '@/components/dashboard/ProjectOwnerDashboard';
import { ProjectSeekerDashboard } from '@/components/dashboard/ProjectSeekerDashboard';
import { InvestorDashboard } from '@/components/dashboard/InvestorDashboard';
import { motion } from 'framer-motion';
import type { UserRole } from '@/lib/types';

export function AdminDashboard() {
  const [selectedView, setSelectedView] = useState<'dashboard' | 'swipe' | 'users' | 'projects' | 'settings' | 'subscriptions'>('dashboard');
  const [selectedUserType, setSelectedUserType] = useState<UserRole>('project_owner');
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'project_owner',
      label: 'Porteur de projet',
      icon: Briefcase
    },
    {
      id: 'project_seeker',
      label: 'Chercheur de projet',
      icon: Search
    },
    {
      id: 'investor',
      label: 'Investisseur',
      icon: TrendingUp
    }
  ];

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Home,
      color: 'bg-blue-50 border-blue-100 text-blue-700'
    },
    {
      id: 'swipe',
      label: 'Interface de swipe',
      icon: ArrowRight,
      color: 'bg-yellow-50 border-yellow-100 text-yellow-700'
    },
    {
      id: 'subscriptions',
      label: 'Abonnements',
      icon: CreditCard,
      color: 'bg-green-50 border-green-100 text-green-700'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      color: 'bg-purple-50 border-purple-100 text-purple-700'
    },
    {
      id: 'projects',
      label: 'Projets',
      icon: FileText,
      color: 'bg-orange-50 border-orange-100 text-orange-700'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      color: 'bg-gray-50 border-gray-100 text-gray-700'
    }
  ];

  const renderContent = () => {
    if (selectedView === 'swipe') {
      return <AdminSwipeSelector />;
    } else if (selectedView === 'subscriptions') {
      return <AdminSubscriptionViewer />;
    } else if (selectedView === 'dashboard') {
      return (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex justify-center space-x-4">
              {userTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedUserType(type.id as UserRole)}
                  className={`flex flex-col items-center px-6 py-3 rounded-lg ${
                    selectedUserType === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <type.icon className="h-6 w-6 mb-1" />
                  <span>{type.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {selectedUserType === 'project_owner' && <ProjectOwnerDashboard />}
            {selectedUserType === 'project_seeker' && <ProjectSeekerDashboard />}
            {selectedUserType === 'investor' && <InvestorDashboard />}
          </div>
        </div>
      );
    } else {
      return (
        <div className="max-w-7xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">
              {selectedView === 'users' ? 'Gestion des utilisateurs' : 
               selectedView === 'projects' ? 'Gestion des projets' : 'Paramètres du système'}
            </h2>
            
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Cette fonctionnalité est en cours de développement.</p>
              <Button onClick={() => setSelectedView('dashboard')}>
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              <h1 className="text-xl font-bold">Mode Administrateur</h1>
              {selectedView !== 'dashboard' && (
                <span className="ml-4 bg-red-700 px-3 py-1 rounded-full text-sm">
                  {selectedView === 'swipe' ? 'Interface de swipe' : 
                   selectedView === 'subscriptions' ? 'Abonnements' :
                   selectedView === 'users' ? 'Utilisateurs' :
                   selectedView === 'projects' ? 'Projets' : 'Paramètres'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedView !== 'dashboard' && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setSelectedView('dashboard');
                  }}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              )}
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/')}
              >
                Quitter le mode admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {selectedView === 'dashboard' ? (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminMenuItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`${item.color} p-6 rounded-lg border cursor-pointer`}
                onClick={() => setSelectedView(item.id as any)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <item.icon className="h-8 w-8" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.label}</h3>
                    <p className="text-sm opacity-80">
                      {item.id === 'dashboard' && "Visualiser les tableaux de bord utilisateur"}
                      {item.id === 'swipe' && "Tester les interfaces de swipe"}
                      {item.id === 'subscriptions' && "Voir les plans d'abonnement"}
                      {item.id === 'users' && "Gérer les utilisateurs"}
                      {item.id === 'projects' && "Gérer les projets"}
                      {item.id === 'settings' && "Configurer le système"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <ArrowRight className="h-5 w-5 opacity-60" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          {renderContent()}
        </div>
      )}
    </div>
  );
}
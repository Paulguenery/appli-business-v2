import React, { useState } from 'react';
import { ProjectOwnerPlans } from '@/components/subscription/ProjectOwnerPlans';
import { ProjectSeekerPlans } from '@/components/subscription/ProjectSeekerPlans';
import { InvestorPlans } from '@/components/subscription/InvestorPlans';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Briefcase, Search, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function AdminSubscriptionViewer() {
  const [activeTab, setActiveTab] = useState<'project_owner' | 'project_seeker' | 'investor'>('project_owner');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Forfaits d'abonnement</h1>
            <p className="text-gray-600">
              Visualisez les différents plans disponibles pour chaque type d'utilisateur
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="project_owner" className="flex items-center gap-2 py-3">
              <Briefcase className="h-5 w-5" />
              <span className="hidden md:inline">Porteur de projet</span>
            </TabsTrigger>
            <TabsTrigger value="project_seeker" className="flex items-center gap-2 py-3">
              <Search className="h-5 w-5" />
              <span className="hidden md:inline">Chercheur de projet</span>
            </TabsTrigger>
            <TabsTrigger value="investor" className="flex items-center gap-2 py-3">
              <TrendingUp className="h-5 w-5" />
              <span className="hidden md:inline">Investisseur</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="project_owner" className="mt-0">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Forfaits Porteur de Projet
                </h2>
                <p className="text-gray-600 mb-6">
                  Ces forfaits sont conçus pour les entrepreneurs et porteurs de projets qui cherchent à constituer leur équipe.
                </p>
                <ProjectOwnerPlans currentPlan="premium_owner" isLoading={false} />
              </div>
            </TabsContent>

            <TabsContent value="project_seeker" className="mt-0">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Forfaits Chercheur de Projet
                </h2>
                <p className="text-gray-600 mb-6">
                  Ces forfaits sont conçus pour les professionnels qui cherchent à rejoindre des projets innovants.
                </p>
                <ProjectSeekerPlans currentPlan="premium_seeker" isLoading={false} />
              </div>
            </TabsContent>

            <TabsContent value="investor" className="mt-0">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Forfaits Investisseur
                </h2>
                <p className="text-gray-600 mb-6">
                  Ces forfaits sont conçus pour les investisseurs à la recherche d'opportunités prometteuses.
                </p>
                <InvestorPlans currentPlan="pro_investor" isLoading={false} />
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
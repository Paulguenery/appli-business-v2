import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Briefcase, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';

interface GuestInvestorCardProps {
  project: Project;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function GuestInvestorCard({ project, onSwipe, onViewDetails }: GuestInvestorCardProps) {
  // Generate simulated investment metrics based on project ID
  const projectIdNumber = parseInt(project.id.replace(/-/g, '').substring(0, 8), 16);
  const simulatedValuation = (projectIdNumber % 10) * 100;
  const simulatedStage = project.experience_level === 'beginner' 
    ? 'Amorçage' 
    : project.experience_level === 'any' 
      ? 'Développement' 
      : 'Croissance';

  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header image or gradient with investment badge */}
      <div className="h-48 bg-gradient-to-r from-green-500 to-blue-600 relative">
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute top-4 right-4">
          <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-sm font-bold">
            Opportunité d'investissement
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-white" />
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            <MapPin className="h-4 w-4" />
            <span>{project.city || 'France'}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {project.category}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Recherche financement
          </span>
        </div>

        {/* Brief description */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="text-gray-600">
            {project.brief_description}
          </p>
        </div>

        {/* Investment metrics - simulated for demo */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Métriques d'investissement
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-sm">Stade</div>
              <div className="font-medium">{simulatedStage}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Valorisation estimée</div>
              <div className="font-medium">
                {simulatedValuation}K€ - {simulatedValuation + 200}K€
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => onSwipe('left')}
            className="flex-1 h-14"
          >
            Passer
          </Button>
          <Button
            onClick={() => onSwipe('right')}
            className="flex-1 h-14"
          >
            Intéressé
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
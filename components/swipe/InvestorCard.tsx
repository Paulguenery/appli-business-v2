import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Briefcase, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';

interface InvestorCardProps {
  project: Project;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function InvestorCard({ project, onSwipe, onViewDetails }: InvestorCardProps) {
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
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header image or gradient with investment badge */}
      <div className="h-32 bg-gradient-to-r from-green-500 to-blue-600 relative">
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
            Opportunité d'investissement
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-white" />
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{project.city || 'France'}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {project.category}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            Recherche financement
          </span>
        </div>

        {/* Brief description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {project.brief_description}
          </p>
        </div>

        {/* Investment metrics - simulated for demo */}
        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            Métriques d'investissement
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-gray-500">Stade</div>
              <div className="font-medium">{simulatedStage}</div>
            </div>
            <div>
              <div className="text-gray-500">Valorisation</div>
              <div className="font-medium">
                {simulatedValuation}K€ - {simulatedValuation + 200}K€
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onSwipe('left')}
            className="flex-1"
          >
            Passer
          </Button>
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="flex-1"
          >
            Détails
          </Button>
          <Button
            onClick={() => onSwipe('right')}
            className="flex-1"
          >
            Intéressé
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
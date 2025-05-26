import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Briefcase, Star, DollarSign, Calendar, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { Project } from '@/lib/types';

interface InvestorSwipeCardProps {
  project: Project;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function InvestorSwipeCard({ project, onSwipe, onViewDetails }: InvestorSwipeCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { selectedCity } = useLocationStore();
  
  // Generate simulated investment metrics based on project ID
  const projectIdNumber = parseInt(project.id.replace(/-/g, '').substring(0, 8), 16);
  const simulatedValuation = (projectIdNumber % 10) * 100 + 100;
  const simulatedStage = project.experience_level === 'beginner' 
    ? 'Amorçage' 
    : project.experience_level === 'any' 
      ? 'Développement' 
      : 'Croissance';
  
  // Simulate funding amount based on project ID
  const fundingAmount = (projectIdNumber % 5) * 50 + 50;
  const fundingPercentage = (projectIdNumber % 3) * 5 + 10;

  // Calculate distance between user and project
  const getDistance = () => {
    if (!selectedCity || !project.latitude || !project.longitude) return null;
    
    const distance = calculateDistance(
      selectedCity.latitude,
      selectedCity.longitude,
      project.latitude,
      project.longitude
    );
    
    return Math.round(distance);
  };

  const distance = getDistance();

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header image or gradient with investment badge */}
      <div className="h-40 bg-gradient-to-r from-green-500 to-blue-600 relative">
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
            {distance !== null && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                à {distance} km
              </span>
            )}
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
          <div className={`relative ${!showFullDescription && 'max-h-12 overflow-hidden'}`}>
            <p className="text-gray-600 text-sm">
              {project.brief_description}
            </p>
            {!showFullDescription && project.brief_description.length > 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-sm text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
          >
            {showFullDescription ? (
              <>
                Voir moins <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Voir plus <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>

        {/* Investment metrics - simulated for demo */}
        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            Opportunité d'investissement
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
            <div>
              <div className="text-gray-500">Recherche</div>
              <div className="font-medium">{fundingAmount}K€</div>
            </div>
            <div>
              <div className="text-gray-500">Equity</div>
              <div className="font-medium">{fundingPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Porteur de projet */}
        <div className="mb-4 flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-sm">Porteur de projet</div>
            <div className="text-xs text-gray-500">Expérience: 3 ans</div>
          </div>
        </div>

        {/* View details button */}
        <Button
          variant="outline"
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-2 mt-2"
        >
          Voir les détails
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/types';

interface GuestProjectCardProps {
  project: Project;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function GuestProjectCard({ project, onSwipe, onViewDetails }: GuestProjectCardProps) {
  const experienceLevelText = {
    any: 'Tous niveaux acceptés',
    beginner: 'Débutant accepté',
    experienced: 'Expérimenté requis'
  };

  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header image or gradient */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{project.title}</h3>
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
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {project.collaboration_type}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            {experienceLevelText[project.experience_level as keyof typeof experienceLevelText]}
          </span>
        </div>

        {/* Brief description */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="text-gray-600">
            {project.brief_description}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            Compétences recherchées
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.required_skills?.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
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
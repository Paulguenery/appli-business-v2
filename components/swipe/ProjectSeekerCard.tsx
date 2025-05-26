import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, GraduationCap, Star, Calendar, Building, Clock, ChevronRight, ChevronDown, ChevronUp, User, Target, Award, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { Project } from '@/lib/types';

interface ProjectSeekerCardProps {
  project: Project;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function ProjectSeekerCard({ project, onSwipe, onViewDetails }: ProjectSeekerCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { selectedCity } = useLocationStore();
  
  const experienceLevelText = {
    any: 'Tous niveaux acceptés',
    beginner: 'Débutant accepté',
    experienced: 'Expérimenté requis'
  };

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

  // Generate a gradient based on project category
  const getGradient = () => {
    const category = project.category || '';
    
    if (category.includes('Tech') || category.includes('Numérique')) {
      return 'from-blue-500 to-indigo-600';
    } else if (category.includes('Santé') || category.includes('Bien-être')) {
      return 'from-green-400 to-teal-500';
    } else if (category.includes('Commerce') || category.includes('Distribution')) {
      return 'from-orange-400 to-red-500';
    } else if (category.includes('Écologie') || category.includes('Impact')) {
      return 'from-green-500 to-emerald-600';
    } else if (category.includes('Création') || category.includes('Culture')) {
      return 'from-purple-500 to-pink-500';
    } else if (category.includes('Éducation') || category.includes('Formation')) {
      return 'from-blue-400 to-cyan-500';
    } else {
      return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header image or gradient */}
      <div className={`h-48 bg-gradient-to-r ${getGradient()} relative`}>
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        
        {/* Floating badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {distance !== null && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              <span>à {distance} km</span>
            </motion.div>
          )}
          
          {project.open_to_investment && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              <span>Investissement</span>
            </motion.div>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {project.title}
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-white/80 text-sm mt-1"
          >
            <MapPin className="h-3 w-3" />
            <span>{project.city || 'France'}</span>
          </motion.div>
        </div>
      </div>

      <div className="p-4">
        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-4"
        >
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Building className="h-3 w-3" />
            {project.category}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {project.collaboration_type}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {experienceLevelText[project.experience_level as keyof typeof experienceLevelText]}
          </span>
        </motion.div>

        {/* Brief description */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-500" />
            Description
          </h4>
          <div className={`relative ${!showFullDescription && 'max-h-20 overflow-hidden'}`}>
            <p className="text-gray-600 leading-relaxed">
              {project.brief_description}
            </p>
            {!showFullDescription && project.brief_description.length > 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          {project.brief_description.length > 100 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1 text-sm"
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
          )}
        </motion.div>

        {/* Profil recherché */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4 bg-blue-50 p-3 rounded-lg"
        >
          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-1 mb-1">
            <User className="h-4 w-4 text-blue-500" />
            Profil recherché
          </h4>
          <p className="text-xs text-blue-600">
            {project.experience_level === 'any' 
              ? 'Tous les profils sont acceptés, quel que soit votre niveau d\'expérience.' 
              : project.experience_level === 'beginner'
                ? 'Les débutants sont les bienvenus sur ce projet.'
                : 'Ce projet recherche des profils expérimentés.'}
          </p>
          
          {/* Description de l'associé idéal */}
          {project.ideal_partner_description && (
            <div className="mt-2 pt-2 border-t border-blue-100">
              <p className="text-xs text-blue-600 italic">
                "{project.ideal_partner_description}"
              </p>
            </div>
          )}
        </motion.div>

        {/* Exigences spécifiques */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-4 bg-gray-50 p-3 rounded-lg"
        >
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
            <Check className="h-4 w-4 text-green-500" />
            Exigences
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${project.experience_level === 'any' || project.experience_level === 'beginner' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {project.experience_level === 'any' || project.experience_level === 'beginner' ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
              </div>
              <span className="text-xs text-gray-600">Débutants acceptés</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${!project.required_skills || project.required_skills.length === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {!project.required_skills || project.required_skills.length === 0 ? <Check className="h-2 w-2" /> : <X className="h-2 w-2" />}
              </div>
              <span className="text-xs text-gray-600">Aucune compétence requise</span>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
            <Award className="h-4 w-4 text-blue-500" />
            Compétences recherchées
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {project.required_skills && project.required_skills.length > 0 ? (
              <>
                {project.required_skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </>
            ) : (
              <p className="text-xs text-gray-500 italic">Aucune compétence spécifique requise</p>
            )}
          </div>
        </motion.div>

        {/* View details button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-2 py-6 text-lg"
          >
            Voir les détails
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
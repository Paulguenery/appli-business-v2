import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Star, Calendar, Award, ChevronRight, ChevronDown, ChevronUp, Briefcase, Check, X, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { UserProfile } from '@/lib/types';

interface ProjectOwnerCardProps {
  talent: UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function ProjectOwnerCard({ talent, onSwipe, onViewDetails }: ProjectOwnerCardProps) {
  const [showFullBio, setShowFullBio] = useState(false);
  const { selectedCity } = useLocationStore();
  
  // Determine experience level text
  const experienceLevelText = {
    junior: 'Junior',
    intermediaire: 'Intermédiaire',
    senior: 'Senior'
  };

  // Get the first letter of the name for avatar fallback
  const nameInitial = talent.full_name ? talent.full_name.charAt(0).toUpperCase() : 'U';

  // Calculate distance between user and talent
  const getDistance = () => {
    if (!selectedCity || !talent.latitude || !talent.longitude) return null;
    
    const distance = calculateDistance(
      selectedCity.latitude,
      selectedCity.longitude,
      talent.latitude,
      talent.longitude
    );
    
    return Math.round(distance);
  };

  const distance = getDistance();

  // Generate a gradient based on experience level
  const getGradient = () => {
    switch (talent.experience_level) {
      case 'junior':
        return 'from-green-400 to-teal-500';
      case 'intermediaire':
        return 'from-blue-400 to-indigo-500';
      case 'senior':
        return 'from-purple-500 to-indigo-600';
      default:
        return 'from-blue-500 to-indigo-600';
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
      {/* Header with avatar or gradient */}
      <div className={`h-48 bg-gradient-to-r ${getGradient()} relative`}>
        {'avatar_url' in talent && talent.avatar_url ? (
          <img 
            src={talent.avatar_url} 
            alt={talent.full_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center"
            >
              <span className="text-white text-4xl font-semibold">{nameInitial}</span>
            </motion.div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        
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
          
          {talent.is_verified && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              <span>Vérifié</span>
            </motion.div>
          )}
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
          >
            {talent.full_name}
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-white/80 text-sm mt-1"
          >
            <MapPin className="h-3 w-3" />
            <span>{talent.city || 'France'}</span>
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
            <GraduationCap className="h-3 w-3" />
            {experienceLevelText[talent.experience_level as keyof typeof experienceLevelText] || 'Non spécifié'}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {talent.availability || 'Non spécifié'}
          </span>
        </motion.div>

        {/* Brief bio */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-blue-500" />
            À propos
          </h4>
          <div className={`relative ${!showFullBio && 'max-h-20 overflow-hidden'}`}>
            <p className="text-gray-600 leading-relaxed">
              {talent.bio || "Aucune biographie disponible."}
            </p>
            {!showFullBio && talent.bio && talent.bio.length > 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          {talent.bio && talent.bio.length > 100 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1 text-sm"
            >
              {showFullBio ? (
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

        {/* Points forts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4 bg-yellow-50 p-3 rounded-lg"
        >
          <h4 className="text-sm font-medium text-yellow-700 flex items-center gap-1 mb-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Points forts
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-700">Réactivité</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-700">Expertise technique</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-700">Autonomie</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-3 w-3 text-yellow-600" />
              <span className="text-xs text-yellow-700">Expérience</span>
            </div>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-blue-500" />
            Compétences
          </h4>
          <div className="flex flex-wrap gap-2">
            {talent.skills?.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </motion.span>
            ))}
            {(!talent.skills || talent.skills.length === 0) && (
              <p className="text-gray-500 italic">Aucune compétence spécifiée</p>
            )}
          </div>
        </motion.div>

        {/* View details button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
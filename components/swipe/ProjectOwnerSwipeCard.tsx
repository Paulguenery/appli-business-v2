import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Star, Calendar, Award, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { UserProfile } from '@/lib/types';

interface ProjectOwnerSwipeCardProps {
  talent: UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function ProjectOwnerSwipeCard({ talent, onSwipe, onViewDetails }: ProjectOwnerSwipeCardProps) {
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

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header with avatar or gradient */}
      <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        {'avatar_url' in talent && talent.avatar_url ? (
          <img 
            src={talent.avatar_url} 
            alt={talent.full_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-3xl font-semibold">{nameInitial}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white">{talent.full_name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{talent.city || 'France'}</span>
            {distance !== null && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                à {distance} km
              </span>
            )}
            {talent.is_verified && (
              <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <Star className="h-3 w-3" />
                Vérifié
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {experienceLevelText[talent.experience_level as keyof typeof experienceLevelText] || 'Expérience non spécifiée'}
          </span>
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {talent.availability || 'Disponibilité non spécifiée'}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {talent.user_type === 'project_seeker' ? 'Chercheur de projet' : talent.user_type}
          </span>
        </div>

        {/* Brief bio */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <User className="h-4 w-4 text-blue-500" />
            À propos
          </h4>
          <div className={`relative ${!showFullBio && 'max-h-12 overflow-hidden'}`}>
            <p className="text-gray-600 text-sm">
              {talent.bio || "Aucune biographie disponible."}
            </p>
            {!showFullBio && talent.bio && talent.bio.length > 100 && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          {talent.bio && talent.bio.length > 100 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="text-sm text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
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
        </div>

        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <Award className="h-4 w-4 text-blue-500" />
            Compétences
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {talent.skills?.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {talent.skills && talent.skills.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                +{talent.skills.length - 3}
              </span>
            )}
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
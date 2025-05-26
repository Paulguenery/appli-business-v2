import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Star, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/lib/types';

interface TalentCardProps {
  talent: UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function TalentCard({ talent, onSwipe, onViewDetails }: TalentCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header with avatar or gradient */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {'avatar_url' in talent && talent.avatar_url ? (
          <img 
            src={talent.avatar_url} 
            alt={talent.full_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white">{talent.full_name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{talent.city || 'France'}</span>
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
            <User className="h-3 w-3" />
            {talent.role}
          </span>
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {talent.availability}
          </span>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {talent.experience_level}
          </span>
        </div>

        {/* Brief bio */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <User className="h-4 w-4 text-blue-500" />
            À propos
          </h4>
          <p className="text-gray-600 text-sm line-clamp-3">
            {talent.bio}
          </p>
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
            {talent.skills?.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                +{talent.skills.length - 3}
              </span>
            )}
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
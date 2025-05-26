import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, GraduationCap, Star, Calendar, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { UserProfile } from '@/lib/types';

interface GuestTalentCardProps {
  talent: UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  onViewDetails: () => void;
}

export function GuestTalentCard({ talent, onSwipe, onViewDetails }: GuestTalentCardProps) {
  return (
    <motion.div
      className="absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {/* Header with avatar or gradient */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {'avatar_url' in talent && talent.avatar_url ? (
          <img 
            src={talent.avatar_url} 
            alt={talent.full_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{talent.full_name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            <MapPin className="h-4 w-4" />
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

      <div className="p-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            {talent.experience_level === 'junior' ? 'Junior' : 
             talent.experience_level === 'intermediaire' ? 'Intermédiaire' : 'Senior'}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {talent.availability}
          </span>
        </div>

        {/* Brief bio */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">À propos</h4>
          <p className="text-gray-600">
            {talent.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-500" />
            Compétences
          </h4>
          <div className="flex flex-wrap gap-2">
            {talent.skills?.map((skill) => (
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
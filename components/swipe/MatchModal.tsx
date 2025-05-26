import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X, Star, MapPin, Calendar, Briefcase, MessageSquare, FileText, ExternalLink, User, Award, Check, GraduationCap, Clock, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { Project, UserProfile } from '@/lib/types';

interface MatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Project | UserProfile;
  type: 'project' | 'talent';
}

// Custom Confetti component
const ConfettiAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -20,
            opacity: 1,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: window.innerHeight + 50,
            opacity: 0
          }}
          transition={{ 
            duration: Math.random() * 2 + 2,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
          className="absolute w-4 h-4 rounded-sm"
          style={{ 
            backgroundColor: ['#FF5E5B', '#D8D8D8', '#FFFFEA', '#00CECB', '#FFED66', '#4D96FF', '#FF6B6B', '#C2F9BB'][Math.floor(Math.random() * 8)],
            boxShadow: '0 0 10px rgba(255,255,255,0.5)'
          }}
        />
      ))}
    </div>
  );
};

export function MatchModal({ open, onOpenChange, item, type }: MatchModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedCity } = useLocationStore();
  const [playSound] = React.useState(true);

  // Play match sound effect
  useEffect(() => {
    if (open && playSound) {
      const audio = new Audio('/sounds/match-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [open, playSound]);

  // Check if there's a match to show document access
  const { data: hasMatch } = useQuery({
    queryKey: ['match-document', item.id, user?.id],
    queryFn: async () => {
      if (!user?.id || type !== 'project') return false;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!profile) return false;
      
      const { data, error } = await supabase
        .from('project_matches')
        .select('*')
        .eq('project_id', item.id)
        .eq('seeker_id', profile.id)
        .single();
      
      return !!data && !error;
    },
    enabled: !!user?.id && type === 'project'
  });

  // Calculate distance between user and item
  const getDistance = () => {
    if (!selectedCity || !item.latitude || !item.longitude) return null;
    
    const distance = calculateDistance(
      selectedCity.latitude,
      selectedCity.longitude,
      item.latitude,
      item.longitude
    );
    
    return Math.round(distance);
  };

  const distance = getDistance();

  const handleMessage = () => {
    onOpenChange(false);
    navigate('/messages');
  };

  const experienceLevelText = {
    any: 'Tous niveaux acceptés',
    beginner: 'Débutant accepté',
    experienced: 'Expérimenté requis',
    junior: 'Junior',
    intermediaire: 'Intermédiaire',
    senior: 'Senior'
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" 
        />
        <Dialog.Content
          as={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-xl p-0 overflow-hidden z-50 max-h-[90vh] flex flex-col"
        >
          <Dialog.Title className="sr-only">Match !</Dialog.Title>
          
          {/* Confetti animation */}
          <ConfettiAnimation />
          
          {/* Header Image with match animation */}
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white/20 rounded-full p-6 inline-block"
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <Star className="h-16 w-16 text-yellow-300" />
                  </motion.div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  className="text-3xl font-bold text-white mt-2"
                >
                  Match !
                </motion.h2>
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-2xl font-bold mb-2"
                >
                  Félicitations !
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-gray-600"
                >
                  {type === 'project' 
                    ? 'Vous avez trouvé un projet intéressant !'
                    : 'Vous avez trouvé un talent prometteur !'}
                </motion.p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-4 mb-6"
            >
              <h3 className="text-xl font-semibold">
                {type === 'project' ? (item as Project).title : (item as UserProfile).full_name}
              </h3>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{item.city || 'France'}</span>
                {distance !== null && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                    à {distance} km
                  </span>
                )}
              </div>

              {type === 'project' ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{(item as Project).collaboration_type}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{(item as UserProfile).availability}</span>
                </div>
              )}

              <p className="text-gray-700">
                {type === 'project' ? (item as Project).brief_description : (item as UserProfile).bio}
              </p>
            </motion.div>

            {/* Detailed information section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4 mb-6"
            >
              {type === 'project' ? (
                <>
                  {/* Profil recherché */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 flex items-center gap-2 mb-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Profil recherché
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-700">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        <span>
                          {experienceLevelText[(item as Project).experience_level as keyof typeof experienceLevelText]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-700">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>{(item as Project).collaboration_type}</span>
                      </div>
                    </div>
                    
                    {/* Description de l'associé idéal */}
                    {(item as Project).ideal_partner_description && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-1">Associé idéal</h4>
                        <p className="text-sm text-blue-700">{(item as Project).ideal_partner_description}</p>
                      </div>
                    )}
                  </div>

                  {/* Exigences spécifiques */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                      <Check className="h-5 w-5 text-green-600" />
                      Exigences spécifiques
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(item as Project).experience_level === 'any' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {(item as Project).experience_level === 'any' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </div>
                        <span className="text-gray-700">Accepte les débutants</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(item as Project).required_skills?.length === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {(item as Project).required_skills?.length === 0 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        </div>
                        <span className="text-gray-700">Aucune compétence spécifique requise</span>
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  {(item as Project).required_skills && (item as Project).required_skills.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        Compétences recherchées
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(item as Project).required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Points forts */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-yellow-600" />
                      Points forts
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-700">Réactivité</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-700">Expertise technique</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-700">Autonomie</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-700">Expérience</span>
                      </div>
                    </div>
                  </div>

                  {/* Compétences */}
                  {(item as UserProfile).skills && (item as UserProfile).skills.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 flex items-center gap-2 mb-3">
                        <Award className="h-5 w-5 text-blue-600" />
                        Compétences
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(item as UserProfile).skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* Document access for matched projects */}
            {type === 'project' && (item as Project).full_description_url && hasMatch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
              >
                <h3 className="font-medium text-green-800 flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Document confidentiel disponible
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  Félicitations ! Vous avez maintenant accès au document détaillé du projet.
                </p>
                <Button
                  asChild
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <a
                    href={(item as Project).full_description_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Voir le document
                  </a>
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={handleMessage}
                className="w-full flex items-center justify-center gap-2 py-6 text-lg bg-gradient-to-r from-blue-500 to-blue-700"
              >
                <MessageSquare className="h-5 w-5" />
                Envoyer un message
              </Button>
            </motion.div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
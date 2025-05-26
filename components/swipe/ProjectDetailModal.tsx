import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { 
  X, MapPin, GraduationCap, Building, Calendar, MessageSquare, FileText, Phone, 
  User, Star, Award, Clock, Target, Zap, Sparkles, Check, ExternalLink, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { Project, UserProfile } from '@/lib/types';

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Project | UserProfile;
  type: 'project' | 'talent';
}

export function ProjectDetailModal({ open, onOpenChange, item, type }: ProjectDetailModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'requirements' | 'contact'>('about');
  const { selectedCity } = useLocationStore();

  // Check if there's a match between the user and the project
  const { data: hasMatch } = useQuery({
    queryKey: ['match', item.id, user?.id],
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

  const experienceLevelText = {
    any: 'Tous niveaux acceptés',
    beginner: 'Débutant accepté',
    experienced: 'Expérimenté requis',
    junior: 'Junior',
    intermediaire: 'Intermédiaire',
    senior: 'Senior'
  };

  // Generate a gradient based on item type and id
  const getGradient = () => {
    if (type === 'project') {
      const category = (item as Project).category || '';
      
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
    } else {
      // For talent
      const talent = item as UserProfile;
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
    }
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
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
        >
          {/* Header */}
          <div className={`h-48 bg-gradient-to-r ${getGradient()} relative`}>
            {type === 'project' && (item as Project).image_url && (
              <img 
                src={(item as Project).image_url} 
                alt={(item as Project).title} 
                className="w-full h-full object-cover"
              />
            )}
            {type === 'talent' && 'avatar_url' in item && item.avatar_url && (
              <img 
                src={item.avatar_url} 
                alt={(item as UserProfile).full_name} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
            
            {/* Floating badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              {distance !== null && (
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>à {distance} km</span>
                </div>
              )}
              
              {type === 'talent' && (item as UserProfile).is_verified && (
                <div className="bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>Vérifié</span>
                </div>
              )}
              
              {type === 'project' && (item as Project).open_to_investment && (
                <div className="bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>Investissement</span>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold">
                {type === 'project' ? (item as Project).title : (item as UserProfile).full_name}
              </h2>
              
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{item.city || 'France'}</span>
                </div>
                
                {type === 'project' ? (
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{(item as Project).category}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{(item as UserProfile).availability}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'about' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              À propos
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'requirements' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'project' ? 'Exigences' : 'Compétences'}
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === 'contact' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 space-y-6"
              >
                {type === 'project' ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-500" />
                        Description du projet
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {(item as Project).brief_description}
                      </p>
                    </div>

                    {/* Profil recherché */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-800">
                        <User className="h-5 w-5 text-blue-500" />
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

                    {/* Document confidentiel */}
                    {type === 'project' && (item as Project).full_description_url && (
                      <div className={`p-4 rounded-lg ${hasMatch ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          Document confidentiel
                        </h3>
                        
                        {hasMatch ? (
                          <>
                            <p className="text-green-700 mb-4">
                              Félicitations ! Vous avez accès au document confidentiel de ce projet.
                            </p>
                            <Button
                              asChild
                              className="flex items-center gap-2"
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
                          </>
                        ) : (
                          <p className="text-gray-600">
                            Ce projet possède un document confidentiel qui sera accessible après un match.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        À propos
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {(item as UserProfile).bio}
                      </p>
                    </div>

                    {/* Points forts */}
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-yellow-800">
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

                    {/* Expérience */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-gray-700" />
                        Expérience
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="font-medium">Lead Developer</div>
                          <div className="text-sm text-gray-500">2023 - Présent</div>
                          <p className="text-sm text-gray-600 mt-1">
                            Développement de fonctionnalités clés et gestion d'équipe
                          </p>
                        </div>
                        <div>
                          <div className="font-medium">Senior Developer</div>
                          <div className="text-sm text-gray-500">2021 - 2023</div>
                          <p className="text-sm text-gray-600 mt-1">
                            Développement frontend et backend
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'requirements' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 space-y-6"
              >
                {type === 'project' ? (
                  <>
                    {/* Exigences spécifiques */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
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
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(item as Project).open_to_investment ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {(item as Project).open_to_investment ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </div>
                          <span className="text-gray-700">Ouvert aux investisseurs</span>
                        </div>
                      </div>
                    </div>

                    {/* Compétences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        Compétences recherchées
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(item as Project).required_skills?.map((skill, index) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                        {(!((item as Project).required_skills) || (item as Project).required_skills.length === 0) && (
                          <p className="text-gray-500 italic">Aucune compétence spécifique requise</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Porteur de projet */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-700" />
                        À propos du porteur
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Entrepreneur passionné avec une vision claire pour ce projet. 
                        Recherche un partenaire motivé et complémentaire pour développer cette solution innovante.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Compétences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        Compétences
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(item as UserProfile).skills?.map((skill, index) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                        {(!((item as UserProfile).skills) || (item as UserProfile).skills.length === 0) && (
                          <p className="text-gray-500 italic">Aucune compétence spécifiée</p>
                        )}
                      </div>
                    </div>

                    {/* Disponibilité et expérience */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Disponibilité</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {(item as UserProfile).availability || 'Non spécifié'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Expérience</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {experienceLevelText[(item as UserProfile).experience_level as keyof typeof experienceLevelText] || 'Non spécifié'}
                        </p>
                      </div>
                    </div>

                    {/* Objectifs */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5 text-gray-700" />
                        Objectifs
                      </h3>
                      <div className="space-y-2">
                        {(item as UserProfile).objectives?.map((objective, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">{objective}</span>
                          </div>
                        ))}
                        {(!((item as UserProfile).objectives) || (item as UserProfile).objectives.length === 0) && (
                          <p className="text-gray-500 italic">Aucun objectif spécifié</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6 space-y-6"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  Prendre contact
                </h3>

                <div className="space-y-4">
                  <Button 
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={() => {}}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Envoyer un message
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {}}
                  >
                    <Calendar className="h-4 w-4" />
                    Prendre rendez-vous
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => {}}
                  >
                    <Phone className="h-4 w-4" />
                    Appel vidéo
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Les coordonnées complètes seront disponibles après un match mutuel.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
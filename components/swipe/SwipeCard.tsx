import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Briefcase, Star, Calendar, Users, Eye, Heart,
  MessageSquare, FileText, Phone, Building, Clock, Award,
  GraduationCap, Rocket, User, ChevronRight, ChevronDown, ChevronUp,
  Check, X, Target, Zap, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/geolocation';
import type { Project, UserProfile } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface SwipeCardProps {
  item: Project | UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  type: 'project' | 'talent';
}

export function SwipeCard({ item, onSwipe, type }: SwipeCardProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const { selectedCity } = useLocationStore();

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

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleFullDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };

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
    const id = item.id;
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-400 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-teal-400 to-blue-500',
      'from-pink-500 to-red-500',
      'from-indigo-500 to-blue-600'
    ];
    
    return gradients[hash % gradients.length];
  };

  const renderHeader = () => {
    const hasImage = type === 'project' 
      ? (item as Project).image_url && !imageError
      : 'avatar_url' in item && item.avatar_url && !imageError;
    
    const imageUrl = type === 'project' 
      ? (item as Project).image_url 
      : 'avatar_url' in item ? item.avatar_url : null;
    
    const gradient = getGradient();

    return (
      <div className="relative h-64 overflow-hidden rounded-t-xl">
        {/* Background gradient or image */}
        <div className="absolute inset-0">
          {hasImage && imageUrl ? (
            <>
              <img 
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              {type === 'project' ? (
                <Briefcase className="h-16 w-16 text-white/30" />
              ) : (
                <User className="h-16 w-16 text-white/30" />
              )}
            </div>
          )}
        </div>

        {/* Floating badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          {distance !== null && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 shadow-lg"
            >
              <MapPin className="h-3 w-3" />
              <span>à {distance} km</span>
            </motion.div>
          )}
          
          {'is_verified' in item && item.is_verified && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 shadow-lg"
            >
              <Star className="h-3 w-3" />
              <span>Vérifié</span>
            </motion.div>
          )}
        </div>

        {/* Header content */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-2 drop-shadow-md"
          >
            {type === 'project' ? (item as Project).title : (item as UserProfile).full_name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 text-white/90"
          >
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
          </motion.div>
        </div>
      </div>
    );
  };

  const renderBadges = () => {
    if (type === 'project') {
      const project = item as Project;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-4 px-4"
        >
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
            <Building className="h-4 w-4" />
            {project.category}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
            <Clock className="h-4 w-4" />
            {project.collaboration_type}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
            <GraduationCap className="h-4 w-4" />
            {experienceLevelText[project.experience_level as keyof typeof experienceLevelText]}
          </span>
        </motion.div>
      );
    } else {
      const talent = item as UserProfile;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-4 px-4"
        >
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
            <GraduationCap className="h-4 w-4" />
            {experienceLevelText[talent.experience_level as keyof typeof experienceLevelText] || 'Expérience non spécifiée'}
          </span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
            <Calendar className="h-4 w-4" />
            {talent.availability || 'Disponibilité non spécifiée'}
          </span>
        </motion.div>
      );
    }
  };

  const renderDescription = () => {
    if (type === 'project') {
      const project = item as Project;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 mb-4"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <Target className="h-5 w-5 text-blue-500" />
            Description
          </h3>
          <div className={`relative ${!showFullDescription && !expanded && 'max-h-24 overflow-hidden'}`}>
            <p className="text-gray-600 leading-relaxed">
              {project.brief_description}
            </p>
            {!showFullDescription && !expanded && project.brief_description.length > 150 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          {project.brief_description.length > 150 && (
            <button 
              onClick={toggleFullDescription}
              className="mt-2 text-blue-600 flex items-center gap-1 text-sm hover:underline"
            >
              {showFullDescription ? (
                <>
                  Voir moins <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Voir plus <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      );
    } else {
      const talent = item as UserProfile;
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 mb-4"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <User className="h-5 w-5 text-blue-500" />
            À propos
          </h3>
          <div className={`relative ${!showFullDescription && !expanded && 'max-h-24 overflow-hidden'}`}>
            <p className="text-gray-600 leading-relaxed">
              {talent.bio}
            </p>
            {!showFullDescription && !expanded && talent.bio.length > 150 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
          {talent.bio.length > 150 && (
            <button 
              onClick={toggleFullDescription}
              className="mt-2 text-blue-600 flex items-center gap-1 text-sm hover:underline"
            >
              {showFullDescription ? (
                <>
                  Voir moins <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Voir plus <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      );
    }
  };

  const renderSkills = () => {
    const skills = type === 'project' 
      ? (item as Project).required_skills 
      : (item as UserProfile).skills;
    
    if (!skills || skills.length === 0) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="px-4 mb-6"
      >
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
          <Award className="h-5 w-5 text-blue-500" />
          {type === 'project' ? 'Compétences recherchées' : 'Compétences'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, expanded ? skills.length : 5).map((skill, index) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm"
            >
              {skill}
            </motion.span>
          ))}
          {!expanded && skills.length > 5 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm"
            >
              +{skills.length - 5}
            </motion.span>
          )}
        </div>
      </motion.div>
    );
  };

  const renderActionButtons = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-4 pt-2 pb-4 space-y-3"
      >
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            onClick={toggleExpanded}
            className="w-full flex items-center justify-center gap-2 py-6 text-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-300"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-5 w-5" />
                Voir moins
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5" />
                Voir plus de détails
              </>
            )}
          </Button>
        </motion.div>
        
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200"
                onClick={() => {}}
              >
                <Calendar className="h-4 w-4" />
                Prendre RDV
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200"
                onClick={() => {}}
              >
                <Phone className="h-4 w-4" />
                Appel vidéo
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="col-span-2">
              <Button
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 py-6 text-lg"
                onClick={() => {}}
              >
                <MessageSquare className="h-5 w-5" />
                Envoyer un message
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderExpandedContent = () => {
    if (!expanded) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-4 space-y-6 border-t border-gray-100"
      >
        {type === 'project' ? (
          <>
            {/* Profil recherché */}
            <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
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
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Document confidentiel
                </h3>
                
                <p className="text-gray-600 mb-4">
                  Ce projet possède un document confidentiel qui sera accessible après un match.
                </p>
              </div>
            )}

            {/* Exigences spécifiques */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
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
          </>
        ) : (
          <>
            {/* Expérience */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
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
            
            {/* Disponibilité */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Disponibilité</span>
                </div>
                <p className="text-sm text-gray-600">
                  {(item as UserProfile).availability}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Expérience</span>
                </div>
                <p className="text-sm text-gray-600">
                  {experienceLevelText[(item as UserProfile).experience_level as keyof typeof experienceLevelText] || 'Non spécifié'}
                </p>
              </div>
            </div>

            {/* Points forts */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Points forts
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-700">Réactivité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-700">Expertise technique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-700">Travail d'équipe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-700">Attention aux détails</span>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      {renderHeader()}
      
      <div className="flex-1 overflow-y-auto">
        {renderBadges()}
        {renderDescription()}
        {renderSkills()}
        {renderExpandedContent()}
      </div>
      
      {renderActionButtons()}
    </motion.div>
  );
}
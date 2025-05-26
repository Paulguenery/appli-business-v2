import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import { 
  User, Briefcase, FileText, Calendar, MapPin, 
  Star, Award, GraduationCap, Clock, Target, 
  Building, Phone, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project, UserProfile } from '@/lib/types';

interface ProjectDetailTabsProps {
  item: Project | UserProfile;
  type: 'project' | 'talent';
}

export function ProjectDetailTabs({ item, type }: ProjectDetailTabsProps) {
  const [activeTab, setActiveTab] = useState('about');

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
      <Tabs.List className="flex border-b">
        <Tabs.Trigger
          value="about"
          className="flex-1 py-3 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
        >
          À propos
        </Tabs.Trigger>
        <Tabs.Trigger
          value="skills"
          className="flex-1 py-3 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
        >
          {type === 'project' ? 'Compétences' : 'Expertise'}
        </Tabs.Trigger>
        <Tabs.Trigger
          value="contact"
          className="flex-1 py-3 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500"
        >
          Contact
        </Tabs.Trigger>
      </Tabs.List>

      <AnimatePresence mode="wait">
        <Tabs.Content value="about" asChild>
          <motion.div
            key="about"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 space-y-6"
          >
            {type === 'project' ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Description du projet
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {(item as Project).brief_description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Building className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Secteur</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(item as Project).category}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Collaboration</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(item as Project).collaboration_type}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Niveau d'expérience</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {(item as Project).experience_level === 'any' 
                      ? 'Tous niveaux acceptés' 
                      : (item as Project).experience_level === 'beginner'
                        ? 'Débutant accepté'
                        : 'Expérimenté requis'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    À propos
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {(item as UserProfile).bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Disponibilité</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(item as UserProfile).availability}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Expérience</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {(item as UserProfile).experience_level}
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </Tabs.Content>

        <Tabs.Content value="skills" asChild>
          <motion.div
            key="skills"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 space-y-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              {type === 'project' ? 'Compétences recherchées' : 'Compétences'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(type === 'project' ? (item as Project).required_skills : (item as UserProfile).skills)?.map((skill, index) => (
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
            </div>

            {type === 'talent' && (
              <div className="mt-8">
                <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  Parcours
                </h4>
                <div className="relative pl-6 border-l-2 border-blue-100">
                  <div className="relative mb-6">
                    <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100" />
                    <div>
                      <h5 className="font-medium text-blue-700">Lead Developer</h5>
                      <p className="text-sm text-gray-600">2023 - Present</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Development of key features and team management
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100" />
                    <div>
                      <h5 className="font-medium text-blue-700">Senior Developer</h5>
                      <p className="text-sm text-gray-600">2021 - 2023</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Frontend and backend development
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </Tabs.Content>

        <Tabs.Content value="contact" asChild>
          <motion.div
            key="contact"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-4 space-y-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
        </Tabs.Content>
      </AnimatePresence>
    </Tabs.Root>
  );
}
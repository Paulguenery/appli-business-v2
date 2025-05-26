import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X, Star, MapPin, Calendar, Briefcase, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { Project, UserProfile } from '@/lib/types';

interface GuestMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Project | UserProfile;
  type: 'project' | 'talent';
}

export function GuestMatchModal({ open, onOpenChange, item, type }: GuestMatchModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-xl p-0 overflow-hidden">
          <Dialog.Title className="sr-only">Match !</Dialog.Title>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative"
          >
            {/* Header Image */}
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600" />

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    C'est un match !
                  </h2>
                  <p className="text-gray-600">
                    {type === 'project' 
                      ? 'Vous avez trouvé un projet intéressant !'
                      : 'Vous avez trouvé un talent prometteur !'}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-semibold">
                  {type === 'project' ? (item as Project).title : (item as UserProfile).full_name}
                </h3>

                {item.city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{item.city}</span>
                  </div>
                )}

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
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-yellow-800 mb-2">Mode invité</h4>
                <p className="text-yellow-700 text-sm">
                  En mode invité, vous ne pouvez pas contacter directement les {type === 'project' ? 'porteurs de projet' : 'talents'}.
                  Créez un compte pour débloquer toutes les fonctionnalités !
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Continuer à swiper
                </Button>
                <Button
                  asChild
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Link to="/">
                    <MessageSquare className="h-4 w-4" />
                    Créer un compte
                  </Link>
                </Button>
              </div>
            </div>

            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20">
              <X className="h-5 w-5 text-white" />
            </Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
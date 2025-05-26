import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Phone, PhoneOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface IncomingCallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({
  open,
  onOpenChange,
  callerName,
  onAccept,
  onReject
}: IncomingCallModalProps) {
  // Play ringtone when call is incoming
  useEffect(() => {
    if (open) {
      const audio = new Audio('/sounds/ringtone.mp3');
      audio.loop = true;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />
        <Dialog.Content
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                borderColor: ['#3B82F6', '#60A5FA', '#3B82F6']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 border-4 border-blue-500"
            >
              <User className="h-8 w-8 text-blue-600" />
            </motion.div>

            <Dialog.Title className="text-xl font-semibold mb-2">
              Appel entrant
            </Dialog.Title>

            <Dialog.Description className="text-gray-600 mb-6">
              {callerName} souhaite démarrer un appel vidéo
            </Dialog.Description>

            <div className="flex gap-4 w-full">
              <Button
                onClick={onReject}
                variant="destructive"
                className="flex-1 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <PhoneOff className="h-4 w-4" />
                Refuser
              </Button>
              <Button
                onClick={onAccept}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
              >
                <Phone className="h-4 w-4" />
                Accepter
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { VideoCall } from './VideoCall';
import { X } from 'lucide-react';

interface CallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callId: string;
  participantId: string;
  title: string;
}

export function CallModal({ open, onOpenChange, callId, participantId, title }: CallModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0">
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <VideoCall
            callId={callId}
            participantId={participantId}
            onEnd={() => onOpenChange(false)}
          />
          <Dialog.Close className="absolute top-4 right-4 z-10">
            <X className="h-6 w-6 text-white" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
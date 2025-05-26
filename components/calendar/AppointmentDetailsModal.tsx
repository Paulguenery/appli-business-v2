import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import type { Appointment } from '@/lib/types';

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function AppointmentDetailsModal({
  appointment,
  open,
  onOpenChange,
  onDelete,
}: AppointmentDetailsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Détails du rendez-vous
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Date et heure</h3>
              <p className="text-gray-600">
                {format(appointment.start, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
              <p className="text-gray-600">
                {format(appointment.end, "HH:mm", { locale: fr })}
              </p>
            </div>

            <div>
              <h3 className="font-medium">Participant</h3>
              <p className="text-gray-600">{appointment.title.replace('RDV avec ', '')}</p>
            </div>

            {appointment.description && (
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-gray-600">{appointment.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-medium">Statut</h3>
              <p className="text-gray-600">
                {appointment.status === 'pending' ? 'En attente' : 'Confirmé'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fermer
              </Button>
              <Button
                variant="destructive"
                onClick={onDelete}
              >
                Supprimer
              </Button>
            </div>
          </div>

          <Dialog.Close className="absolute top-4 right-4">
            <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
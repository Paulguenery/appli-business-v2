import React, { useState } from 'react';
import { useLocationStore } from '@/stores/location';
import { RayonSlider } from './RayonSlider';
import { LocationSearch } from './LocationSearch';
import { MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';

export function LocationFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCity, radius, reset, setRadius } = useLocationStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Localisation</h2>
        </div>
        {selectedCity && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-gray-500 hover:text-gray-700"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {selectedCity ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="font-medium text-lg">{selectedCity.name}</div>
          <div className="text-sm text-gray-500 mb-4">
            {selectedCity.postal_code} - {selectedCity.department}
          </div>
          <RayonSlider value={radius} onChange={setRadius} />
        </motion.div>
      ) : (
        <p className="text-gray-500 mb-4">
          Sélectionnez une ville pour filtrer par localisation
        </p>
      )}

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <Button className="w-full flex items-center justify-between mt-4">
            <span>{selectedCity ? 'Modifier la localisation' : 'Choisir une ville'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto m-4 z-50">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Recherche par localisation
            </Dialog.Title>
            <LocationSearch onClose={() => setIsOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
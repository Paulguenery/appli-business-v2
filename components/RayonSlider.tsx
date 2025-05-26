import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

// Définition des étapes de distance avec des incréments de 10km
const DISTANCE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

interface RayonSliderProps {
  value: number;
  onChange: (val: number) => void;
}

export function RayonSlider({ value, onChange }: RayonSliderProps) {
  // État local pour la valeur affichée pendant le glissement
  const [displayValue, setDisplayValue] = useState(value);
  
  // Mise à jour de la valeur affichée lorsque la prop value change
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  // Trouver l'étape la plus proche de la valeur actuelle
  const findClosestStep = (val: number) => {
    return DISTANCE_STEPS.reduce((prev, curr) => {
      return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
    });
  };

  // Gérer le changement de valeur du slider
  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setDisplayValue(newValue);
  };

  // Gérer la fin du glissement
  const handleChangeCommitted = () => {
    const closestStep = findClosestStep(displayValue);
    onChange(closestStep);
    setDisplayValue(closestStep);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Rayon de recherche</span>
        <motion.span 
          key={displayValue}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
        >
          {displayValue} km
        </motion.span>
      </div>
      
      <div className="relative pt-1">
        <Slider
          min={DISTANCE_STEPS[0]}
          max={DISTANCE_STEPS[DISTANCE_STEPS.length - 1]}
          step={1}
          value={[displayValue]}
          onValueChange={handleValueChange}
          onValueCommit={handleChangeCommitted}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-wrap justify-between mt-4">
        {DISTANCE_STEPS.map((step) => (
          <motion.button
            key={step}
            onClick={() => {
              onChange(step);
              setDisplayValue(step);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              displayValue === step
                ? 'bg-blue-500 text-white font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {step}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
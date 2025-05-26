import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface City {
  id: string;
  name: string;
  department: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

interface LocationState {
  selectedCity: City | null;
  radius: number;
  setSelectedCity: (city: City | null) => void;
  setRadius: (radius: number) => void;
  reset: () => void;
}

// Définition des étapes de distance avec des incréments de 10km
const DISTANCE_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedCity: null,
      radius: DISTANCE_STEPS[0],
      setSelectedCity: (city) => set({ selectedCity: city }),
      setRadius: (radius) => {
        // Trouver l'étape la plus proche dans DISTANCE_STEPS
        const closestStep = DISTANCE_STEPS.reduce((prev, curr) => {
          return Math.abs(curr - radius) < Math.abs(prev - radius) ? curr : prev;
        }, DISTANCE_STEPS[0]);
        
        set({ radius: closestStep });
      },
      reset: () => set({ selectedCity: null, radius: DISTANCE_STEPS[0] })
    }),
    {
      name: 'location-store'
    }
  )
);
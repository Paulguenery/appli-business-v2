import { useLocationStore } from '@/stores/location';
import { calculateDistance } from '@/lib/supabase';

export function useLocationFilter() {
  const { selectedCity, radius } = useLocationStore();

  const isWithinRadius = (lat: number, lon: number) => {
    if (!selectedCity) return true;
    
    const distance = calculateDistance(
      selectedCity.latitude,
      selectedCity.longitude,
      lat,
      lon
    );
    
    return distance <= radius;
  };

  return {
    selectedCity,
    radius,
    isWithinRadius,
  };
}
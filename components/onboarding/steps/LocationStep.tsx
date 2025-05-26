import React from 'react';
import { LocationSearch } from '@/components/LocationSearch';

interface LocationStepProps {
  onComplete: (stepId: string, answers: { city: string }) => void;
}

export function LocationStep({ onComplete }: LocationStepProps) {
  const handleLocationSelect = (city: any) => {
    onComplete('location', {
      city: city.name,
      postal_code: city.postal_code,
      department: city.department,
      latitude: city.latitude,
      longitude: city.longitude
    });
  };

  return (
    <div>
      <LocationSearch onClose={handleLocationSelect} />
    </div>
  );
}
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label, className = '' }: BackButtonProps) {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className={`flex items-center gap-2 ${className}`}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-4 w-4" />
      {label && <span>{label}</span>}
    </Button>
  );
}
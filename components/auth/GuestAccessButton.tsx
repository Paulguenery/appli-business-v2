import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GuestAccessButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border-dashed"
    >
      <Link to="/guest">
        <Eye className="h-5 w-5" />
        <span>Explorer sans compte</span>
      </Link>
    </Button>
  );
}
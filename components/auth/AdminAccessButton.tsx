import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminAccessButton() {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border-dashed border-red-300 text-red-600 hover:bg-red-50"
    >
      <Link to="/admin">
        <ShieldCheck className="h-5 w-5" />
        <span>Accès administrateur</span>
      </Link>
    </Button>
  );
}
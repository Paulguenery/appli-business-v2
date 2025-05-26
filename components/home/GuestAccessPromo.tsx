import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function GuestAccessPromo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Eye className="h-6 w-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Essayez sans créer de compte
          </h3>
          
          <p className="text-blue-700 mb-4">
            Découvrez notre plateforme en mode invité. Explorez les projets et talents disponibles sans inscription.
          </p>
          
          <Button
            asChild
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Link to="/guest" className="flex items-center gap-2">
              Explorer maintenant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
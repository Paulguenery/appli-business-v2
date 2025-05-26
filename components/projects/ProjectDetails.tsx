import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, GraduationCap } from 'lucide-react';

interface ProjectDetailsProps {
  projectId: string;
  isMatched: boolean;
}

const experienceLevelText = {
  any: 'Tous niveaux acceptés',
  beginner: 'Débutant accepté',
  experienced: 'Expérimenté requis'
};

export function ProjectDetails({ projectId, isMatched }: ProjectDetailsProps) {
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles (
            full_name,
            city
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (!project) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
      <p className="text-gray-600 mb-6">
        Par {project.profiles.full_name} • {project.profiles.city}
      </p>

      <div className="flex items-center gap-2 text-gray-600 mb-6">
        <GraduationCap className="h-5 w-5" />
        <span>{experienceLevelText[project.experience_level as keyof typeof experienceLevelText]}</span>
      </div>

      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-2">Description du projet</h3>
        <p>{project.brief_description}</p>
      </div>

      {isMatched && project.full_description_url && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Document détaillé
          </h3>
          <p className="text-gray-600 mb-4">
            Félicitations ! Vous avez maintenant accès au document détaillé du projet.
          </p>
          <Button
            asChild
            className="flex items-center gap-2"
          >
            <a
              href={project.full_description_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Voir le document
            </a>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Compétences recherchées</h3>
        <div className="flex flex-wrap gap-2">
          {project.required_skills?.map((skill: string) => (
            <span
              key={skill}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
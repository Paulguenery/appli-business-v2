import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { UserTypeStep } from './steps/UserTypeStep';
import { SectorsStep } from './steps/SectorsStep';
import { ObjectivesStep } from './steps/ObjectivesStep';
import { SkillsStep } from './steps/SkillsStep';
import { LocationStep } from './steps/LocationStep';
import { useAuth } from '@/hooks/use-auth';
import type { OnboardingStep } from '@/lib/types';

const steps: OnboardingStep[] = [
  {
    id: 'user-type',
    title: 'Votre profil',
    description: 'Sélectionnez votre type de profil pour commencer',
    fields: [
      {
        name: 'user_type',
        type: 'select',
        label: 'Je suis...',
        required: true,
        options: [
          'project_owner|Porteur de projet',
          'project_seeker|Chercheur de projet',
          'investor|Investisseur'
        ]
      }
    ]
  },
  {
    id: 'sectors',
    title: 'Vos secteurs d\'activité',
    description: 'Sélectionnez les secteurs qui vous intéressent',
    fields: [
      {
        name: 'sectors',
        type: 'multiselect',
        label: 'Secteurs',
        required: true,
        options: [
          'Technology',
          'E-commerce',
          'Healthcare',
          'Education',
          'Finance',
          'Sustainability',
          'Social Impact',
          'AI/ML',
          'Blockchain',
          'Mobile Apps'
        ]
      }
    ]
  },
  {
    id: 'objectives',
    title: 'Vos objectifs',
    description: 'Définissez vos objectifs sur la plateforme',
    fields: [
      {
        name: 'objectives',
        type: 'multiselect',
        label: 'Objectifs',
        required: true,
        options: [
          'Trouver des collaborateurs',
          'Rejoindre un projet',
          'Investir dans des projets',
          'Développer mon réseau',
          'Partager mes compétences',
          'Apprendre de nouvelles compétences'
        ]
      }
    ]
  },
  {
    id: 'skills',
    title: 'Vos compétences',
    description: 'Sélectionnez vos principales compétences',
    fields: [
      {
        name: 'skills',
        type: 'multiselect',
        label: 'Compétences',
        required: true,
        options: []
      }
    ]
  },
  {
    id: 'location',
    title: 'Votre localisation',
    description: 'Définissez votre zone géographique',
    fields: [
      {
        name: 'city',
        type: 'text',
        label: 'Ville',
        required: true
      }
    ]
  }
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStepComplete = async (stepId: string, stepAnswers: Record<string, any>) => {
    const newAnswers = { ...answers, ...stepAnswers };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Update profile with onboarding answers
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            user_type: newAnswers.user_type,
            sectors: newAnswers.sectors,
            objectives: newAnswers.objectives,
            skills: newAnswers.skills,
            city: newAnswers.city,
            onboarding_completed: true
          })
          .eq('user_id', user?.id);

        if (profileError) throw profileError;

        // Update onboarding progress
        const { error: onboardingError } = await supabase
          .from('onboarding')
          .upsert({
            user_id: user?.id,
            step: steps.length,
            completed_steps: steps.map(s => s.id),
            answers: newAnswers,
            updated_at: new Date().toISOString()
          });

        if (onboardingError) throw onboardingError;

        // Redirect based on user type
        const redirectPath = newAnswers.user_type === 'project_owner' 
          ? '/owner/dashboard'
          : newAnswers.user_type === 'project_seeker'
            ? '/seeker/dashboard'
            : '/investor/dashboard';

        navigate(redirectPath);
      } catch (error) {
        console.error('Error completing onboarding:', error);
      }
    }
  };

  const currentStepData = steps[currentStep];

  const renderStep = () => {
    switch (currentStepData.id) {
      case 'user-type':
        return <UserTypeStep onComplete={handleStepComplete} />;
      case 'sectors':
        return <SectorsStep onComplete={handleStepComplete} />;
      case 'objectives':
        return <ObjectivesStep onComplete={handleStepComplete} userType={answers.user_type} />;
      case 'skills':
        return <SkillsStep onComplete={handleStepComplete} />;
      case 'location':
        return <LocationStep onComplete={handleStepComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            {currentStepData.title}
          </h1>
          <p className="text-gray-600 text-center">
            {currentStepData.description}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderStep()}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Étape {currentStep + 1} sur {steps.length}
          </div>
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Retour
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
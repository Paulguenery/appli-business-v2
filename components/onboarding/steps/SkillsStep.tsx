import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SkillsStepProps {
  onComplete: (stepId: string, answers: { skills: string[] }) => void;
}

const skillCategories = {
  "Informatique & Développement": [
    "Développement web (HTML, CSS, JS, frameworks)",
    "Développement mobile (React Native, Flutter)",
    "Programmation Backend (Node.js, PHP, Python, Java)",
    "API REST & GraphQL",
    "DevOps (Docker, CI/CD, GitHub Actions)",
    "Infrastructure Cloud (AWS, Azure, GCP)",
    "Sécurité informatique (OWASP, chiffrement)",
    "Tests logiciels (unitaires, end-to-end)",
    "Automatisation de tâches",
    "Maintenance de systèmes",
    "Utilisation de Git/GitHub"
  ],
  "Design, Création & Communication": [
    "UI/UX Design (Figma, Adobe XD)",
    "Design graphique (Photoshop, Illustrator)",
    "Création de branding et logos",
    "Montage vidéo (Premiere Pro, After Effects)",
    "Photographie de produit",
    "Direction artistique",
    "Création de contenu réseaux sociaux",
    "Storytelling visuel",
    "Rédaction publicitaire",
    "Création de supports print & web"
  ],
  "Marketing, Vente & Relation client": [
    "Stratégie marketing digital",
    "Référencement naturel (SEO)",
    "Campagnes payantes (Google Ads, Meta)",
    "Gestion CRM (HubSpot, Sendinblue)",
    "Community management",
    "Emailing automatisé",
    "Tunnel de vente",
    "Copywriting persuasif",
    "Négociation commerciale",
    "Fidélisation client"
  ]
};

export function SkillsStep({ onComplete }: SkillsStepProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    if (selectedSkills.length > 0) {
      onComplete('skills', { skills: selectedSkills });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <div key={category} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
            >
              <span className="font-medium">{category}</span>
              {expandedCategories.includes(category) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedCategories.includes(category) && (
              <div className="p-3 pt-0 border-t border-gray-200">
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <label key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        className="w-full mt-6"
        onClick={handleContinue}
        disabled={selectedSkills.length === 0}
      >
        Continuer
      </Button>
    </div>
  );
}
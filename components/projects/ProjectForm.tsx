import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Image as ImageIcon, Upload, X } from 'lucide-react';

export function ProjectForm() {
  const [title, setTitle] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [fullDescriptionUrl, setFullDescriptionUrl] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('any');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [openToAll, setOpenToAll] = useState(false);
  const [noExperienceRequired, setNoExperienceRequired] = useState(false);
  const [noSkillsRequired, setNoSkillsRequired] = useState(false);
  const [idealPartnerDescription, setIdealPartnerDescription] = useState('');
  const [openToInvestment, setOpenToInvestment] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Le fichier doit être une image');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Determine the final experience level based on checkboxes
      let finalExperienceLevel = experienceLevel;
      if (openToAll || noExperienceRequired) {
        finalExperienceLevel = 'any';
      }

      // Determine the final required skills based on checkboxes
      let finalRequiredSkills = requiredSkills;
      if (openToAll || noSkillsRequired) {
        finalRequiredSkills = [];
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          owner_id: profile.id,
          title,
          brief_description: briefDescription,
          full_description_url: fullDescriptionUrl,
          experience_level: finalExperienceLevel,
          required_skills: finalRequiredSkills,
          ideal_partner_description: idealPartnerDescription,
          open_to_investment: openToInvestment,
          image_url: imageUrl
        });

      if (error) throw error;
      navigate('/owner/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau projet</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image du projet
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative">
            {imageUrl ? (
              <div className="relative w-full aspect-video">
                <img
                  src={imageUrl}
                  alt="Project preview"
                  className="rounded-lg object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <div className="flex flex-col items-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Télécharger une image</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG jusqu'à 5MB
                  </p>
                </div>
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre du projet
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description brève
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Cette description sera visible par tous les utilisateurs. Donnez un aperçu de votre projet sans révéler les détails sensibles.
          </p>
          <textarea
            value={briefDescription}
            onChange={(e) => setBriefDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document détaillé
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Ajoutez un lien vers votre document détaillé (Google Docs, PDF, etc.). Ce document ne sera accessible qu'après un match.
          </p>
          <Input
            type="url"
            value={fullDescriptionUrl}
            onChange={(e) => setFullDescriptionUrl(e.target.value)}
            placeholder="https://docs.google.com/..."
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="openToAll"
              checked={openToAll}
              onCheckedChange={(checked) => setOpenToAll(checked as boolean)}
            />
            <label
              htmlFor="openToAll"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ouvert à tous les profils
            </label>
          </div>

          {!openToAll && (
            <div className="ml-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau d'expérience requis
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={noExperienceRequired}
                >
                  <option value="any">Tous niveaux acceptés</option>
                  <option value="beginner">Débutant accepté</option>
                  <option value="experienced">Expérimenté requis</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noExperienceRequired"
                  checked={noExperienceRequired}
                  onCheckedChange={(checked) => setNoExperienceRequired(checked as boolean)}
                />
                <label
                  htmlFor="noExperienceRequired"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sans expérience accepté
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compétences requises
                </label>
                <Input
                  type="text"
                  value={requiredSkills.join(', ')}
                  onChange={(e) => setRequiredSkills(e.target.value.split(',').map(s => s.trim()))}
                  placeholder="React, Node.js, UI/UX..."
                  disabled={noSkillsRequired}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noSkillsRequired"
                  checked={noSkillsRequired}
                  onCheckedChange={(checked) => setNoSkillsRequired(checked as boolean)}
                />
                <label
                  htmlFor="noSkillsRequired"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sans compétence spécifique accepté
                </label>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description de l'associé idéal
          </label>
          <textarea
            value={idealPartnerDescription}
            onChange={(e) => setIdealPartnerDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Décrivez le profil idéal que vous recherchez..."
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="openToInvestment"
              checked={openToInvestment}
              onCheckedChange={(checked) => setOpenToInvestment(checked as boolean)}
            />
            <label
              htmlFor="openToInvestment"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ouvert aux investisseurs
            </label>
          </div>
          {openToInvestment && (
            <div className="ml-6 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
              <p>En cochant cette option, votre projet sera visible par les investisseurs dans leur interface de swipe.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Annuler
          </Button>
          <Button type="submit">
            Créer le projet
          </Button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CallHistory } from '@/components/video-call/CallHistory';
import { CallStatistics } from '@/components/video-call/CallStatistics';

export function ProjectOwnerProfile() {
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [collaborationType, setCollaborationType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          city,
          bio: description,
          collaboration_type: collaborationType,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Profil Porteur de Projet</h1>
      <p className="text-gray-600 mb-8">Gérez votre profil de porteur de projet et vos annonces</p>

      <div className="space-y-6">
        {/* Call Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Statistiques des appels</h2>
          <CallStatistics />
        </div>

        {/* Call History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Historique des appels</h2>
          <CallHistory />
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl text-gray-400">
                      G
                    </div>
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Photo de profil</p>
                    <p className="text-sm text-gray-500">Choisir un fichier</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="GUENERY PAUL"
                    className="input-field"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ville"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Profil Porteur de Projet</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description de votre activité
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="input-field"
                    placeholder="Présentez votre entreprise et vos besoins en termes de projets..."
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de collaboration recherchée
                  </label>
                  <input
                    type="text"
                    value={collaborationType}
                    onChange={(e) => setCollaborationType(e.target.value)}
                    placeholder="Ex: Temps plein, temps partiel"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button type="submit" className="btn-primary">
                  Enregistrer les modifications
                </button>
                <button
                  type="button"
                  onClick={() => supabase.auth.signOut()}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export function InvestorProfile() {
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);

  const interestAreas = [
    'Technology',
    'Healthcare',
    'E-commerce',
    'Fintech',
    'Sustainability',
    'AI/ML',
    'SaaS',
    'Consumer',
    'Enterprise',
    'Deep Tech'
  ];

  const expertiseAreas = [
    'Business Strategy',
    'Marketing',
    'Finance',
    'Product Development',
    'Technology',
    'Operations',
    'Sales',
    'International Markets',
    'Scaling',
    'Team Building'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          city,
          bio,
          sectors: interests,
          skills: expertise,
          user_type: 'investor'
        })
        .eq('user_id', user.id);

      if (error) throw error;
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleExpertise = (area: string) => {
    setExpertise(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Profil Investisseur</h1>
      <p className="text-gray-600 mb-8">Personnalisez votre profil pour découvrir des projets qui correspondent à vos intérêts</p>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl text-gray-400">
                  {fullName ? fullName[0].toUpperCase() : 'I'}
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paris"
                />
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Profil professionnel</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biographie
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Présentez votre expérience et ce que vous pouvez apporter aux projets..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Centres d'intérêt
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleInterest(area)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        interests.includes(area)
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      } border`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domaines d'expertise
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {expertiseAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleExpertise(area)}
                      className={`p-2 text-sm rounded-md transition-colors ${
                        expertise.includes(area)
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      } border`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="submit">
              Enregistrer les modifications
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => supabase.auth.signOut()}
            >
              Se déconnecter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
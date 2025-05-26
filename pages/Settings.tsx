import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Bell, Mail, Lock, Eye, MapPin, MessageSquare, Star, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';

function Settings() {
  const { user, isPremium } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile-settings'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('notification_preferences, settings')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: !!user
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      alert('Paramètres mis à jour avec succès !');
    }
  });

  const handleNotificationToggle = (key: string) => {
    if (!profile?.notification_preferences) return;
    
    const newPreferences = {
      ...profile.notification_preferences,
      [key]: !profile.notification_preferences[key]
    };

    updateSettings({ notification_preferences: newPreferences });
  };

  const handleSettingToggle = (key: string) => {
    if (!profile?.settings) return;

    const newSettings = {
      ...profile.settings,
      [key]: !profile.settings[key]
    };

    updateSettings({ settings: newSettings });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Paramètres</h1>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-medium">Notifications push</h3>
                  <p className="text-sm text-gray-600">Recevoir des notifications sur l'application</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile?.notification_preferences?.push}
                  onChange={() => handleNotificationToggle('push')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-medium">Notifications par email</h3>
                  <p className="text-sm text-gray-600">Recevoir des notifications par email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile?.notification_preferences?.email}
                  onChange={() => handleNotificationToggle('email')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Notification Types */}
            <div className="mt-6">
              <h3 className="font-medium mb-4">Types de notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium">Messages</h3>
                      <p className="text-sm text-gray-600">Notifications de nouveaux messages</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile?.notification_preferences?.messages}
                      onChange={() => handleNotificationToggle('messages')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium">Matches</h3>
                      <p className="text-sm text-gray-600">Notifications de nouveaux matches</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile?.notification_preferences?.matches}
                      onChange={() => handleNotificationToggle('matches')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium">Rendez-vous</h3>
                      <p className="text-sm text-gray-600">Rappels de rendez-vous</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile?.notification_preferences?.appointments}
                      onChange={() => handleNotificationToggle('appointments')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium">Vues du profil</h3>
                      <p className="text-sm text-gray-600">Notifications de vues de votre profil</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile?.notification_preferences?.profile_views}
                      onChange={() => handleNotificationToggle('profile_views')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Confidentialité</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-medium">Afficher les statistiques</h3>
                  <p className="text-sm text-gray-600">Rendre visible vos statistiques sur votre profil</p>
                </div>
              </div>
              {isPremium ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={profile?.settings?.show_stats}
                    onChange={() => handleSettingToggle('show_stats')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/subscribe" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Premium</span>
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="font-medium">Afficher la localisation</h3>
                  <p className="text-sm text-gray-600">Rendre visible votre localisation</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profile?.settings?.show_location}
                  onChange={() => handleSettingToggle('show_location')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Compte</h2>
          </div>

          <div className="space-y-4">
            <Button variant="destructive" className="w-full">
              Supprimer mon compte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

export { Settings }
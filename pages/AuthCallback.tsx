import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          // Check if user profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_type, onboarding_completed')
            .eq('user_id', user.id)
            .single();

          if (!profile) {
            // Redirect to onboarding if no profile exists
            navigate('/onboarding');
          } else if (!profile.onboarding_completed) {
            // Resume onboarding if not completed
            navigate('/onboarding');
          } else {
            // Redirect based on user type
            switch (profile.user_type) {
              case 'project_owner':
                navigate('/owner/dashboard');
                break;
              case 'project_seeker':
                navigate('/seeker/dashboard');
                break;
              case 'investor':
                navigate('/investor/dashboard');
                break;
              default:
                navigate('/onboarding');
            }
          }
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
}
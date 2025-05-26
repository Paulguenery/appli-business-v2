import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      if (data.user) {
        // Vérifier si l'utilisateur a complété son profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed, user_type')
          .eq('user_id', data.user.id)
          .single();
        
        if (!profile || !profile.onboarding_completed) {
          navigate('/onboarding');
        } else {
          // Rediriger vers le dashboard approprié
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
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Veuillez entrer votre adresse email pour réinitialiser votre mot de passe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?reset=true`,
      });

      if (error) throw error;
      
      setResetPasswordSent(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <button 
              type="button" 
              onClick={handleResetPassword}
              disabled={loading || resetPasswordSent}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {resetPasswordSent ? 'Email envoyé' : 'Mot de passe oublié ?'}
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {resetPasswordSent && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
          Un email de réinitialisation de mot de passe a été envoyé à {email}. Veuillez vérifier votre boîte de réception.
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </Button>

      <div className="text-center text-sm text-gray-500">
        En vous connectant, vous acceptez nos{' '}
        <Link to="/terms" className="text-blue-600 hover:underline">conditions d'utilisation</Link>{' '}
        et notre{' '}
        <Link to="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</Link>.
      </div>
    </form>
  );
}
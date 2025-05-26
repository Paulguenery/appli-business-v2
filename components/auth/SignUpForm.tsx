import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Briefcase, Search, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'project_owner' | 'project_seeker' | 'investor' | null>(null);
  const [isOver18, setIsOver18] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'project_owner',
      label: 'Porteur de projet',
      description: 'Je cherche des talents pour mon projet',
      icon: Briefcase
    },
    {
      id: 'project_seeker',
      label: 'Chercheur de projet',
      description: 'Je souhaite rejoindre des projets',
      icon: Search
    },
    {
      id: 'investor',
      label: 'Investisseur',
      description: 'Je souhaite investir dans des projets',
      icon: TrendingUp
    }
  ];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (!userType) {
      setError('Veuillez sélectionner un type de profil');
      return;
    }
    
    if (!isOver18) {
      setError('Vous devez avoir plus de 18 ans pour vous inscrire');
      return;
    }
    
    if (!acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First, sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (!data.user) {
        throw new Error('Erreur lors de la création du compte');
      }
      
      // Wait a moment for the auth session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the current session
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        // If no session, we'll need to sign in manually
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
      }
      
      // Now create the profile with the authenticated session
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          role: userType,
          user_type: userType
        });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw new Error('Erreur lors de la création du profil. Veuillez contacter le support.');
      }
      
      // Redirect to onboarding
      navigate('/onboarding');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
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
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmer le mot de passe
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Je suis...
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {userTypes.map((type) => (
            <motion.button
              key={type.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType(type.id as any)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                userType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <type.icon className={`h-6 w-6 mb-2 ${
                  userType === type.id ? 'text-blue-500' : 'text-gray-500'
                }`} />
                <div className="font-medium">{type.label}</div>
                <div className="text-xs text-gray-500 mt-1">{type.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="isOver18" 
            checked={isOver18} 
            onCheckedChange={(checked) => setIsOver18(checked as boolean)}
            required
            className="mt-1"
          />
          <label htmlFor="isOver18" className="text-sm text-gray-700">
            J'ai plus de 18 ans <span className="text-red-500">*</span>
          </label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="acceptTerms" 
            checked={acceptTerms} 
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            required
            className="mt-1"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-700">
            J'accepte les <Link to="/terms" className="text-blue-600 hover:underline">conditions d'utilisation</Link>, la <Link to="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</Link> et les <Link to="/subscription-terms" className="text-blue-600 hover:underline">conditions générales de vente</Link> <span className="text-red-500">*</span>
          </label>
        </div>
        
        <p className="text-xs text-gray-500 mt-1">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
      </Button>
    </form>
  );
}
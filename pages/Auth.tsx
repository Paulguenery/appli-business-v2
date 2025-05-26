import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseIcon, SearchIcon, TrendingUpIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';
import { GuestAccessButton } from '@/components/auth/GuestAccessButton';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminAccessButton } from '../components/auth/AdminAccessButton';

export function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleQuickAccess = (userType: 'owner' | 'seeker' | 'investor') => {
    navigate(userType === 'owner' ? '/owner/dashboard' : '/seeker/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mymate</h1>
            <p className="mt-2 text-sm text-gray-600">
              La plateforme de référence pour les projets professionnels
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'login'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Connexion
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'signup'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Inscription
              </button>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'login' ? (
                    <div className="space-y-6">
                      {/* Google Sign In */}
                      <div className="space-y-4">
                        <GoogleSignIn />
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">ou</span>
                          </div>
                        </div>
                      </div>

                      <LoginForm />
                      
                      {/* Guest Access Button */}
                      <div className="pt-2 flex flex-col space-y-2">
                        <GuestAccessButton />
                        <AdminAccessButton />
                      </div>
                    </div>
                  ) : (
                    <SignUpForm />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
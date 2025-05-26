import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, MessageSquare, Settings, LogOut, Calendar, Star, Lightbulb, Gift, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { NotificationBadge } from './notifications/NotificationBadge';
import { NotificationPanel } from './notifications/NotificationPanel';
import type { UserRole } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  userType: UserRole;
}

export function Layout({ children, userType }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = userType === 'project_owner' ? '/owner' : '/seeker';
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const menuItems = [
    {
      icon: User,
      label: 'Profil',
      path: `${basePath}/profile`
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      path: `${basePath}/messages`
    },
    {
      icon: Star,
      label: 'Favoris',
      path: `${basePath}/favorites`
    },
    {
      icon: Calendar,
      label: 'Agenda',
      path: '/calendar'
    },
    {
      icon: Lightbulb,
      label: 'Suggestions',
      path: '/suggestions'
    },
    {
      icon: Gift,
      label: 'Parrainage',
      path: '/referral'
    },
    {
      icon: Settings,
      label: 'Paramètres',
      path: `${basePath}/settings`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={basePath + '/dashboard'} className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Mymate</span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <NotificationBadge />
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user?.full_name || 'Utilisateur'}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                          location.pathname === item.path
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-5 h-16">
          <Link 
            to={`${basePath}/dashboard`}
            className={`flex flex-col items-center justify-center ${
              location.pathname === `${basePath}/dashboard` ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          
          <Link 
            to="/swipe"
            className={`flex flex-col items-center justify-center ${
              location.pathname === '/swipe' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Star className="h-5 w-5" />
            <span className="text-xs mt-1">Swipe</span>
          </Link>
          
          <Link 
            to={`${basePath}/messages`}
            className={`flex flex-col items-center justify-center ${
              location.pathname === `${basePath}/messages` ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          
          <Link 
            to={`${basePath}/favorites`}
            className={`flex flex-col items-center justify-center ${
              location.pathname === `${basePath}/favorites` ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Star className="h-5 w-5" />
            <span className="text-xs mt-1">Favoris</span>
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center text-gray-500"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
    </div>
  );
}
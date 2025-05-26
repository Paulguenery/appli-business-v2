import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationBadge() {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="h-6 w-6 text-gray-600" />
      <AnimatePresence>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
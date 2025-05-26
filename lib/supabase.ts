import { createClient } from '@supabase/supabase-js';
import type { UserProfile, UserStatistics, Notification } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'project_owner' | 'project_seeker' | 'investor';

// User statistics functions
export async function getUserStatistics(userId: string): Promise<UserStatistics | null> {
  const { data, error } = await supabase
    .from('user_statistics')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Notification functions
export async function getUnreadNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}

// Profile functions
export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: { push: boolean; email: boolean }
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ notification_preferences: preferences })
    .eq('user_id', userId);

  if (error) throw error;
}

export async function updateUserSettings(
  userId: string,
  settings: {
    swipe_mode: boolean;
    show_location: boolean;
    show_availability: boolean;
    show_stats: boolean;
  }
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ settings })
    .eq('user_id', userId);

  if (error) throw error;
}

// Onboarding functions
export async function getOnboardingProgress(userId: string) {
  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOnboardingStep(
  userId: string,
  step: number,
  answers: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('onboarding')
    .update({
      step,
      answers,
      completed_steps: supabase.sql`array_append(completed_steps, ${step}::text)`,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) throw error;
}

// Distance calculation function (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
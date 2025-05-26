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

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  fields: OnboardingField[];
}

export interface OnboardingField {
  name: string;
  type: 'text' | 'select' | 'multiselect' | 'checkbox';
  label: string;
  required: boolean;
  options?: string[];
}

export interface UserSettings {
  swipe_mode: boolean;
  show_location: boolean;
  show_availability: boolean;
  show_stats: boolean;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
}

export interface UserStatistics {
  daily_profile_views: number;
  daily_matches: number;
  daily_messages: number;
  total_profile_views: number;
  total_matches: number;
  total_messages: number;
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'swipe' | 'project' | 'boost_ended' | 'reminder' | 'view';
  title: string;
  content: string;
  read: boolean;
  data: Record<string, any>;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: UserRole;
  user_type: 'project_owner' | 'project_seeker' | 'investor';
  full_name: string;
  city: string;
  bio: string;
  skills: string[];
  sectors: string[];
  objectives: string[];
  experience_level: string;
  availability: string;
  portfolio_url: string;
  company_name: string;
  collaboration_type: string;
  onboarding_completed: boolean;
  profile_views_count: number;
  matches_count: number;
  pending_messages_count: number;
  notification_preferences: NotificationPreferences;
  settings: UserSettings;
  subscription_status: string;
  is_verified: boolean;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  avatar_url?: string;
}

export interface Appointment {
  id: string;
  creator_id: string;
  participant_id: string;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  creator: {
    full_name: string;
  };
  participant: {
    full_name: string;
  };
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  brief_description: string;
  full_description_url?: string;
  image_url?: string;
  category: string;
  required_skills: string[];
  collaboration_type: string;
  experience_level: 'any' | 'beginner' | 'experienced';
  interests: string[];
  created_at: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  ideal_partner_description?: string;
  open_to_investment?: boolean;
}

export interface ProjectMatch {
  id: string;
  project_id: string;
  seeker_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  department: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}
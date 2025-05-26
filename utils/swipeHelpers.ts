/**
 * Shared utility functions for swipe functionality
 * These functions are used by all swipe systems but don't create dependencies between them
 */

import { supabase } from '@/lib/supabase';

/**
 * Logs a swipe action to the swipe history
 * @param userId The profile ID of the user making the swipe
 * @param swipedId The ID of the item being swiped (project or profile)
 * @param direction The direction of the swipe ('left' or 'right')
 */
export async function logSwipeHistory(
  userId: string, 
  swipedId: string, 
  direction: 'left' | 'right'
): Promise<void> {
  try {
    await supabase
      .from('swipe_history')
      .insert({
        user_id: userId,
        swiped_id: swipedId,
        swipe_type: direction
      });
  } catch (error) {
    console.error('Error logging swipe history:', error);
  }
}

/**
 * Gets the current user's profile ID
 * @returns The profile ID of the current user
 */
export async function getCurrentUserProfileId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    return profile?.id || null;
  } catch (error) {
    console.error('Error getting current user profile ID:', error);
    return null;
  }
}

/**
 * Calculates the distance between two points
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns The distance in kilometers
 */
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
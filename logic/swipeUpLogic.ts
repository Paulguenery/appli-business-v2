/**
 * Logic for the SwipeUp functionality
 * This file contains all the logic specific to the SwipeUp interface
 */

import { supabase } from '@/lib/supabase';
import { getCurrentUserProfileId, logSwipeHistory } from '@/utils/swipeHelpers';
import type { UserProfile } from '@/lib/types';

/**
 * Fetches talents based on location
 */
export async function fetchTalentsForSwipeUp(
  centerLat: number,
  centerLon: number,
  radius: number
): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase.rpc('search_profiles_by_location', {
      center_lat: centerLat,
      center_lon: centerLon,
      radius_km: radius,
      role_filter: 'project_seeker'
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching talents for swipe up:', error);
    return [];
  }
}

/**
 * Filters talents based on user-selected criteria
 */
export function filterTalentsForSwipeUp(
  talents: UserProfile[],
  filters: {
    sector: string;
    duration: string;
    stage: string;
    skills: string[];
  }
): UserProfile[] {
  return talents.filter(talent => {
    // Filter by sector
    if (filters.sector && (!talent.sectors || !talent.sectors.some(s => s.includes(filters.sector)))) {
      return false;
    }
    
    // Filter by skills
    if (filters.skills.length > 0 && (!talent.skills || !filters.skills.some(skill => 
      talent.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    ))) {
      return false;
    }
    
    // Filter by availability (duration)
    if (filters.duration && talent.availability !== filters.duration) {
      return false;
    }
    
    // Filter by experience level (stage)
    if (filters.stage) {
      const stageMap: Record<string, string> = {
        'Idée / Concept': 'junior',
        'Prototype / MVP': 'junior',
        'En développement': 'intermediaire',
        'Lancé / En croissance': 'senior',
        'Mature / Établi': 'senior'
      };
      
      if (talent.experience_level !== stageMap[filters.stage]) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Handles a swipe action on a talent with the new up/down directions
 */
export async function handleSwipeUpAction(
  talentId: string,
  direction: 'up' | 'down' | 'left' | 'right'
): Promise<void> {
  try {
    const profileId = await getCurrentUserProfileId();
    if (!profileId) return;

    // Handle different swipe directions
    switch (direction) {
      case 'up':
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: profileId,
            item_id: talentId,
            item_type: 'profile'
          })
          .onConflict(['user_id', 'item_id'])
          .ignore();
        break;
        
      case 'right':
        // Create a match
        // Get the owner's projects
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .eq('owner_id', profileId)
          .limit(1);

        if (projects?.[0]) {
          await supabase
            .from('project_matches')
            .insert({
              project_id: projects[0].id,
              seeker_id: talentId,
              status: 'pending'
            });
        }
        break;
        
      case 'down':
        // Blacklist or hide this profile
        await supabase
          .from('swipe_history')
          .insert({
            user_id: profileId,
            swiped_id: talentId,
            swipe_type: 'left' // Use 'left' for compatibility with existing system
          });
        break;
        
      case 'left':
        // Standard pass
        await supabase
          .from('swipe_history')
          .insert({
            user_id: profileId,
            swiped_id: talentId,
            swipe_type: 'left'
          });
        break;
    }

    // Log the swipe history with the new direction
    // Convert up/down to a compatible format for the existing system
    const compatibleDirection = direction === 'up' ? 'right' : direction === 'down' ? 'left' : direction;
    await logSwipeHistory(profileId, talentId, compatibleDirection as 'left' | 'right');
  } catch (error) {
    console.error('Error handling swipe up action:', error);
  }
}
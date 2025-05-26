/**
 * Logic for project owner swipe functionality
 * This file contains all the logic specific to project owners swiping on talents
 */

import { supabase } from '@/lib/supabase';
import { getCurrentUserProfileId, logSwipeHistory } from '@/utils/swipeHelpers';
import type { UserProfile } from '@/lib/types';

/**
 * Fetches talents based on location
 */
export async function fetchTalents(
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
    console.error('Error fetching talents:', error);
    return [];
  }
}

/**
 * Filters talents based on user-selected criteria
 */
export function filterTalents(
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
 * Handles a swipe action on a talent
 */
export async function handleTalentSwipe(
  talentId: string,
  direction: 'left' | 'right'
): Promise<void> {
  try {
    const profileId = await getCurrentUserProfileId();
    if (!profileId) return;

    // Create a match if swiping right
    if (direction === 'right') {
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
    }

    // Log the swipe history
    await logSwipeHistory(profileId, talentId, direction);
  } catch (error) {
    console.error('Error handling talent swipe:', error);
  }
}
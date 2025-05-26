/**
 * Logic for project seeker swipe functionality
 * This file contains all the logic specific to project seekers swiping on projects
 */

import { supabase } from '@/lib/supabase';
import { getCurrentUserProfileId, logSwipeHistory } from '@/utils/swipeHelpers';
import type { Project } from '@/lib/types';

/**
 * Fetches projects based on location and filters
 */
export async function fetchProjects(
  centerLat: number,
  centerLon: number,
  radius: number
): Promise<Project[]> {
  try {
    const { data, error } = await supabase.rpc('search_projects_by_location', {
      center_lat: centerLat,
      center_lon: centerLon,
      radius_km: radius
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

/**
 * Filters projects based on user-selected criteria
 */
export function filterProjects(
  projects: Project[],
  filters: {
    sector: string;
    duration: string;
    stage: string;
    skills: string[];
  }
): Project[] {
  return projects.filter(project => {
    // Filter by sector
    if (filters.sector && (!project.category || !project.category.includes(filters.sector))) {
      return false;
    }
    
    // Filter by collaboration type (duration)
    if (filters.duration && project.collaboration_type !== filters.duration) {
      return false;
    }
    
    // Filter by experience level (stage)
    if (filters.stage) {
      const stageMap: Record<string, string> = {
        'Idée / Concept': 'beginner',
        'Prototype / MVP': 'beginner',
        'En développement': 'any',
        'Lancé / En croissance': 'experienced',
        'Mature / Établi': 'experienced'
      };
      
      if (project.experience_level !== stageMap[filters.stage] && project.experience_level !== 'any') {
        return false;
      }
    }
    
    // Filter by skills
    if (filters.skills.length > 0 && (!project.required_skills || !filters.skills.some(skill => 
      project.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    ))) {
      return false;
    }
    
    return true;
  });
}

/**
 * Handles a swipe action on a project
 */
export async function handleProjectSwipe(
  projectId: string,
  direction: 'left' | 'right'
): Promise<void> {
  try {
    const profileId = await getCurrentUserProfileId();
    if (!profileId) return;

    // Create a match if swiping right
    if (direction === 'right') {
      await supabase
        .from('project_matches')
        .insert({
          project_id: projectId,
          seeker_id: profileId,
          status: 'pending'
        });
    }

    // Log the swipe history
    await logSwipeHistory(profileId, projectId, direction);
  } catch (error) {
    console.error('Error handling project swipe:', error);
  }
}
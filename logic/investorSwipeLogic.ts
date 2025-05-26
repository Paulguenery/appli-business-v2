/**
 * Logic for investor swipe functionality
 * This file contains all the logic specific to investors swiping on projects
 */

import { supabase } from '@/lib/supabase';
import { getCurrentUserProfileId, logSwipeHistory } from '@/utils/swipeHelpers';
import type { Project } from '@/lib/types';

/**
 * Fetches investment opportunities based on location
 */
export async function fetchInvestmentOpportunities(
  centerLat: number,
  centerLon: number,
  radius: number
): Promise<Project[]> {
  try {
    // Get all projects within radius
    const { data, error } = await supabase.rpc('search_projects_by_location', {
      center_lat: centerLat,
      center_lon: centerLon,
      radius_km: radius
    });

    if (error) throw error;
    
    // For investors, we want to show only projects open to investment
    // In a real implementation, this would be a field in the projects table
    // For the demo, we simulate this behavior
    const investmentProjects = data.filter((project: Project) => {
      // For the demo, consider every 3rd project as open to investment
      const projectIdNumber = parseInt(project.id.replace(/-/g, '').substring(0, 8), 16);
      return projectIdNumber % 3 === 0;
    });
    
    return investmentProjects;
  } catch (error) {
    console.error('Error fetching investment opportunities:', error);
    return [];
  }
}

/**
 * Filters investment opportunities based on user-selected criteria
 */
export function filterInvestmentOpportunities(
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
    
    // Filter by stage (for investors, this is particularly important)
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
    
    // Other filters are less relevant for investors but still applied
    if (filters.duration && project.collaboration_type !== filters.duration) {
      return false;
    }
    
    if (filters.skills.length > 0 && (!project.required_skills || !filters.skills.some(skill => 
      project.required_skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
    ))) {
      return false;
    }
    
    return true;
  });
}

/**
 * Handles a swipe action on an investment opportunity
 */
export async function handleInvestmentSwipe(
  projectId: string,
  direction: 'left' | 'right'
): Promise<void> {
  try {
    const profileId = await getCurrentUserProfileId();
    if (!profileId) return;

    // For investors, we create a notification for the project owner when swiping right
    if (direction === 'right') {
      // Get investor profile details
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', profileId)
        .single();

      // Get project details
      const { data: project } = await supabase
        .from('projects')
        .select('owner_id, title')
        .eq('id', projectId)
        .single();

      if (project && profile) {
        // Get project owner's user ID
        const { data: ownerProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('id', project.owner_id)
          .single();

        if (ownerProfile) {
          // Create a notification
          await supabase
            .from('notifications')
            .insert({
              user_id: ownerProfile.user_id,
              type: 'project',
              title: 'Intérêt d\'un investisseur',
              content: `L'investisseur ${profile.full_name} a manifesté son intérêt pour votre projet "${project.title}"`,
              data: {
                project_id: projectId,
                investor_id: profile.id,
                investor_name: profile.full_name
              }
            });
        }
      }
    }

    // Log the swipe history
    await logSwipeHistory(profileId, projectId, direction);
  } catch (error) {
    console.error('Error handling investment swipe:', error);
  }
}
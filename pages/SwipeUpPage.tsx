import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSubscription } from '@/hooks/use-subscription';
import { useLocationStore } from '@/stores/location';
import { LocationFilter } from '@/components/search/LocationFilter';
import { FilterBar } from '@/components/search/FilterBar';
import { Button } from '@/components/ui/button';
import { Info, ThumbsUp, ThumbsDown, Heart, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectDetailModal } from '@/components/swipe/ProjectDetailModal';
import { SwipeUpInterface } from '@/components/swipe/SwipeUpInterface';
import type { UserProfile } from '@/lib/types';
import { BackButton } from '@/components/BackButton';

export function SwipeUpPage() {
  const { selectedCity, radius } = useLocationStore();
  const { limits } = useSubscription();
  const navigate = useNavigate();
  const [selectedTalent, setSelectedTalent] = useState<UserProfile | null>(null);
  const [filters, setFilters] = useState({
    sector: '',
    duration: '',
    stage: '',
    skills: [] as string[],
  });
  const [showTutorial, setShowTutorial] = useState(() => {
    // Vérifier si le tutoriel a déjà été vu
    const tutorialSeen = localStorage.getItem('swipeUpTutorialSeen');
    return !tutorialSeen;
  });

  // Fetch talents based on location
  const { data: talents = [], isLoading } = useQuery({
    queryKey: ['swipe-up-talents', selectedCity?.id, radius],
    queryFn: async () => {
      if (!selectedCity) return [];
      
      const { data, error } = await supabase.rpc('search_profiles_by_location', {
        center_lat: selectedCity.latitude,
        center_lon: selectedCity.longitude,
        radius_km: radius,
        role_filter: 'project_seeker'
      });

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCity
  });

  // Apply filters
  const filteredTalents = React.useMemo(() => {
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
  }, [talents, filters]);

  // Handle swipe action with new up/down directions
  const handleSwipe = async (talentId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Handle different swipe directions
      switch (direction) {
        case 'up':
          // Add to favorites
          await supabase
            .from('favorites')
            .insert({
              user_id: profile.id,
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
            .eq('owner_id', profile.id)
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
              user_id: profile.id,
              swiped_id: talentId,
              swipe_type: 'left' // Use 'left' for compatibility with existing system
            });
          break;
          
        case 'left':
          // Standard pass
          await supabase
            .from('swipe_history')
            .insert({
              user_id: profile.id,
              swiped_id: talentId,
              swipe_type: 'left'
            });
          break;
      }

      // Log the swipe history with the new direction
      // Convert up/down to a compatible format for the existing system
      const compatibleDirection = direction === 'up' ? 'right' : direction === 'down' ? 'left' : direction;
      await supabase
        .from('swipe_history')
        .insert({
          user_id: profile.id,
          swiped_id: talentId,
          swipe_type: compatibleDirection as 'left' | 'right'
        });
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('swipeUpTutorialSeen', 'true');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BackButton />
            <h1 className="text-xl font-semibold">SwipeUp - Nouvelle expérience</h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </div>
    </div>
  );
}
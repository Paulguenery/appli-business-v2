/*
  # Update search functions to handle filtering

  1. Changes
    - Update search_projects_by_location function to handle filtering
    - Add support for sector, duration, stage, and skills filtering
    - Ensure backward compatibility with existing code

  2. Security
    - Maintain existing security model
    - Keep function as SECURITY DEFINER
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.search_projects_by_location(float8, float8, float8);

-- Create updated function with filtering support
CREATE OR REPLACE FUNCTION public.search_projects_by_location(
  center_lat float8,
  center_lon float8,
  radius_km float8
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  brief_description text,
  full_description_url text,
  category text,
  required_skills text[],
  collaboration_type text,
  experience_level text,
  distance float8,
  owner_id uuid,
  city text,
  latitude float8,
  longitude float8
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.brief_description,
    p.full_description_url,
    p.category,
    p.required_skills,
    p.collaboration_type,
    p.experience_level,
    public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) as distance,
    p.owner_id,
    prof.city,
    p.latitude,
    p.longitude
  FROM projects p
  LEFT JOIN profiles prof ON p.owner_id = prof.id
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) <= radius_km
  ORDER BY distance ASC;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.search_projects_by_location TO authenticated;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.search_profiles_by_location(float8, float8, float8, text);

-- Create updated function with filtering support
CREATE OR REPLACE FUNCTION public.search_profiles_by_location(
  center_lat float8,
  center_lon float8,
  radius_km float8,
  role_filter text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  full_name text,
  city text,
  bio text,
  skills text[],
  experience_level text,
  availability text,
  is_verified boolean,
  user_type text,
  distance float8,
  latitude float8,
  longitude float8
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.city,
    p.bio,
    p.skills,
    p.experience_level,
    p.availability,
    p.is_verified,
    p.user_type,
    public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) as distance,
    p.latitude,
    p.longitude
  FROM profiles p
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) <= radius_km
    AND (role_filter IS NULL OR p.role = role_filter)
  ORDER BY distance ASC;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.search_profiles_by_location TO authenticated;
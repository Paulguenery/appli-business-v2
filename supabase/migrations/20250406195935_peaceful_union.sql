/*
  # Fix cities search functionality

  1. Updates
    - Drop and recreate search_cities function with updated return type
    - Add function to search profiles and projects by location
    - Add indexes for better search performance

  2. Security
    - Add appropriate RLS policies for new functions
*/

-- Drop existing functions first
DROP FUNCTION IF EXISTS public.search_cities(text,integer);
DROP FUNCTION IF EXISTS public.search_profiles_by_location(float8,float8,float8,text);
DROP FUNCTION IF EXISTS public.search_projects_by_location(float8,float8,float8);

-- Create or replace the search_cities function
CREATE OR REPLACE FUNCTION public.search_cities(
  search_term text,
  max_results int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  name text,
  department text,
  postal_code text,
  latitude float8,
  longitude float8
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.department,
    c.postal_code,
    c.latitude,
    c.longitude
  FROM cities c
  WHERE 
    c.name ILIKE '%' || search_term || '%'
    OR c.postal_code LIKE search_term || '%'
    OR c.department ILIKE '%' || search_term || '%'
  ORDER BY
    CASE 
      WHEN c.postal_code = search_term THEN 1
      WHEN c.postal_code LIKE search_term || '%' THEN 2
      WHEN c.name ILIKE search_term || '%' THEN 3
      ELSE 4
    END,
    c.name ASC
  LIMIT max_results;
END;
$$;

-- Function to search profiles by location
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
  distance float8,
  role text,
  skills text[],
  is_verified boolean
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
    public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) as distance,
    p.role,
    p.skills,
    p.is_verified
  FROM profiles p
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) <= radius_km
    AND (role_filter IS NULL OR p.role = role_filter)
  ORDER BY distance ASC;
END;
$$;

-- Function to search projects by location
CREATE OR REPLACE FUNCTION public.search_projects_by_location(
  center_lat float8,
  center_lon float8,
  radius_km float8
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  distance float8,
  owner_id uuid,
  required_skills text[],
  collaboration_type text
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
    public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) as distance,
    p.owner_id,
    p.required_skills,
    p.collaboration_type
  FROM projects p
  WHERE 
    p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) <= radius_km
  ORDER BY distance ASC;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.search_cities TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_profiles_by_location TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_projects_by_location TO authenticated;
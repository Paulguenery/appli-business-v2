/*
  # Add postal code and improve distance handling

  1. Updates
    - Add postal_code column to cities table
    - Add distance steps function
    - Add city search function with postal code

  2. Changes
    - Add postal code to existing cities table
    - Create function to get valid distance steps
    - Create function to search cities with postal code
*/

-- Add postal code to cities table
ALTER TABLE public.cities 
ADD COLUMN IF NOT EXISTS postal_code text NOT NULL;

-- Create unique index on postal code and city name
CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_postal_name 
ON public.cities (postal_code, name);

-- Function to get valid distance steps
CREATE OR REPLACE FUNCTION public.get_valid_distance_steps()
RETURNS int[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ARRAY[10, 20, 30, 40, 50, 75, 100, 150];
$$;

-- Function to search cities with postal code
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
  longitude float8,
  similarity float8
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.department,
    c.postal_code,
    c.latitude,
    c.longitude,
    similarity(c.name, search_term) as similarity
  FROM cities c
  WHERE 
    c.name % search_term 
    OR c.postal_code LIKE search_term || '%'
    OR c.department ILIKE '%' || search_term || '%'
  ORDER BY
    -- Prioritize exact postal code matches
    CASE WHEN c.postal_code = search_term THEN 0
         WHEN c.postal_code LIKE search_term || '%' THEN 1
         ELSE 2
    END,
    -- Then by text similarity
    similarity(c.name, search_term) DESC,
    c.name ASC
  LIMIT max_results;
END;
$$;

-- Function to get nearest valid distance step
CREATE OR REPLACE FUNCTION public.get_nearest_distance_step(
  distance float8
)
RETURNS int
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  valid_steps int[];
BEGIN
  valid_steps := get_valid_distance_steps();
  
  -- Return the first step that's greater than or equal to the input distance
  FOR i IN 1..array_length(valid_steps, 1) LOOP
    IF valid_steps[i] >= distance THEN
      RETURN valid_steps[i];
    END IF;
  END LOOP;
  
  -- If no step is found, return the maximum step
  RETURN valid_steps[array_length(valid_steps, 1)];
END;
$$;

-- Function to get cities within radius
CREATE OR REPLACE FUNCTION public.get_cities_within_radius(
  center_lat float8,
  center_lon float8,
  radius_km float8
)
RETURNS TABLE (
  id uuid,
  name text,
  department text,
  postal_code text,
  latitude float8,
  longitude float8,
  distance float8
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Round radius to nearest valid step
  radius_km := get_nearest_distance_step(radius_km);
  
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.department,
    c.postal_code,
    c.latitude,
    c.longitude,
    public.calculate_distance(
      center_lat, 
      center_lon, 
      c.latitude, 
      c.longitude
    ) as distance
  FROM cities c
  WHERE public.calculate_distance(
    center_lat,
    center_lon,
    c.latitude,
    c.longitude
  ) <= radius_km
  ORDER BY distance ASC;
END;
$$;

-- Update existing RLS policy to include new columns
DROP POLICY IF EXISTS "Anyone can view cities" ON public.cities;
CREATE POLICY "Anyone can view cities"
  ON public.cities
  FOR SELECT
  TO authenticated
  USING (true);

-- Add comments for better documentation
COMMENT ON FUNCTION public.get_valid_distance_steps IS 
'Returns array of valid distance steps in kilometers for radius selection';

COMMENT ON FUNCTION public.search_cities IS 
'Search cities by name, postal code or department with fuzzy matching';

COMMENT ON FUNCTION public.get_nearest_distance_step IS 
'Rounds a distance to the nearest valid step value';

COMMENT ON FUNCTION public.get_cities_within_radius IS 
'Returns all cities within specified radius, with distances';
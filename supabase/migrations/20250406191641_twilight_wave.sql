/*
  # Add geolocation features
  
  1. New Tables
    - `cities`
      - `id` (uuid, primary key)
      - `name` (text)
      - `department` (text) 
      - `latitude` (float8)
      - `longitude` (float8)
      - `created_at` (timestamptz)

  2. Schema Updates
    - Add location columns to profiles and projects
    - Add distance calculation function
    - Add trigram search index for city names

  3. Security
    - Enable RLS on cities table
    - Add policy for authenticated users to view cities
*/

-- Enable the pg_trgm extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  latitude float8 NOT NULL,
  longitude float8 NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add location columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS latitude float8,
ADD COLUMN IF NOT EXISTS longitude float8;

-- Add location columns to projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS latitude float8,
ADD COLUMN IF NOT EXISTS longitude float8;

-- Enable RLS on cities table
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read cities
CREATE POLICY "Anyone can view cities"
  ON public.cities
  FOR SELECT
  TO authenticated
  USING (true);

-- Create search index for city names
CREATE INDEX IF NOT EXISTS idx_cities_name_trgm 
ON public.cities USING gin (name gin_trgm_ops);

-- Create distance calculation function
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 float8,
  lon1 float8,
  lat2 float8,
  lon2 float8
)
RETURNS float8
LANGUAGE plpgsql
AS $$
DECLARE
  R float8 := 6371; -- Earth's radius in kilometers
  dLat float8;
  dLon float8;
  a float8;
  c float8;
BEGIN
  -- Convert latitude and longitude to radians
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  
  -- Haversine formula
  a := sin(dLat/2) * sin(dLat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dLon/2) * sin(dLon/2);
  
  c := 2 * asin(sqrt(a));
  
  -- Return distance in kilometers
  RETURN R * c;
END;
$$;

-- Create index on location columns for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_location 
ON public.profiles (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_projects_location 
ON public.projects (latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
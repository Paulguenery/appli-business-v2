/*
  # Enhance search functionality with more data
  
  1. Changes
    - Add more cities to the database
    - Update search functions to include more fields
    - Add more sample data for testing
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper permissions for functions
*/

-- Add more French cities
INSERT INTO cities (name, department, postal_code, latitude, longitude)
VALUES 
  ('Lyon', 'Rhône', '69001', 45.7578, 4.8320),
  ('Marseille', 'Bouches-du-Rhône', '13001', 43.2965, 5.3698),
  ('Bordeaux', 'Gironde', '33000', 44.8378, -0.5792),
  ('Lille', 'Nord', '59000', 50.6292, 3.0573),
  ('Toulouse', 'Haute-Garonne', '31000', 43.6047, 1.4442),
  ('Nantes', 'Loire-Atlantique', '44000', 47.2184, -1.5536),
  ('Strasbourg', 'Bas-Rhin', '67000', 48.5734, 7.7521),
  ('Montpellier', 'Hérault', '34000', 43.6108, 3.8767),
  ('Rennes', 'Ille-et-Vilaine', '35000', 48.1173, -1.6778),
  ('Grenoble', 'Isère', '38000', 45.1885, 5.7245),
  ('Angers', 'Maine-et-Loire', '49000', 47.4784, -0.5632),
  ('Dijon', 'Côte-d''Or', '21000', 47.3220, 5.0415),
  ('Le Havre', 'Seine-Maritime', '76600', 49.4944, 0.1079),
  ('Saint-Étienne', 'Loire', '42000', 45.4397, 4.3872),
  ('Toulon', 'Var', '83000', 43.1242, 5.9280),
  ('Annecy', 'Haute-Savoie', '74000', 45.8992, 6.1294),
  ('Biarritz', 'Pyrénées-Atlantiques', '64200', 43.4832, -1.5586),
  ('Cannes', 'Alpes-Maritimes', '06400', 43.5528, 7.0174),
  ('La Rochelle', 'Charente-Maritime', '17000', 46.1591, -1.1520),
  ('Aix-en-Provence', 'Bouches-du-Rhône', '13100', 43.5297, 5.4474)
ON CONFLICT (postal_code, name) DO NOTHING;

-- Update search_projects_by_location function to include more fields
DROP FUNCTION IF EXISTS public.search_projects_by_location(float8, float8, float8);

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
  longitude float8,
  created_at timestamptz
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
    p.longitude,
    p.created_at
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

-- Update search_profiles_by_location function to include more fields
DROP FUNCTION IF EXISTS public.search_profiles_by_location(float8, float8, float8, text);

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
  sectors text[],
  experience_level text,
  availability text,
  is_verified boolean,
  user_type text,
  distance float8,
  latitude float8,
  longitude float8,
  created_at timestamptz
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
    p.sectors,
    p.experience_level,
    p.availability,
    p.is_verified,
    p.user_type,
    public.calculate_distance(center_lat, center_lon, p.latitude, p.longitude) as distance,
    p.latitude,
    p.longitude,
    p.created_at
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

-- Add more sample profiles with diverse locations
DO $$
DECLARE
  city_record RECORD;
  new_user_id uuid;
  new_profile_id uuid;
  sectors text[];
  skills text[];
  user_types text[] := ARRAY['project_owner', 'project_seeker', 'investor'];
  user_type text;
  city_count integer := 0;
BEGIN
  -- Loop through cities to create profiles in different locations
  FOR city_record IN SELECT * FROM cities LIMIT 20 LOOP
    city_count := city_count + 1;
    
    -- Create only 1 profile per city to avoid too many
    -- Alternate between user types
    user_type := user_types[(city_count % 3) + 1];
    
    -- Generate sectors based on user type
    IF user_type = 'project_owner' THEN
      sectors := ARRAY['Technologie', 'E-commerce', 'Finance'];
      skills := ARRAY['Gestion de projet', 'Business Development', 'Marketing'];
    ELSIF user_type = 'project_seeker' THEN
      sectors := ARRAY['Technologie', 'Design', 'Marketing'];
      skills := ARRAY['Développement web', 'UI/UX Design', 'React', 'Node.js'];
    ELSE -- investor
      sectors := ARRAY['Technologie', 'Finance', 'Healthcare'];
      skills := ARRAY['Analyse financière', 'Due Diligence', 'Stratégie'];
    END IF;
    
    -- Create user
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (id, email)
    VALUES (new_user_id, 'user_' || city_record.postal_code || '@example.com');
    
    -- Create profile
    new_profile_id := gen_random_uuid();
    INSERT INTO profiles (
      id, 
      user_id, 
      role, 
      user_type, 
      full_name, 
      city, 
      bio, 
      skills, 
      sectors,
      experience_level, 
      availability, 
      latitude, 
      longitude, 
      is_verified
    ) VALUES (
      new_profile_id,
      new_user_id,
      user_type,
      user_type,
      'Utilisateur ' || city_record.name,
      city_record.name,
      'Professionnel basé à ' || city_record.name || ' dans le secteur ' || sectors[1],
      skills,
      sectors,
      CASE WHEN city_count % 3 = 0 THEN 'senior' WHEN city_count % 3 = 1 THEN 'intermediaire' ELSE 'junior' END,
      CASE WHEN city_count % 2 = 0 THEN 'Temps plein' ELSE 'Temps partiel' END,
      city_record.latitude,
      city_record.longitude,
      city_count % 5 = 0 -- Every 5th profile is verified
    );
    
    -- Create a project if user is project owner
    IF user_type = 'project_owner' THEN
      INSERT INTO projects (
        owner_id,
        title,
        brief_description,
        category,
        required_skills,
        collaboration_type,
        experience_level,
        latitude,
        longitude
      ) VALUES (
        new_profile_id,
        'Projet à ' || city_record.name,
        'Un projet innovant basé à ' || city_record.name || ' dans le secteur ' || sectors[1],
        sectors[1],
        skills,
        CASE WHEN city_count % 2 = 0 THEN 'Temps plein' ELSE 'Temps partiel' END,
        CASE WHEN city_count % 3 = 0 THEN 'experienced' WHEN city_count % 3 = 1 THEN 'beginner' ELSE 'any' END,
        city_record.latitude,
        city_record.longitude
      );
    END IF;
  END LOOP;
END $$;
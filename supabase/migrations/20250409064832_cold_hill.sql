-- Ajouter une colonne open_to_investment à la table projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS open_to_investment BOOLEAN DEFAULT false;

-- Mettre à jour la fonction search_projects_by_location pour inclure cette colonne
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
  created_at timestamptz,
  open_to_investment boolean
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
    p.created_at,
    COALESCE(p.open_to_investment, false) as open_to_investment
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

-- Mettre à jour quelques projets existants pour les marquer comme ouverts à l'investissement
UPDATE projects
SET open_to_investment = true
WHERE id IN (
  SELECT id FROM projects WHERE MOD(EXTRACT(EPOCH FROM created_at)::integer, 3) = 0
  LIMIT 20
);
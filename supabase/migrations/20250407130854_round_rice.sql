/*
  # Add favorites functionality

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `item_id` (uuid) - Can be either project_id or profile_id
      - `item_type` (text) - 'project' or 'profile'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles NOT NULL,
  item_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('project', 'profile')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own favorites"
  ON favorites
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Function to get favorites with details
CREATE OR REPLACE FUNCTION get_favorites(
  p_user_id uuid,
  p_item_type text
)
RETURNS TABLE (
  favorite_id uuid,
  item_id uuid,
  item_type text,
  created_at timestamptz,
  item_details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id as favorite_id,
    f.item_id,
    f.item_type,
    f.created_at,
    CASE
      WHEN f.item_type = 'project' THEN
        (SELECT jsonb_build_object(
          'title', p.title,
          'description', p.description,
          'category', p.category,
          'required_skills', p.required_skills,
          'collaboration_type', p.collaboration_type,
          'owner', (
            SELECT jsonb_build_object(
              'id', pr.id,
              'full_name', pr.full_name,
              'is_verified', pr.is_verified
            )
            FROM profiles pr
            WHERE pr.id = p.owner_id
          )
        )
        FROM projects p
        WHERE p.id = f.item_id)
      WHEN f.item_type = 'profile' THEN
        (SELECT jsonb_build_object(
          'full_name', p.full_name,
          'role', p.role,
          'bio', p.bio,
          'skills', p.skills,
          'experience_level', p.experience_level,
          'is_verified', p.is_verified,
          'availability', p.availability
        )
        FROM profiles p
        WHERE p.id = f.item_id)
    END as item_details
  FROM favorites f
  WHERE f.user_id = p_user_id
  AND (p_item_type IS NULL OR f.item_type = p_item_type)
  ORDER BY f.created_at DESC;
END;
$$;
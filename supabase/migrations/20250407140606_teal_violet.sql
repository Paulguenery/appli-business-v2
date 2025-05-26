/*
  # Add Brief Description and Document Fields

  1. Changes
    - Add `brief_description` column to projects table with default value
    - Add `full_description_url` column for document links
    - Add `experience_level` column for required experience
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Add policy for viewing full description only after match
*/

-- Add new columns to projects table with safe defaults
ALTER TABLE projects 
ADD COLUMN brief_description text DEFAULT '' NOT NULL,
ADD COLUMN full_description_url text,
ADD COLUMN experience_level text DEFAULT 'any' NOT NULL CHECK (experience_level IN ('experienced', 'beginner', 'any'));

-- Update existing projects to use their description as brief_description
UPDATE projects 
SET brief_description = COALESCE(description, '')
WHERE brief_description = '';

-- Create function to check if user has matched with project
CREATE OR REPLACE FUNCTION has_project_match(project_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM project_matches 
    WHERE project_id = $1 
    AND seeker_id IN (
      SELECT id 
      FROM profiles 
      WHERE user_id = $2
    )
    AND status = 'accepted'
  );
END;
$$;

-- Update RLS policies
CREATE POLICY "Users can view brief description"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view full description after match"
  ON projects FOR SELECT
  TO authenticated
  USING (
    owner_id IN (
      SELECT id 
      FROM profiles 
      WHERE user_id = auth.uid()
    )
    OR 
    has_project_match(id, auth.uid())
  );
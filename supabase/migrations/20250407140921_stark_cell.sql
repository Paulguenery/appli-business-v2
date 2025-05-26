/*
  # Update projects table for brief descriptions

  1. Changes
    - Add brief_description, full_description_url, and experience_level columns if they don't exist
    - Update RLS policies for description access
    - Add function to check project matches

  2. Security
    - Enable RLS policies for description visibility
*/

-- Add columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'brief_description'
  ) THEN
    ALTER TABLE projects ADD COLUMN brief_description text DEFAULT '' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'full_description_url'
  ) THEN
    ALTER TABLE projects ADD COLUMN full_description_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'experience_level'
  ) THEN
    ALTER TABLE projects ADD COLUMN experience_level text DEFAULT 'any' NOT NULL;
  END IF;
END $$;

-- Add check constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'projects' AND constraint_name = 'projects_experience_level_check'
  ) THEN
    ALTER TABLE projects 
    ADD CONSTRAINT projects_experience_level_check 
    CHECK (experience_level IN ('experienced', 'beginner', 'any'));
  END IF;
END $$;

-- Update existing projects to use their description as brief_description
UPDATE projects 
SET brief_description = COALESCE(description, '')
WHERE brief_description = '';

-- Create or replace function to check if user has matched with project
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

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view brief description" ON projects;
  DROP POLICY IF EXISTS "Users can view full description after match" ON projects;

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
END $$;
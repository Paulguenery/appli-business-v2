/*
  # Add project description fields and experience level

  1. Changes
    - Add brief_description and full_description_url columns if they don't exist
    - Add experience_level column with check constraint if it doesn't exist
    - Update existing projects to use description as brief_description
  
  2. Security
    - Add function to check project matches
    - Add RLS policies for viewing brief and full descriptions
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
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'projects_experience_level_check'
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

-- Drop existing policies if they exist and create new ones
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view brief description'
  ) THEN
    CREATE POLICY "Users can view brief description"
      ON projects FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view full description after match'
  ) THEN
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
  END IF;
END $$;
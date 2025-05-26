/*
  # Add matching system tables
  
  1. New Tables
    - `project_matches`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `seeker_id` (uuid, references profiles)
      - `status` (text) - pending, accepted, rejected
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `project_interests`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `created_at` (timestamp)

    - `project_interest_links`
      - `project_id` (uuid, references projects)
      - `interest_id` (uuid, references project_interests)
      - Primary key (project_id, interest_id)

    - `seeker_interests`
      - `profile_id` (uuid, references profiles)
      - `interest_id` (uuid, references project_interests) 
      - Primary key (profile_id, interest_id)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create project_matches table
CREATE TABLE project_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects NOT NULL,
  seeker_id uuid REFERENCES profiles NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, seeker_id)
);

-- Create project_interests table
CREATE TABLE project_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create project_interest_links table
CREATE TABLE project_interest_links (
  project_id uuid REFERENCES projects ON DELETE CASCADE,
  interest_id uuid REFERENCES project_interests ON DELETE CASCADE,
  PRIMARY KEY (project_id, interest_id)
);

-- Create seeker_interests table
CREATE TABLE seeker_interests (
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  interest_id uuid REFERENCES project_interests ON DELETE CASCADE,
  PRIMARY KEY (profile_id, interest_id)
);

-- Enable RLS
ALTER TABLE project_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_interest_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_interests ENABLE ROW LEVEL SECURITY;

-- Project matches policies
CREATE POLICY "Users can view their own matches"
  ON project_matches FOR SELECT
  TO authenticated
  USING (
    seeker_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR 
    project_id IN (
      SELECT id FROM projects 
      WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create matches for projects they're interested in"
  ON project_matches FOR INSERT
  TO authenticated
  WITH CHECK (
    seeker_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own match responses"
  ON project_matches FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Project interests policies
CREATE POLICY "Anyone can view interests"
  ON project_interests FOR SELECT
  TO authenticated
  USING (true);

-- Project interest links policies
CREATE POLICY "Anyone can view project interests"
  ON project_interest_links FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project owners can manage project interests"
  ON project_interest_links FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects 
      WHERE owner_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Seeker interests policies
CREATE POLICY "Anyone can view seeker interests"
  ON seeker_interests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own interests"
  ON seeker_interests FOR ALL
  TO authenticated
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Insert some initial interests
INSERT INTO project_interests (name) VALUES
  ('Technology'),
  ('E-commerce'),
  ('Healthcare'),
  ('Education'),
  ('Finance'),
  ('Sustainability'),
  ('Social Impact'),
  ('AI/ML'),
  ('Blockchain'),
  ('Mobile Apps');
/*
  # Ajout des suggestions d'amélioration

  1. Nouvelles Tables
    - `suggestions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key vers profiles)
      - `content` (text)
      - `is_public` (boolean)
      - `user_type` (text)
      - `created_at` (timestamp)
    - `suggestion_likes`
      - `suggestion_id` (uuid, foreign key vers suggestions)
      - `user_id` (uuid, foreign key vers profiles)

  2. Security
    - Enable RLS sur les deux tables
    - Policies pour la gestion des suggestions et des likes
*/

-- Create suggestions table
CREATE TABLE suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  is_public boolean DEFAULT true,
  user_type text NOT NULL CHECK (user_type IN ('project_owner', 'project_seeker', 'investor')),
  created_at timestamptz DEFAULT now()
);

-- Create suggestion_likes table
CREATE TABLE suggestion_likes (
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (suggestion_id, user_id)
);

-- Enable RLS
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suggestions
CREATE POLICY "Users can create suggestions"
  ON suggestions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view public suggestions"
  ON suggestions FOR SELECT
  TO authenticated
  USING (
    is_public = true OR
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for suggestion_likes
CREATE POLICY "Users can manage their likes"
  ON suggestion_likes
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view likes"
  ON suggestion_likes FOR SELECT
  TO authenticated
  USING (true);
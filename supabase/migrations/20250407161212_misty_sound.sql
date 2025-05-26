/*
  # Add suggestions functionality

  1. New Tables
    - `suggestions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `is_public` (boolean)
      - `user_type` (text)
      - `created_at` (timestamptz)
    
    - `suggestion_likes`
      - `suggestion_id` (uuid, references suggestions)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for managing suggestions and likes
*/

-- Create suggestions table if it doesn't exist
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  is_public boolean DEFAULT true,
  user_type text NOT NULL CHECK (user_type IN ('project_owner', 'project_seeker', 'investor')),
  created_at timestamptz DEFAULT now()
);

-- Create suggestion_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS suggestion_likes (
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (suggestion_id, user_id)
);

-- Enable RLS
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for suggestions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'suggestions' 
    AND policyname = 'Users can create suggestions'
  ) THEN
    CREATE POLICY "Users can create suggestions"
      ON suggestions FOR INSERT
      TO authenticated
      WITH CHECK (
        user_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'suggestions' 
    AND policyname = 'Users can view public suggestions'
  ) THEN
    CREATE POLICY "Users can view public suggestions"
      ON suggestions FOR SELECT
      TO authenticated
      USING (
        is_public = true OR
        user_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- RLS Policies for suggestion_likes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'suggestion_likes' 
    AND policyname = 'Users can manage their likes'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'suggestion_likes' 
    AND policyname = 'Users can view likes'
  ) THEN
    CREATE POLICY "Users can view likes"
      ON suggestion_likes FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
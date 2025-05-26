/*
  # Add suggestion likes functionality

  1. New Tables
    - `suggestion_likes`
      - `suggestion_id` (uuid, references suggestions)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on suggestion_likes table
    - Add policies for managing likes
*/

-- Create suggestion_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS suggestion_likes (
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (suggestion_id, user_id)
);

-- Enable RLS for suggestion_likes
ALTER TABLE suggestion_likes ENABLE ROW LEVEL SECURITY;

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
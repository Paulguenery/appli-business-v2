/*
  # Add user features and statistics

  1. New Tables
    - `user_ratings`
      - `id` (uuid, primary key)
      - `rater_id` (uuid, references profiles)
      - `rated_id` (uuid, references profiles)
      - `project_id` (uuid, references projects)
      - `communication_score` (int)
      - `reliability_score` (int)
      - `skills_score` (int)
      - `timeliness_score` (int)
      - `comment` (text)
      - `is_public` (boolean)
      - `created_at` (timestamptz)

    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `badge_type` (text)
      - `earned_at` (timestamptz)

  2. Updates
    - Add rating-related columns to profiles
    - Add swipe history tracking
    - Add notification preferences

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies
*/

-- Create user_ratings table
CREATE TABLE user_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id uuid REFERENCES profiles NOT NULL,
  rated_id uuid REFERENCES profiles NOT NULL,
  project_id uuid REFERENCES projects NOT NULL,
  communication_score int CHECK (communication_score BETWEEN 1 AND 5),
  reliability_score int CHECK (reliability_score BETWEEN 1 AND 5),
  skills_score int CHECK (skills_score BETWEEN 1 AND 5),
  timeliness_score int CHECK (timeliness_score BETWEEN 1 AND 5),
  comment text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(rater_id, rated_id, project_id)
);

-- Create user_badges table
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles NOT NULL,
  badge_type text NOT NULL CHECK (badge_type IN (
    'reliable_collaborator',
    'top_rated',
    'fast_responder',
    'project_completed',
    'verified_profile'
  )),
  earned_at timestamptz DEFAULT now()
);

-- Create swipe_history table
CREATE TABLE swipe_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles NOT NULL,
  swiped_id uuid, -- Can be either project_id or profile_id
  swipe_type text NOT NULL CHECK (swipe_type IN ('left', 'right')),
  created_at timestamptz DEFAULT now()
);

-- Add rating-related columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS average_rating float DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS total_ratings int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating_breakdown jsonb DEFAULT '{
    "communication": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0},
    "reliability": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0},
    "skills": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0},
    "timeliness": {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}
  }'::jsonb;

-- Enable RLS
ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view public ratings"
  ON user_ratings FOR SELECT
  TO authenticated
  USING (is_public = true OR rater_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ) OR rated_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create ratings for their collaborations"
  ON user_ratings FOR INSERT
  TO authenticated
  WITH CHECK (rater_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their own swipe history"
  ON swipe_history FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create swipe history"
  ON swipe_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Function to calculate average rating
CREATE OR REPLACE FUNCTION calculate_average_rating(profile_uuid uuid)
RETURNS float
LANGUAGE plpgsql
AS $$
DECLARE
  avg_rating float;
BEGIN
  SELECT 
    ROUND(
      AVG(
        (communication_score + reliability_score + skills_score + timeliness_score) / 4.0
      )::numeric,
      1
    ) INTO avg_rating
  FROM user_ratings
  WHERE rated_id = profile_uuid;

  RETURN COALESCE(avg_rating, 0.0);
END;
$$;

-- Function to update rating statistics
CREATE OR REPLACE FUNCTION update_rating_statistics()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update average rating
  UPDATE profiles
  SET 
    average_rating = calculate_average_rating(NEW.rated_id),
    total_ratings = (SELECT COUNT(*) FROM user_ratings WHERE rated_id = NEW.rated_id),
    rating_breakdown = (
      SELECT jsonb_build_object(
        'communication', (
          SELECT jsonb_object_agg(score, count)
          FROM (
            SELECT communication_score as score, COUNT(*) as count
            FROM user_ratings
            WHERE rated_id = NEW.rated_id
            GROUP BY communication_score
          ) t
        ),
        'reliability', (
          SELECT jsonb_object_agg(score, count)
          FROM (
            SELECT reliability_score as score, COUNT(*) as count
            FROM user_ratings
            WHERE rated_id = NEW.rated_id
            GROUP BY reliability_score
          ) t
        ),
        'skills', (
          SELECT jsonb_object_agg(score, count)
          FROM (
            SELECT skills_score as score, COUNT(*) as count
            FROM user_ratings
            WHERE rated_id = NEW.rated_id
            GROUP BY skills_score
          ) t
        ),
        'timeliness', (
          SELECT jsonb_object_agg(score, count)
          FROM (
            SELECT timeliness_score as score, COUNT(*) as count
            FROM user_ratings
            WHERE rated_id = NEW.rated_id
            GROUP BY timeliness_score
          ) t
        )
      )
    )
  WHERE id = NEW.rated_id;

  -- Check and award badges
  IF (SELECT COUNT(*) FROM user_ratings WHERE rated_id = NEW.rated_id) >= 5 
     AND (SELECT AVG((communication_score + reliability_score + skills_score + timeliness_score) / 4.0)
          FROM user_ratings WHERE rated_id = NEW.rated_id) >= 4.5 THEN
    INSERT INTO user_badges (user_id, badge_type)
    VALUES (NEW.rated_id, 'top_rated')
    ON CONFLICT DO NOTHING;
  END IF;

  IF (SELECT COUNT(*) FROM user_ratings WHERE rated_id = NEW.rated_id) >= 10 
     AND (SELECT AVG(reliability_score) FROM user_ratings WHERE rated_id = NEW.rated_id) >= 4.0 THEN
    INSERT INTO user_badges (user_id, badge_type)
    VALUES (NEW.rated_id, 'reliable_collaborator')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for rating statistics
CREATE TRIGGER update_rating_statistics_trigger
  AFTER INSERT OR UPDATE ON user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_rating_statistics();
/*
  # Update authentication and user profile system

  1. Updates
    - Add new user types (investor)
    - Add onboarding fields
    - Add profile statistics
    - Add referral system
    - Add notification preferences
    - Add user settings

  2. Changes
    - Modify profiles table
    - Add onboarding table
    - Add statistics table
    - Add notifications table
*/

-- Add new user types to profiles
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS user_type text CHECK (user_type IN ('project_owner', 'project_seeker', 'investor')),
  ADD COLUMN IF NOT EXISTS sectors text[],
  ADD COLUMN IF NOT EXISTS objectives text[],
  ADD COLUMN IF NOT EXISTS availability text,
  ADD COLUMN IF NOT EXISTS profile_views_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS matches_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pending_messages_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{"push": true, "email": true}'::jsonb,
  ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{
    "swipe_mode": true,
    "show_location": true,
    "show_availability": true,
    "show_stats": true
  }'::jsonb;

-- Create onboarding table
CREATE TABLE IF NOT EXISTS onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  step int DEFAULT 1,
  completed_steps text[] DEFAULT '{}',
  answers jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user statistics table
CREATE TABLE IF NOT EXISTS user_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  daily_profile_views int DEFAULT 0,
  daily_matches int DEFAULT 0,
  daily_messages int DEFAULT 0,
  total_profile_views int DEFAULT 0,
  total_matches int DEFAULT 0,
  total_messages int DEFAULT 0,
  last_reset_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN (
    'match', 'message', 'swipe', 'project', 
    'boost_ended', 'reminder', 'view'
  )),
  title text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own onboarding"
  ON onboarding FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own onboarding"
  ON onboarding FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own statistics"
  ON user_statistics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Function to reset daily statistics
CREATE OR REPLACE FUNCTION reset_daily_statistics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_statistics
  SET 
    daily_profile_views = 0,
    daily_matches = 0,
    daily_messages = 0,
    last_reset_date = CURRENT_DATE
  WHERE last_reset_date < CURRENT_DATE;
END;
$$;

-- Function to increment statistics
CREATE OR REPLACE FUNCTION increment_user_statistic(
  user_uuid uuid,
  stat_type text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_statistics (user_id)
  VALUES (user_uuid)
  ON CONFLICT (user_id) DO NOTHING;

  CASE stat_type
    WHEN 'view' THEN
      UPDATE user_statistics
      SET 
        daily_profile_views = daily_profile_views + 1,
        total_profile_views = total_profile_views + 1
      WHERE user_id = user_uuid;
    WHEN 'match' THEN
      UPDATE user_statistics
      SET 
        daily_matches = daily_matches + 1,
        total_matches = total_matches + 1
      WHERE user_id = user_uuid;
    WHEN 'message' THEN
      UPDATE user_statistics
      SET 
        daily_messages = daily_messages + 1,
        total_messages = total_messages + 1
      WHERE user_id = user_uuid;
    ELSE
      RAISE EXCEPTION 'Invalid statistic type: %', stat_type;
  END CASE;
END;
$$;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  user_uuid uuid,
  notif_type text,
  notif_title text,
  notif_content text,
  notif_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO notifications (
    user_id,
    type,
    title,
    content,
    data
  )
  VALUES (
    user_uuid,
    notif_type,
    notif_title,
    notif_content,
    notif_data
  );
END;
$$;
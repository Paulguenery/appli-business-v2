/*
  # Add subscription and profile view tracking

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan` (text) - freemium, standard, premium
      - `status` (text) - active, cancelled, expired
      - `starts_at` (timestamptz)
      - `ends_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `profile_views`
      - `id` (uuid, primary key)
      - `viewer_id` (uuid, references profiles)
      - `viewed_id` (uuid, references profiles)
      - `view_date` (date)
      - `created_at` (timestamptz)

  2. Updates
    - Add subscription-related columns to profiles
    - Add referral system columns
    - Add daily limits tracking

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL CHECK (plan IN ('freemium', 'standard', 'premium')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create profile_views table
CREATE TABLE profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id uuid REFERENCES profiles NOT NULL,
  viewed_id uuid REFERENCES profiles NOT NULL,
  view_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(viewer_id, viewed_id, view_date)
);

-- Add new columns to profiles
ALTER TABLE profiles 
  ADD COLUMN subscription_status text DEFAULT 'freemium',
  ADD COLUMN boost_until timestamptz,
  ADD COLUMN daily_swipes_left int DEFAULT 5,
  ADD COLUMN daily_messages_left int DEFAULT 0,
  ADD COLUMN is_verified boolean DEFAULT false,
  ADD COLUMN referral_code text UNIQUE,
  ADD COLUMN referred_by text REFERENCES profiles(referral_code);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Profile views policies
CREATE POLICY "Users can view profile view statistics"
  ON profile_views FOR SELECT
  TO authenticated
  USING (
    viewer_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR 
    viewed_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create profile views"
  ON profile_views FOR INSERT
  TO authenticated
  WITH CHECK (
    viewer_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Function to generate referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS trigger AS $$
BEGIN
  NEW.referral_code := substr(md5(random()::text), 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically generate referral code
CREATE TRIGGER generate_referral_code_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- Function to reset daily limits
CREATE OR REPLACE FUNCTION reset_daily_limits()
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    daily_swipes_left = CASE 
      WHEN subscription_status = 'freemium' THEN 5
      WHEN subscription_status = 'standard' THEN 10
      WHEN subscription_status = 'premium' THEN -1 -- Unlimited
    END,
    daily_messages_left = CASE
      WHEN subscription_status = 'freemium' THEN 0
      WHEN subscription_status = 'standard' THEN 10
      WHEN subscription_status = 'premium' THEN -1 -- Unlimited
    END
  WHERE date_trunc('day', timezone('UTC', now())) > date_trunc('day', timezone('UTC', updated_at));
END;
$$ LANGUAGE plpgsql;
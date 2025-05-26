/*
  # Add user type and description to subscription tables

  1. Changes
    - Add user_type and description columns to subscription_features and subscription_pricing
    - Set default values and make user_type NOT NULL
    - Add type check constraints
    - Enable RLS and add policies
    - Insert subscription data

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing subscription data
*/

DO $$ 
BEGIN
  -- Add user_type column to subscription_features if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'subscription_features' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE subscription_features ADD COLUMN user_type text;
  END IF;

  -- Add description column to subscription_features if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'subscription_features' AND column_name = 'description'
  ) THEN
    ALTER TABLE subscription_features ADD COLUMN description text;
  END IF;

  -- Add user_type column to subscription_pricing if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'subscription_pricing' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE subscription_pricing ADD COLUMN user_type text;
  END IF;

  -- Add description column to subscription_pricing if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'subscription_pricing' AND column_name = 'description'
  ) THEN
    ALTER TABLE subscription_pricing ADD COLUMN description text;
  END IF;

  -- Set default values for existing rows
  UPDATE subscription_features
  SET user_type = 'project_seeker'
  WHERE user_type IS NULL;

  UPDATE subscription_pricing
  SET user_type = 'project_seeker'
  WHERE user_type IS NULL;

  -- Make user_type NOT NULL and add constraints
  ALTER TABLE subscription_features 
  ALTER COLUMN user_type SET NOT NULL;

  ALTER TABLE subscription_pricing
  ALTER COLUMN user_type SET NOT NULL;

  -- Add type check constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscription_features_user_type_check'
  ) THEN
    ALTER TABLE subscription_features 
    ADD CONSTRAINT subscription_features_user_type_check 
    CHECK (user_type IN ('project_owner', 'project_seeker', 'investor'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'subscription_pricing_user_type_check'
  ) THEN
    ALTER TABLE subscription_pricing
    ADD CONSTRAINT subscription_pricing_user_type_check 
    CHECK (user_type IN ('project_owner', 'project_seeker', 'investor'));
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_pricing ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view subscription features" ON subscription_features;
DROP POLICY IF EXISTS "Anyone can view subscription pricing" ON subscription_pricing;

-- Add policies
CREATE POLICY "Anyone can view subscription features"
ON subscription_features
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can view subscription pricing"
ON subscription_pricing
FOR SELECT
TO authenticated
USING (true);

-- Clear existing data in correct order
TRUNCATE TABLE subscription_pricing CASCADE;
TRUNCATE TABLE subscription_features CASCADE;

-- Insert subscription features for project owners
INSERT INTO subscription_features 
(plan, user_type, description, daily_swipes_limit, daily_messages_limit, can_initiate_chat, can_view_documents, can_schedule_meetings, has_advanced_matching, has_profile_boost, has_premium_badge, max_active_projects)
VALUES 
('freemium_owner', 'project_owner', 'Basic features for project owners', 5, 3, false, false, false, false, false, false, 1),
('starter_owner', 'project_owner', 'Essential features for growing projects', 20, -1, true, true, true, true, false, false, 3),
('premium_owner', 'project_owner', 'Complete solution for serious project owners', -1, -1, true, true, true, true, true, true, -1);

-- Insert subscription features for project seekers
INSERT INTO subscription_features 
(plan, user_type, description, daily_swipes_limit, daily_messages_limit, can_initiate_chat, can_view_documents, can_schedule_meetings, has_advanced_matching, has_profile_boost, has_premium_badge, max_active_conversations)
VALUES 
('freemium_seeker', 'project_seeker', 'Basic features for project seekers', 5, 3, false, false, false, false, false, false, 1),
('pay_per_conversation', 'project_seeker', 'Pay as you go for casual users', 10, -1, true, true, true, true, false, false, 1),
('standard_seeker', 'project_seeker', 'Standard features for active seekers', 20, -1, true, true, true, true, false, false, 10),
('premium_seeker', 'project_seeker', 'Premium features for serious seekers', -1, -1, true, true, true, true, true, true, -1);

-- Insert subscription features for investors
INSERT INTO subscription_features 
(plan, user_type, description, daily_swipes_limit, daily_messages_limit, can_initiate_chat, can_view_documents, can_schedule_meetings, has_advanced_matching, has_profile_boost, has_premium_badge)
VALUES 
('basic_investor', 'investor', 'Basic features for investors', 5, 3, false, false, false, false, false, false),
('pro_investor', 'investor', 'Professional features for serious investors', -1, -1, true, true, true, true, true, true);

-- Insert subscription pricing
INSERT INTO subscription_pricing 
(plan, user_type, description, price_monthly)
VALUES 
('freemium_owner', 'project_owner', 'Free plan for project owners', 0),
('starter_owner', 'project_owner', 'Starter plan for project owners', 6.99),
('premium_owner', 'project_owner', 'Premium plan for project owners', 12.99),
('freemium_seeker', 'project_seeker', 'Free plan for project seekers', 0),
('pay_per_conversation', 'project_seeker', 'Pay per conversation', 3.99),
('standard_seeker', 'project_seeker', 'Standard plan for project seekers', 6.99),
('premium_seeker', 'project_seeker', 'Premium plan for project seekers', 9.99),
('basic_investor', 'investor', 'Basic plan for investors', 0),
('pro_investor', 'investor', 'Professional plan for investors', 14.99);
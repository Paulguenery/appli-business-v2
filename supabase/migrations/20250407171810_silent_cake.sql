/*
  # Update project owner subscription plans

  1. Changes
    - Update project owner subscription plans with new features and limits
    - Update pricing structure for project owner plans

  2. Tables Modified
    - subscription_features
    - subscription_pricing
*/

-- Update subscription features table
DROP TABLE IF EXISTS subscription_features CASCADE;
CREATE TABLE subscription_features (
  plan text PRIMARY KEY,
  daily_swipes_limit int,
  daily_messages_limit int,
  can_initiate_chat boolean DEFAULT false,
  can_view_documents boolean DEFAULT false,
  can_schedule_meetings boolean DEFAULT false,
  has_advanced_matching boolean DEFAULT false,
  has_profile_boost boolean DEFAULT false,
  has_premium_badge boolean DEFAULT false,
  has_video_calls boolean DEFAULT false,
  max_active_projects int,
  max_active_conversations int,
  can_access_investors boolean DEFAULT false,
  has_project_promotion boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Update subscription pricing table
DROP TABLE IF EXISTS subscription_pricing CASCADE;
CREATE TABLE subscription_pricing (
  plan text PRIMARY KEY REFERENCES subscription_features(plan),
  price_monthly decimal(10,2) NOT NULL,
  price_per_conversation decimal(10,2),
  max_active_projects int,
  max_active_conversations int,
  created_at timestamptz DEFAULT now()
);

-- Insert features for project owner plans
INSERT INTO subscription_features (
  plan,
  daily_swipes_limit,
  daily_messages_limit,
  can_initiate_chat,
  can_view_documents,
  can_schedule_meetings,
  has_video_calls,
  max_active_projects,
  has_premium_badge,
  can_access_investors,
  has_project_promotion
) VALUES
-- Project owner plans
('freemium_owner', 5, 0, false, false, false, false, 1, false, false, false),
('starter_owner', -1, -1, true, true, true, true, 3, false, false, false),
('premium_owner', -1, -1, true, true, true, true, NULL, true, true, true);

-- Insert pricing for project owner plans
INSERT INTO subscription_pricing (
  plan,
  price_monthly,
  max_active_projects
) VALUES
('freemium_owner', 0, 1),
('starter_owner', 6.99, 3),
('premium_owner', 12.99, NULL);
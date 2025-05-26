/*
  # Set up subscription plans for different user types

  1. Changes
    - Update subscription features table with new plans
    - Update subscription pricing table with new pricing structure
    - Add user type specific features

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

-- Insert features for all plan types
INSERT INTO subscription_features (
  plan,
  daily_swipes_limit,
  daily_messages_limit,
  can_initiate_chat,
  can_view_documents,
  can_schedule_meetings,
  has_video_calls,
  max_active_projects,
  max_active_conversations,
  has_premium_badge,
  can_access_investors,
  has_project_promotion
) VALUES
-- Project seeker plans
('freemium_seeker', -1, 3, false, false, false, false, NULL, 1, false, false, false),
('pay_per_conversation', -1, -1, true, true, true, true, NULL, NULL, false, false, false),
('standard_seeker', -1, -1, true, true, true, true, NULL, 10, false, false, false),
('premium_seeker', -1, -1, true, true, true, true, NULL, NULL, true, false, false),

-- Project owner plans
('freemium_owner', 5, 0, false, false, false, false, 1, NULL, false, false, false),
('starter_owner', -1, -1, true, true, true, true, 3, NULL, false, false, false),
('premium_owner', -1, -1, true, true, true, true, NULL, NULL, true, true, true),

-- Investor plans
('basic_investor', 5, 3, false, false, false, false, NULL, NULL, false, false, false),
('pro_investor', -1, -1, true, true, true, true, NULL, NULL, true, true, false);

-- Insert pricing for all plan types
INSERT INTO subscription_pricing (
  plan,
  price_monthly,
  price_per_conversation,
  max_active_projects,
  max_active_conversations
) VALUES
-- Project seeker plans
('freemium_seeker', 0, NULL, NULL, 1),
('pay_per_conversation', 0, 3.99, NULL, NULL),
('standard_seeker', 6.99, NULL, NULL, 10),
('premium_seeker', 9.99, NULL, NULL, NULL),

-- Project owner plans
('freemium_owner', 0, NULL, 1, NULL),
('starter_owner', 6.99, NULL, 3, NULL),
('premium_owner', 12.99, NULL, NULL, NULL),

-- Investor plans
('basic_investor', 0, NULL, NULL, NULL),
('pro_investor', 14.99, NULL, NULL, NULL);

-- Update subscription plan check constraint
ALTER TABLE subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

ALTER TABLE subscriptions
ADD CONSTRAINT subscriptions_plan_check 
CHECK (plan IN (
  -- Project seeker plans
  'freemium_seeker',
  'pay_per_conversation',
  'standard_seeker',
  'premium_seeker',
  -- Project owner plans
  'freemium_owner',
  'starter_owner',
  'premium_owner',
  -- Investor plans
  'basic_investor',
  'pro_investor'
));
/*
  # Update subscription plans for project seekers

  1. Changes
    - Update subscription plan types and constraints
    - Update subscription features table with new limits
    - Update subscription pricing table with new prices
    - Add new features for project seekers

  2. Tables Modified
    - subscriptions (plan check constraint)
    - subscription_features (new features and limits)
    - subscription_pricing (new pricing structure)
*/

-- Update subscription plan types
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
  max_active_conversations int,
  created_at timestamptz DEFAULT now()
);

-- Insert features for project seeker plans
INSERT INTO subscription_features (
  plan,
  daily_swipes_limit,
  daily_messages_limit,
  can_initiate_chat,
  can_view_documents,
  can_schedule_meetings,
  has_video_calls,
  max_active_conversations,
  has_premium_badge
) VALUES
-- Project seeker plans
('freemium_seeker', -1, 3, false, false, false, false, 1, false),
('pay_per_conversation', -1, -1, true, true, true, true, NULL, false),
('standard_seeker', -1, -1, true, true, true, true, 10, false),
('premium_seeker', -1, -1, true, true, true, true, NULL, true);

-- Update subscription pricing table
DROP TABLE IF EXISTS subscription_pricing CASCADE;
CREATE TABLE subscription_pricing (
  plan text PRIMARY KEY REFERENCES subscription_features(plan),
  price_monthly decimal(10,2) NOT NULL,
  price_per_conversation decimal(10,2),
  max_active_conversations int,
  created_at timestamptz DEFAULT now()
);

-- Insert pricing for project seeker plans
INSERT INTO subscription_pricing (
  plan,
  price_monthly,
  price_per_conversation,
  max_active_conversations
) VALUES
('freemium_seeker', 0, NULL, 1),
('pay_per_conversation', 0, 3.99, NULL),
('standard_seeker', 6.99, NULL, 10),
('premium_seeker', 9.99, NULL, NULL);
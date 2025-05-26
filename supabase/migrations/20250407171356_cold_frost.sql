/*
  # Update subscription plans and features

  1. Changes
    - Update subscription plan types
    - Add new subscription features
    - Add pricing information
    - Update referral system

  2. Tables Modified
    - subscriptions (plan types)
    - subscription_features (new features)
    - subscription_pricing (pricing structure)
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
  max_active_projects int,
  max_active_conversations int,
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

-- Create referrals table if it doesn't exist
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id),
  referred_id uuid REFERENCES profiles(id) UNIQUE,
  status text CHECK (status IN ('pending', 'completed')),
  discount_applied boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Function to handle referral completion
CREATE OR REPLACE FUNCTION complete_referral()
RETURNS trigger AS $$
BEGIN
  -- When referred user gets their first match
  IF NEW.status = 'completed' AND OLD.status = 'pending' THEN
    -- Give referrer a free match
    UPDATE profiles
    SET matches_count = matches_count + 1
    WHERE id = NEW.referrer_id;
    
    -- Apply 20% discount to referred user's subscription
    UPDATE subscriptions
    SET price_monthly = price_monthly * 0.8
    WHERE user_id = (
      SELECT user_id 
      FROM profiles 
      WHERE id = NEW.referred_id
    )
    AND status = 'active';

    -- Mark discount as applied
    UPDATE referrals
    SET discount_applied = true,
        completed_at = now()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral completion
DROP TRIGGER IF EXISTS complete_referral_trigger ON referrals;
CREATE TRIGGER complete_referral_trigger
  AFTER UPDATE OF status ON referrals
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status = 'pending')
  EXECUTE FUNCTION complete_referral();
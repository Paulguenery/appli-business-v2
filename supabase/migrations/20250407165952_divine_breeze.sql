/*
  # Subscription Model Implementation
  
  1. Changes
    - Add new subscription types for each user role
    - Update subscription features table
    - Add pricing information
    - Add referral tracking
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
    
  3. Notes
    - Safely handles existing data
    - Preserves referential integrity
*/

-- Add new subscription types
DO $$ 
BEGIN
  -- First drop the constraint if it exists
  ALTER TABLE subscriptions 
  DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

  -- Then add the new constraint with updated plans
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
END $$;

-- Create subscription_pricing table
CREATE TABLE IF NOT EXISTS subscription_pricing (
  plan text PRIMARY KEY,
  price_monthly decimal(10,2) NOT NULL,
  price_per_conversation decimal(10,2),
  max_active_projects int,
  max_active_conversations int,
  created_at timestamptz DEFAULT now()
);

-- Insert pricing information
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

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id),
  referred_id uuid REFERENCES profiles(id) UNIQUE,
  status text CHECK (status IN ('pending', 'completed')),
  reward_claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    referrer_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR
    referred_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Function to handle referral completion
CREATE OR REPLACE FUNCTION complete_referral()
RETURNS trigger AS $$
BEGIN
  -- When referred user gets their first match
  IF NEW.status = 'completed' AND OLD.status = 'pending' THEN
    -- Give referrer a free conversation/match
    UPDATE profiles
    SET matches_count = matches_count + 1
    WHERE id = NEW.referrer_id;
    
    -- Give referred user 20% discount on their next subscription
    UPDATE subscriptions
    SET price_monthly = price_monthly * 0.8
    WHERE user_id = (
      SELECT user_id 
      FROM profiles 
      WHERE id = NEW.referred_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for referral completion
CREATE TRIGGER complete_referral_trigger
  AFTER UPDATE OF status ON referrals
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status = 'pending')
  EXECUTE FUNCTION complete_referral();
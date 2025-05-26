/*
  # Update subscription system
  
  1. Tables
    - subscriptions: Store user subscription data
    - subscription_features: Define features and limits for each plan
    - subscription_history: Track subscription changes
    
  2. Features
    - Plan types: freemium, standard, premium
    - Feature limits: swipes, messages, etc.
    - Status tracking: active, cancelled, expired
    
  3. Security
    - RLS enabled on all tables
    - Users can only access their own subscription data
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  plan text NOT NULL CHECK (plan IN ('freemium', 'standard', 'premium')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create subscription_features table to track feature limits
CREATE TABLE IF NOT EXISTS subscription_features (
  plan text PRIMARY KEY,
  daily_swipes_limit int NOT NULL,
  daily_messages_limit int NOT NULL,
  can_initiate_chat boolean DEFAULT false,
  can_view_documents boolean DEFAULT false,
  can_schedule_meetings boolean DEFAULT false,
  has_advanced_matching boolean DEFAULT false,
  has_profile_boost boolean DEFAULT false,
  has_premium_badge boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO subscription_features (
  plan,
  daily_swipes_limit,
  daily_messages_limit,
  can_initiate_chat,
  can_view_documents,
  can_schedule_meetings,
  has_advanced_matching,
  has_profile_boost,
  has_premium_badge
) VALUES 
('freemium', 5, 3, false, false, false, false, false, false),
('standard', 20, 10, true, true, true, true, false, false),
('premium', -1, -1, true, true, true, true, true, true)
ON CONFLICT (plan) DO NOTHING;

-- Create subscription_history table for tracking changes
CREATE TABLE IF NOT EXISTS subscription_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  old_plan text REFERENCES subscription_features(plan),
  new_plan text REFERENCES subscription_features(plan),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Function to update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS trigger AS $$
BEGIN
  UPDATE subscriptions
  SET status = CASE
    WHEN ends_at IS NULL OR ends_at > now() THEN 'active'
    ELSE 'expired'
  END,
  updated_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update subscription status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_subscription_status_trigger'
  ) THEN
    CREATE TRIGGER update_subscription_status_trigger
      AFTER INSERT OR UPDATE OF ends_at ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_subscription_status();
  END IF;
END $$;

-- Function to log subscription changes
CREATE OR REPLACE FUNCTION log_subscription_change()
RETURNS trigger AS $$
BEGIN
  IF OLD.plan IS DISTINCT FROM NEW.plan THEN
    INSERT INTO subscription_history (user_id, old_plan, new_plan)
    VALUES (NEW.user_id, OLD.plan, NEW.plan);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log subscription changes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'log_subscription_change_trigger'
  ) THEN
    CREATE TRIGGER log_subscription_change_trigger
      AFTER UPDATE ON subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION log_subscription_change();
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Enable read access for own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Enable insert access for own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Enable update access for own subscription" ON subscriptions;
  DROP POLICY IF EXISTS "Enable read access for own subscription history" ON subscription_history;
END $$;

-- Create new RLS policies
CREATE POLICY "Enable read access for own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Enable insert access for own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable update access for own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable read access for own subscription history"
  ON subscription_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
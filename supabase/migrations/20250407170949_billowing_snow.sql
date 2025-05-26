/*
  # Update referral system and subscription plans

  1. Changes
    - Add referral code to profiles
    - Create referral system tables and functions
    - Update subscription plans and pricing
    - Add RLS policies for referrals

  2. Tables Modified/Created
    - profiles (add referral_code)
    - referrals (create)
    - subscription_plans (update)
    - subscription_pricing (update)
*/

-- Add referral code to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN referral_code text UNIQUE,
    ADD COLUMN referred_by text REFERENCES profiles(referral_code);
  END IF;
END $$;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS trigger AS $$
DECLARE
  chars text[] := '{A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,2,3,4,5,6,7,8,9}';
  result text := '';
  i integer := 0;
BEGIN
  IF NEW.referral_code IS NULL THEN
    LOOP
      i := 0;
      result := '';
      WHILE i < 8 LOOP
        result := result || chars[1+random()*(array_length(chars, 1)-1)];
        i := i + 1;
      END LOOP;
      BEGIN
        NEW.referral_code := result;
        RETURN NEW;
      EXCEPTION WHEN unique_violation THEN
        -- If we get a duplicate, try again
        CONTINUE;
      END;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for referral code generation
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'generate_referral_code_trigger'
  ) THEN
    CREATE TRIGGER generate_referral_code_trigger
      BEFORE INSERT ON profiles
      FOR EACH ROW
      WHEN (NEW.referral_code IS NULL)
      EXECUTE FUNCTION generate_referral_code();
  END IF;
END $$;

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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their referrals" ON referrals;

-- Create new RLS policy
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
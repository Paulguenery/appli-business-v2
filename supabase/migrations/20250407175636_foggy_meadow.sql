/*
  # Add referral system

  1. Changes
    - Add referral rewards table if not exists
    - Add referral claims table if not exists
    - Enable RLS and add policies
    - Insert initial rewards

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and creating claims
*/

-- Check if tables exist and create if they don't
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'referral_rewards') THEN
    CREATE TABLE referral_rewards (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text NOT NULL,
      reward_type text NOT NULL CHECK (reward_type IN ('discount', 'credit', 'feature')),
      value text NOT NULL,
      conditions jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now(),
      active boolean DEFAULT true
    );

    -- Enable RLS
    ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

    -- Add policy
    CREATE POLICY "Anyone can view active rewards"
    ON referral_rewards
    FOR SELECT
    TO authenticated
    USING (active = true);

    -- Insert initial rewards
    INSERT INTO referral_rewards 
    (name, description, reward_type, value, conditions)
    VALUES
    ('Discount 20%', 'Réduction de 20% sur le premier achat', 'discount', '20', '{"first_purchase": true}'),
    ('Match Illimité', 'Un match illimité offert', 'feature', 'unlimited_match', '{"on_referred_match": true}');
  END IF;

  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'referral_claims') THEN
    CREATE TABLE referral_claims (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      referrer_id uuid REFERENCES profiles(id),
      referred_id uuid REFERENCES profiles(id),
      reward_id uuid REFERENCES referral_rewards(id),
      claimed_at timestamptz DEFAULT now(),
      status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
      UNIQUE(referrer_id, referred_id, reward_id)
    );

    -- Enable RLS
    ALTER TABLE referral_claims ENABLE ROW LEVEL SECURITY;

    -- Add policies
    CREATE POLICY "Users can view their own claims"
    ON referral_claims
    FOR SELECT
    TO authenticated
    USING (
      referrer_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      ) OR 
      referred_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    );

    CREATE POLICY "Users can create claims"
    ON referral_claims
    FOR INSERT
    TO authenticated
    WITH CHECK (
      referrer_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      ) OR 
      referred_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    );
  END IF;
END $$;
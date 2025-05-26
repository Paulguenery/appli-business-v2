/*
  # Add referral tracking

  1. New Tables
    - `referral_rewards` - Tracks available rewards
    - `referral_claims` - Tracks claimed rewards

  2. Changes
    - Add referral tracking columns to profiles table
    - Add referral reward tracking

  3. Security
    - Enable RLS on new tables
    - Add policies for reward claims
*/

-- Add referral rewards table
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

-- Add referral claims table
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
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_claims ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Anyone can view active rewards"
ON referral_rewards
FOR SELECT
TO authenticated
USING (active = true);

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

-- Insert initial rewards
INSERT INTO referral_rewards 
(name, description, reward_type, value, conditions)
VALUES
('Discount 20%', 'Réduction de 20% sur le premier achat', 'discount', '20', '{"first_purchase": true}'),
('Match Illimité', 'Un match illimité offert', 'feature', 'unlimited_match', '{"on_referred_match": true}');
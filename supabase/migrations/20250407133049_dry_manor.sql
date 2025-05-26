/*
  # Add appointments functionality

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, references profiles)
      - `participant_id` (uuid, references profiles)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `description` (text)
      - `status` (text) - pending, confirmed, cancelled
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles NOT NULL,
  participant_id uuid REFERENCES profiles NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT appointments_time_check CHECK (end_time > start_time)
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR 
    participant_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    creator_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR 
    participant_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    creator_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    ) OR 
    participant_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (
    creator_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Function to get appointments with participant details
CREATE OR REPLACE FUNCTION get_appointments(
  p_user_id uuid,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  creator_id uuid,
  participant_id uuid,
  start_time timestamptz,
  end_time timestamptz,
  description text,
  status text,
  created_at timestamptz,
  creator_name text,
  participant_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.creator_id,
    a.participant_id,
    a.start_time,
    a.end_time,
    a.description,
    a.status,
    a.created_at,
    c.full_name as creator_name,
    p.full_name as participant_name
  FROM appointments a
  JOIN profiles c ON c.id = a.creator_id
  JOIN profiles p ON p.id = a.participant_id
  WHERE (
    a.creator_id IN (
      SELECT id FROM profiles WHERE user_id = p_user_id
    ) OR 
    a.participant_id IN (
      SELECT id FROM profiles WHERE user_id = p_user_id
    )
  )
  AND (
    p_start_date IS NULL OR 
    a.start_time >= p_start_date
  )
  AND (
    p_end_date IS NULL OR 
    a.end_time <= p_end_date
  )
  ORDER BY a.start_time ASC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_appointments TO authenticated;

-- Insert sample appointments
DO $$
DECLARE
  user1_id uuid;
  user2_id uuid;
BEGIN
  -- Get two random profiles for sample appointments
  SELECT id INTO user1_id FROM profiles LIMIT 1;
  SELECT id INTO user2_id FROM profiles WHERE id != user1_id LIMIT 1;

  -- Insert sample appointments
  INSERT INTO appointments (
    creator_id,
    participant_id,
    start_time,
    end_time,
    description,
    status
  ) VALUES
    (
      user1_id,
      user2_id,
      now() + interval '1 day',
      now() + interval '1 day' + interval '1 hour',
      'Premier rendez-vous de présentation',
      'confirmed'
    ),
    (
      user2_id,
      user1_id,
      now() + interval '2 days',
      now() + interval '2 days' + interval '1 hour',
      'Discussion sur les opportunités de collaboration',
      'pending'
    );
END;
$$;
/*
  # Add video call functionality

  1. New Tables
    - `call_signals`
      - `id` (uuid, primary key)
      - `call_id` (uuid)
      - `sender_id` (uuid, references auth.users)
      - `receiver_id` (uuid, references auth.users)
      - `type` (text) - offer, answer, ice_candidate
      - `signal` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage call signals
    - Add cleanup trigger for old signals
*/

-- Create call_signals table
CREATE TABLE call_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id uuid NOT NULL,
  sender_id uuid REFERENCES auth.users NOT NULL,
  receiver_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('offer', 'answer', 'ice_candidate')),
  signal jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE call_signals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create call signals"
  ON call_signals FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
  );

CREATE POLICY "Users can view call signals they're involved in"
  ON call_signals FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR
    receiver_id = auth.uid()
  );

-- Function to cleanup old call signals
CREATE OR REPLACE FUNCTION cleanup_old_call_signals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM call_signals
  WHERE created_at < now() - interval '1 hour';
  RETURN NEW;
END;
$$;

-- Create trigger to cleanup old signals on insert
CREATE TRIGGER cleanup_old_signals_trigger
  AFTER INSERT ON call_signals
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_call_signals();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_old_call_signals TO postgres;
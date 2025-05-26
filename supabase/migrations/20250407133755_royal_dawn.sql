/*
  # Add Call History Feature

  1. New Tables
    - `call_history`
      - `id` (uuid, primary key)
      - `caller_id` (uuid, references users)
      - `receiver_id` (uuid, references users)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `duration` (interval)
      - `status` (text: completed, missed, failed)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `call_history` table
    - Add policies for users to view their own call history
*/

-- Create call_history table
CREATE TABLE call_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id uuid REFERENCES auth.users NOT NULL,
  receiver_id uuid REFERENCES auth.users NOT NULL,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration interval GENERATED ALWAYS AS (end_time - start_time) STORED,
  status text NOT NULL CHECK (status IN ('completed', 'missed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own call history"
  ON call_history FOR SELECT
  TO authenticated
  USING (
    caller_id = auth.uid() OR
    receiver_id = auth.uid()
  );

CREATE POLICY "Users can create call history entries"
  ON call_history FOR INSERT
  TO authenticated
  WITH CHECK (
    caller_id = auth.uid()
  );

CREATE POLICY "Users can update their own call history"
  ON call_history FOR UPDATE
  TO authenticated
  USING (
    caller_id = auth.uid()
  )
  WITH CHECK (
    caller_id = auth.uid()
  );

-- Create index for faster queries
CREATE INDEX idx_call_history_user_time ON call_history (caller_id, receiver_id, start_time DESC);
/*
  # Update Call History Policies and Indexes

  1. Security
    - Add policies for users to view their own call history
    - Add policies for users to create and update call history entries

  2. Indexes
    - Add index for faster queries on user_id and time
*/

-- RLS Policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'call_history' 
    AND policyname = 'Users can view their own call history'
  ) THEN
    CREATE POLICY "Users can view their own call history"
      ON call_history FOR SELECT
      TO authenticated
      USING (
        caller_id = auth.uid() OR
        receiver_id = auth.uid()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'call_history' 
    AND policyname = 'Users can create call history entries'
  ) THEN
    CREATE POLICY "Users can create call history entries"
      ON call_history FOR INSERT
      TO authenticated
      WITH CHECK (
        caller_id = auth.uid()
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'call_history' 
    AND policyname = 'Users can update their own call history'
  ) THEN
    CREATE POLICY "Users can update their own call history"
      ON call_history FOR UPDATE
      TO authenticated
      USING (
        caller_id = auth.uid()
      )
      WITH CHECK (
        caller_id = auth.uid()
      );
  END IF;
END $$;

-- Create index if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'call_history' 
    AND indexname = 'idx_call_history_user_time'
  ) THEN
    CREATE INDEX idx_call_history_user_time 
      ON call_history (caller_id, receiver_id, start_time DESC);
  END IF;
END $$;
/*
  # Call Statistics Migration Fix

  1. Changes
    - Create call_statistics table with proper checks
    - Add RLS policies with existence checks
    - Add trigger and function for statistics updates
    - Ensure all operations are idempotent

  2. Security
    - Enable RLS on table
    - Add policy for viewing own statistics
    - Secure function execution

  3. Notes
    - All operations check for existence before creation
    - Uses DO blocks for conditional creation
    - Maintains data integrity
*/

-- Create call_statistics table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'call_statistics'
  ) THEN
    CREATE TABLE call_statistics (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
      total_calls integer DEFAULT 0,
      total_duration interval DEFAULT '0'::interval,
      missed_calls integer DEFAULT 0,
      failed_calls integer DEFAULT 0,
      average_duration interval GENERATED ALWAYS AS (
        CASE 
          WHEN total_calls > 0 THEN total_duration / total_calls
          ELSE '0'::interval
        END
      ) STORED,
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE call_statistics ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policy if it exists and create new one
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own call statistics" ON call_statistics;
  
  CREATE POLICY "Users can view their own call statistics"
    ON call_statistics FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
END $$;

-- Function to update call statistics
CREATE OR REPLACE FUNCTION update_call_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update caller statistics
  INSERT INTO call_statistics (user_id)
  VALUES (NEW.caller_id)
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_calls = CASE
      WHEN NEW.status = 'completed' THEN call_statistics.total_calls + 1
      ELSE call_statistics.total_calls
    END,
    total_duration = CASE
      WHEN NEW.status = 'completed' THEN call_statistics.total_duration + (NEW.end_time - NEW.start_time)
      ELSE call_statistics.total_duration
    END,
    failed_calls = CASE
      WHEN NEW.status = 'failed' THEN call_statistics.failed_calls + 1
      ELSE call_statistics.failed_calls
    END,
    updated_at = now();

  -- Update receiver statistics
  INSERT INTO call_statistics (user_id)
  VALUES (NEW.receiver_id)
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_calls = CASE
      WHEN NEW.status = 'completed' THEN call_statistics.total_calls + 1
      ELSE call_statistics.total_calls
    END,
    total_duration = CASE
      WHEN NEW.status = 'completed' THEN call_statistics.total_duration + (NEW.end_time - NEW.start_time)
      ELSE call_statistics.total_duration
    END,
    missed_calls = CASE
      WHEN NEW.status = 'missed' THEN call_statistics.missed_calls + 1
      ELSE call_statistics.missed_calls
    END,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and create new one
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS update_call_statistics_trigger ON call_history;
  
  CREATE TRIGGER update_call_statistics_trigger
    AFTER INSERT OR UPDATE ON call_history
    FOR EACH ROW
    EXECUTE FUNCTION update_call_statistics();
END $$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_call_statistics TO postgres;
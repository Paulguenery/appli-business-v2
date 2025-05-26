/*
  # Call Statistics Migration Fix

  1. Changes
    - Add existence checks for call_statistics table
    - Add existence checks for policies
    - Add existence checks for triggers and functions
    - Ensure idempotent operations

  2. Security
    - Maintain RLS policies
    - Keep existing permissions

  3. Notes
    - All operations are now safe to run multiple times
    - Preserves existing data and structure
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

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'call_statistics' 
    AND policyname = 'Users can view their own call statistics'
  ) THEN
    CREATE POLICY "Users can view their own call statistics"
      ON call_statistics FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
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

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_call_statistics_trigger'
  ) THEN
    CREATE TRIGGER update_call_statistics_trigger
      AFTER INSERT OR UPDATE ON call_history
      FOR EACH ROW
      EXECUTE FUNCTION update_call_statistics();
  END IF;
END $$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_call_statistics TO postgres;
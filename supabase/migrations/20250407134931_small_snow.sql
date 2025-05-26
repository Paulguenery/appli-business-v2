/*
  # Add Call Statistics Update Function

  1. Changes
    - Add function to update call statistics when calls end
    - Add trigger to automatically update statistics

  2. Details
    - Function updates total calls, duration, and status counts
    - Handles both caller and receiver statistics
    - Automatically calculates average duration
*/

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

-- Create trigger for call_history if it doesn't exist
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
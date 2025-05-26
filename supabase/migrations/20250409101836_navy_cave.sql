/*
  # Fix profile creation RLS policies

  1. Changes
    - Add RLS policy to allow users to create their own profile during signup
    - Ensure policy checks that user_id matches authenticated user's id
    - Add policy for profile updates

  2. Security
    - Enable RLS on profiles table (already enabled)
    - Add policy for profile creation during signup
    - Maintain existing policies for profile updates and viewing
*/

-- Add policy to allow users to create their own profile
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND
  user_type IN ('project_owner', 'project_seeker', 'investor')
);
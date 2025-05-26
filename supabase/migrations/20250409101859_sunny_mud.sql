/*
  # Update profiles table RLS policies

  1. Security Changes
    - Modify RLS policies to allow new users to create their own profiles
    - Ensure users can only update their own profiles
  
  2. Changes
    - Add policy for inserting profiles during signup
    - Maintain existing policies for profile updates and viewing
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Update the policy for inserting profiles
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create update policy
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Create select policy
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);
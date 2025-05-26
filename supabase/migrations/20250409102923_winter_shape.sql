/*
  # Allow profile creation during signup

  1. Security
    - Update RLS policies for profiles table to allow new users to create their profile during signup
    - Ensure users can only create/update their own profile
    - Allow all authenticated users to view profiles

  This migration fixes the "new row violates row-level security policy for table profiles" error
  that occurs during signup.
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create policy for inserting profiles
-- This allows users to create their own profile during signup
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
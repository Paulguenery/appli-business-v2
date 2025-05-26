/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop the trigger-based approach which is causing conflicts
    - Simplify RLS policies to ensure proper access control
    - Fix the policy for profile creation during signup

  2. Security
    - Maintain RLS on profiles table
    - Ensure users can only create/update their own profiles
    - Allow authenticated users to view all profiles
*/

-- First, drop the trigger-based approach as it's causing conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a simplified policy for inserting profiles
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
/*
  # Create auth trigger for profiles

  1. New Trigger
    - Create a trigger to automatically insert a profile when a new user is created
    - This bypasses RLS for the profiles table during user creation
  
  2. Security
    - Ensures profiles are created with the correct user_id
    - Maintains data integrity between auth.users and profiles
*/

-- Create a function that will be triggered after a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, user_type)
  VALUES (new.id, 
          COALESCE(new.raw_user_meta_data->>'user_type', 'project_seeker'),
          COALESCE(new.raw_user_meta_data->>'user_type', 'project_seeker'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function after a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
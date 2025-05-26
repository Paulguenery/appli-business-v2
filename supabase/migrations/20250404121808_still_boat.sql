/*
  # Create profiles and projects tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (text)
      - `full_name` (text)
      - `city` (text)
      - `bio` (text)
      - `skills` (text[])
      - `experience_level` (text)
      - `portfolio_url` (text)
      - `company_name` (text)
      - `collaboration_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `required_skills` (text[])
      - `collaboration_type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL,
  full_name text,
  city text,
  bio text,
  skills text[],
  experience_level text,
  portfolio_url text,
  company_name text,
  collaboration_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  required_skills text[],
  collaboration_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project owners can update their projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ))
  WITH CHECK (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Project owners can delete their projects"
  ON projects FOR DELETE
  TO authenticated
  USING (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Project owners can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (owner_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));
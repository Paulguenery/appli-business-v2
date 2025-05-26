/*
  # Add sample data for testing

  1. Sample Data
    - Create auth.users first
    - Project owners with profiles
    - Project seekers with profiles
    - Sample projects
    - Initial matches and ratings

  2. Location
    - All data centered around Paris
    - Using real coordinates and districts
*/

-- First, create users in auth.users table
DO $$
DECLARE
  owner1_id uuid := '11111111-1111-1111-1111-111111111111';
  owner2_id uuid := '22222222-2222-2222-2222-222222222222';
  seeker1_id uuid := '33333333-3333-3333-3333-333333333333';
  seeker2_id uuid := '44444444-4444-4444-4444-444444444444';
  seeker3_id uuid := '55555555-5555-5555-5555-555555555555';
BEGIN
  -- Create users in auth.users
  INSERT INTO auth.users (id, email)
  VALUES 
    (owner1_id, 'sophie.martin@example.com'),
    (owner2_id, 'thomas.dubois@example.com'),
    (seeker1_id, 'lucas.bernard@example.com'),
    (seeker2_id, 'emma.petit@example.com'),
    (seeker3_id, 'antoine.leroy@example.com');

  -- Insert project owners
  INSERT INTO profiles (
    id, user_id, role, user_type, full_name, city, bio, skills, sectors,
    objectives, experience_level, availability, company_name, collaboration_type,
    latitude, longitude, is_verified, subscription_status
  ) VALUES
    (
      owner1_id,
      owner1_id,
      'project_owner',
      'project_owner',
      'Sophie Martin',
      'Paris',
      'Fondatrice d''une startup EdTech en pleine croissance. Nous développons une plateforme d''apprentissage innovante basée sur l''IA.',
      ARRAY['Gestion de projet', 'Product Management', 'Business Development', 'EdTech'],
      ARRAY['Education', 'Technology', 'AI/ML'],
      ARRAY['Trouver des collaborateurs', 'Développer mon réseau'],
      'senior',
      'Temps plein',
      'EduTech Solutions',
      'Temps plein',
      48.8566,
      2.3522,
      true,
      'premium'
    ),
    (
      owner2_id,
      owner2_id,
      'project_owner',
      'project_owner',
      'Thomas Dubois',
      'Paris',
      'Entrepreneur dans la GreenTech. Nous développons des solutions innovantes pour réduire l''empreinte carbone des entreprises.',
      ARRAY['Sustainability', 'Business Strategy', 'Environmental Science', 'Project Management'],
      ARRAY['Sustainability', 'Technology'],
      ARRAY['Trouver des collaborateurs', 'Obtenir des financements'],
      'expert',
      'Temps plein',
      'GreenTech Innovation',
      'Temps plein',
      48.8737,
      2.2950,
      true,
      'premium'
    );

  -- Insert project seekers
  INSERT INTO profiles (
    id, user_id, role, user_type, full_name, city, bio, skills, sectors,
    objectives, experience_level, availability, collaboration_type,
    latitude, longitude, is_verified, subscription_status
  ) VALUES
    (
      seeker1_id,
      seeker1_id,
      'project_seeker',
      'project_seeker',
      'Lucas Bernard',
      'Paris',
      'Développeur Full Stack passionné avec 5 ans d''expérience. Spécialisé en React, Node.js et architecture cloud.',
      ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL'],
      ARRAY['Technology', 'AI/ML'],
      ARRAY['Rejoindre un projet', 'Apprendre'],
      'senior',
      'Temps plein',
      'Temps plein',
      48.8584,
      2.2945,
      true,
      'standard'
    ),
    (
      seeker2_id,
      seeker2_id,
      'project_seeker',
      'project_seeker',
      'Emma Petit',
      'Paris',
      'Designer UX/UI avec expertise en design systems et accessibilité. 3 ans d''expérience dans les startups tech.',
      ARRAY['UI Design', 'UX Research', 'Figma', 'Design Systems', 'Prototyping'],
      ARRAY['Technology', 'E-commerce'],
      ARRAY['Rejoindre un projet', 'Partager mes compétences'],
      'intermediaire',
      'Temps partiel',
      'Freelance',
      48.8661,
      2.3522,
      false,
      'freemium'
    ),
    (
      seeker3_id,
      seeker3_id,
      'project_seeker',
      'project_seeker',
      'Antoine Leroy',
      'Paris',
      'Data Scientist spécialisé en ML et NLP. Passionné par l''IA éthique et l''innovation responsable.',
      ARRAY['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'Data Analysis'],
      ARRAY['AI/ML', 'Technology'],
      ARRAY['Rejoindre un projet', 'Développer mon réseau'],
      'senior',
      'Temps plein',
      'Temps plein',
      48.8747,
      2.3504,
      true,
      'premium'
    );

  -- Insert sample projects
  INSERT INTO projects (
    id, owner_id, title, description, category, required_skills,
    collaboration_type, latitude, longitude
  ) VALUES
    (
      '66666666-6666-6666-6666-666666666666',
      owner1_id,
      'Plateforme d''apprentissage adaptatif',
      'Nous recherchons des développeurs et designers talentueux pour créer une plateforme d''apprentissage innovante utilisant l''IA pour personnaliser les parcours d''apprentissage.',
      'Education',
      ARRAY['React', 'Node.js', 'Machine Learning', 'UI/UX Design'],
      'Temps plein',
      48.8566,
      2.3522
    ),
    (
      '77777777-7777-7777-7777-777777777777',
      owner2_id,
      'Application de suivi carbone',
      'Développement d''une application mobile permettant aux entreprises de suivre et réduire leur empreinte carbone en temps réel.',
      'Sustainability',
      ARRAY['React Native', 'Node.js', 'Data Analysis', 'UI/UX Design'],
      'Temps plein',
      48.8737,
      2.2950
    );

  -- Insert project interests
  INSERT INTO project_interest_links (project_id, interest_id)
  SELECT 
    '66666666-6666-6666-6666-666666666666',
    id
  FROM project_interests 
  WHERE name IN ('Education', 'AI/ML', 'Technology');

  INSERT INTO project_interest_links (project_id, interest_id)
  SELECT 
    '77777777-7777-7777-7777-777777777777',
    id
  FROM project_interests 
  WHERE name IN ('Sustainability', 'Mobile Apps', 'Technology');

  -- Insert matches
  INSERT INTO project_matches (
    project_id, seeker_id, status
  ) VALUES
    (
      '66666666-6666-6666-6666-666666666666',
      seeker1_id,
      'pending'
    ),
    (
      '77777777-7777-7777-7777-777777777777',
      seeker3_id,
      'accepted'
    );

  -- Insert ratings
  INSERT INTO user_ratings (
    rater_id, rated_id, project_id,
    communication_score, reliability_score, skills_score, timeliness_score,
    comment, is_public
  ) VALUES
    (
      owner1_id,
      seeker1_id,
      '66666666-6666-6666-6666-666666666666',
      5, 4, 5, 4,
      'Excellent développeur, très professionnel et proactif',
      true
    ),
    (
      owner2_id,
      seeker3_id,
      '77777777-7777-7777-7777-777777777777',
      5, 5, 5, 4,
      'Data scientist exceptionnel, a fourni des insights précieux',
      true
    );
END $$;
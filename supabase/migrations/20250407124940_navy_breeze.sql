/*
  # Add more sample profiles in Paris

  1. New Data
    - Additional project owners
    - Additional project seekers
    - Additional projects
    - Sample matches and ratings

  2. Location
    - All profiles centered around different Paris districts
    - Using real coordinates for different arrondissements
*/

DO $$
DECLARE
  owner3_id uuid := 'aaaaaaaa-1111-2222-3333-444444444444';
  owner4_id uuid := 'bbbbbbbb-2222-3333-4444-555555555555';
  seeker4_id uuid := 'cccccccc-3333-4444-5555-666666666666';
  seeker5_id uuid := 'dddddddd-4444-5555-6666-777777777777';
  seeker6_id uuid := 'eeeeeeee-5555-6666-7777-888888888888';
BEGIN
  -- Create additional users in auth.users
  INSERT INTO auth.users (id, email)
  VALUES 
    (owner3_id, 'marie.laurent@example.com'),
    (owner4_id, 'pierre.durand@example.com'),
    (seeker4_id, 'julie.moreau@example.com'),
    (seeker5_id, 'david.rousseau@example.com'),
    (seeker6_id, 'claire.lefebvre@example.com');

  -- Insert additional project owners
  INSERT INTO profiles (
    id, user_id, role, user_type, full_name, city, bio, skills, sectors,
    objectives, experience_level, availability, company_name, collaboration_type,
    latitude, longitude, is_verified, subscription_status
  ) VALUES
    (
      owner3_id,
      owner3_id,
      'project_owner',
      'project_owner',
      'Marie Laurent',
      'Paris',
      'Fondatrice d''une startup FinTech innovante. Nous développons une solution de paiement nouvelle génération basée sur la blockchain.',
      ARRAY['Finance', 'Blockchain', 'Product Strategy', 'Team Management'],
      ARRAY['Finance', 'Technology', 'Blockchain'],
      ARRAY['Trouver des collaborateurs', 'Lever des fonds'],
      'expert',
      'Temps plein',
      'NextPay Solutions',
      'Temps plein',
      48.8711, -- 9ème arrondissement
      2.3378,
      true,
      'premium'
    ),
    (
      owner4_id,
      owner4_id,
      'project_owner',
      'project_owner',
      'Pierre Durand',
      'Paris',
      'Entrepreneur dans l''e-commerce. Création d''une marketplace spécialisée dans les produits artisanaux français.',
      ARRAY['E-commerce', 'Digital Marketing', 'Business Development', 'Supply Chain'],
      ARRAY['E-commerce', 'Retail'],
      ARRAY['Trouver des collaborateurs', 'Développer le réseau'],
      'senior',
      'Temps plein',
      'Artisans Connect',
      'Temps plein',
      48.8546, -- 15ème arrondissement
      2.2854,
      true,
      'standard'
    );

  -- Insert additional project seekers
  INSERT INTO profiles (
    id, user_id, role, user_type, full_name, city, bio, skills, sectors,
    objectives, experience_level, availability, collaboration_type,
    latitude, longitude, is_verified, subscription_status
  ) VALUES
    (
      seeker4_id,
      seeker4_id,
      'project_seeker',
      'project_seeker',
      'Julie Moreau',
      'Paris',
      'Product Manager expérimentée avec une passion pour l''UX. 6 ans d''expérience dans les produits B2B SaaS.',
      ARRAY['Product Management', 'UX Design', 'Agile', 'Data Analysis', 'User Research'],
      ARRAY['Technology', 'SaaS'],
      ARRAY['Rejoindre un projet innovant', 'Développer des produits impactants'],
      'senior',
      'Temps plein',
      'Temps plein',
      48.8872, -- 18ème arrondissement
      2.3435,
      true,
      'premium'
    ),
    (
      seeker5_id,
      seeker5_id,
      'project_seeker',
      'project_seeker',
      'David Rousseau',
      'Paris',
      'Développeur Backend spécialisé en architecture cloud et microservices. Expert en performance et scalabilité.',
      ARRAY['Java', 'Spring Boot', 'Kubernetes', 'AWS', 'Microservices'],
      ARRAY['Technology', 'Cloud'],
      ARRAY['Rejoindre une startup innovante', 'Construire des systèmes scalables'],
      'expert',
      'Temps plein',
      'Temps plein',
      48.8502, -- 14ème arrondissement
      2.3288,
      false,
      'freemium'
    ),
    (
      seeker6_id,
      seeker6_id,
      'project_seeker',
      'project_seeker',
      'Claire Lefebvre',
      'Paris',
      'Growth Marketer avec expertise en acquisition et rétention client. Spécialisation dans les startups B2C.',
      ARRAY['Growth Marketing', 'SEO', 'Analytics', 'CRM', 'Marketing Automation'],
      ARRAY['Marketing', 'E-commerce'],
      ARRAY['Rejoindre une équipe dynamique', 'Développer la croissance'],
      'senior',
      'Temps plein',
      'Temps plein',
      48.8738, -- 10ème arrondissement
      2.3585,
      true,
      'standard'
    );

  -- Insert additional projects
  INSERT INTO projects (
    id, owner_id, title, description, category, required_skills,
    collaboration_type, latitude, longitude
  ) VALUES
    (
      '88888888-8888-8888-8888-888888888888',
      owner3_id,
      'Plateforme de paiement blockchain',
      'Recherche de développeurs blockchain et backend pour créer une solution de paiement innovante utilisant la technologie blockchain.',
      'Finance',
      ARRAY['Blockchain', 'Smart Contracts', 'Node.js', 'Security'],
      'Temps plein',
      48.8711,
      2.3378
    ),
    (
      '99999999-9999-9999-9999-999999999999',
      owner4_id,
      'Marketplace artisanale',
      'Développement d''une plateforme e-commerce mettant en relation artisans français et consommateurs.',
      'E-commerce',
      ARRAY['React', 'Node.js', 'E-commerce', 'UI/UX Design'],
      'Temps plein',
      48.8546,
      2.2854
    );

  -- Insert project interests for new projects
  INSERT INTO project_interest_links (project_id, interest_id)
  SELECT 
    '88888888-8888-8888-8888-888888888888',
    id
  FROM project_interests 
  WHERE name IN ('Finance', 'Blockchain', 'Technology');

  INSERT INTO project_interest_links (project_id, interest_id)
  SELECT 
    '99999999-9999-9999-9999-999999999999',
    id
  FROM project_interests 
  WHERE name IN ('E-commerce', 'Mobile Apps', 'Technology');

  -- Insert additional matches
  INSERT INTO project_matches (
    project_id, seeker_id, status
  ) VALUES
    (
      '88888888-8888-8888-8888-888888888888',
      seeker5_id,
      'pending'
    ),
    (
      '99999999-9999-9999-9999-999999999999',
      seeker6_id,
      'accepted'
    );

  -- Insert additional ratings
  INSERT INTO user_ratings (
    rater_id, rated_id, project_id,
    communication_score, reliability_score, skills_score, timeliness_score,
    comment, is_public
  ) VALUES
    (
      owner3_id,
      seeker4_id,
      '88888888-8888-8888-8888-888888888888',
      5, 5, 5, 4,
      'Excellente Product Manager, vision stratégique et exécution parfaite',
      true
    ),
    (
      owner4_id,
      seeker6_id,
      '99999999-9999-9999-9999-999999999999',
      4, 5, 5, 5,
      'Growth Marketer très compétente, a significativement amélioré notre acquisition',
      true
    );
END $$;
DO $$
DECLARE
  owner5_id uuid := gen_random_uuid();
  owner6_id uuid := gen_random_uuid();
  seeker7_id uuid := gen_random_uuid();
  seeker8_id uuid := gen_random_uuid();
  seeker9_id uuid := gen_random_uuid();
BEGIN
  -- Create additional users in auth.users
  INSERT INTO auth.users (id, email)
  VALUES 
    (owner5_id, 'alice.dupont@example.com'),
    (owner6_id, 'marc.lambert@example.com'),
    (seeker7_id, 'sarah.bernard@example.com'),
    (seeker8_id, 'hugo.martin@example.com'),
    (seeker9_id, 'lea.dubois@example.com');

  -- Insert additional project owners
  INSERT INTO profiles (
    id, user_id, role, user_type, full_name, city, bio, skills, sectors,
    objectives, experience_level, availability, company_name, collaboration_type,
    latitude, longitude, is_verified, subscription_status
  ) VALUES
    (
      owner5_id,
      owner5_id,
      'project_owner',
      'project_owner',
      'Alice Dupont',
      'Paris',
      'Fondatrice d''une startup HealthTech développant une solution de télémédecine nouvelle génération avec IA pour le diagnostic précoce.',
      ARRAY['Healthcare', 'AI/ML', 'Product Management', 'Business Development'],
      ARRAY['Healthcare', 'Technology', 'AI/ML'],
      ARRAY['Trouver des collaborateurs', 'Développer des partenariats'],
      'senior',
      'Temps plein',
      'HealthAI Solutions',
      'Temps plein',
      48.8417, -- 13ème arrondissement
      2.3488,
      true,
      'premium'
    ),
    (
      owner6_id,
      owner6_id,
      'project_owner',
      'project_owner',
      'Marc Lambert',
      'Paris',
      'Entrepreneur dans l''AgriTech. Développement d''une plateforme IoT pour l''agriculture urbaine et la gestion intelligente des ressources.',
      ARRAY['IoT', 'Agriculture', 'Sustainability', 'Hardware'],
      ARRAY['AgriTech', 'IoT', 'Sustainability'],
      ARRAY['Trouver des collaborateurs', 'Lever des fonds'],
      'expert',
      'Temps plein',
      'Urban Farming Tech',
      'Temps plein',
      48.8925, -- 17ème arrondissement
      2.3153,
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
      seeker7_id,
      seeker7_id,
      'project_seeker',
      'project_seeker',
      'Sarah Bernard',
      'Paris',
      'Architecte Cloud & DevOps avec expertise en infrastructure as code et automatisation. Passionnée par les architectures serverless.',
      ARRAY['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Docker'],
      ARRAY['Technology', 'Cloud'],
      ARRAY['Rejoindre un projet innovant', 'Construire des infrastructures scalables'],
      'senior',
      'Temps plein',
      'Temps plein',
      48.8649, -- 11ème arrondissement
      2.3798,
      true,
      'premium'
    ),
    (
      seeker8_id,
      seeker8_id,
      'project_seeker',
      'project_seeker',
      'Hugo Martin',
      'Paris',
      'Expert en cybersécurité spécialisé dans la sécurité des applications web et blockchain. 7 ans d''expérience en audit et pentesting.',
      ARRAY['Security', 'Blockchain', 'Pentesting', 'Smart Contracts', 'Web Security'],
      ARRAY['Security', 'Blockchain'],
      ARRAY['Rejoindre une startup innovante', 'Renforcer la sécurité'],
      'expert',
      'Temps plein',
      'Temps plein',
      48.8843, -- 19ème arrondissement
      2.3838,
      true,
      'standard'
    ),
    (
      seeker9_id,
      seeker9_id,
      'project_seeker',
      'project_seeker',
      'Léa Dubois',
      'Paris',
      'Designer d''expérience produit spécialisée en accessibilité et design inclusif. Forte expérience en recherche utilisateur et prototypage.',
      ARRAY['Product Design', 'Accessibility', 'User Research', 'Design Systems', 'Prototyping'],
      ARRAY['Design', 'Technology'],
      ARRAY['Rejoindre une équipe engagée', 'Créer des produits inclusifs'],
      'senior',
      'Temps plein',
      'Temps plein',
      48.8736, -- 20ème arrondissement
      2.3985,
      false,
      'freemium'
    );

  -- Insert additional projects
  INSERT INTO projects (
    id, owner_id, title, description, category, required_skills,
    collaboration_type, latitude, longitude
  ) VALUES
    (
      gen_random_uuid(),
      owner5_id,
      'Plateforme de télémédecine IA',
      'Développement d''une solution innovante de télémédecine utilisant l''IA pour améliorer le diagnostic et le suivi des patients.',
      'Healthcare',
      ARRAY['Machine Learning', 'Python', 'React', 'Healthcare'],
      'Temps plein',
      48.8417,
      2.3488
    ),
    (
      gen_random_uuid(),
      owner6_id,
      'Système IoT pour agriculture urbaine',
      'Création d''une solution IoT complète pour optimiser la gestion des cultures urbaines et la consommation des ressources.',
      'AgriTech',
      ARRAY['IoT', 'Hardware', 'Full Stack', 'Data Analysis'],
      'Temps plein',
      48.8925,
      2.3153
    );

  -- Insert project interests for new projects
  INSERT INTO project_interest_links (project_id, interest_id)
  SELECT 
    p.id,
    i.id
  FROM projects p
  CROSS JOIN project_interests i
  WHERE p.owner_id = owner5_id
  AND i.name IN ('Healthcare', 'AI/ML', 'Technology');

  INSERT INTO project_interest_links (project_id, interest_id)
  SELECT 
    p.id,
    i.id
  FROM projects p
  CROSS JOIN project_interests i
  WHERE p.owner_id = owner6_id
  AND i.name IN ('Mobile Apps', 'Technology', 'Sustainability');

  -- Insert additional matches
  INSERT INTO project_matches (
    project_id, seeker_id, status
  )
  SELECT 
    p.id,
    seeker7_id,
    'accepted'
  FROM projects p
  WHERE p.owner_id = owner5_id;

  INSERT INTO project_matches (
    project_id, seeker_id, status
  )
  SELECT 
    p.id,
    seeker8_id,
    'pending'
  FROM projects p
  WHERE p.owner_id = owner6_id;

  -- Insert additional ratings
  INSERT INTO user_ratings (
    rater_id, rated_id, project_id,
    communication_score, reliability_score, skills_score, timeliness_score,
    comment, is_public
  )
  SELECT 
    owner5_id,
    seeker7_id,
    p.id,
    5, 5, 5, 5,
    'Excellente architecte cloud, a mis en place une infrastructure robuste et scalable',
    true
  FROM projects p
  WHERE p.owner_id = owner5_id;

  INSERT INTO user_ratings (
    rater_id, rated_id, project_id,
    communication_score, reliability_score, skills_score, timeliness_score,
    comment, is_public
  )
  SELECT 
    owner6_id,
    seeker8_id,
    p.id,
    5, 4, 5, 4,
    'Expert en sécurité très compétent, a grandement renforcé la sécurité de notre plateforme',
    true
  FROM projects p
  WHERE p.owner_id = owner6_id;
END $$;
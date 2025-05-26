-- Add more French cities
INSERT INTO cities (name, department, postal_code, latitude, longitude)
VALUES 
  -- Major cities
  ('Paris', 'Paris', '75002', 48.8566, 2.3522),
  ('Lyon', 'Rhône', '69002', 45.7578, 4.8320),
  ('Marseille', 'Bouches-du-Rhône', '13002', 43.2965, 5.3698),
  ('Bordeaux', 'Gironde', '33001', 44.8378, -0.5792),
  ('Lille', 'Nord', '59001', 50.6292, 3.0573),
  ('Toulouse', 'Haute-Garonne', '31001', 43.6047, 1.4442),
  ('Nantes', 'Loire-Atlantique', '44001', 47.2184, -1.5536),
  ('Strasbourg', 'Bas-Rhin', '67001', 48.5734, 7.7521),
  ('Montpellier', 'Hérault', '34001', 43.6108, 3.8767),
  ('Rennes', 'Ille-et-Vilaine', '35001', 48.1173, -1.6778),
  
  -- Medium-sized cities
  ('Grenoble', 'Isère', '38001', 45.1885, 5.7245),
  ('Angers', 'Maine-et-Loire', '49001', 47.4784, -0.5632),
  ('Dijon', 'Côte-d''Or', '21001', 47.3220, 5.0415),
  ('Le Havre', 'Seine-Maritime', '76601', 49.4944, 0.1079),
  ('Saint-Étienne', 'Loire', '42001', 45.4397, 4.3872),
  ('Toulon', 'Var', '83001', 43.1242, 5.9280),
  ('Annecy', 'Haute-Savoie', '74001', 45.8992, 6.1294),
  ('Biarritz', 'Pyrénées-Atlantiques', '64201', 43.4832, -1.5586),
  ('Cannes', 'Alpes-Maritimes', '06401', 43.5528, 7.0174),
  ('La Rochelle', 'Charente-Maritime', '17001', 46.1591, -1.1520),
  ('Aix-en-Provence', 'Bouches-du-Rhône', '13101', 43.5297, 5.4474),
  ('Reims', 'Marne', '51101', 49.2583, 4.0317),
  ('Avignon', 'Vaucluse', '84001', 43.9493, 4.8055),
  ('Caen', 'Calvados', '14001', 49.1829, -0.3707),
  ('Nancy', 'Meurthe-et-Moselle', '54001', 48.6921, 6.1844),
  ('Tours', 'Indre-et-Loire', '37001', 47.3941, 0.6848),
  ('Orléans', 'Loiret', '45001', 47.9029, 1.9039),
  ('Mulhouse', 'Haut-Rhin', '68101', 47.7508, 7.3359),
  ('Rouen', 'Seine-Maritime', '76001', 49.4431, 1.0993),
  ('Metz', 'Moselle', '57001', 49.1193, 6.1757),
  
  -- Smaller cities and towns
  ('Perpignan', 'Pyrénées-Orientales', '66001', 42.6986, 2.8956),
  ('Besançon', 'Doubs', '25001', 47.2378, 6.0240),
  ('Limoges', 'Haute-Vienne', '87001', 45.8315, 1.2578),
  ('Nîmes', 'Gard', '30001', 43.8367, 4.3601),
  ('Amiens', 'Somme', '80001', 49.8942, 2.2957),
  ('Bayonne', 'Pyrénées-Atlantiques', '64101', 43.4933, -1.4748),
  ('Pau', 'Pyrénées-Atlantiques', '64001', 43.2951, -0.3708),
  ('Chambéry', 'Savoie', '73001', 45.5667, 5.9333),
  ('La Roche-sur-Yon', 'Vendée', '85001', 46.6705, -1.4269),
  ('Troyes', 'Aube', '10001', 48.2973, 4.0744),
  ('Lorient', 'Morbihan', '56101', 47.7486, -3.3701),
  ('Saint-Malo', 'Ille-et-Vilaine', '35401', 48.6493, -2.0135),
  ('Angoulême', 'Charente', '16001', 45.6494, 0.1563),
  ('Valence', 'Drôme', '26001', 44.9333, 4.8922),
  ('Montauban', 'Tarn-et-Garonne', '82001', 44.0221, 1.3529),
  ('Niort', 'Deux-Sèvres', '79001', 46.3239, -0.4661),
  ('Chamonix-Mont-Blanc', 'Haute-Savoie', '74401', 45.9237, 6.8694),
  ('Colmar', 'Haut-Rhin', '68001', 48.0794, 7.3585),
  ('Vannes', 'Morbihan', '56001', 47.6586, -2.7599),
  ('Fréjus', 'Var', '83601', 43.4332, 6.7370)
ON CONFLICT (postal_code, name) DO NOTHING;

-- Add sample profiles and projects in these cities
DO $$
DECLARE
  city_record RECORD;
  new_user_id uuid;
  new_profile_id uuid;
  sectors text[];
  skills text[];
  user_types text[] := ARRAY['project_owner', 'project_seeker', 'investor'];
  user_type text;
  city_count integer := 0;
  project_id uuid;
  project_title text;
  project_description text;
  project_category text;
  collaboration_type text;
  experience_level text;
  unique_email text;
BEGIN
  -- Loop through cities to create profiles in different locations
  FOR city_record IN SELECT * FROM cities LIMIT 50 LOOP
    city_count := city_count + 1;
    
    -- Create only 1 profile per city to avoid too many
    -- Alternate between user types
    user_type := user_types[(city_count % 3) + 1];
    
    -- Generate sectors based on user type
    IF user_type = 'project_owner' THEN
      sectors := ARRAY['🧠 Technologie & Numérique', '📱 Communication & Marketing', '🛒 Commerce & Distribution'];
      skills := ARRAY['Gestion de projet', 'Business Development', 'Marketing', 'UI/UX Design'];
    ELSIF user_type = 'project_seeker' THEN
      sectors := ARRAY['🧠 Technologie & Numérique', '🎨 Création & Culture', '📱 Communication & Marketing'];
      skills := ARRAY['Développement web', 'UI/UX Design', 'React', 'Node.js'];
    ELSE -- investor
      sectors := ARRAY['🧠 Technologie & Numérique', '💼 Business & Finances', '🏥 Santé & Bien-être'];
      skills := ARRAY['Analyse financière', 'Due Diligence', 'Stratégie'];
    END IF;
    
    -- Create a unique email to avoid conflicts
    unique_email := 'user_' || city_record.postal_code || '_' || city_count || '@example.com';
    
    -- Create user
    new_user_id := gen_random_uuid();
    
    -- Insert into auth.users with a try-catch block to handle potential duplicates
    BEGIN
      INSERT INTO auth.users (id, email)
      VALUES (new_user_id, unique_email);
      
      -- Create profile
      new_profile_id := gen_random_uuid();
      INSERT INTO profiles (
        id, 
        user_id, 
        role, 
        user_type, 
        full_name, 
        city, 
        bio, 
        skills, 
        sectors,
        experience_level, 
        availability, 
        latitude, 
        longitude, 
        is_verified
      ) VALUES (
        new_profile_id,
        new_user_id,
        user_type,
        user_type,
        'Utilisateur ' || city_record.name,
        city_record.name,
        'Professionnel basé à ' || city_record.name || ' dans le secteur ' || sectors[1],
        skills,
        sectors,
        CASE WHEN city_count % 3 = 0 THEN 'senior' WHEN city_count % 3 = 1 THEN 'intermediaire' ELSE 'junior' END,
        CASE WHEN city_count % 2 = 0 THEN 'Temps plein' ELSE 'Temps partiel' END,
        city_record.latitude,
        city_record.longitude,
        city_count % 5 = 0 -- Every 5th profile is verified
      );
      
      -- Create a project if user is project owner
      IF user_type = 'project_owner' THEN
        -- Generate project details
        project_id := gen_random_uuid();
        
        -- Vary project titles and descriptions based on city
        IF city_count % 5 = 0 THEN
          project_title := 'Startup Tech à ' || city_record.name;
          project_description := 'Développement d''une application innovante dans le domaine de la tech à ' || city_record.name;
          project_category := '🧠 Technologie & Numérique';
        ELSIF city_count % 5 = 1 THEN
          project_title := 'E-commerce local à ' || city_record.name;
          project_description := 'Création d''une plateforme de vente en ligne pour les produits locaux de ' || city_record.name;
          project_category := '🛒 Commerce & Distribution';
        ELSIF city_count % 5 = 2 THEN
          project_title := 'Agence marketing à ' || city_record.name;
          project_description := 'Lancement d''une agence de marketing digital spécialisée dans la région de ' || city_record.name;
          project_category := '📱 Communication & Marketing';
        ELSIF city_count % 5 = 3 THEN
          project_title := 'Projet écologique à ' || city_record.name;
          project_description := 'Initiative environnementale visant à améliorer la durabilité à ' || city_record.name;
          project_category := '🌿 Écologie & Impact';
        ELSE
          project_title := 'Startup EdTech à ' || city_record.name;
          project_description := 'Développement d''une solution éducative innovante basée à ' || city_record.name;
          project_category := '📚 Éducation & Formation';
        END IF;
        
        -- Set collaboration type and experience level
        collaboration_type := CASE WHEN city_count % 2 = 0 THEN 'Temps plein' ELSE 'Temps partiel' END;
        experience_level := CASE 
          WHEN city_count % 3 = 0 THEN 'experienced' 
          WHEN city_count % 3 = 1 THEN 'beginner' 
          ELSE 'any' 
        END;
        
        -- Insert project
        INSERT INTO projects (
          id,
          owner_id,
          title,
          brief_description,
          category,
          required_skills,
          collaboration_type,
          experience_level,
          latitude,
          longitude
        ) VALUES (
          project_id,
          new_profile_id,
          project_title,
          project_description,
          project_category,
          skills,
          collaboration_type,
          experience_level,
          city_record.latitude,
          city_record.longitude
        );
      END IF;
    EXCEPTION
      WHEN others THEN
        -- Skip this user if there's an error (like duplicate email)
        CONTINUE;
    END;
  END LOOP;
END $$;
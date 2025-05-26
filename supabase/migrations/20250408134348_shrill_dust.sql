/*
  # Add more French cities to the database
  
  1. Changes
    - Add 50+ additional French cities with accurate coordinates
    - Include cities from various regions and departments
    - Add cities of different sizes (large, medium, small)
    - Create sample profiles and projects with unique emails
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add more French cities
INSERT INTO cities (name, department, postal_code, latitude, longitude)
VALUES 
  -- Major cities
  ('Paris', 'Paris', '75001', 48.8566, 2.3522),
  ('Lyon', 'Rhône', '69001', 45.7578, 4.8320),
  ('Marseille', 'Bouches-du-Rhône', '13001', 43.2965, 5.3698),
  ('Bordeaux', 'Gironde', '33000', 44.8378, -0.5792),
  ('Lille', 'Nord', '59000', 50.6292, 3.0573),
  ('Toulouse', 'Haute-Garonne', '31000', 43.6047, 1.4442),
  ('Nantes', 'Loire-Atlantique', '44000', 47.2184, -1.5536),
  ('Strasbourg', 'Bas-Rhin', '67000', 48.5734, 7.7521),
  ('Montpellier', 'Hérault', '34000', 43.6108, 3.8767),
  ('Rennes', 'Ille-et-Vilaine', '35000', 48.1173, -1.6778),
  
  -- Medium-sized cities
  ('Grenoble', 'Isère', '38000', 45.1885, 5.7245),
  ('Angers', 'Maine-et-Loire', '49000', 47.4784, -0.5632),
  ('Dijon', 'Côte-d''Or', '21000', 47.3220, 5.0415),
  ('Le Havre', 'Seine-Maritime', '76600', 49.4944, 0.1079),
  ('Saint-Étienne', 'Loire', '42000', 45.4397, 4.3872),
  ('Toulon', 'Var', '83000', 43.1242, 5.9280),
  ('Annecy', 'Haute-Savoie', '74000', 45.8992, 6.1294),
  ('Biarritz', 'Pyrénées-Atlantiques', '64200', 43.4832, -1.5586),
  ('Cannes', 'Alpes-Maritimes', '06400', 43.5528, 7.0174),
  ('La Rochelle', 'Charente-Maritime', '17000', 46.1591, -1.1520),
  ('Aix-en-Provence', 'Bouches-du-Rhône', '13100', 43.5297, 5.4474),
  ('Reims', 'Marne', '51100', 49.2583, 4.0317),
  ('Avignon', 'Vaucluse', '84000', 43.9493, 4.8055),
  ('Caen', 'Calvados', '14000', 49.1829, -0.3707),
  ('Nancy', 'Meurthe-et-Moselle', '54000', 48.6921, 6.1844),
  ('Tours', 'Indre-et-Loire', '37000', 47.3941, 0.6848),
  ('Orléans', 'Loiret', '45000', 47.9029, 1.9039),
  ('Mulhouse', 'Haut-Rhin', '68100', 47.7508, 7.3359),
  ('Rouen', 'Seine-Maritime', '76000', 49.4431, 1.0993),
  ('Metz', 'Moselle', '57000', 49.1193, 6.1757),
  
  -- Smaller cities and towns
  ('Perpignan', 'Pyrénées-Orientales', '66000', 42.6986, 2.8956),
  ('Besançon', 'Doubs', '25000', 47.2378, 6.0240),
  ('Limoges', 'Haute-Vienne', '87000', 45.8315, 1.2578),
  ('Nîmes', 'Gard', '30000', 43.8367, 4.3601),
  ('Amiens', 'Somme', '80000', 49.8942, 2.2957),
  ('Bayonne', 'Pyrénées-Atlantiques', '64100', 43.4933, -1.4748),
  ('Pau', 'Pyrénées-Atlantiques', '64000', 43.2951, -0.3708),
  ('Chambéry', 'Savoie', '73000', 45.5667, 5.9333),
  ('La Roche-sur-Yon', 'Vendée', '85000', 46.6705, -1.4269),
  ('Troyes', 'Aube', '10000', 48.2973, 4.0744),
  ('Lorient', 'Morbihan', '56100', 47.7486, -3.3701),
  ('Saint-Malo', 'Ille-et-Vilaine', '35400', 48.6493, -2.0135),
  ('Angoulême', 'Charente', '16000', 45.6494, 0.1563),
  ('Valence', 'Drôme', '26000', 44.9333, 4.8922),
  ('Montauban', 'Tarn-et-Garonne', '82000', 44.0221, 1.3529),
  ('Niort', 'Deux-Sèvres', '79000', 46.3239, -0.4661),
  ('Chamonix-Mont-Blanc', 'Haute-Savoie', '74400', 45.9237, 6.8694),
  ('Colmar', 'Haut-Rhin', '68000', 48.0794, 7.3585),
  ('Vannes', 'Morbihan', '56000', 47.6586, -2.7599),
  ('Fréjus', 'Var', '83600', 43.4332, 6.7370),
  
  -- Tourist destinations and smaller towns
  ('Carcassonne', 'Aude', '11000', 43.2130, 2.3491),
  ('Deauville', 'Calvados', '14800', 49.3601, 0.0750),
  ('Arcachon', 'Gironde', '33120', 44.6523, -1.1677),
  ('Cassis', 'Bouches-du-Rhône', '13260', 43.2140, 5.5370),
  ('Honfleur', 'Calvados', '14600', 49.4186, 0.2329),
  ('Sarlat-la-Canéda', 'Dordogne', '24200', 44.8908, 1.2161),
  ('Bonifacio', 'Corse-du-Sud', '20169', 41.3871, 9.1594),
  ('Étretat', 'Seine-Maritime', '76790', 49.7069, 0.2031),
  ('Gordes', 'Vaucluse', '84220', 43.9115, 5.2002),
  ('Annecy-le-Vieux', 'Haute-Savoie', '74940', 45.9205, 6.1498),
  ('Menton', 'Alpes-Maritimes', '06500', 43.7765, 7.5000),
  ('Arles', 'Bouches-du-Rhône', '13200', 43.6776, 4.6279),
  ('Fontainebleau', 'Seine-et-Marne', '77300', 48.4049, 2.7016),
  ('Giverny', 'Eure', '27620', 49.0764, 1.5321),
  ('Rocamadour', 'Lot', '46500', 44.7989, 1.6178),
  ('Collioure', 'Pyrénées-Orientales', '66190', 42.5270, 3.0849),
  ('Beaune', 'Côte-d''Or', '21200', 47.0261, 4.8404),
  ('Amboise', 'Indre-et-Loire', '37400', 47.4134, 0.9857),
  ('Carnac', 'Morbihan', '56340', 47.5842, -3.0778),
  ('Évian-les-Bains', 'Haute-Savoie', '74500', 46.4003, 6.5876)
ON CONFLICT (postal_code, name) DO NOTHING;

-- Add sample profiles and projects in these cities
-- First check if emails already exist to avoid conflicts
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
  email_exists boolean;
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
    unique_email := 'user_' || city_record.postal_code || '_' || city_count || '_' || extract(epoch from now())::text || '@example.com';
    
    -- Check if email already exists
    SELECT EXISTS (
      SELECT 1 FROM auth.users WHERE email = unique_email
    ) INTO email_exists;
    
    -- Only create user if email doesn't exist
    IF NOT email_exists THEN
      -- Create user
      new_user_id := gen_random_uuid();
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
    END IF;
  END LOOP;
END $$;
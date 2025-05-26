-- Import cities data from OpenStreetMap France
CREATE OR REPLACE FUNCTION import_french_cities()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert major French cities
  INSERT INTO cities (name, department, postal_code, latitude, longitude)
  VALUES 
    ('Paris', 'Paris', '75001', 48.8566, 2.3522),
    ('Marseille', 'Bouches-du-Rhône', '13001', 43.2965, 5.3698),
    ('Lyon', 'Rhône', '69001', 45.7578, 4.8320),
    ('Toulouse', 'Haute-Garonne', '31000', 43.6047, 1.4442),
    ('Nice', 'Alpes-Maritimes', '06000', 43.7102, 7.2620),
    ('Nantes', 'Loire-Atlantique', '44000', 47.2184, -1.5536),
    ('Strasbourg', 'Bas-Rhin', '67000', 48.5734, 7.7521),
    ('Montpellier', 'Hérault', '34000', 43.6108, 3.8767),
    ('Bordeaux', 'Gironde', '33000', 44.8378, -0.5792),
    ('Lille', 'Nord', '59000', 50.6292, 3.0573),
    ('Rennes', 'Ille-et-Vilaine', '35000', 48.1173, -1.6778),
    ('Reims', 'Marne', '51100', 49.2583, 4.0317),
    ('Le Havre', 'Seine-Maritime', '76600', 49.4944, 0.1079),
    ('Saint-Étienne', 'Loire', '42000', 45.4397, 4.3872),
    ('Toulon', 'Var', '83000', 43.1242, 5.9280),
    ('Grenoble', 'Isère', '38000', 45.1885, 5.7245),
    ('Dijon', 'Côte-d''Or', '21000', 47.3220, 5.0415),
    ('Angers', 'Maine-et-Loire', '49000', 47.4784, -0.5632),
    ('Nîmes', 'Gard', '30000', 43.8367, 4.3601),
    ('Aix-en-Provence', 'Bouches-du-Rhône', '13100', 43.5297, 5.4474)
  ON CONFLICT (postal_code, name) DO NOTHING;
END;
$$;

-- Update the distance steps function to use 10km increments
CREATE OR REPLACE FUNCTION public.get_valid_distance_steps()
RETURNS int[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT ARRAY[10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
$$;

-- Execute the import function
SELECT import_french_cities();
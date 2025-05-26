-- Import cities data from OpenStreetMap France
CREATE OR REPLACE FUNCTION import_french_cities()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert a sample of major French cities
  -- In production, this would be replaced with a complete dataset
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
    ('Lille', 'Nord', '59000', 50.6292, 3.0573)
  ON CONFLICT (postal_code, name) DO NOTHING;
END;
$$;

-- Execute the import function
SELECT import_french_cities();
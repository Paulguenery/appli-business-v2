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
    ('Aix-en-Provence', 'Bouches-du-Rhône', '13100', 43.5297, 5.4474),
    ('Brest', 'Finistère', '29200', 48.3904, -4.4861),
    ('Le Mans', 'Sarthe', '72000', 48.0061, 0.1996),
    ('Tours', 'Indre-et-Loire', '37000', 47.3941, 0.6848),
    ('Amiens', 'Somme', '80000', 49.8942, 2.2957),
    ('Limoges', 'Haute-Vienne', '87000', 45.8315, 1.2578),
    ('Clermont-Ferrand', 'Puy-de-Dôme', '63000', 45.7772, 3.0870),
    ('Villeurbanne', 'Rhône', '69100', 45.7679, 4.8813),
    ('Besançon', 'Doubs', '25000', 47.2378, 6.0240),
    ('Orléans', 'Loiret', '45000', 47.9029, 1.9039),
    ('Metz', 'Moselle', '57000', 49.1193, 6.1757),
    ('Rouen', 'Seine-Maritime', '76000', 49.4431, 1.0993),
    ('Mulhouse', 'Haut-Rhin', '68100', 47.7508, 7.3359),
    ('Caen', 'Calvados', '14000', 49.1829, -0.3707),
    ('Nancy', 'Meurthe-et-Moselle', '54000', 48.6921, 6.1844),
    ('Tourcoing', 'Nord', '59200', 50.7236, 3.1640),
    ('Roubaix', 'Nord', '59100', 50.6927, 3.1748),
    ('Nanterre', 'Hauts-de-Seine', '92000', 48.8924, 2.2071),
    ('Avignon', 'Vaucluse', '84000', 43.9493, 4.8055),
    ('Vitry-sur-Seine', 'Val-de-Marne', '94400', 48.7875, 2.3927),
    ('Créteil', 'Val-de-Marne', '94000', 48.7794, 2.4532),
    ('Dunkerque', 'Nord', '59140', 51.0343, 2.3767),
    ('Poitiers', 'Vienne', '86000', 46.5802, 0.3404),
    ('Asnières-sur-Seine', 'Hauts-de-Seine', '92600', 48.9111, 2.2855),
    ('Courbevoie', 'Hauts-de-Seine', '92400', 48.8969, 2.2522),
    ('Versailles', 'Yvelines', '78000', 48.8048, 2.1203),
    ('Colombes', 'Hauts-de-Seine', '92700', 48.9227, 2.2537),
    ('Fort-de-France', 'Martinique', '97200', 14.6160, -61.0588),
    ('Aulnay-sous-Bois', 'Seine-Saint-Denis', '93600', 48.9413, 2.5037),
    ('Saint-Denis', 'Seine-Saint-Denis', '93200', 48.9362, 2.3551),
    ('Cherbourg-en-Cotentin', 'Manche', '50100', 49.6339, -1.6222),
    ('Pau', 'Pyrénées-Atlantiques', '64000', 43.2951, -0.3708),
    ('Rueil-Malmaison', 'Hauts-de-Seine', '92500', 48.8847, 2.1907),
    ('Champigny-sur-Marne', 'Val-de-Marne', '94500', 48.8172, 2.4987),
    ('Béziers', 'Hérault', '34500', 43.3449, 3.2160),
    ('La Rochelle', 'Charente-Maritime', '17000', 46.1591, -1.1520),
    ('Saint-Maur-des-Fossés', 'Val-de-Marne', '94100', 48.8003, 2.4857),
    ('Calais', 'Pas-de-Calais', '62100', 50.9513, 1.8587),
    ('Antibes', 'Alpes-Maritimes', '06600', 43.5800, 7.1250),
    ('Cannes', 'Alpes-Maritimes', '06400', 43.5528, 7.0174),
    ('Colmar', 'Haut-Rhin', '68000', 48.0794, 7.3585),
    ('Ajaccio', 'Corse-du-Sud', '20000', 41.9192, 8.7386),
    ('Bastia', 'Haute-Corse', '20200', 42.6976, 9.4509)
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
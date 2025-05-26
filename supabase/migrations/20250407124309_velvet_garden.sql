-- Create rating_categories table
CREATE TABLE rating_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  weight float DEFAULT 1.0,
  created_at timestamptz DEFAULT now()
);

-- Insert default rating categories
INSERT INTO rating_categories (name, description) VALUES
  ('communication', 'Qualité et efficacité de la communication'),
  ('reliability', 'Fiabilité et respect des engagements'),
  ('skills', 'Compétences techniques et professionnelles'),
  ('timeliness', 'Respect des délais et ponctualité');

-- Create rating_criteria table
CREATE TABLE rating_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES rating_categories NOT NULL,
  score int NOT NULL CHECK (score BETWEEN 1 AND 5),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insert rating criteria
INSERT INTO rating_criteria (category_id, score, description)
SELECT 
  c.id,
  s.score,
  CASE 
    WHEN c.name = 'communication' THEN
      CASE s.score
        WHEN 1 THEN 'Communication très difficile'
        WHEN 2 THEN 'Communication peu satisfaisante'
        WHEN 3 THEN 'Communication correcte'
        WHEN 4 THEN 'Bonne communication'
        WHEN 5 THEN 'Excellente communication'
      END
    WHEN c.name = 'reliability' THEN
      CASE s.score
        WHEN 1 THEN 'Peu fiable'
        WHEN 2 THEN 'Fiabilité irrégulière'
        WHEN 3 THEN 'Fiabilité moyenne'
        WHEN 4 THEN 'Très fiable'
        WHEN 5 THEN 'Extrêmement fiable'
      END
    WHEN c.name = 'skills' THEN
      CASE s.score
        WHEN 1 THEN 'Compétences insuffisantes'
        WHEN 2 THEN 'Compétences basiques'
        WHEN 3 THEN 'Compétences satisfaisantes'
        WHEN 4 THEN 'Très bonnes compétences'
        WHEN 5 THEN 'Expertise exceptionnelle'
      END
    WHEN c.name = 'timeliness' THEN
      CASE s.score
        WHEN 1 THEN 'Retards fréquents'
        WHEN 2 THEN 'Quelques retards'
        WHEN 3 THEN 'Ponctualité moyenne'
        WHEN 4 THEN 'Très ponctuel'
        WHEN 5 THEN 'Toujours en avance'
      END
  END
FROM rating_categories c
CROSS JOIN (SELECT generate_series(1,5) AS score) s;

-- Enable RLS
ALTER TABLE rating_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating_criteria ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view rating categories"
  ON rating_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view rating criteria"
  ON rating_criteria FOR SELECT
  TO authenticated
  USING (true);
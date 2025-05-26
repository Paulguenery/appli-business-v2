/*
  # Ajout de champs pour les projets

  1. Nouveaux champs
    - `ideal_partner_description` (text) - Description du partenaire idéal recherché
    - `open_to_investment` (boolean) - Indique si le projet est ouvert aux investisseurs
  
  2. Valeurs par défaut
    - `open_to_investment` est false par défaut
*/

-- Ajout du champ pour la description du partenaire idéal
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS ideal_partner_description TEXT;

-- Ajout du champ pour indiquer si le projet est ouvert aux investisseurs
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS open_to_investment BOOLEAN DEFAULT false;
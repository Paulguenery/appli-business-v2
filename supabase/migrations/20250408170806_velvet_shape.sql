-- Add Google OAuth provider configuration
-- Note: This migration doesn't actually modify the database schema
-- It's a reminder that you need to configure Google OAuth in the Supabase dashboard

/*
  # Configuration de l'authentification Google

  Pour activer l'authentification Google, vous devez configurer les paramètres suivants
  dans le dashboard Supabase de votre projet:

  1. Allez dans Authentication > Providers > Google
  2. Activez le provider Google
  3. Configurez les paramètres suivants:
     - Client ID: Votre Google Client ID
     - Client Secret: Votre Google Client Secret
     - Authorized redirect URLs: https://aufzayvducotoyxnghoc.supabase.co/auth/v1/callback
  4. Ajoutez les domaines autorisés:
     - localhost
     - 127.0.0.1
     - Votre domaine de production

  Pour obtenir un Client ID et Client Secret Google:
  1. Allez sur https://console.cloud.google.com/
  2. Créez un nouveau projet ou sélectionnez un projet existant
  3. Allez dans "APIs & Services" > "Credentials"
  4. Cliquez sur "Create Credentials" > "OAuth client ID"
  5. Configurez l'écran de consentement OAuth
  6. Créez un ID client OAuth pour une application Web
  7. Ajoutez les URIs de redirection autorisés:
     - https://aufzayvducotoyxnghoc.supabase.co/auth/v1/callback
*/

-- Aucune modification de schéma n'est nécessaire pour l'authentification Google
-- Cette migration sert uniquement de documentation
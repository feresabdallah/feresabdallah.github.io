# Activer le panneau d’administration

Le panneau est accessible à `/admin/` (ou `/admin.html`). Il permet de modifier les titres, textes et projets, ainsi que d’envoyer des photos JPG, PNG ou WebP (10 Mo maximum).

## 1. Créer le projet Supabase

1. Crée un compte sur [supabase.com](https://supabase.com/) puis un projet sur l’offre Free.
2. Dans le projet, ouvre **SQL Editor**, crée une requête, colle tout le contenu de `supabase-setup.sql`, puis exécute-la.
3. Dans **Project Settings → API Keys**, copie le **Project URL** et la **publishable key** (ou l’ancienne clé `anon`). Ne copie jamais une clé `secret` ou `service_role`.
4. Ouvre `supabase-config.js` et remplace les deux valeurs `COLLER_ICI...` par ces deux valeurs.
5. Dans **Authentication → Users**, ajoute un utilisateur avec `feresabdallah.design@gmail.com` et définis ton mot de passe. Confirme l’adresse depuis le tableau de bord si Supabase le demande.

## 2. Publier les fichiers du panneau

Dans le dépôt GitHub du site, ajoute ou remplace tous les fichiers du dossier `site` : `index.html`, `styles.css`, `script.js`, `site-content.js`, `supabase-config.js`, `admin.html`, `admin.css`, `admin.js`, `supabase-setup.sql` et le dossier `admin`.

Après l’enregistrement sur GitHub, attends la fin du déploiement Pages. Ouvre `https://feresabdallah.github.io/admin/`, connecte-toi avec l’adresse et le mot de passe créés dans Supabase, modifie tes textes/projets, puis clique sur **Publier les changements**. Le compte GitHub n’est pas nécessaire pour les modifications faites dans le panneau.

## Sécurité et offre gratuite

Les règles SQL rendent le contenu lisible par les visiteurs, mais limitent les modifications et les envois de photos à `feresabdallah.design@gmail.com`. La clé publishable/anon peut être dans le site public ; une clé `secret`/`service_role` ne doit jamais y être ajoutée. Supabase peut mettre en pause un projet Free après une période de faible activité ; il est possible de le réactiver dans son tableau de bord.

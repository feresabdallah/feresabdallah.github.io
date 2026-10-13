# Activer le panneau d’administration

Le panneau est accessible à `/admin/` (ou `/admin.html`). Il permet de modifier l’identité et la navigation, les textes de toutes les sections, les projets, les services, le journal, les coordonnées, la couleur d’accent et les photos JPG, PNG ou WebP (10 Mo maximum).

## 1. Créer le projet Supabase

Le projet Supabase est déjà configuré et les fichiers sont publiés. Pour créer ton accès : dans le projet Supabase, ouvre **Authentication → Users → Add user → Create new user**, saisis `feresabdallah.design@gmail.com` et définis toi-même le mot de passe.

## 2. Publier les fichiers du panneau

Ensuite, ouvre `https://feresabdallah.github.io/admin/`, connecte-toi avec ces identifiants, modifie les rubriques puis clique sur **Publier les changements**. Le compte GitHub n’est pas nécessaire pour les modifications faites dans le panneau.

## Sécurité et offre gratuite

Les règles SQL rendent le contenu lisible par les visiteurs, mais limitent les modifications et les envois de photos à `feresabdallah.design@gmail.com`. La clé publishable/anon peut être dans le site public ; une clé `secret`/`service_role` ne doit jamais y être ajoutée. Supabase peut mettre en pause un projet Free après une période de faible activité ; il est possible de le réactiver dans son tableau de bord.

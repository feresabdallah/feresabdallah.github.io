-- À exécuter une seule fois dans Supabase > SQL Editor.
-- Le contenu est public en lecture ; seule l'adresse admin peut le modifier.
create table if not exists public.portfolio_content (
  id text primary key default 'main' check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.portfolio_content enable row level security;

drop policy if exists "Public can read portfolio" on public.portfolio_content;
create policy "Public can read portfolio"
  on public.portfolio_content for select
  to anon, authenticated using (true);

drop policy if exists "Feres can manage portfolio" on public.portfolio_content;
create policy "Feres can manage portfolio"
  on public.portfolio_content for all
  to authenticated
  using (lower((select auth.jwt() ->> 'email')) = 'feresabdallah.design@gmail.com')
  with check (lower((select auth.jwt() ->> 'email')) = 'feresabdallah.design@gmail.com');

-- Images publiques du portfolio ; seuls les comptes authentifiés avec l'adresse
-- ci-dessus peuvent ajouter, modifier ou supprimer les images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
  on storage.objects for select
  to anon, authenticated using (bucket_id = 'portfolio-images');

drop policy if exists "Feres can upload portfolio images" on storage.objects;
create policy "Feres can upload portfolio images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-images' and lower((select auth.jwt() ->> 'email')) = 'feresabdallah.design@gmail.com');

drop policy if exists "Feres can update portfolio images" on storage.objects;
create policy "Feres can update portfolio images"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-images' and lower((select auth.jwt() ->> 'email')) = 'feresabdallah.design@gmail.com')
  with check (bucket_id = 'portfolio-images' and lower((select auth.jwt() ->> 'email')) = 'feresabdallah.design@gmail.com');

drop policy if exists "Feres can delete portfolio images" on storage.objects;
create policy "Feres can delete portfolio images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-images' and lower((select auth.jwt() ->> 'email')) = 'feresabdallah.design@gmail.com');

insert into public.portfolio_content (id, content)
values ('main', '{
  "heroTitle": "Des lieux justes.\nDes vies qui bougent.",
  "heroIntro": "Je conçois des intérieurs sensibles et fonctionnels, nourris par les matières, les usages et les histoires de Tunis.",
  "approachTitle": "Un intérieur ne se décore pas.\nIl se comprend.",
  "approachText": "Lumière, circulation, matière, quotidien : chaque projet commence par l’écoute. Mon rôle est de révéler ce qui rend un lieu singulier, puis de lui donner une forme simple, durable et vivante.",
  "projects": [
    {"title":"Dar El Hara","type":"ÉTUDE · RÉNOVATION","location":"MÉDINA · TUNIS","description":"Réinventer une maison autour de son patio, entre mémoire et nouveaux usages.","category":"habitat","image":""},
    {"title":"Appartement Lafayette","type":"CONCEPT · APPARTEMENT","location":"LAFAYETTE · TUNIS","description":"Faire respirer un plan traversant avec une palette minérale et des lignes franches.","category":"habitat","image":""},
    {"title":"Seuils","type":"RECHERCHE · DÉTAIL","location":"CARNET DE RECHERCHE · TUNIS","description":"Une collecte de portes, poignées et passages qui racontent la ville.","category":"recherche","image":""}
  ]
}')
on conflict (id) do nothing;

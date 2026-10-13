import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } from './supabase-config.js';

const DEFAULT_CONTENT = {
  brandName: 'Feres Abdallah', brandTagline: 'ARCHITECTURE INTÉRIEURE · TUNIS',
  navProjects: 'Projets', navApproach: 'Approche', navJournal: 'Journal', navContact: 'Parlons de votre projet',
  ctaProjects: 'Découvrir les projets', ctaApproach: 'Mon approche', filterAll: 'Tout', filterHabitat: 'Habitat', filterResearch: 'Recherche',
  metaTitle: 'Feres Abdallah — Architecture intérieure à Tunis',
  metaDescription: 'Feres Abdallah, architecte d’intérieur à Tunis. Conception d’espaces, rénovation et accompagnement de chantier.',
  heroEyebrow: 'Architecte d’intérieur indépendant · Tunis',
  heroTitle: 'Des lieux justes.\nDes vies qui bougent.',
  heroIntro: 'Je conçois des intérieurs sensibles et fonctionnels, nourris par les matières, les usages et les histoires de Tunis.',
  heroLocation: 'TUNIS · 36°48′ N / 10°10′ E', heroCaptionTitle: 'Maison du patio',
  heroCaptionSub: 'Étude d’intention · 2026', heroIndex: 'A—01', heroImage: '',
  heroMeta: 'Concevoir · transformer · habiter', heroScrollLabel: 'DÉFILER POUR EXPLORER',
  visionLabel: 'Ma vision', approachTitle: 'Un intérieur ne se décore pas.\nIl se comprend.',
  approachText: 'Lumière, circulation, matière, quotidien : chaque projet commence par l’écoute. Mon rôle est de révéler ce qui rend un lieu singulier, puis de lui donner une forme simple, durable et vivante.',
  approachLink: 'En savoir plus sur ma démarche',
  projectsEyebrow: 'Sélection de projets', projectsTitle: 'Des espaces,\ndes histoires.',
  projectsIntro: 'Études, transformations et détails de vie.\nChaque lieu appelle sa propre réponse.',
  portfolioNote: 'Études et projets d’architecture intérieure à Tunis.',
  projects: [
    { title: 'Dar El Hara', type: 'ÉTUDE · RÉNOVATION', location: 'MÉDINA · TUNIS', description: 'Réinventer une maison autour de son patio, entre mémoire et nouveaux usages.', category: 'habitat', image: '', link: '#contact' },
    { title: 'Appartement Lafayette', type: 'CONCEPT · APPARTEMENT', location: 'LAFAYETTE · TUNIS', description: 'Faire respirer un plan traversant avec une palette minérale et des lignes franches.', category: 'habitat', image: '', link: '#contact' },
    { title: 'Seuils', type: 'RECHERCHE · DÉTAIL', location: 'CARNET DE RECHERCHE · TUNIS', description: 'Une collecte de portes, poignées et passages qui racontent la ville.', category: 'recherche', image: '', link: '#contact' }
  ],
  manifestoQuote: 'La ville est un atelier.\nIl suffit de prendre le temps de regarder.', manifestoAttribution: 'NOTES DE TERRAIN · TUNIS',
  servicesEyebrow: 'Comment je peux vous accompagner', servicesTitle: 'Du premier croquis\nau dernier détail.',
  servicesIntro: 'Un accompagnement adapté à votre lieu, votre calendrier et votre manière d’habiter.',
  services: [
    { title: 'Conception intérieure', description: 'Plan d’aménagement, intentions, matières et lumière.' },
    { title: 'Rénovation & suivi', description: 'Coordination des étapes, dialogue avec les artisans et suivi du chantier.' },
    { title: 'Conseil ciblé', description: 'Une séance pour débloquer un plan, une pièce ou un choix de matériaux.' }
  ],
  journalEyebrow: 'Journal de terrain', journalTitle: 'Regarder la ville\nautrement.',
  journalLink: 'Suivre les coulisses sur Instagram',
  journal: [
    { tag: '01 / DÉTAIL', title: 'Une porte, mille façons d’entrer.', meta: 'NOTES DE LA MÉDINA · 02:14', image: '' },
    { tag: '02 / LUMIÈRE', title: 'À 17 h, la ruelle change de dessin.', meta: 'UNE BALADE À TUNIS · 00:28', image: '' },
    { tag: '03 / CHANTIER', title: 'Du plan au réel : ce qui change en route.', meta: 'CARNET OUVERT · 01:06', image: '' }
  ],
  contactEyebrow: 'Un lieu à transformer ?', contactTitle: 'Commençons\npar en parler.',
  contactText: 'Racontez-moi votre espace, vos envies et vos contraintes. Je vous répondrai pour convenir d’un premier échange.',
  contactButton: 'Écrire à Feres', city: 'Basé à Tunis', availability: 'Disponible en Tunisie et à distance',
  email: 'feresabdallah.design@gmail.com', phoneLabel: 'Téléphone', phone: '+216 55 128 645',
  instagram: 'https://www.instagram.com/feres_abdallah_design/', season: 'olive'
};

const GROUPS = [
  { title: 'Identité et navigation', fields: [
    ['brandName', 'Nom affiché'], ['brandTagline', 'Signature sous le nom'],
    ['navProjects', 'Lien de menu : projets'], ['navApproach', 'Lien de menu : approche'],
    ['navJournal', 'Lien de menu : journal'], ['navContact', 'Lien de menu : contact'],
    ['ctaProjects', 'Bouton d’accueil : projets'], ['ctaApproach', 'Lien d’accueil : approche'],
    ['metaTitle', 'Titre de l’onglet du navigateur'], ['metaDescription', 'Description du site', 'textarea']
  ] },
  { title: 'Accueil', fields: [
    ['heroEyebrow', 'Petite ligne au-dessus du titre'], ['heroTitle', 'Grand titre', 'textarea'],
    ['heroIntro', 'Texte de présentation', 'textarea'], ['heroLocation', 'Repère géographique'],
    ['heroCaptionTitle', 'Légende de l’illustration'], ['heroCaptionSub', 'Sous-légende'], ['heroIndex', 'Petit numéro de repère'],
    ['heroMeta', 'Phrase de navigation'], ['heroScrollLabel', 'Texte du lien de défilement']
  ], image: ['heroImage', 'Photo de couverture'] },
  { title: 'Approche', fields: [
    ['visionLabel', 'Petit titre de section'], ['approachTitle', 'Grand titre', 'textarea'],
    ['approachText', 'Texte de présentation', 'textarea'], ['approachLink', 'Texte du lien']
  ] },
  { title: 'Introduction aux projets', fields: [
    ['projectsEyebrow', 'Petit titre de section'], ['projectsTitle', 'Grand titre', 'textarea'],
    ['projectsIntro', 'Texte à droite du titre', 'textarea'], ['portfolioNote', 'Note sous les projets'],
    ['filterAll', 'Filtre : tout'], ['filterHabitat', 'Filtre : habitat'], ['filterResearch', 'Filtre : recherche']
  ] },
  { title: 'Manifeste', fields: [
    ['manifestoQuote', 'Phrase mise en avant', 'textarea'], ['manifestoAttribution', 'Signature sous la phrase']
  ] },
  { title: 'Services', fields: [
    ['servicesEyebrow', 'Petit titre de section'], ['servicesTitle', 'Grand titre', 'textarea'],
    ['servicesIntro', 'Texte de présentation', 'textarea']
  ] },
  { title: 'Journal', fields: [
    ['journalEyebrow', 'Petit titre de section'], ['journalTitle', 'Grand titre', 'textarea'],
    ['journalLink', 'Texte du lien Instagram']
  ] },
  { title: 'Contact', fields: [
    ['contactEyebrow', 'Petit titre de section'], ['contactTitle', 'Grand titre', 'textarea'],
    ['contactText', 'Texte de présentation', 'textarea'], ['contactButton', 'Texte du bouton e-mail'],
    ['city', 'Localisation'], ['availability', 'Disponibilité'], ['email', 'Adresse e-mail', 'email'],
    ['phoneLabel', 'Libellé du téléphone'], ['phone', 'Téléphone avec indicatif', 'tel'], ['instagram', 'Lien Instagram', 'url']
  ] }
];
const SEASONS = {
  olive: ['#b5a323', '#807313'], terracotta: ['#a95d43', '#7e3e2d'],
  blue: ['#547984', '#3b5961'], sage: ['#71805d', '#536044']
};

const isConfigured = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('COLLER_') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('COLLER_');
const setupHint = document.querySelector('#setup-hint');
if (!isConfigured) {
  document.querySelector('#login-panel').hidden = true;
  setupHint.hidden = false;
  setupHint.textContent = 'Le panneau attend encore la configuration Supabase. Renseigne l’URL et la clé publique dans supabase-config.js, puis applique supabase-setup.sql dans le SQL Editor du projet.';
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const loginPanel = document.querySelector('#login-panel');
  const editorPanel = document.querySelector('#editor-panel');
  const loginMessage = document.querySelector('#login-message');
  const saveMessage = document.querySelector('#save-message');
  const contentForm = document.querySelector('#content-form');
  const editableFields = document.querySelector('#editable-fields');
  const projectEditors = document.querySelector('#project-editors');
  const serviceEditors = document.querySelector('#service-editors');
  const journalEditors = document.querySelector('#journal-editors');
  let content;

  const message = (node, text, error = false) => {
    node.textContent = text;
    node.classList.toggle('error', error);
  };

  function renderGroups() {
    editableFields.replaceChildren();
    GROUPS.forEach(group => {
      const details = document.createElement('details');
      details.className = 'edit-section';
      details.open = ['Identité et navigation', 'Accueil', 'Contact'].includes(group.title);
      const summary = document.createElement('summary');
      summary.textContent = group.title;
      details.append(summary);
      const grid = document.createElement('div');
      grid.className = 'field-grid';
      group.fields.forEach(([key, label, type]) => {
        const wrapper = document.createElement('label');
        wrapper.textContent = label;
        let input;
        if (type === 'textarea') {
          input = document.createElement('textarea');
          input.rows = key.toLowerCase().includes('title') ? 2 : 3;
        } else {
          input = document.createElement('input');
          input.type = type || 'text';
        }
        input.dataset.key = key;
        if (['heroTitle', 'approachTitle', 'projectsTitle', 'manifestoQuote', 'servicesTitle', 'journalTitle', 'contactTitle'].includes(key)) input.classList.add('title-field');
        wrapper.append(input);
        grid.append(wrapper);
      });
      details.append(grid);
      if (group.image) details.append(buildImageControl(group.image[0], group.image[1], content[group.image[0]] || ''));
      editableFields.append(details);
    });
    const seasonDetails = document.createElement('details');
    seasonDetails.className = 'edit-section';
    const summary = document.createElement('summary');
    summary.textContent = 'Charte graphique';
    seasonDetails.append(summary);
    const seasonLabel = document.createElement('label');
    seasonLabel.textContent = 'Accent de couleur';
    const seasonSelect = document.createElement('select');
    seasonSelect.dataset.key = 'season';
    [['olive','Jaune olive'],['terracotta','Terre cuite'],['blue','Bleu ardoise'],['sage','Vert sauge']].forEach(([value,label]) => {
      const option = document.createElement('option'); option.value = value; option.textContent = label; seasonSelect.append(option);
    });
    seasonLabel.append(seasonSelect); seasonDetails.append(seasonLabel); editableFields.append(seasonDetails);
  }

  const restoreLineBreaks = value => {
    if (typeof value === 'string') return value.replace(/\\n/g, '\n');
    if (Array.isArray(value)) return value.map(restoreLineBreaks);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,restoreLineBreaks(item)]));
    return value;
  };

  function buildImageControl(key, labelText, initialUrl = '') {
    const row = document.createElement('div'); row.className = 'image-control'; row.dataset.imageKey = key; row.dataset.imageUrl = initialUrl;
    const preview = document.createElement('img'); preview.className = 'image-preview'; preview.alt = initialUrl ? 'Aperçu de l’image' : 'Aucune image ajoutée';
    if (initialUrl) preview.src = initialUrl;
    const label = document.createElement('label'); label.className = 'image-label'; label.textContent = labelText;
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/jpeg,image/png,image/webp'; label.append(input);
    const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'clear-image'; clear.textContent = 'Retirer la photo';
    clear.addEventListener('click', () => { row.dataset.imageUrl = ''; preview.removeAttribute('src'); preview.alt = 'Aucune image ajoutée'; message(saveMessage, 'Photo retirée. Publie les changements pour valider.'); });
    input.addEventListener('change', () => uploadImage(input, row, preview));
    row.append(preview, label, clear); return row;
  }

  async function uploadImage(input, row, preview) {
    const file = input.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) {
      message(saveMessage, 'Choisis une photo JPG, PNG ou WebP de 10 Mo maximum.', true); input.value = ''; return;
    }
    message(saveMessage, 'Envoi de la photo…');
    const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { contentType: file.type, upsert: false });
    if (error) { message(saveMessage, `Photo non envoyée : ${error.message}`, true); return; }
    row.dataset.imageUrl = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl;
    preview.src = row.dataset.imageUrl; preview.alt = `Aperçu : ${file.name}`;
    message(saveMessage, 'Photo envoyée. Publie les changements pour l’afficher sur le site.');
  }

  function syncCardDraft(target, kind) {
    content[kind] = [...target.querySelectorAll('.item-editor')].map((card,index) => {
      const item = {...(content[kind][index] || {})};
      card.querySelectorAll('[data-field]').forEach(input => { item[input.dataset.field] = input.value.trim(); });
      const image = card.querySelector('.image-control'); if (image) item.image = image.dataset.imageUrl || '';
      return item;
    });
  }

  function renderCards(target, items, kind) {
    target.replaceChildren();
    const fields = kind === 'projects'
      ? [['title','Nom du projet'],['type','Type / catégorie'],['location','Lieu'],['description','Description','textarea'],['link','Lien du projet (optionnel)']]
      : kind === 'services' ? [['title','Nom du service'],['description','Description','textarea']]
      : [['tag','Repère / thème'],['title','Texte du post'],['meta','Légende / durée']];
    items.forEach((item, index) => {
      const card = document.createElement('details'); card.className = 'item-editor'; card.open = index === 0;
      const summary = document.createElement('summary'); summary.textContent = `${kind === 'projects' ? 'Projet' : kind === 'services' ? 'Service' : 'Publication'} ${String(index + 1).padStart(2,'0')} · ${item.title || item.name || ''}`;
      card.append(summary);
      const grid = document.createElement('div'); grid.className = 'field-grid';
      fields.forEach(([key,label,type]) => {
        const wrapper = document.createElement('label'); wrapper.textContent = label;
        const input = type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
        if (type !== 'textarea') input.type = 'text'; else input.rows = 3;
        input.dataset.field = key; input.value = item[key] || ''; wrapper.append(input); grid.append(wrapper);
      });
      if (kind === 'projects') {
        const wrapper = document.createElement('label'); wrapper.textContent = 'Catégorie de filtre';
        const select = document.createElement('select'); select.dataset.field = 'category';
        [['habitat','Habitat'],['recherche','Recherche']].forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option);});
        select.value = item.category || 'habitat'; wrapper.append(select); grid.append(wrapper);
      }
      card.append(grid);
      if (kind !== 'services') card.append(buildImageControl(`item-image-${kind}-${index}`, kind === 'projects' ? 'Photo du projet' : 'Photo du journal', item.image || ''));
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-item'; remove.textContent = 'Retirer cet élément';
      remove.addEventListener('click', () => {
        syncCardDraft(target,kind); content[kind].splice(index,1); renderCards(target,content[kind],kind);
        message(saveMessage, 'Élément retiré du brouillon. Publie les changements pour valider.');
      });
      card.append(remove);
      target.append(card);
    });
    const add = document.createElement('button'); add.type = 'button'; add.className = 'add-item';
    add.textContent = kind === 'projects' ? '+ Ajouter un projet' : kind === 'services' ? '+ Ajouter un service' : '+ Ajouter une publication';
    add.addEventListener('click', () => {
      syncCardDraft(target,kind);
      const item = kind === 'projects' ? {title:'Nouveau projet',type:'ÉTUDE · INTÉRIEUR',location:'TUNIS',description:'',category:'habitat',image:'',link:'#contact'}
        : kind === 'services' ? {title:'Nouveau service',description:''} : {tag:'NOUVEAU / SUJET',title:'Nouvelle publication',meta:'',image:''};
      content[kind].push(item); renderCards(target,content[kind],kind);
      target.lastElementChild?.scrollIntoView({behavior:'smooth',block:'center'});
    });
    target.append(add);
  }

  async function loadContent() {
    message(saveMessage, 'Chargement…');
    const { data, error } = await supabase.from('portfolio_content').select('content').eq('id', 'main').single();
    if (error) { message(saveMessage, `Impossible de charger le contenu : ${error.message}`, true); return; }
    const stored = restoreLineBreaks(data.content);
    content = { ...DEFAULT_CONTENT, ...stored };
    ['projects','services','journal'].forEach(key => { content[key] = DEFAULT_CONTENT[key].map((item,index) => ({...item,...(stored[key]?.[index] || {})})); });
    renderGroups();
    editableFields.querySelectorAll('[data-key]').forEach(input => input.value = content[input.dataset.key] || '');
    renderCards(projectEditors, content.projects, 'projects');
    renderCards(serviceEditors, content.services, 'services');
    renderCards(journalEditors, content.journal, 'journal');
    message(saveMessage, 'Tout le contenu est chargé.');
  }

  async function showSession(session) {
    const allowed = session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    loginPanel.hidden = Boolean(allowed); editorPanel.hidden = !allowed;
    if (session && !allowed) {
      await supabase.auth.signOut();
      message(loginMessage, `Cette adresse n’a pas accès à l’administration. Utilise ${ADMIN_EMAIL}.`, true);
      return;
    }
    if (allowed) await loadContent();
  }

  document.querySelector('#login-form').addEventListener('submit', async event => {
    event.preventDefault(); message(loginMessage, 'Connexion…');
    const { data, error } = await supabase.auth.signInWithPassword({ email: document.querySelector('#email').value.trim(), password: document.querySelector('#password').value });
    if (error) return message(loginMessage, error.message, true);
    await showSession(data.session);
  });
  document.querySelector('#logout-button').addEventListener('click', async () => {
    await supabase.auth.signOut(); editorPanel.hidden = true; loginPanel.hidden = false; document.querySelector('#password').value = '';
  });

  contentForm.addEventListener('submit', async event => {
    event.preventDefault(); message(saveMessage, 'Publication…');
    const updated = { ...content };
    editableFields.querySelectorAll('[data-key]').forEach(input => { updated[input.dataset.key] = input.value.trim(); });
    editableFields.querySelectorAll('.image-control').forEach(row => { updated[row.dataset.imageKey] = row.dataset.imageUrl || ''; });
    const collect = (target, kind, source) => [...target.querySelectorAll('.item-editor')].map((card,index) => {
      const item = {...(source[index] || {})};
      card.querySelectorAll('[data-field]').forEach(input => { item[input.dataset.field] = input.value.trim(); });
      const image = card.querySelector('.image-control'); if (image) item.image = image.dataset.imageUrl || '';
      return item;
    });
    updated.projects = collect(projectEditors,'projects',content.projects);
    updated.services = collect(serviceEditors,'services',content.services);
    updated.journal = collect(journalEditors,'journal',content.journal);
    const { error } = await supabase.from('portfolio_content').update({ content: updated, updated_at: new Date().toISOString() }).eq('id', 'main');
    if (error) return message(saveMessage, `Enregistrement impossible : ${error.message}`, true);
    content = updated; message(saveMessage, 'C’est publié ! Le site est à jour.');
  });

  supabase.auth.getSession().then(({ data }) => showSession(data.session));
  supabase.auth.onAuthStateChange((_event, session) => window.setTimeout(() => showSession(session), 0));
}

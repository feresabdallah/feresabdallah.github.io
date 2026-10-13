import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } from './supabase-config.js';

const isConfigured = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('COLLER_') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('COLLER_');
const setupHint = document.querySelector('#setup-hint');
if (!isConfigured) {
  document.querySelector('#login-panel').hidden = true;
  setupHint.hidden = false;
  setupHint.textContent = 'Le panneau attend encore la configuration Supabase. Il faut renseigner l’URL et la clé publique dans supabase-config.js, puis appliquer supabase-setup.sql dans le SQL Editor du projet.';
} else {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const loginPanel = document.querySelector('#login-panel');
  const editorPanel = document.querySelector('#editor-panel');
  const loginMessage = document.querySelector('#login-message');
  const saveMessage = document.querySelector('#save-message');
  const contentForm = document.querySelector('#content-form');
  const projectEditors = document.querySelector('#project-editors');
  let content;

  const message = (node, text, error = false) => {
    node.textContent = text;
    node.classList.toggle('error', error);
  };

  async function showSession(session) {
    const allowed = session?.user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    loginPanel.hidden = Boolean(allowed);
    editorPanel.hidden = !allowed;
    if (session && !allowed) {
      await supabase.auth.signOut();
      message(loginMessage, `Cette adresse n’a pas accès à l’administration. Utilise ${ADMIN_EMAIL}.`, true);
      return;
    }
    if (allowed) await loadContent();
  }

  async function loadContent() {
    message(saveMessage, 'Chargement…');
    const { data, error } = await supabase.from('portfolio_content').select('content').eq('id', 'main').single();
    if (error) {
      message(saveMessage, `Impossible de charger le contenu : ${error.message}`, true);
      return;
    }
    content = data.content;
    ['heroTitle', 'heroIntro', 'approachTitle', 'approachText'].forEach(key => {
      document.getElementById(key).value = content[key] || '';
    });
    projectEditors.replaceChildren();
    (content.projects || []).forEach((project, index) => {
      const section = document.createElement('section');
      section.className = 'project-editor';
      section.innerHTML = `<h3>Projet ${String(index + 1).padStart(2, '0')}</h3>
        <div class="project-fields">
          <label>Nom du projet<input data-field="title" required></label>
          <label>Type / catégorie<input data-field="type" required></label>
          <label>Lieu<input data-field="location" required></label>
          <label>Description<textarea data-field="description" rows="2" required></textarea></label>
          <label>Catégorie de filtre<select data-field="category"><option value="habitat">Habitat</option><option value="recherche">Recherche</option></select></label>
        </div>
        <div class="image-row"><img class="image-preview" alt="Aperçu de la photo"><label class="image-label">Photo du projet<input data-image type="file" accept="image/jpeg,image/png,image/webp"></label></div>`;
      Object.entries(project).forEach(([key, value]) => {
        const field = section.querySelector(`[data-field="${key}"]`);
        if (field) field.value = value || '';
      });
      const preview = section.querySelector('.image-preview');
      if (project.image) preview.src = project.image;
      else preview.alt = 'Aucune photo ajoutée';
      section.dataset.imageUrl = project.image || '';
      const fileInput = section.querySelector('[data-image]');
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
          message(saveMessage, 'La photo dépasse la limite de 10 Mo.', true);
          fileInput.value = '';
          return;
        }
        message(saveMessage, 'Envoi de la photo…');
        const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-');
        const path = `${crypto.randomUUID()}-${safeName}`;
        const { error } = await supabase.storage.from('portfolio-images').upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          message(saveMessage, `Photo non envoyée : ${error.message}`, true);
          return;
        }
        section.dataset.imageUrl = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl;
        preview.src = section.dataset.imageUrl;
        message(saveMessage, 'Photo envoyée. Publie les changements pour l’afficher sur le site.');
      });
      projectEditors.append(section);
    });
    message(saveMessage, 'Contenu chargé.');
  }

  document.querySelector('#login-form').addEventListener('submit', async event => {
    event.preventDefault();
    message(loginMessage, 'Connexion…');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: document.querySelector('#email').value.trim(),
      password: document.querySelector('#password').value
    });
    if (error) return message(loginMessage, error.message, true);
    await showSession(data.session);
  });

  document.querySelector('#logout-button').addEventListener('click', async () => {
    await supabase.auth.signOut();
    editorPanel.hidden = true;
    loginPanel.hidden = false;
    document.querySelector('#password').value = '';
  });

  contentForm.addEventListener('submit', async event => {
    event.preventDefault();
    message(saveMessage, 'Publication…');
    const updated = {
      ...content,
      heroTitle: document.querySelector('#heroTitle').value.trim(),
      heroIntro: document.querySelector('#heroIntro').value.trim(),
      approachTitle: document.querySelector('#approachTitle').value.trim(),
      approachText: document.querySelector('#approachText').value.trim(),
      projects: [...projectEditors.querySelectorAll('.project-editor')].map(section => ({
        title: section.querySelector('[data-field="title"]').value.trim(),
        type: section.querySelector('[data-field="type"]').value.trim(),
        location: section.querySelector('[data-field="location"]').value.trim(),
        description: section.querySelector('[data-field="description"]').value.trim(),
        category: section.querySelector('[data-field="category"]').value,
        image: section.dataset.imageUrl || ''
      }))
    };
    const { error } = await supabase.from('portfolio_content').update({ content: updated, updated_at: new Date().toISOString() }).eq('id', 'main');
    if (error) return message(saveMessage, `Enregistrement impossible : ${error.message}`, true);
    content = updated;
    message(saveMessage, 'C’est publié ! Le site est à jour.');
  });

  supabase.auth.getSession().then(({ data }) => showSession(data.session));
  supabase.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => showSession(session), 0);
  });
}

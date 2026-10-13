import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

if (SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('COLLER_') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('COLLER_')) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data } = await supabase.from('portfolio_content').select('content').eq('id', 'main').maybeSingle();
  const content = data?.content;
  if (content) {
    const setText = (selector, text, preserveBreaks = false) => {
      const node = document.querySelector(selector);
      if (!node || !text) return;
      if (!preserveBreaks) node.textContent = text;
      else {
        const lines = text.split('\n');
        node.replaceChildren();
        lines.forEach((line, index) => {
          if (index) node.append(document.createElement('br'));
          const part = document.createElement(index === lines.length - 1 ? 'em' : 'span');
          part.textContent = line;
          node.append(part);
        });
      }
    };
    setText('#accueil h1', content.heroTitle, true);
    setText('.hero-intro', content.heroIntro);
    setText('#approche h2', content.approachTitle, true);
    setText('.intro-text', content.approachText);

    document.querySelectorAll('.project-card').forEach((card, index) => {
      const project = content.projects?.[index];
      if (!project) return;
      card.dataset.category = project.category || 'habitat';
      card.querySelector('h3').textContent = project.title || '';
      card.querySelector('.project-type').textContent = project.type || '';
      card.querySelector('.visual-caption').textContent = project.location || '';
      card.querySelector('.project-description').textContent = project.description || '';
      const link = card.querySelector('.project-link');
      link.setAttribute('aria-label', `Découvrir ${project.title || 'le projet'}`);
      if (project.image) {
        const visual = card.querySelector('.project-visual');
        visual.replaceChildren();
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title ? `Photo du projet ${project.title}` : 'Photo du projet';
        img.loading = 'lazy';
        img.className = 'project-photo';
        visual.append(img);
        visual.classList.add('has-photo');
      }
    });
    const note = document.querySelector('.portfolio-note');
    if (note && content.projects?.some(project => project.image)) note.textContent = 'Projets d’architecture intérieure · Tunis.';
  }
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const SEASONS = {
  olive: ['#b5a323', '#807313'], terracotta: ['#a95d43', '#7e3e2d'],
  blue: ['#547984', '#3b5961'], sage: ['#71805d', '#536044']
};

if (SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('COLLER_') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('COLLER_')) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data } = await supabase.from('portfolio_content').select('content').eq('id', 'main').maybeSingle();
  const restoreLineBreaks = value => {
    if (typeof value === 'string') return value.replace(/\\n/g, '\n');
    if (Array.isArray(value)) return value.map(restoreLineBreaks);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,restoreLineBreaks(item)]));
    return value;
  };
  const content = restoreLineBreaks(data?.content);
  if (content) {
    const visibility = {
      hero: true, approach: true, projects: true, manifesto: true,
      services: true, journal: true, contact: true, footer: true,
      ...(content.visibility || {})
    };
    const setVisible = (key, selector) => document.querySelectorAll(selector).forEach(node => { node.hidden = visibility[key] === false; });
    setVisible('hero', '#accueil');
    setVisible('approach', '#approche');
    setVisible('projects', '.projects');
    setVisible('manifesto', '.manifesto');
    setVisible('services', '.services');
    setVisible('journal', '.journal');
    setVisible('contact', '.contact-section');
    setVisible('footer', '.site-footer');
    const setText = (selector, text) => { const node = document.querySelector(selector); if (node && text != null) node.textContent = text; };
    const setIn = (parent, selector, text) => { const node = parent?.querySelector(selector); if (node && text != null) node.textContent = text; };
    const setRich = (selector, text) => {
      const node = document.querySelector(selector); if (!node || text == null) return;
      const lines = text.split('\n'); node.replaceChildren();
      lines.forEach((line,index) => {
        if (index) node.append(document.createElement('br'));
        const part = document.createElement(index === lines.length - 1 ? 'em' : 'span');
        part.textContent = line; node.append(part);
      });
    };
    const setBrand = element => {
      if (!element) return;
      const small = element.querySelector('small');
      element.firstChild.nodeValue = `${content.brandName || 'Feres Abdallah'} `;
      if (small) small.textContent = content.brandTagline || '';
    };

    document.title = content.metaTitle || document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && content.metaDescription) metaDescription.content = content.metaDescription;
    document.querySelectorAll('.brand-name').forEach(setBrand);
    document.querySelectorAll('.brand-mark').forEach(mark => { mark.firstChild.nodeValue = (content.brandName || 'F').trim().charAt(0); });
    const navLinks = [...document.querySelectorAll('.main-nav>a')];
    [visibility.projects,visibility.approach,visibility.journal,visibility.contact].forEach((visible,index) => { if (navLinks[index]) navLinks[index].hidden = visible === false; });
    [content.navProjects,content.navApproach,content.navJournal].forEach((value,index) => { if (navLinks[index] && value) navLinks[index].textContent = value; });
    if (navLinks[3]) navLinks[3].firstChild.nodeValue = `${content.navContact || ''} `;

    const heroEyebrow = document.querySelector('.hero-copy .eyebrow');
    if (heroEyebrow && content.heroEyebrow) {
      const dot = heroEyebrow.querySelector('.status-dot');
      heroEyebrow.replaceChildren(...(dot ? [dot, document.createTextNode(` ${content.heroEyebrow}`)] : [document.createTextNode(content.heroEyebrow)]));
    }
    setRich('#accueil h1',content.heroTitle);
    setText('.hero-intro',content.heroIntro);
    setText('.art-label-top',content.heroLocation);
    const heroCaptions = document.querySelectorAll('.art-label-bottom span');
    if (heroCaptions[0]) heroCaptions[0].textContent = content.heroCaptionTitle || '';
    if (heroCaptions[1]) heroCaptions[1].textContent = content.heroCaptionSub || '';
    setText('.art-index',content.heroIndex);
    setText('.hero-meta>span:last-child',content.heroMeta);
    const scrollCue = document.querySelector('.scroll-cue');
    if (scrollCue && content.heroScrollLabel) { const mark = scrollCue.querySelector('span'); scrollCue.replaceChildren(...(mark ? [mark,document.createTextNode(` ${content.heroScrollLabel}`)] : [document.createTextNode(content.heroScrollLabel)])); }
    const heroArt = document.querySelector('.hero-art');
    if (heroArt && content.heroImage) {
      heroArt.classList.add('has-photo');
      heroArt.style.backgroundImage = `linear-gradient(0deg,#0003,#0001),url("${content.heroImage.replaceAll('"','%22')}")`;
      heroArt.setAttribute('aria-label',`Photographie de couverture : ${content.heroCaptionTitle || 'projet intérieur'}`);
    }
    const heroActions = document.querySelectorAll('.hero-actions a');
    if (heroActions[0]) { heroActions[0].firstChild.nodeValue = `${content.ctaProjects?.trim() || 'Découvrir les projets'} `; }
    if (heroActions[1]) { heroActions[1].firstChild.nodeValue = `${content.ctaApproach?.trim() || 'Mon approche'} `; }

    setText('#approche .eyebrow',content.visionLabel);
    setRich('#approche h2',content.approachTitle);
    setText('.intro-text',content.approachText);
    const approachLink = document.querySelector('#approche .text-link');
    if (approachLink) approachLink.firstChild.nodeValue = `${content.approachLink || ''} `;

    setText('.projects .section-heading .eyebrow',content.projectsEyebrow);
    setRich('.projects .section-heading h2',content.projectsTitle);
    setRich('.project-controls>p',content.projectsIntro);
    const filterLabels = document.querySelectorAll('.filter-button');
    [content.filterAll,content.filterHabitat,content.filterResearch].forEach((value,index) => { if (filterLabels[index] && value) filterLabels[index].textContent = value; });
    const projectGrid = document.querySelector('.project-grid');
    const visibleProjects = (content.projects || []).filter(project => project.visible !== false);
    let projectCards = [...document.querySelectorAll('.project-card')];
    while (projectCards.length < visibleProjects.length) {
      const clone = projectCards[0].cloneNode(true); clone.className = 'project-card'; projectGrid.append(clone); projectCards.push(clone);
    }
    while (projectCards.length > visibleProjects.length) projectCards.pop().remove();
    projectCards.forEach((card,index) => {
      const project = visibleProjects[index]; if (!project) return;
      card.dataset.category = project.category || 'habitat';
      setIn(card,'h3',project.title); setIn(card,'.project-type',project.type);
      setIn(card,'.visual-caption',project.location); setIn(card,'.project-description',project.description);
      const projectLink = card.querySelector('.project-link');
      projectLink?.setAttribute('aria-label',`Découvrir ${project.title || 'le projet'}`);
      if (projectLink) projectLink.href = project.link || '#contact';
      setIn(card,'.visual-number',String(index+1).padStart(2,'0'));
      if (project.image) {
        const visual = card.querySelector('.project-visual'); visual.replaceChildren();
        const img = document.createElement('img'); img.src = project.image; img.alt = `Photo du projet ${project.title || ''}`; img.loading = 'lazy'; img.className = 'project-photo';
        const caption = document.createElement('div'); caption.className = 'visual-caption'; caption.textContent = project.location || '';
        const number = document.createElement('span'); number.className = 'visual-number'; number.textContent = String(index + 1).padStart(2,'0');
        visual.append(img,caption,number); visual.classList.add('has-photo');
      }
    });
    setText('.portfolio-note',content.portfolioNote);

    setRich('.manifesto>p',content.manifestoQuote);
    setText('.manifesto>span',content.manifestoAttribution);
    setText('.services-title .eyebrow',content.servicesEyebrow);
    setRich('.services-title h2',content.servicesTitle);
    setText('.services-title>p:last-child',content.servicesIntro);
    const serviceList = document.querySelector('.service-list');
    const visibleServices = (content.services || []).filter(service => service.visible !== false);
    let serviceCards = [...serviceList.querySelectorAll('article')];
    while (serviceCards.length < visibleServices.length) { const clone = serviceCards[serviceCards.length-1].cloneNode(true); serviceList.append(clone); serviceCards.push(clone); }
    while (serviceCards.length > visibleServices.length) serviceCards.pop().remove();
    serviceCards.forEach((article,index) => {
      const service = visibleServices[index]; if (!service) return;
      setIn(article,'h3',service.title); setIn(article,'p',service.description); setIn(article,'span',String(index+1).padStart(2,'0'));
    });

    setText('.journal-head .eyebrow',content.journalEyebrow);
    setRich('.journal-head h2',content.journalTitle);
    const journalLink = document.querySelector('.journal-head .text-link');
    if (journalLink) journalLink.firstChild.nodeValue = `${content.journalLink || ''} `;
    if (content.instagram) journalLink?.setAttribute('href',content.instagram);
    const journalGrid = document.querySelector('.journal-grid');
    const visibleJournal = (content.journal || []).filter(entry => entry.visible !== false);
    let journalCards = [...journalGrid.querySelectorAll('.journal-card')];
    while (journalCards.length < visibleJournal.length) { const clone = journalCards[journalCards.length-1].cloneNode(true); clone.classList.remove('journal-card-low'); journalGrid.append(clone); journalCards.push(clone); }
    while (journalCards.length > visibleJournal.length) journalCards.pop().remove();
    journalCards.forEach((card,index) => {
      const entry = visibleJournal[index]; if (!entry) return;
      setIn(card,'.journal-art>span',entry.tag); setIn(card,'p',entry.title); setIn(card,'small',entry.meta);
      if (entry.image) {
        const art = card.querySelector('.journal-art'); art.replaceChildren();
        const img = document.createElement('img'); img.src = entry.image; img.alt = entry.title || 'Photographie du journal'; img.loading = 'lazy'; img.className = 'journal-photo';
        const tag = document.createElement('span'); tag.textContent = entry.tag || ''; art.append(img,tag); art.classList.add('has-photo');
      }
    });

    setText('.contact-section .eyebrow',content.contactEyebrow);
    setRich('.contact-section h2',content.contactTitle);
    setText('.contact-grid>div:first-child>p:not(.eyebrow)',content.contactText);
    const contactButton = document.querySelector('.contact-section .button');
    if (contactButton) contactButton.firstChild.nodeValue = `${content.contactButton || ''} `;
    if (content.email) {
      document.querySelectorAll('.contact-side a[href^="mailto:"]').forEach(link => { link.href = `mailto:${content.email}`; if (link.textContent.includes('@')) link.textContent = `${content.email} ↗`; });
      if (contactButton) contactButton.href = `mailto:${content.email}?subject=Parlons%20de%20mon%20projet`;
    }
    if (content.phone) {
      const tel = document.querySelector('.contact-side a[href^="tel:"]');
      if (tel) { tel.href = `tel:${content.phone.replace(/[^+\d]/g,'')}`; tel.textContent = `${content.phoneLabel || 'Téléphone'} · ${content.phone} ↗`; }
    }
    const contactSideText = document.querySelector('.contact-side>p');
    if (contactSideText) contactSideText.textContent = `${content.city || ''}\n${content.availability || ''}`;
    const instagramLink = document.querySelector('.contact-side a[href*="instagram.com"]');
    if (instagramLink && content.instagram) instagramLink.href = content.instagram;

    if (SEASONS[content.season]) {
      document.documentElement.style.setProperty('--accent',SEASONS[content.season][0]);
      document.documentElement.style.setProperty('--accent-dark',SEASONS[content.season][1]);
      document.querySelectorAll('.season-control button').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.season === content.season)));
    }
  }
}

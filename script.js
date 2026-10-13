(() => {
  const root = document.documentElement;
  const seasonColors = {
    olive: ['#b5a323', '#807313'],
    terracotta: ['#a95d43', '#7e3e2d'],
    blue: ['#547984', '#3b5961'],
    sage: ['#71805d', '#536044']
  };
  const seasonButtons = [...document.querySelectorAll('.season-control button')];
  const setSeason = (season, save = true) => {
    const colors = seasonColors[season] || seasonColors.olive;
    root.style.setProperty('--accent', colors[0]);
    root.style.setProperty('--accent-dark', colors[1]);
    seasonButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.season === season)));
    if (save) {
      try { localStorage.setItem('ybs-season', season); } catch {}
    }
  };
  const quarter = Math.floor(new Date().getMonth() / 3);
  const seasonByQuarter = ['olive', 'terracotta', 'blue', 'sage'];
  let savedSeason;
  try { savedSeason = localStorage.getItem('ybs-season'); } catch {}
  setSeason(savedSeason && seasonColors[savedSeason] ? savedSeason : seasonByQuarter[quarter], false);
  seasonButtons.forEach(button => button.addEventListener('click', () => setSeason(button.dataset.season)));

  document.getElementById('year').textContent = new Date().getFullYear();
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
  }));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.project-card, .service-list article, .journal-card, .intro-grid > div').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
  });
})();

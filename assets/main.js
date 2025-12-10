(function(){
  // Theme toggle with persistence
  const storageKey = 'portfolio.theme';
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const saved = localStorage.getItem(storageKey);
  const theme = saved || (prefersLight ? 'light' : 'dark');
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorage.setItem(storageKey, isLight ? 'dark' : 'light');
  });

  // Footer dates
  const y = document.getElementById('year');
  const u = document.getElementById('updated');
  if (y) y.textContent = new Date().getFullYear();
  if (u) u.textContent = new Date().toISOString().slice(0,10);

  // Load projects.json and render cards
  async function loadProjects(){
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    try {
      const res = await fetch('data/projects.json', {cache: 'no-store'});
      if (!res.ok) throw new Error('Failed to fetch projects.json');
      const items = await res.json();
      grid.innerHTML = '';
      items.forEach((p, i) => grid.appendChild(projectCard(p, i)));
    } catch (err) {
      console.error(err);
      const msg = document.createElement('p');
      msg.className = 'err';
      msg.textContent = 'Could not load projects right now.';
      grid.appendChild(msg);
    }
  }

  function projectCard(p, index){
    const article = document.createElement('article');
    article.className = 'card project';
    article.setAttribute('aria-labelledby', `p${index}-title`);

    const h3 = document.createElement('h3');
    h3.id = `p${index}-title`;
    h3.textContent = p.title || 'Untitled Project';

    const stack = document.createElement('p');
    stack.className = 'stack';
    stack.textContent = p.stack || '';

    const desc = document.createElement('p');
    desc.textContent = p.description || '';

    const links = document.createElement('div');
    links.className = 'links';
    if (p.links && typeof p.links === 'object') {
      Object.entries(p.links).forEach(([label, href]) => {
        if (!href) return;
        links.appendChild(btn(formatLabel(label), href));
      });
    }

    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.alt = p.image_alt || `${p.title} preview`;
      img.loading = 'lazy';
      img.decoding = 'async';
      article.appendChild(img);
    }

    article.appendChild(h3);
    article.appendChild(stack);
    article.appendChild(desc);
    article.appendChild(links);
    return article;
  }

  function btn(label, href){
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = label;
    return a;
  }

  function formatLabel(raw){
    if (!raw) return 'Link';
    // Convert keys like "demo_video" or "github repository" to "Demo video"
    return raw
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^./, c => c.toUpperCase());
  }

  document.addEventListener('DOMContentLoaded', loadProjects);
})();
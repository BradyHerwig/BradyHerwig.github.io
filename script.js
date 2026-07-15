// Brady S. Herwig — Portfolio
// Theme, nav, GitHub projects, scroll reveals, accessibility

const THEME_KEY = 'brady-theme';
const GITHUB_USER = 'BradyHerwig';

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ----------------------
// Tailwind (CDN) extend — mirrors index.html early config
function initTailwind() {
  if (typeof tailwind === 'undefined') return;
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          surface: {
            DEFAULT: 'var(--color-background)',
            raised: 'var(--color-surface)',
            muted: 'var(--color-muted)',
          },
          ink: {
            DEFAULT: 'var(--color-foreground)',
            muted: 'var(--color-foreground-muted)',
            subtle: 'var(--color-foreground-subtle)',
          },
          accent: {
            DEFAULT: 'var(--color-accent)',
            soft: 'var(--color-accent-soft)',
            hover: 'var(--color-accent-hover)',
          },
          line: 'var(--color-border)',
        },
        fontFamily: {
          display: ['Exo', 'system-ui', 'sans-serif'],
          sans: ['DM Sans', 'system-ui', 'sans-serif'],
          mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
        },
        maxWidth: {
          content: '72rem',
        },
      },
    },
  };
}

// ----------------------
// Theme
function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  updateThemeIcon(theme);
  updateThemeColorMeta(theme);
}

function updateThemeColorMeta(theme) {
  const meta = document.querySelector('meta[name="theme-color"]:not([media])')
    || document.querySelector('meta[name="theme-color"]');
  if (meta && !meta.hasAttribute('media')) {
    meta.setAttribute('content', theme === 'dark' ? '#09090B' : '#FAFAFA');
  }
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById('theme-icon');
  if (!iconContainer) return;

  if (theme === 'dark') {
    // Sun — switch to light
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5m-2.136-6.364l-1.06 1.06M7.696 16.304l-1.06 1.06m12.728 0l-1.06-1.06M7.696 7.696l-1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>`;
  } else {
    // Moon — switch to dark
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>`;
  }
}

function initTheme() {
  const saved = getSavedTheme();
  const theme = saved || getSystemTheme();
  applyTheme(theme);

  if (!saved && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch { /* ignore */ }
    });
  }
}

// ----------------------
// Mobile menu
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');

  if (!btn || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('hidden', !open);
    if (open) {
      menu.removeAttribute('hidden');
    } else {
      menu.setAttribute('hidden', '');
    }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!isOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

// ----------------------
// Smooth scroll + active section
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const nav = document.getElementById('site-nav');
      const navHeight = nav ? nav.offsetHeight : 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
      history.pushState(null, '', id);
    });
  });
}

function initNavScrollState() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initActiveSection() {
  const sections = ['about', 'projects', 'skills', 'education', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = document.querySelectorAll('[data-nav]');

  if (!sections.length || !links.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('data-nav') === id);
    });
  };

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ----------------------
// Skills
function initSkills() {
  const techContainer = document.getElementById('tech-skills');
  const softContainer = document.getElementById('soft-skills');

  const techSkills = [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Jupyter',
    'Git & GitHub', 'Data Visualization', 'Scikit-learn',
    'Statistics', 'Exploratory Data Analysis',
  ];

  const softSkills = [
    'Leadership', 'Communication', 'Collaboration',
    'Problem Solving', 'Determined', 'Friendly & Understanding',
  ];

  if (techContainer) {
    techContainer.innerHTML = techSkills
      .map((skill) => `<span class="skill-pill tech">${escapeHtml(skill)}</span>`)
      .join('');
  }

  if (softContainer) {
    softContainer.innerHTML = softSkills
      .map((skill) => `<span class="skill-pill soft">${escapeHtml(skill)}</span>`)
      .join('');
  }
}

// ----------------------
// GitHub Projects
async function fetchGitHubRepos() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const loadingLabel = document.getElementById('projects-loading-label');
  const url = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!res.ok) throw new Error('GitHub API error');

    let repos = await res.json();
    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (loadingLabel) loadingLabel.remove();

    if (repos.length === 0) {
      renderEmptyState(grid);
      return;
    }

    grid.innerHTML = repos.map((repo) => createProjectCard(repo)).join('');
    initScrollReveals(grid.querySelectorAll('.project-card'));
  } catch (err) {
    console.warn('Could not fetch GitHub repos:', err);
    if (loadingLabel) loadingLabel.remove();
    renderEmptyState(grid, true);
  }
}

function createProjectCard(repo) {
  const name = repo.name;
  const description = repo.description || 'No description provided yet.';
  const language = repo.language || '—';
  const stars = repo.stargazers_count ?? 0;
  const updated = new Date(repo.updated_at);
  const updatedStr = updated.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  const url = repo.html_url;

  return `
    <a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer"
       class="project-card reveal" role="listitem">
      <div class="flex items-start justify-between gap-3">
        <h3 class="project-card__title">${escapeHtml(name)}</h3>
        <svg class="ext-icon w-4 h-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
      <p class="project-card__desc">${escapeHtml(description)}</p>
      <div class="project-card__meta">
        <span class="badge">${escapeHtml(language)}</span>
        <span class="inline-flex items-center gap-1 tabular-nums" title="Stars">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          ${stars}
        </span>
        <span class="ml-auto font-mono text-[0.7rem]">Updated ${escapeHtml(updatedStr)}</span>
      </div>
    </a>
  `;
}

function renderEmptyState(container, hadError = false) {
  const message = hadError
    ? "Couldn't load projects right now (GitHub rate limit or network). Check back later or visit my GitHub directly."
    : "I'm currently building my first data science projects. Check back soon — or explore my GitHub for the latest work in progress.";

  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <p class="text-ink-muted max-w-sm mx-auto text-sm leading-relaxed">${message}</p>
      <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer"
         class="btn btn-soft mt-5 cursor-pointer">
        Visit GitHub
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

// ----------------------
// Scroll reveals
function initScrollReveals(extraElements) {
  if (prefersReducedMotion()) {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach((el) => {
      el.classList.add('is-visible');
    });
    if (extraElements) {
      extraElements.forEach((el) => el.classList.add('is-visible'));
    }
    return;
  }

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const targets = extraElements
    ? Array.from(extraElements)
    : [
        ...document.querySelectorAll('.reveal'),
        ...document.querySelectorAll('.reveal-stagger > *'),
      ];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  targets.forEach((el) => {
    if (!el.classList.contains('is-visible')) {
      observer.observe(el);
    }
  });
}

// ----------------------
// Resume toast
function initResumeButton() {
  const btn = document.getElementById('resume-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    showToast('Resume PDF coming soon — check back shortly.');
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  // force reflow for re-trigger
  void toast.offsetWidth;
  toast.classList.add('is-show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 3200);
}

// ----------------------
// Boot
function init() {
  initTailwind();
  initTheme();
  initMobileMenu();
  initSmoothScroll();
  initNavScrollState();
  initActiveSection();
  initSkills();
  initResumeButton();
  initScrollReveals();
  fetchGitHubRepos();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

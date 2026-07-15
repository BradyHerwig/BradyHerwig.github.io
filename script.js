// Brady S. Herwig — Portfolio
// Theme, nav, scroll reveal, GitHub projects (Tailwind config lives in index.html BEFORE CDN)

const THEME_KEY = 'brady-theme';
const GITHUB_USER = 'BradyHerwig';

function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

// ----------------------
// Scroll reveal (subtle fade-up; skipped when reduced-motion)
function initReveal() {
  // Above-the-fold hero should never flash empty
  document.querySelectorAll('.hero .reveal:not(.is-visible)').forEach((el) => {
    el.classList.add('is-visible');
  });

  const nodes = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!nodes.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    nodes.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  nodes.forEach((el) => observer.observe(el));
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
  document.documentElement.classList.toggle('dark', theme === 'dark');
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const el = document.getElementById('theme-icon');
  if (!el) return;

  if (theme === 'dark') {
    el.innerHTML = `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5m-2.136-6.364l-1.06 1.06M7.696 16.304l-1.06 1.06m12.728 0l-1.06-1.06M7.696 7.696l-1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>`;
  } else {
    el.innerHTML = `
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>`;
  }
}

function initTheme() {
  applyTheme(getSavedTheme() || getSystemTheme());

  if (!getSavedTheme() && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getSavedTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
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
    if (open) menu.removeAttribute('hidden');
    else menu.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (iconOpen && iconClose) {
      iconOpen.classList.toggle('hidden', open);
      iconClose.classList.toggle('hidden', !open);
    }
  }

  btn.addEventListener('click', () => {
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

// ----------------------
// Smooth scroll + nav state
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const nav = document.getElementById('site-nav');
      const offset = (nav ? nav.offsetHeight : 64) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
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
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initActiveSection() {
  const sections = ['about', 'projects', 'skills', 'education', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = document.querySelectorAll('[data-nav]');
  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('data-nav') === entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

// ----------------------
// Skills
function initSkills() {
  const tech = [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Jupyter',
    'Git & GitHub', 'Data Visualization', 'Scikit-learn',
    'Statistics', 'Exploratory Data Analysis',
  ];
  const soft = [
    'Leadership', 'Communication', 'Collaboration',
    'Problem Solving', 'Determined', 'Friendly & Understanding',
  ];

  const techEl = document.getElementById('tech-skills');
  const softEl = document.getElementById('soft-skills');
  if (techEl) {
    techEl.innerHTML = tech.map((s) => `<span class="skill-pill tech">${escapeHtml(s)}</span>`).join('');
  }
  if (softEl) {
    softEl.innerHTML = soft.map((s) => `<span class="skill-pill soft">${escapeHtml(s)}</span>`).join('');
  }
}

// ----------------------
// GitHub projects
async function fetchGitHubRepos() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );
    if (!res.ok) throw new Error('GitHub API error');

    const repos = (await res.json()).sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    if (!repos.length) {
      renderEmptyState(grid, false);
      return;
    }

    grid.innerHTML = repos.map(createProjectCard).join('');
    initReveal();
  } catch (err) {
    console.warn('Could not fetch GitHub repos:', err);
    renderEmptyState(grid, true);
  }
}

function createProjectCard(repo) {
  const description = repo.description || 'No description provided yet.';
  const language = repo.language || '—';
  const stars = repo.stargazers_count ?? 0;
  const updatedStr = new Date(repo.updated_at).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });

  return `
    <a href="${escapeAttr(repo.html_url)}" target="_blank" rel="noopener noreferrer"
       class="project-card reveal" role="listitem">
      <div class="flex items-start justify-between gap-3">
        <h3 class="project-card__title">${escapeHtml(repo.name)}</h3>
        <svg class="h-4 w-4 shrink-0 mt-0.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </div>
      <p class="project-card__desc">${escapeHtml(description)}</p>
      <div class="project-card__meta">
        <span class="badge">${escapeHtml(language)}</span>
        <span class="inline-flex items-center gap-1 tabular-nums">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          ${stars}
        </span>
        <span class="ml-auto">Updated ${escapeHtml(updatedStr)}</span>
      </div>
    </a>
  `;
}

function renderEmptyState(container, hadError) {
  const message = hadError
    ? "Couldn't load projects right now. Visit my GitHub directly."
    : "I'm building my first data science projects. Check back soon.";

  container.innerHTML = `
    <div class="empty-state">
      <div class="icon-well mx-auto mb-4 h-11 w-11 rounded-xl" aria-hidden="true">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      </div>
      <p class="mx-auto max-w-sm text-sm leading-relaxed text-subtle">${message}</p>
      <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer" class="btn btn-soft mt-5 cursor-pointer">
        Visit GitHub
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
// Resume toast
function initResumeButton() {
  const btn = document.getElementById('resume-btn');
  if (!btn) return;
  btn.addEventListener('click', () => showToast('Resume PDF coming soon — check back shortly.'));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.remove('is-show');
  void toast.offsetWidth;
  toast.classList.add('is-show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove('is-show');
    setTimeout(() => {
      toast.hidden = true;
    }, 300);
  }, 3000);
}

// ----------------------
function init() {
  initTheme();
  initMobileMenu();
  initSmoothScroll();
  initNavScrollState();
  initActiveSection();
  initSkills();
  initResumeButton();
  initReveal();
  fetchGitHubRepos();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

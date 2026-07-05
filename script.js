// Brady S. Herwig - Portfolio Script
// Clean, modern baseline with:
// - System-aware light/dark mode + manual toggle + persistence
// - GitHub repos fetch (hybrid approach ready)
// - Smooth interactions

// ----------------------
// Tailwind config (via CDN)
function initTailwind() {
  if (typeof tailwind === 'undefined') return;

  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Forest / muted greens
          forest: {
            700: '#166534',
            600: '#15803d',
            500: '#22c55e',
          },
          // Warm browns
          earth: {
            800: '#78350f',
            700: '#92400e',
          }
        }
      }
    }
  };
}

// ----------------------
// Theme (Light / Dark) - follows system by default
const THEME_KEY = 'brady-theme';

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY);
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById('theme-icon');
  if (!iconContainer) return;

  if (theme === 'dark') {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    `;
  } else {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    `;
  }
}

function initTheme() {
  const saved = getSavedTheme();
  const theme = saved || getSystemTheme();
  applyTheme(theme);

  // Listen for system changes only if user hasn't manually chosen
  if (!saved && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Toggle button
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }
}

// ----------------------
// Mobile menu
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

// ----------------------
// Smooth scroll for anchor links (nice baseline)
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ----------------------
// Skills (data science focused)
function initSkills() {
  const techContainer = document.getElementById('tech-skills');
  const softContainer = document.getElementById('soft-skills');

  const techSkills = [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Jupyter',
    'Git & GitHub', 'Data Visualization', 'Scikit-learn',
    'Statistics', 'Exploratory Data Analysis'
  ];

  const softSkills = [
    'Leadership', 'Communication', 'Collaboration',
    'Problem Solving', 'Determined', 'Friendly & Understanding'
  ];

  if (techContainer) {
    techContainer.innerHTML = techSkills.map(skill =>
      `<span class="skill-pill tech">${skill}</span>`
    ).join('');
  }

  if (softContainer) {
    softContainer.innerHTML = softSkills.map(skill =>
      `<span class="skill-pill soft">${skill}</span>`
    ).join('');
  }
}

// ----------------------
// GitHub Projects (hybrid fetch)
async function fetchGitHubRepos() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const username = 'BradyHerwig';
  const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) throw new Error('GitHub API error');

    let repos = await res.json();

    // Filter out forks if you want (keep for now)
    // repos = repos.filter(r => !r.fork);

    // Sort by updated (newest first) — API already does this but double ensure
    repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    if (repos.length === 0) {
      renderEmptyState(grid);
      return;
    }

    grid.innerHTML = repos.map(repo => createProjectCard(repo)).join('');

  } catch (err) {
    console.warn('Could not fetch GitHub repos:', err);
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
    <a href="${url}" target="_blank" rel="noopener"
       class="project-card group block rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 hover:border-emerald-700 dark:hover:border-emerald-600">
      <div class="flex items-start justify-between gap-3">
        <h4 class="font-semibold text-lg tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          ${escapeHtml(name)}
        </h4>
        <span class="text-[10px] text-stone-400 shrink-0">↗</span>
      </div>

      <p class="mt-2 text-sm text-stone-600 dark:text-stone-400 max-h-16 overflow-hidden">
        ${escapeHtml(description)}
      </p>

      <div class="mt-4 flex items-center gap-2 flex-wrap text-xs">
        <span class="badge bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
          ${escapeHtml(language)}
        </span>

        <span class="text-stone-400 dark:text-stone-500 flex items-center gap-1">
          ★ <span class="tabular-nums">${stars}</span>
        </span>

        <span class="text-stone-400 dark:text-stone-500 ml-auto">
          Updated ${updatedStr}
        </span>
      </div>
    </a>
  `;
}

function renderEmptyState(container, hadError = false) {
  const message = hadError
    ? "Couldn't load projects right now (GitHub rate limit or network). Check back later or visit my GitHub directly."
    : "I'm currently building my first data science projects. Check back soon — or explore my GitHub for the latest work in progress.";

  container.innerHTML = `
    <div class="col-span-full border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl p-8 text-center">
      <div class="mx-auto w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
        <span class="text-emerald-700 dark:text-emerald-400 text-lg">📊</span>
      </div>
      <p class="text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
        ${message}
      </p>
      <a href="https://github.com/BradyHerwig" target="_blank" rel="noopener"
         class="mt-4 inline-block text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
        Visit GitHub →
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

// ----------------------
// Main initialization
function init() {
  initTailwind();
  initTheme();
  initMobileMenu();
  initSmoothScroll();
  initSkills();

  // Fetch GitHub repos (non-blocking)
  fetchGitHubRepos();

  // Optional: keyboard support for theme toggle
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === '?' && document.activeElement.tagName === 'BODY') {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
    }
  });
}

// Boot
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

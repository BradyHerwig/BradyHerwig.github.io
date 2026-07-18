// Brady S. Herwig — Portfolio
// Theme, nav, scroll reveal, project jump nav, screenshot carousels

const THEME_KEY = 'brady-theme';

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

// ----------------------
// Skills (home only)
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
// Screenshot carousel (left ↔ right)
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('[data-carousel-track]');
    const slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    const dotsWrap = root.querySelector('[data-carousel-dots]');
    const status = root.querySelector('[data-carousel-status]');
    if (!track || slides.length < 2) return;

    let index = 0;
    let touchStartX = null;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map((_, i) => {
          const label = `Go to screenshot ${i + 1} of ${slides.length}`;
          return `<button type="button" class="shot-carousel__dot" role="tab" data-carousel-dot="${i}" aria-label="${escapeAttr(label)}" aria-selected="false"></button>`;
        })
        .join('');
    }

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('[data-carousel-dot]')) : [];

    function goTo(nextIndex, { announce = true } = {}) {
      const total = slides.length;
      index = ((nextIndex % total) + total) % total;
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;

      slides.forEach((slide, i) => {
        const active = i === index;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.setAttribute('aria-label', `${i + 1} of ${total}`);
      });

      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (status && announce) {
        status.textContent = `Slide ${index + 1} of ${total}`;
      }
    }

    prevBtn?.addEventListener('click', () => goTo(index - 1));
    nextBtn?.addEventListener('click', () => goTo(index + 1));

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const i = Number(dot.getAttribute('data-carousel-dot'));
        if (!Number.isNaN(i)) goTo(i);
      });
    });

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(index + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(slides.length - 1);
      }
    });

    // Make the region focusable for keyboard rotation without trapping tab order
    if (!root.hasAttribute('tabindex')) {
      root.setAttribute('tabindex', '0');
    }

    const viewport = root.querySelector('.shot-carousel__viewport');
    if (viewport) {
      viewport.addEventListener(
        'touchstart',
        (e) => {
          touchStartX = e.changedTouches[0]?.clientX ?? null;
        },
        { passive: true }
      );
      viewport.addEventListener(
        'touchend',
        (e) => {
          if (touchStartX == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
          touchStartX = null;
          if (Math.abs(dx) < 40) return;
          goTo(index + (dx < 0 ? 1 : -1));
        },
        { passive: true }
      );
    }

    goTo(0, { announce: false });
  });
}

// ----------------------
// Projects page: jump nav + active showcase tracking
function initProjectJumpNav() {
  const showcases = document.querySelectorAll('.project-showcase[id]');
  const jumpWrap = document.getElementById('project-jump');
  const jumpNav = jumpWrap && jumpWrap.querySelector('.project-jump-nav');
  if (!showcases.length || !jumpWrap || !jumpNav) return;

  jumpWrap.hidden = false;
  jumpNav.innerHTML = Array.from(showcases)
    .map((section) => {
      const id = section.id;
      const title = section.getAttribute('data-title') || id.replace(/^project-/, '').replace(/-/g, ' ');
      return `<a href="#${escapeAttr(id)}" class="project-jump-link" data-jump="${escapeAttr(id)}">${escapeHtml(title)}</a>`;
    })
    .join('');

  const links = jumpNav.querySelectorAll('[data-jump]');
  if (!links.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('data-jump') === id);
        });
      });
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: 0 }
  );

  showcases.forEach((s) => observer.observe(s));
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
function init() {
  initTheme();
  initMobileMenu();
  initSmoothScroll();
  initNavScrollState();
  initSkills();
  initResumeButton();
  initProjectJumpNav();
  initCarousels();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

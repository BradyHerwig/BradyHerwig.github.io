// Brady S. Herwig — AuthKit portfolio

function prefersReducedMotion() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

function initReveal() {
  document.querySelectorAll(".hero .reveal:not(.is-visible)").forEach((el) => {
    el.classList.add("is-visible");
  });

  const nodes = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!nodes.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  nodes.forEach((el) => observer.observe(el));
}

function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  if (!btn || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    if (open) menu.removeAttribute("hidden");
    else menu.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (iconOpen && iconClose) {
      if (open) {
        iconOpen.setAttribute("hidden", "");
        iconClose.removeAttribute("hidden");
      } else {
        iconOpen.removeAttribute("hidden");
        iconClose.setAttribute("hidden", "");
      }
      iconOpen.hidden = open;
      iconClose.hidden = !open;
    }
  }

  btn.addEventListener("click", () => {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const nav = document.getElementById("site-nav");
      const offset = (nav ? nav.offsetHeight : 64) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      history.pushState(null, "", id);
    });
  });
}

function initNavScrollState() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initSkills() {
  const tech = [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Jupyter",
    "Git & GitHub",
    "Data Visualization",
    "Scikit-learn",
    "Statistics",
    "Exploratory Data Analysis",
  ];
  const soft = [
    "Leadership",
    "Communication",
    "Collaboration",
    "Problem Solving",
    "Determined",
    "Friendly & Understanding",
  ];

  const techEl = document.getElementById("tech-skills");
  const softEl = document.getElementById("soft-skills");
  if (techEl) {
    techEl.innerHTML = tech.map((s) => `<span class="skill-pill">${escapeHtml(s)}</span>`).join("");
  }
  if (softEl) {
    softEl.innerHTML = soft.map((s) => `<span class="skill-pill">${escapeHtml(s)}</span>`).join("");
  }
}

function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const viewport = root.querySelector("[data-carousel-viewport]");
    const slides = Array.from(root.querySelectorAll("[data-carousel-slide]"));
    const prevBtn = root.querySelector("[data-carousel-prev]");
    const nextBtn = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    const status = root.querySelector("[data-carousel-status]");
    if (!viewport || slides.length < 2) return;

    let index = 0;
    let scrollRaf = 0;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map((_, i) => {
          const label = `Go to screenshot ${i + 1} of ${slides.length}`;
          return `<button type="button" class="carousel__dot" data-carousel-dot="${i}" aria-label="${escapeAttr(label)}" aria-current="false"></button>`;
        })
        .join("");
    }

    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll("[data-carousel-dot]")) : [];

    function slideWidth() {
      return viewport.clientWidth || 1;
    }

    function syncUi(active, { announce = true } = {}) {
      const total = slides.length;
      index = active;
      slides.forEach((slide, i) => {
        const on = i === index;
        slide.setAttribute("aria-hidden", on ? "false" : "true");
        slide.setAttribute("aria-label", `${i + 1} of ${total}`);
      });
      dots.forEach((dot, i) => {
        const on = i === index;
        dot.classList.toggle("is-active", on);
        dot.setAttribute("aria-current", on ? "true" : "false");
      });
      if (status && announce) status.textContent = `Slide ${index + 1} of ${total}`;
    }

    function goTo(nextIndex, { announce = true, instant = false } = {}) {
      const total = slides.length;
      const target = ((nextIndex % total) + total) % total;
      const behavior = instant || prefersReducedMotion() ? "auto" : "smooth";
      viewport.scrollTo({ left: Math.round(target * slideWidth()), behavior });
      syncUi(target, { announce });
    }

    function indexFromScroll() {
      const w = slideWidth();
      return Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / w)));
    }

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.getAttribute("data-carousel-dot"));
        if (!Number.isNaN(i)) goTo(i);
      });
    });

    viewport.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    viewport.addEventListener(
      "scroll",
      () => {
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(() => {
          const next = indexFromScroll();
          if (next !== index) syncUi(next);
        });
      },
      { passive: true }
    );

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => goTo(index, { announce: false, instant: true })).observe(viewport);
    }

    syncUi(0, { announce: false });
    viewport.scrollLeft = 0;
  });
}

function initProjectJumpNav() {
  const showcases = document.querySelectorAll(".project-showcase[id]");
  const jumpWrap = document.getElementById("project-jump");
  const jumpNav = jumpWrap && jumpWrap.querySelector(".project-jump-nav");
  if (!showcases.length || !jumpWrap || !jumpNav) return;

  jumpWrap.hidden = false;
  jumpNav.innerHTML = Array.from(showcases)
    .map((section) => {
      const id = section.id;
      const title = section.getAttribute("data-title") || id;
      return `<a href="#${escapeAttr(id)}" data-jump="${escapeAttr(id)}">${escapeHtml(title)}</a>`;
    })
    .join("");

  const links = jumpNav.querySelectorAll("[data-jump]");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("data-jump") === id);
        });
      });
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
  );

  showcases.forEach((s) => observer.observe(s));
}

function init() {
  document.documentElement.classList.remove("dark");
  try {
    localStorage.removeItem("brady-theme");
  } catch {
    /* ignore */
  }

  initMobileMenu();
  initSmoothScroll();
  initNavScrollState();
  initSkills();
  initProjectJumpNav();
  initCarousels();
  initReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

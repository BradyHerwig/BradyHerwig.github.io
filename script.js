const PROFILE_LINKS = {
  showLinkedIn: false,
  linkedInUrl: "",
  showGitHub: false,
  gitHubUrl: "",
  showProjectCode: false,
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  if (!btn || !icon) return;
  const apply = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    icon.setAttribute("data-icon", theme === "dark" ? "sun" : "moon");
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  };
  apply(document.documentElement.getAttribute("data-theme") || "light");
  btn.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });
}

function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  const openIcon = document.getElementById("menu-icon-open");
  const closeIcon = document.getElementById("menu-icon-close");
  if (!btn || !menu) return;
  const setOpen = (open) => {
    menu.hidden = !open;
    menu.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (openIcon) openIcon.hidden = open;
    if (closeIcon) closeIcon.hidden = !open;
    if (open) {
      const first = menu.querySelector("a, button");
      if (first) first.focus();
    }
  };
  btn.addEventListener("click", () => setOpen(menu.hidden));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || menu.hidden) return;
    const focusable = Array.from(menu.querySelectorAll("a, button"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setOpen(false);
      btn.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (menu.hidden) return;
    if (menu.contains(event.target) || btn.contains(event.target)) return;
    setOpen(false);
  });
}

function initNavScroll() {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initScrollSpy() {
  const links = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!links.length) return;
  const map = new Map();
  links.forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) map.set(section, link);
  });
  if (!map.size || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const on = link === map.get(entry.target);
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
  map.forEach((_, section) => observer.observe(section));
}

function initSkills() {
  const tech = ["Python", "Pandas", "NumPy", "Scikit-learn", "PyTorch", "KNIME", "SQL", "Matplotlib", "Jupyter", "Git"];
  const soft = ["Clear writing", "Checking my work", "Communication", "Collaboration", "Problem solving"];
  const techEl = document.getElementById("tech-skills");
  const softEl = document.getElementById("soft-skills");
  const pill = (label) => `<span class="skill-pill">${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`;
  if (techEl) techEl.innerHTML = tech.map(pill).join("");
  if (softEl) softEl.innerHTML = soft.map(pill).join("");
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  nodes.forEach((node) => observer.observe(node));
}

function initCopyEmail() {
  const btn = document.getElementById("copy-email");
  const status = document.getElementById("copy-status");
  const icon = document.getElementById("copy-icon");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("bradyherwig@outlook.com");
      if (status) status.textContent = "Copied";
      if (icon) icon.setAttribute("data-icon", "check");
      window.setTimeout(() => {
        if (status) status.textContent = "";
        if (icon) icon.setAttribute("data-icon", "copy");
      }, 1500);
    } catch (e) {
      if (status) status.textContent = "Copy failed";
    }
  });
}

function initProfileLinks() {
  document.querySelectorAll("[data-slot]").forEach((node) => {
    const slot = node.getAttribute("data-slot");
    let show = false;
    let url = "";
    if (slot === "linkedin") {
      show = PROFILE_LINKS.showLinkedIn;
      url = PROFILE_LINKS.linkedInUrl;
    } else if (slot === "github") {
      show = PROFILE_LINKS.showGitHub;
      url = PROFILE_LINKS.gitHubUrl;
    } else if (slot === "code") {
      show = PROFILE_LINKS.showProjectCode;
      url = node.getAttribute("href") || "";
    }
    if (show && url) {
      node.hidden = false;
      if (slot !== "code") node.setAttribute("href", url);
    } else {
      node.hidden = true;
    }
  });
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initProjectJumpNav() {
  const showcases = document.querySelectorAll(".project-showcase[id]");
  const jump = document.getElementById("project-jump");
  const nav = jump && jump.querySelector(".project-jump-nav");
  if (!showcases.length || !jump || !nav) return;
  jump.hidden = false;
  nav.innerHTML = Array.from(showcases).map((section) => {
    const id = section.id;
    const title = section.getAttribute("data-title") || id;
    return `<a href="#${id}">${title}</a>`;
  }).join("");
}

function initCarousels() {
  /* Carousels are not used. Figures are static. */
}

function init() {
  initTheme();
  initMobileMenu();
  initNavScroll();
  initScrollSpy();
  initSkills();
  initReveal();
  initCopyEmail();
  initProfileLinks();
  initYear();
  initProjectJumpNav();
  initCarousels();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

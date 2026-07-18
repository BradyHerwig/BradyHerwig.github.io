# Page Override: Projects

> Overrides `MASTER.md` for the projects showcase page only.
> Keep **Deep Ocean Mist** tokens — do not introduce new palette colors.

**Page:** `projects.html`  
**Updated:** 2026-07-17  
**Pattern:** Case-study showcase (long-form sections, not live GitHub grid)

---

## Purpose

Dedicated page for curated project deep-dives. Home (`index.html`) must **not** list projects.

Each project section includes:

1. Title + short summary  
2. Screenshot carousel (`.shot-carousel` left ↔ right wheel)  
3. **What it shows** — product / analysis narrative  
4. **What I learned** — skills & takeaways  
5. **Tools & libraries** — exact stack used  

---

## Layout

1. Shared sticky nav (Projects link active)  
2. Page hero — label, title, brief intro  
3. Sticky-ish table of contents (optional on desktop) or jump links  
4. Stacked project case studies (`#project-*`), alternating surface if needed  
5. Empty / coming-soon state when no showcases yet  
6. Footer contact CTAs  

**Spacing:** Master section padding (`py-16` → `py-24`). Case study vertical gap: `--space-3xl`.  

**Measure:** Body prose max ~`65ch`. Screenshots full content width inside cards.

---

## Components (projects only)

### `.project-showcase`

- Soft UI card surface (`--color-surface`, border, `--shadow-sm`)  
- Top accent bar (gradient) optional on hover / always subtle  
- Internal blocks: `.project-showcase__media`, `__body`, `__block`  
- Tool chips reuse `.skill-pill.tech` / `.badge`  

### Screenshot carousel

- **Pattern:** CSS scroll-snap scroller (web.dev / Chrome gallery) + JS `scrollTo`  
- `.shot-carousel__viewport` is the scroller (`overflow-x: auto`, `scroll-snap-type: x mandatory`)  
- Slides are **direct flex children** (`flex: 0 0 100%`, `scroll-snap-align: start`, `scroll-snap-stop: always`)  
- Do **not** use `transform: translateX(-N%)` on a multi-slide track — % is relative to full track width  
- Prev/next + dots: `scrollTo({ left: index * clientWidth })`; scroll events sync active dot  
- Keyboard on focused viewport: ← / → / Home / End; native touch/trackpad swipe  
- Plot images: `object-fit: contain`; hidden scrollbar; 44px controls  
- `prefers-reduced-motion` → `scroll-behavior: auto`

### Jump nav

- Horizontal scroll chips on mobile; wrap on desktop  
- Min 44px touch targets  
- Active section can use same `.nav-link.is-active` accent tint  

---

## Content rules

- No emoji icons — Heroicons outline only  
- Headings: h1 page title → h2 project name → h3 block titles  
- Screenshots path: `screenshots/<project-slug>/`  
- Prefer real project copy when available; placeholders must read intentional, not lorem  

---

## Anti-patterns

- Do not re-introduce GitHub API repo grid on this page (showcase is curated)  
- Do not list project cards on `index.html`  
- Do not use Vibrant purple / green tokens from generic design-system search  

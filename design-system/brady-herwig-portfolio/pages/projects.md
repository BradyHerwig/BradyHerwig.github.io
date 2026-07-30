# Page Override: Projects

> Overrides `MASTER.md` for the projects showcase page only.
> Keep **Monad** tokens — do not introduce new palette colors.

**Page:** `projects.html`  
**Updated:** 2026-07-30  
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

1. Announcement bar + sticky nav (Projects link active)  
2. Centered typographic hero — serif title, mono subtext, pill CTAs  
3. Jump links (pipeline-style pills) when showcases exist  
4. Stacked project case studies (`#project-*`) with soft gradient wash on even sections  
5. Elevated periwinkle CTA card at bottom  
6. Footer  

**Spacing:** Master section padding; card padding 40px.  

**Measure:** Body prose max ~`65ch`. Screenshots full content width inside ash-bordered frames.

---

## Components on this page

- Feature cards: 1px Ash, 40px radius, serif 24px titles, mono Graphite body  
- One elevated periwinkle card per project (e.g. “What I learned”)  
- Primary CTA = Lake Blue pill with ▸; secondary = ghost pill  
- Carousel controls: ash-bordered circular pills, Off-Black active dots  

No photography; charts/screenshots only. No card shadows.

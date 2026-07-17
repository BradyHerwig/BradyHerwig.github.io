# Brady S. Herwig — Personal Website

Clean personal portfolio for a data science student at Liberty University.

## Design

- **Style:** Soft UI Evolution · Minimal Swiss structure (UI/UX Pro Max)
- **Palette:** Deep Ocean Mist (calm teal + slate indigo)
- **Type:** Space Grotesk (headings) + Archivo (body)
- **Modes:** Light & dark (system default + toggle + localStorage)
- **A11y:** SVG icons, 44px targets, focus rings, `prefers-reduced-motion`

Design system: `design-system/brady-herwig-portfolio/MASTER.md`  
Projects page override: `design-system/brady-herwig-portfolio/pages/projects.md`

## Stack

- HTML + Tailwind CSS (CDN) — config loaded **before** the CDN script
- `style.css` for design tokens and components
- Vanilla JS for theme, nav, scroll reveal, project jump nav

## Pages

| File | Role |
|------|------|
| `index.html` | Home — about, skills, education, contact (**no project list**) |
| `projects.html` | Curated project showcases only |

## Local development

```bash
python -m http.server 8000
```

Open http://localhost:8000

## GitHub Pages

Deploy from `main` / root → live on your Pages URL.

## Projects

Showcase write-ups live only on `projects.html`. Each case study has:

1. Screenshots  
2. What it shows  
3. What I learned  
4. Tools & libraries  

Drop images in `screenshots/<project-slug>/` (see `screenshots/README.md`), then ask to wire them into the page.

# Brady S. Herwig — Personal Website

Editorial personal portfolio for a data science student at Liberty University.

## Design

- **Style:** Monad — editorial tech journal on warm parchment
- **Palette:** Parchment canvas (`#f6f3f1`), Lake Blue primary CTA (`#2b59d1`), warm grayscale
- **Type:** Instrument Serif (headings, weight 400) + JetBrains Mono (body / UI)
- **Theme:** Light only
- **Components:** Pill buttons (100px), soft cards (40px radius), 1px Ash hairline borders, no card shadows
- **A11y:** SVG icons, 44px targets, focus rings, `prefers-reduced-motion`

Design system: `design-system/brady-herwig-portfolio/MASTER.md`  
Projects page override: `design-system/brady-herwig-portfolio/pages/projects.md`

## Stack

- HTML + Tailwind CSS (CDN)
- `style.css` for Monad design tokens and components
- Vanilla JS for nav, scroll reveal, project jump nav, screenshot carousels

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

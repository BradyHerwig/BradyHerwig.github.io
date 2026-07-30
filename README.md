# Brady S. Herwig — Personal Website

Editorial personal portfolio for a data science student at Liberty University.

## Design

- **Style:** Henry — gothic broadside on warm cream paper
- **Palette:** Paper (`#fafafa`) / Headline Ink (`#2a2722`) — 100% warm monochrome, no chromatic accent
- **Type:** Fraunces (display serif) + Inter (UI) + Antonio (stamped mastheads)
- **Theme:** Light only · shadowless · 12px radius only
- **Layout:** Alternating Paper/Ink full-bleed bands; type is the brand
- **Data art:** CSS mono charts, SVG scatter, ASCII plate, Python REPL block, skills ticker
- **A11y:** 44px targets, monochrome focus rings, `prefers-reduced-motion`

Design system: `design-system/brady-herwig-portfolio/MASTER.md`

## Stack

- HTML + Tailwind CSS (CDN)
- `style.css` for Henry design tokens and components
- Vanilla JS for nav, scroll reveal, ticker, clocks, project jump nav, screenshot carousels

## Pages

| File | Role |
|------|------|
| `index.html` | Home — hero data plate, about letter, skills, education, contact |
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

1. Screenshots (rendered grayscale for monochrome cohesion)
2. What it shows
3. What I learned
4. Tools & libraries

Drop images in `screenshots/<project-slug>/` (see `screenshots/README.md`), then ask to wire them into the page.

# Brady S. Herwig — Personal Website

Clean personal portfolio for a data science student at Liberty University.

## Design

- **Style:** Soft UI / professional minimal (UI/UX Pro Max)
- **Colors:** Slate neutrals + blue accent (`#2563EB`)
- **Type:** Outfit (headings) + DM Sans (body)
- **Modes:** Light & dark (system default + toggle + localStorage)
- **A11y:** SVG icons, 44px targets, focus rings, `prefers-reduced-motion`

Design system notes: `design-system/brady-herwig-portfolio/MASTER.md`

## Stack

- HTML + Tailwind CSS (CDN) — config loaded **before** the CDN script
- Small `style.css` for components (cards, buttons, pills)
- Vanilla JS for theme, nav, GitHub projects

## Local development

```bash
python -m http.server 8000
```

Open http://localhost:8000

## GitHub Pages

Deploy from `main` / root → live on your Pages URL.

## Projects

Public repos load automatically from the GitHub API (`BradyHerwig`).

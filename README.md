# Brady S. Herwig — Personal Website

Editorial personal portfolio (Henry broadside system).

## Design

- **Style:** Gothic broadside on warm paper — type is the brand
- **Palette:** Paper `#fafafa` / Ink `#2a2722` only (no chromatic accent)
- **Type:** Fraunces (display) · Inter (UI) · Antonio (stamped mastheads)
- **Layout:** Full-bleed Paper/Ink bands, sparse sections, no SaaS card grids
- **Stack:** Plain HTML + CSS + vanilla JS (no Tailwind)

## Pages

| File | Role |
|------|------|
| `index.html` | Home |
| `projects.html` | Case studies |

## Local

```bash
python -m http.server 8000
```

## Tests

```bash
python -m unittest tests.test_henry_site -v
```

## Projects

Drop screenshots in `screenshots/<slug>/`, then wire them into `projects.html`.

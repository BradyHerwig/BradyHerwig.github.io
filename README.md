# Brady S. Herwig — Personal Website

Modern personal portfolio for a data science student at Liberty University.

**Live version:** Deployed via GitHub Pages (see below)

## Features

- **Hero** — Name, role, university, quick-fact cards, and primary CTAs
- **About** — Three focus cards (who / drive / approach)
- **Data Science Projects** — Dynamic cards from the GitHub API with skeleton loading
- **Skills** — Technical + soft skills as pill tags
- **Education** — Liberty University details
- **Contact** — Email, social links, resume placeholder with toast feedback

### Design system

Generated with UI/UX Pro Max and persisted under `design-system/brady-herwig-portfolio/`.

- **Style:** Modern cinematic — monochrome surfaces + electric blue accent
- **Mode:** Light + dark (system default, manual toggle, `localStorage` persistence)
- **Typography:** Exo (display) · DM Sans (body) · Roboto Mono (labels / stats)
- **Effects:** Ambient gradient blobs, subtle grid, glass nav, scroll reveals
- **Accessibility:** Focus rings, 44px targets, SVG icons (no emoji), `prefers-reduced-motion`

### Colors (semantic tokens)

| Token | Light | Dark |
|-------|-------|------|
| Background | `#FAFAFA` | `#09090B` |
| Foreground | `#09090B` | `#FAFAFA` |
| Accent | `#2563EB` | `#3B82F6` |
| Border | `#E4E4E7` | `#27272A` |

## Tech stack

- Plain HTML + Tailwind CSS (CDN)
- Custom design tokens in `style.css`
- Vanilla JavaScript (`script.js`)
- No build step — easy to edit and deploy

## Local development

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node
npx serve .
```

Open http://localhost:8000

## GitHub Pages

1. Push to the `main` branch
2. **Settings → Pages** → Deploy from branch → `main` / root
3. Live at `https://bradyherwig.github.io` (or your Pages URL)

## Updating projects

The Projects section pulls public repositories from the GitHub API. New public repos appear automatically after the API cache refreshes.

## License

Personal use. Feel free to use this structure as a starting point for your own work.

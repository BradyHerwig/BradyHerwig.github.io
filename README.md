# Brady S. Herwig — Personal Website

Clean, modern personal portfolio for a data science student at Liberty University.

**Live version:** Deployed via GitHub Pages (see below)

## Features (Current Baseline)

- **Intro / Hero** — Clear name, role, university, and strong first impression
- **About** — Short, human description highlighting strengths (determined, communicator, leader, friendly)
- **Data Science Projects** — Dynamic cards pulled from GitHub API (hybrid approach)
  - Currently shows the public `stocks-ds` repo
  - Graceful empty state for future projects
- **Skills** — Technical + soft skills in clean pill layout
- **Education** — Liberty University details
- **Contact** — Email + social links + resume placeholder

### Design
- Forest / muted greens + warm brown accents
- Light and dark mode (follows system preference by default)
- Manual toggle with localStorage persistence
- Smooth, uncluttered, modern aesthetic with generous whitespace
- Fully responsive

## Tech Stack (v1 — simple)

- Plain HTML + Tailwind CSS (via CDN for zero-build)
- Vanilla JavaScript
- No framework — easy to edit and iterate

Basic background using the theme colors.

This keeps the first version approachable and fast to modify.

## Local Development

```bash
# Option 1: Python (built-in)
python -m http.server 8000

# Option 2: Node (if you have npx)
npx serve .
```

Open http://localhost:8000

## GitHub Pages Deployment

1. Push everything to the `main` branch of this repo
2. Go to **Settings → Pages**
3. Source: "Deploy from a branch" → `main` / root
4. Save — your site will be live at `https://bradyherwig.github.io`

(You can also use a custom domain later.)

## Next Steps / Iteration Ideas

- Add your actual resume PDF and wire up the download button
- Add more custom project descriptions (hybrid model)
- Add a small "Featured Project" highlight when you finish the first one
- Add project screenshots or data visualizations
- Turn this into a small Vite + React or Astro site in a future version
- Add a contact form (Formspree, Netlify Forms, etc.)

## Updating Projects

The Projects section automatically pulls your latest public repositories via the GitHub API. No code changes needed when you push new repos.

## Colors

- Primary: Forest greens (`#166534` and family)
- Accents: Warm browns / earth tones
- Backgrounds: Stone / near-white and near-black

## License

Personal use. Feel free to use this structure as a starting point for your own work.

---

Built iteratively as a clean baseline. More features coming in future passes.

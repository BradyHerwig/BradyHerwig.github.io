# Brady S. Herwig — Personal Website

Dark frosted-glass data science portfolio (**AuthKit** system) with self-hosted fonts and Lucide icons.

## Design

- **Canvas:** Midnight `#05060f` · blueprint grid · spotlight halo  
- **Surfaces:** Frosted glass cards · deep-glass panels  
- **Accent:** Void Violet `#663af3` (primary CTAs only)  
- **Type (local):** Space Grotesk · Inter · JetBrains Mono (`assets/fonts/`)  
- **Icons:** Lucide (`assets/icons/lucide/`) via CSS mask  

## Stack

Plain HTML + CSS + vanilla JS. No Tailwind. No Google Fonts CDN.

## Local

```bash
python -m http.server 8000
```

## Tests

```bash
python -m unittest tests.test_authkit_site -v
```

## Assets source

Fonts and icons were vendored from `~/.grok/site-kit/` (Fontsource + Lucide ISC/OFL).

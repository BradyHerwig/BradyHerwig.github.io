# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Brady Herwig Portfolio  
**Updated:** 2026-07-30  
**Category:** Data Science / Personal Portfolio  
**Style:** Henry — gothic broadside poster on warm cream paper  
**Mood:** Editorial, austere, typographic  
**Theme:** Light only · 100% warm monochrome  

---

## Global Rules

### Color Palette — Henry Monochrome

Warm paper canvas with warm near-black ink. **No chromatic accent.** Every visual move comes from scale, weight, and inversion.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Paper | `#fafafa` | `--color-paper` | Page background, card surfaces, inverted-section type |
| Hairline | `#eeeeee` | `--color-hairline` | Card and tile borders on Paper |
| Midstone | `#9f9f9f` | `--color-midstone` | Nav borders, muted borders on dark sections |
| Ash | `#666666` | `--color-ash` | Secondary borders, muted UI text |
| Pebble | `#b3b3b3` | `--color-pebble` | Inactive nav text and borders |
| Sepia | `#3e3b36` | `--color-sepia` | Strong borders, secondary heading text |
| Headline Ink | `#2a2722` | `--color-headline-ink` | Primary text, body ink, dominant borders |

### Typography

| Role | Family (sub) | Weights | Notes |
|------|--------------|---------|-------|
| UI / body / nav | Inter (Neue Montreal) | 400, 700 | 12–32px, -0.01em tracking |
| Display serif | Fraunces (Louize Display) | 400 | Headlines 77–132px; editorial blocks 32px |
| Secondary serif | Fraunces (Louize) | 400 | Short editorial copy, link text |
| Stamped masthead | Antonio (Manuka) | 400 | Uppercase only, 226–371px, line-height 0.75 |

### Type Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 12px | 1.5 | -0.12px |
| body | 16px | 1.5 | -0.16px |
| subheading | 20px | 1.3 | -0.2px |
| heading-sm | 24px | 1.2 | -0.24px |
| heading | 32px | 1.1 | -0.32px |
| heading-lg | 77px | 0.9 | — |
| display | 132px | 0.8 | — |
| display-xl | 371px | 0.75 | — |

### Spacing & Layout

- Base unit: **4px**
- Section gap: 64–96px
- Card padding: 16px
- Element gap: 16px
- Soft max-width: ~1400px (editorial full-bleed feel)
- No traditional card grids of features; prefer editorial bands

### Radius

| Element | Value |
|---------|-------|
| tags / cards / buttons | **12px only** |

No pills (9999px), no square 0px on UI chrome. **Exception:** data/imagery plates use square corners (0).

### Elevation

**Shadowless by design.** Hierarchy via type scale, Paper/Ink inversion, and 1px rules.

### Surfaces

| Level | Name | Value |
|-------|------|-------|
| 1 | Paper | `#fafafa` |
| 2 | Ink | `#2a2722` |

Alternate full-bleed bands. Never gradient-blend; never place a card across the boundary.

---

## Components

### Masthead Display Headline
Fraunces 116–132px (clamped), weight 400, line-height ~0.85. Optional italic half-size phrase inline.

### Stamped Display Section Header
Antonio uppercase at architectural scale on Ink band, trailing rule.

### Top Ticker Banner
Inter 12px uppercase on Paper, hairline rules top/bottom.

### Inverted Editorial Letter
Full-bleed Ink, centered Fraunces 32px prose, Neue-Montreal-style 12px eyebrows.

### Nav Link (Uppercase)
Inter 12px bold uppercase. Active = larger size (16px), same color/weight.

### Brand / Skills Ticker Strip
Ink band, Fraunces tool names marquee, optional ghost COMING SOON tags.

### Coming Soon Tag
Outlined ghost pill, 12px radius, 1px Paper border on Ink.

### Coordinate Footer
12px uppercase single-line meta with em-dash separators + live clock.

### Hero Data Plate
Right-side monochrome plate: pure CSS bars, SVG scatter, ASCII art. Square corners, ink-on-paper only.

### Buttons
- **Primary:** Ink fill, Paper text (inversion, not a brand color)
- **Ghost:** 1px Ink border, transparent fill  
Never a chromatic CTA.

---

## Imagery & Data Art

- Monochrome only: grayscale screenshots, SVG dots, CSS bars, ASCII
- No photography, no product color, no gradients
- Iconography largely absent; type does the work
- Screenshots: `filter: grayscale(1)` for cohesion

Memorable data treatments used on this site:
1. **CSS mono bar chart** — pure height bars labeled EDA/SQL/PY…
2. **SVG halftone scatter** — ink dots + dashed regression line
3. **ASCII plate** — small monospaced figure as typographic counterweight
4. **Python REPL block** — monochrome code as editorial decoration
5. **Skills marquee** — tool names as brand ticker wordmarks

---

## Do's and Don'ts

### Do
- Louize/Fraunces at large scale for section-defining headlines
- Alternate Paper and Ink full-bleed bands
- 12px radius only on UI chrome
- Manuka/Antonio only for largest mastheads, always uppercase
- Let ~90% of the page be empty Paper or Ink

### Don't
- Never introduce blue/red/green accents
- Never use filled colored CTA buttons
- Never apply box-shadow or glow
- Never use border-radius other than 12px (except square image plates)
- Never break Paper/Ink binary with gray panels or gradients
- Never center-align Neue Montreal body; only editorial serif blocks on Ink

---

## Similar Brands

Pentagram · Manual · Locomotive · Cereal magazine · Rauno Freiberg

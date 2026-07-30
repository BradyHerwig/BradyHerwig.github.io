# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Brady Herwig Portfolio  
**Updated:** 2026-07-30  
**Category:** Data Science / Personal Portfolio  
**Style:** Monad — editorial tech journal on warm parchment  
**Mood:** Calm, literary, technical-manual  
**Theme:** Light only  

---

## Global Rules

### Color Palette — Monad Parchment

Warm off-white canvas with a single Lake Blue primary action. Everything else is warm grayscale; pastels are decorative-only.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Parchment | `#f6f3f1` | `--color-parchment` | Page canvas — never pure white |
| Lake Blue | `#2b59d1` | `--color-lake-blue` | Single primary CTA fill only |
| Periwinkle Mist | `#cfdaf5` | `--color-periwinkle-mist` | Elevated card surface |
| Sky Blue | `#a0b5eb` | `--color-sky-blue` | Gradient wash (decorative) |
| Mint | `#a7fccd` | `--color-mint` | Decorative accent |
| Coral | `#ff9473` | `--color-coral` | Gradient wash (decorative) |
| Gold | `#ecda98` | `--color-gold` | Gradient wash (decorative) |
| Off-Black | `#242424` | `--color-off-black` | Primary text, black pills |
| Ink | `#000000` | `--color-ink` | Announcement bar |
| Graphite | `#4e4d4d` | `--color-graphite` | Body / secondary text |
| Smoke | `#797776` | `--color-smoke` | Helper / tertiary text |
| Ash | `#cecac8` | `--color-ash` | Hairline borders |

### Typography

- **Display / Headings:** Instrument Serif (Untitled Serif substitute) — weight **400 only**
- **Body / UI:** JetBrains Mono (ABC Diatype Mono substitute) — weights 400, 500
- **Philosophy:** Serif announces, mono instructs. Never bold headings.

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 12px | 1.2 | -0.4px |
| body-sm | 14px | 1.35 | -0.28px |
| body | 16px | 1.35 | -0.4px |
| label | 18px | 1.2 | -0.4px |
| body-lg | 20px | 1.35 | -0.4px |
| subheading | 24px | 1.2 | -0.48px |
| heading-sm | 32px | 1.2 | -0.64px |
| heading | 40px | 1.2 | -0.8px |
| heading-lg | 48px | 1.2 | -0.96px |
| display | 80px | 1.2 | -1.6px |

### Spacing & Layout

- Base unit: 8px
- Page max-width: `1432px`
- Section gap: `64px`
- Card padding: `40px`
- Element gap: `16px`

### Radius

| Element | Value |
|---------|-------|
| tags / pills | 9999px |
| cards | 40px |
| buttons | 100px |

### Elevation

- Cards: **no drop shadows** — use 1px Ash borders
- Ambient only: `rgba(0, 0, 0, 0.1) 0px 0px 10px 0px`

---

## Components

### Announcement Bar
Full-width Ink bar, mono 14px parchment text, small white pill CTA right.

### Primary Pill (Blue)
Lake Blue fill, white mono 14px uppercase, 100px radius, 16×32 padding, trailing ▸.

### Primary Pill (Black)
Off-Black fill, parchment text, same geometry, no arrow.

### Ghost Pill
Transparent, 1px Off-Black border, Off-Black mono uppercase.

### Feature Card
Transparent/Parchment, 1px Ash, 40px radius, 40px padding. Title: serif 24px. Body: mono 16px Graphite.

### Elevated Feature Card
Periwinkle Mist fill — the one colored card that draws the eye.

### Navigation
~80px height, parchment/transparent, mono 18px uppercase links, blue pill CTA right.

### Hero
Centered stack: serif display 80px weight 400, mono subtext 20px Graphite, two pill buttons. Soft gradient atmospheric washes only.

---

## Do's and Don'ts

### Do
- Untitled Serif / Instrument Serif at weight 400 for all headings
- JetBrains Mono for all body, nav, buttons, badges
- Pill radii (100px / 9999px) on buttons and tags
- Parchment canvas always
- Lake Blue for **one** primary action per screen
- 1px Ash borders only

### Don't
- Never bold headings (600+)
- Never pure white (`#ffffff`) page background
- Never scatter Lake Blue beyond primary CTA
- Never sans-serif body
- Never card drop shadows
- Never corner radii below 16px cards / 100px buttons
- Never functional UI in pastel gradient colors

---

## Stack Notes

- Static HTML + Tailwind CDN + `style.css` tokens
- No dark mode (light-only Monad theme)
- Fonts via Google Fonts: Instrument Serif + JetBrains Mono

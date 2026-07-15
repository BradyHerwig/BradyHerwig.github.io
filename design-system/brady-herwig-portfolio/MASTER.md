# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Brady Herwig Portfolio  
**Updated:** 2026-07-15  
**Category:** Data Science / Personal Portfolio  
**Style:** Soft UI Evolution + Minimal Swiss structure  
**Mood:** Calm, professional, intriguing  

**Design Dials:** Variance 5/10 (Balanced / Modern) | Motion 4/10 (Subtle scroll reveal) | Density 4/10 (Spacious)

---

## Global Rules

### Color Palette — Deep Ocean Mist

Calm teal for trust and focus; slate-indigo undertones for intrigue. Cool mist surfaces keep the page quiet and readable.

| Role | Light | Dark | CSS Variable |
|------|-------|------|--------------|
| Primary | `#0F2744` | `#E8F4F8` | `--color-primary` |
| On Primary | `#F8FAFC` | `#0A1220` | `--color-on-primary` |
| Secondary | `#3D5470` | `#94A8BC` | `--color-secondary` |
| Accent / CTA | `#0E7490` | `#2DD4BF` | `--color-accent` |
| Accent Hover | `#0F8AA8` | `#5EEAD4` | `--color-accent-hover` |
| Background | `#F3F6F8` | `#070B14` | `--color-background` |
| Foreground | `#0C1222` | `#EEF3F7` | `--color-foreground` |
| Muted | `#E8EEF3` | `#141C2B` | `--color-muted` |
| Muted FG | `#5B6B7C` | `#8B9CB0` | `--color-muted-fg` |
| Subtle FG | `#3D4F63` | `#B6C4D4` | `--color-subtle-fg` |
| Border | `#D5DEE8` | `rgba(148,168,188,0.14)` | `--color-border` |
| Surface | `#FFFFFF` | `#0E1522` | `--color-surface` |
| Surface Alt | `#EAF0F4` | `#0A101C` | `--color-surface-alt` |
| Ring | `#0E7490` | `#2DD4BF` | `--color-ring` |
| Gradient | `#0E7490 → #4338CA` | `#2DD4BF → #818CF8` | `--color-gradient-*` |

**Notes:** Synthesized from UI/UX Pro Max calm teal / sage neutral / indigo intrigue palettes. WCAG AA+ body contrast on both themes.

### Typography

- **Display / Headings:** Space Grotesk  
- **Body:** Archivo  
- **Mood:** minimal, portfolio, professional, geometric calm  
- **Google Fonts:** [Space Grotesk + Archivo](https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300..700;1,300..700&family=Space+Grotesk:wght@400;500;600;700&display=swap)

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300..700;1,300..700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
```

- Base size: `16px` / `1rem`
- Body line-height: `1.6`
- Section titles: `clamp(1.625rem, 3.2vw, 2.125rem)`, tracking `-0.03em`

### Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | `0.25rem` |
| `--space-sm` | `0.5rem` |
| `--space-md` | `1rem` |
| `--space-lg` | `1.5rem` |
| `--space-xl` | `2rem` |
| `--space-2xl` | `3rem` |
| `--space-3xl` | `4.5rem` |

Section vertical padding: `py-16` mobile → `py-24` desktop.

### Shadows (Soft UI Evolution)

Multi-layer soft shadows — softer than flat, clearer than neumorphism.

| Level | Usage |
|-------|-------|
| `--shadow-sm` | Cards at rest, nav |
| `--shadow-md` | Hover lift mid |
| `--shadow-lg` | Project cards hover |
| `--shadow-xl` | Toast |
| `--shadow-glow` | Primary CTA + card accent glow |

### Radius & Motion

| Token | Value |
|-------|-------|
| `--radius-sm` | `0.5rem` |
| `--radius-md` | `0.75rem` |
| `--radius-lg` | `1rem` |
| `--radius-xl` | `1.25rem` |
| `--transition` | `200ms cubic-bezier(0.16, 1, 0.3, 1)` |
| Reveal | `~450ms` fade + 14px translateY, stagger 60–240ms |

Respect `prefers-reduced-motion: reduce` (disables scroll animation, forces visible).

---

## Layout Pattern

**Portfolio Grid** (UI/UX Pro Max)

1. Hero (name / role / stats / CTAs)  
2. About philosophy cards  
3. Project grid (live GitHub)  
4. Skills  
5. Education  
6. Contact  

**CTA hierarchy:** Primary → View Projects · Secondary → LinkedIn / GitHub · Contact email + socials.

---

## Components

### Buttons

- `.btn-primary` — teal→indigo gradient, glow shadow  
- `.btn-secondary` — surface + border  
- `.btn-soft` — accent-tinted  
- `.btn-dark` — primary ink fill  
- Min height **44px**, `cursor-pointer`, 150–200ms hover

### Cards

- Soft border + multi-layer shadow  
- `.card--feature` top gradient bar on hover  
- `.project-card` same accent bar + title color shift  
- Lift: `translateY(-2px to -3px)` + glow

### Nav

- Frosted glass (`backdrop-filter: blur(16px)`)  
- Active link uses accent tint background  
- Sticky with scrolled border/shadow

### Ambient

- Fixed page orbs (teal / indigo / cyan, low opacity)  
- Hero glow + faint grid mask  
- Decorative gradient rule under name

### Icons

- Heroicons outline only (stroke 1.75)  
- Never emoji as structural icons  
- Icon wells use soft accent gradient fill

---

## Accessibility Checklist

- [x] Text contrast ≥ 4.5:1 (body) on light and dark  
- [x] Focus-visible rings (`--color-ring`)  
- [x] Touch targets ≥ 44×44  
- [x] `prefers-reduced-motion` respected  
- [x] No emoji icons  
- [x] Reveal has `@media (scripting: none)` fallback  
- [x] Theme flash prevented via head script  
- [x] `aria-live` on projects grid / toast  

---

## Anti-Patterns to Avoid

- Generic pure blue SaaS look (use teal, not `#2563EB` as sole accent)  
- Harsh pure black backgrounds (use `#070B14`)  
- Instant hover transitions  
- Removing focus outlines  
- Layout-shifting press states beyond subtle scale  
- Infinite decorative animation (pulse-dot is the only loop; keep subtle)  

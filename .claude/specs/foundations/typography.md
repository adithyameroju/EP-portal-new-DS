# Typography — Compass Foundation Spec

> **Purpose:** This file defines every text style available in Compass.
> LLMs must use only these font families, sizes, weights, and heading presets.
> If a typography value isn't listed here, it doesn't exist in the system.

---

## Font family

Compass uses **Euclid Circular B** as its sole typeface — across sans, serif,
and mono slots. This is Acko's brand typeface.

| Token | Value | CSS variable |
|-------|-------|-------------|
| `font-sans` | Euclid Circular B | `var(--font-sans)` |
| `font-serif` | Euclid Circular B | `var(--font-serif)` |
| `font-mono` | Euclid Circular B | `var(--font-mono)` |

> **Note:** All three slots point to the same family. This is intentional —
> the system is single-typeface. Do not substitute Inter, system-ui, or any
> other font. If monospaced rendering is needed for code blocks, this may be
> revisited as a future decision (flag it, don't solve it).

---

## Text sizes (Theme collection)

Each size includes a paired line-height. Use via Tailwind classes (`text-sm`, `text-lg`, etc.).

| Token | Font size (px) | Line height (px) | Tailwind class | Typical usage |
|-------|---------------|-------------------|---------------|---------------|
| `text/xs` | 12 | 16 | `text-xs` | Captions, badges, fine print |
| `text/sm` | 14 | 20 | `text-sm` | Helper text, secondary labels |
| `text/base` | 16 | 24 | `text-base` | Body text (default) |
| `text/lg` | 18 | 28 | `text-lg` | Emphasized body, subheads |
| `text/xl` | 20 | 28 | `text-xl` | Small headings, card titles |
| `text/2xl` | 24 | 32 | `text-2xl` | Section subheadings |
| `text/3xl` | 30 | 36 | `text-3xl` | Section headings |
| `text/4xl` | 36 | 40 | `text-4xl` | Page headings |
| `text/5xl` | 48 | 48 | `text-5xl` | Hero headings |
| `text/6xl` | 60 | 60 | `text-6xl` | Display text |
| `text/7xl` | 72 | 72 | `text-7xl` | Large display |
| `text/8xl` | 96 | 96 | `text-8xl` | Extra-large display |
| `text/9xl` | 128 | 128 | `text-9xl` | Maximum display |

---

## Font weights (Theme collection)

| Token | Value | Tailwind class | Typical usage |
|-------|-------|---------------|---------------|
| `font-weight/light` | 300 | `font-light` | Large display text |
| `font-weight/normal` | 400 | `font-normal` | Body text (default) |
| `font-weight/medium` | 500 | `font-medium` | Labels, navigation items |
| `font-weight/semibold` | 600 | `font-semibold` | Headings, buttons, emphasis |
| `font-weight/bold` | 700 | `font-bold` | Strong emphasis |

> Compass ships weights **300–700** (light through bold) — the range the
> self-hosted Euclid Circular B faces (`app/fonts.css`) and the retail family
> both cover. Lighter (thin/extralight) and heavier (extrabold/black) weights
> are not part of the system.

> **Most used weights:** `normal` (400) for body, `medium` (500) for labels,
> `semibold` (600) for headings and buttons. Stick to these three unless the
> Figma design explicitly shows a different weight.

---

## Heading presets (Custom collection)

Pre-composed heading styles with font-size, weight, line-height, and letter-spacing.
These are responsive — values change between desktop and mobile breakpoints.

### Desktop

| Preset | Size (px) | Weight | Line height (px) | Letter spacing | Tailwind equivalent |
|--------|----------|--------|-------------------|---------------|-------------------|
| `heading-xl` | 60 | 600 (semibold) | 60 | -1.5 | `text-6xl font-semibold tracking-tighter` |
| `heading-lg` | 48 | 600 (semibold) | 48 | -1.2 | `text-5xl font-semibold tracking-tighter` |
| `heading-md` | 36 | 600 (semibold) | 40 | -0.9 | `text-4xl font-semibold tracking-tight` |
| `heading-sm` | 24 | 600 (semibold) | 32 | -0.6 | `text-2xl font-semibold tracking-tight` |

### Mobile

| Preset | Size (px) | Weight | Line height (px) | Letter spacing | Tailwind equivalent |
|--------|----------|--------|-------------------|---------------|-------------------|
| `heading-xl` | 48 | 600 (semibold) | 48 | -1.2 | `text-5xl font-semibold tracking-tighter` |
| `heading-lg` | 36 | 600 (semibold) | 40 | -0.9 | `text-4xl font-semibold tracking-tight` |
| `heading-md` | 30 | 600 (semibold) | 36 | -0.75 | `text-3xl font-semibold tracking-tight` |
| `heading-sm` | 20 | 600 (semibold) | 28 | -0.5 | `text-xl font-semibold tracking-tight` |

> **Pattern:** headings step down one size level on mobile. All headings are
> semibold with negative letter-spacing (tighter tracking for display sizes).

---

## Line height tokens (TailwindCSS collection)

For fine-grained control when the text-size pairing isn't sufficient.

| Token | Value (px) | Tailwind class |
|-------|------------|---------------|
| `leading-3` | 12 | `leading-3` |
| `leading-4` | 16 | `leading-4` |
| `leading-5` | 20 | `leading-5` |
| `leading-6` | 24 | `leading-6` |
| `leading-7` | 28 | `leading-7` |
| `leading-8` | 32 | `leading-8` |
| `leading-9` | 36 | `leading-9` |
| `leading-10` | 40 | `leading-10` |

---

## Rules for LLMs

1. **Always use `Euclid Circular B`** as the font family. Do not substitute
   Inter, system-ui, Arial, or any other typeface.
2. **Use Tailwind text classes** (`text-sm`, `text-base`, `text-lg`), not raw
   CSS (`font-size: 14px`).
3. **Use the heading presets** for page/section headings. Do not manually compose
   heading styles from individual tokens unless the Figma design diverges.
4. **Default body text is `text-base font-normal`** (16px / 400 weight).
   Do not use `text-sm` for body copy unless the design explicitly shows 14px.
5. **Semibold (600) is the heading weight.** Do not use bold (700) for headings
   unless the Figma design explicitly shows it.
6. **Negative letter-spacing on headings is intentional.** Values like -1.2 and
   -0.9 are part of the design language. Do not remove or "normalize" them.
7. **Responsive headings:** always apply the mobile size at the base breakpoint
   and the desktop size at `md:` or `lg:`. Example:
   `className="text-5xl md:text-6xl font-semibold tracking-tighter"`

# Token Reference — Compass Master Map

> **Purpose:** A single cross-reference of all Figma variable collections and how
> they map to code. This file connects the Figma structure designers see with the
> CSS variables and Tailwind classes developers and LLMs use.

---

## Collection overview

Compass has **5 Figma variable collections** that map to **3 architectural layers**.

| # | Figma collection | Variables | Layer | Role |
|---|-----------------|-----------|-------|------|
| 1 | TailwindCSS | 452 | Layer 1 (primitives) | Raw scales — colors, spacing, sizing, opacity, line-height, stroke-width, border-radius |
| 2 | Theme | 235 | Layer 2 (semantic) | Named tokens with `-light`/`-dark` values — colors, text sizes, font weights, radius, shadow, breakpoints, containers |
| 3 | Mode | 74 | Layer 3 (resolution) | Semantic names (no suffix) that resolve to Theme values per light/dark mode |
| 4 | Custom | 26 | Layer 3 (responsive) | Composite tokens with Desktop/Mobile values — headings, container padding, section spacing |
| 5 | Icon Library | 5 | Configuration | Boolean toggles for icon set selection |

---

## How the layers connect

```
Designer picks "primary" in Figma
        ↓
Mode collection resolves:
  Light → Theme/colors/primary-light (#6841E6)
  Dark  → Theme/colors/primary-dark  (#7A62F0)
        ↓
Theme/colors/primary-light is a direct value (not referencing TailwindCSS)
        ↓
In code: var(--primary) resolves per :root / .dark class
```

```
Designer picks "spacing 6" in Figma
        ↓
TailwindCSS collection: spacing/6 = 24
        ↓
In code: Tailwind class "p-6" = padding: 24px
```

```
Designer uses "heading-lg" text style
        ↓
Custom collection resolves:
  Desktop → font-size: Theme/text/5xl/font-size (48px), weight: semibold, etc.
  Mobile  → font-size: Theme/text/4xl/font-size (36px), weight: semibold, etc.
        ↓
In code: responsive classes "text-4xl md:text-5xl font-semibold tracking-tighter"
```

---

## Token → Code quick reference

### Colors (use CSS variables via Tailwind)

| Figma token (Mode) | CSS variable | Tailwind bg class | Tailwind text class |
|--------------------|--------------|--------------------|---------------------|
| background | `var(--background)` | `bg-background` | — |
| foreground | `var(--foreground)` | — | `text-foreground` |
| primary | `var(--primary)` | `bg-primary` | `text-primary` |
| primary-foreground | `var(--primary-foreground)` | — | `text-primary-foreground` |
| secondary | `var(--secondary)` | `bg-secondary` | `text-secondary` |
| secondary-foreground | `var(--secondary-foreground)` | — | `text-secondary-foreground` |
| muted | `var(--muted)` | `bg-muted` | — |
| muted-foreground | `var(--muted-foreground)` | — | `text-muted-foreground` |
| accent | `var(--accent)` | `bg-accent` | — |
| accent-foreground | `var(--accent-foreground)` | — | `text-accent-foreground` |
| destructive | `var(--destructive)` | `bg-destructive` | `text-destructive` |
| destructive-foreground | `var(--destructive-foreground)` | — | `text-destructive-foreground` |
| card | `var(--card)` | `bg-card` | — |
| card-foreground | `var(--card-foreground)` | — | `text-card-foreground` |
| popover | `var(--popover)` | `bg-popover` | — |
| popover-foreground | `var(--popover-foreground)` | — | `text-popover-foreground` |
| border | `var(--border)` | — | — (`border-border`) |
| input | `var(--input)` | — | — (`border-input`) |
| ring | `var(--ring)` | — | — (`ring-ring`) |

### Spacing (use Tailwind utilities directly)

| Figma value (px) | Tailwind class suffix | Example |
|-------------------|----------------------|---------|
| 4 | `1` | `p-1`, `gap-1`, `m-1` |
| 8 | `2` | `p-2`, `gap-2` |
| 12 | `3` | `p-3`, `gap-3` |
| 16 | `4` | `p-4`, `gap-4` |
| 20 | `5` | `p-5`, `gap-5` |
| 24 | `6` | `p-6`, `gap-6` |
| 32 | `8` | `p-8`, `gap-8` |
| 48 | `12` | `p-12`, `gap-12` |
| 64 | `16` | `p-16`, `gap-16` |

### Typography (use Tailwind text classes)

| Figma text style | Tailwind classes |
|-----------------|-----------------|
| text-xs | `text-xs` (12px/16px) |
| text-sm | `text-sm` (14px/20px) |
| text-base | `text-base` (16px/24px) |
| text-lg | `text-lg` (18px/28px) |
| text-xl | `text-xl` (20px/28px) |
| text-2xl | `text-2xl` (24px/32px) |
| text-3xl | `text-3xl` (30px/36px) |
| text-4xl | `text-4xl` (36px/40px) |
| text-5xl | `text-5xl` (48px/48px) |

### Radius (use Tailwind rounded classes)

| Figma radius (px) | Tailwind class |
|-------------------|---------------|
| 2 | `rounded-xs` |
| 4 | `rounded-sm` |
| 6 | `rounded-md` |
| 8 | `rounded-lg` |
| 12 | `rounded-xl` |
| 16 | `rounded-2xl` |
| 9999 | `rounded-full` |

### Shadows (use Tailwind shadow classes)

| Figma shadow style | Tailwind class |
|-------------------|---------------|
| shadow 2xs | `shadow-2xs` |
| shadow xs | `shadow-xs` |
| shadow sm | `shadow-sm` |
| shadow md | `shadow-md` |
| shadow lg | `shadow-lg` |
| shadow xl | `shadow-xl` |
| shadow 2xl | `shadow-2xl` |

---

## Icon Library configuration

| Icon set | Default | Package |
|----------|---------|---------|
| Lucide Icons | **Active** | `lucide-react` |
| Tabler Icons | Inactive | `@tabler/icons-react` |
| HugeIcons | Inactive | `hugeicons-react` |
| Phosphor Icons | Inactive | `@phosphor-icons/react` |
| Remix Icon | Inactive | `@remixicon/react` |

> **Default icon set: Lucide.** This is what shadcn/ui uses natively.
> All icon references in component code should use `lucide-react` imports.
> Do not mix icon libraries unless the Figma Icon Library collection
> activates an alternative set.

---

## Spec file index

For detailed rules and usage guidelines, see the individual spec files:

| Spec file | Covers |
|-----------|--------|
| `specs/foundations/color.md` | All color tokens, 3-layer architecture, semantic usage rules |
| `specs/foundations/spacing.md` | Spacing scale, containers, breakpoints, responsive tokens |
| `specs/foundations/typography.md` | Font family, text sizes, weights, heading presets |
| `specs/foundations/radius.md` | Border radius scale, component mappings |
| `specs/foundations/elevation.md` | Shadows, focus rings, elevation hierarchy |
| `specs/foundations/motion.md` | Duration, easing, transition patterns, animation presets |

---

## Rules for LLMs

1. **Read this file first** when you need to translate a Figma design to code.
   It gives you the mapping from what you see in Figma to what you write in code.
2. **Always use the highest-level token available.** Semantic (Layer 3) over
   Theme (Layer 2) over Primitive (Layer 1). Never skip layers.
3. **When a Figma value doesn't match any token exactly**, use the nearest token.
   Example: if Figma shows 15px spacing, use `gap-4` (16px), not `gap-[15px]`.
4. **This file is a quick reference.** For detailed rules and constraints,
   open the corresponding foundation spec file.

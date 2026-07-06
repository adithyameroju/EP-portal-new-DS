# Color — Compass Foundation Spec

> **Purpose:** This file is the single source of truth for color usage in Compass.
> LLMs (Cursor, Claude Code) must read this file before generating any component
> or layout code. If a color value is not listed here, it does not exist in the system.

---

## Architecture: 3-layer token indirection

Compass colors flow through three layers, mirroring the Figma variable collections.
Always use **Layer 3 (semantic)** in component code. Never skip layers.

```
Layer 1: Tailwind primitives    →  Raw color scales (slate-50…950, red-50…950, etc.)
Layer 2: Theme collection       →  Named values with -light/-dark suffix
Layer 3: Mode collection        →  Semantic names (no suffix) that resolve per mode
```

**In code:** use `var(--background)`, `var(--primary)`, etc. — the Layer 3 names.
**Never:** hardcode hex values, reference `-light` / `-dark` tokens directly, or
use Tailwind color utilities like `bg-slate-500`. The audit script will fail the build.

---

## Semantic color tokens (Layer 3 — what you use in code)

These are the CSS custom properties available in `globals.css`. Each resolves to
a light or dark value depending on the active mode.

### Backgrounds

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--background` | `#FAFAFA` | `#0F0F10` | Page/app background |
| `--card` | `#FFFFFF` | `#242324` | Card surfaces, elevated containers |
| `--popover` | `#FFFFFF` | `#19191A` | Dropdowns, tooltips, floating panels |
| `--muted` | `#F5F5F5` | `#141414` | Subtle backgrounds (disabled, secondary areas) |
| `--accent` | `#F5F5F5` | `#19191A` | Hover/active state backgrounds |
| `--secondary` | `#F5F5F5` | `#141414` | Secondary button/element backgrounds |

### Foregrounds (text & icons)

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Primary text |
| `--card-foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Text on card surfaces |
| `--popover-foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Text in floating panels |
| `--muted-foreground` | `#000000` (56%) | `#FFFFFF` (56%) | Secondary/helper text, placeholders |
| `--accent-foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Text on accent backgrounds |
| `--secondary-foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Text on secondary backgrounds |

> **Note on opacity:** Foreground colors use alpha transparency (87% for primary text,
> 56% for muted) rather than gray hex values. This ensures correct rendering over any
> background color. Do not replace these with opaque grays.

### Brand / interactive

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--primary` | `#6841E6` | `#7A62F0` | Primary buttons, links, active indicators |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` | Text/icons on primary surfaces |
| `--ring` | `#6841E6` | `#7A62F0` | Focus rings (keyboard navigation) |
| `--ring-offset` | `#FAFAFA` | `#0F0F10` | Gap between element and focus ring |

> **Acko primary = purple.** `#6841E6` (light) / `#7A62F0` (dark). This is the brand
> anchor. Every interactive element that needs to say "this is actionable" uses primary.

### Destructive

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--destructive` | `#DC2626` | `#EF4444` | Delete buttons, error states, destructive actions |
| `--destructive-foreground` | `#FFFFFF` | `#FFFFFF` | Text on destructive surfaces |

### Borders & inputs

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--border` | `#E5E5E5` | `#242324` | General dividers, card borders |
| `--input` | `#D4D4D4` | `#333333` | Input field borders |

### Sidebar

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--sidebar` | `#FAFAFA` | `#141414` | Sidebar background |
| `--sidebar-foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Sidebar text |
| `--sidebar-primary` | `#6841E6` | `#7A62F0` | Active sidebar item highlight |
| `--sidebar-primary-foreground` | `#FFFFFF` | `#FFFFFF` | Text on active sidebar item |
| `--sidebar-accent` | `#F5F5F5` | `#19191A` | Sidebar hover/secondary state |
| `--sidebar-accent-foreground` | `#000000` (87%) | `#FFFFFF` (87%) | Text on sidebar accent |
| `--sidebar-border` | `#E5E5E5` | `#242324` | Sidebar dividers |
| `--sidebar-ring` | `#6841E6` | `#7A62F0` | Sidebar focus ring |

### Chart colors

| Token | Light value | Dark value | Usage |
|-------|------------|------------|-------|
| `--chart-1` | `#6841E6` | `#9B8FF6` | Primary data series |
| `--chart-2` | `#FF8D28` | `#FFA85C` | Second data series |
| `--chart-3` | `#3B82F6` | `#60A5FA` | Third data series |
| `--chart-4` | `#22C55E` | `#4ADE80` | Fourth data series |
| `--chart-5` | `#EC4899` | `#F472B6` | Fifth data series |

---

## Alpha tokens (Mode collection)

For overlays, scrims, and transparency effects. Based on black with varying opacity.

| Token | Value | Opacity | Typical usage |
|-------|-------|---------|---------------|
| `alpha-5` | `#000000F2` | 95% | Near-opaque overlays |
| `alpha-10` | `#000000E6` | 90% | Heavy overlays |
| `alpha-20` | `#000000CC` | 80% | Modal scrims |
| `alpha-30` | `#000000B3` | 70% | — |
| `alpha-40` | `#00000099` | 60% | — |
| `alpha-50` | `#00000080` | 50% | Medium overlays |
| `alpha-60` | `#00000066` | 40% | — |
| `alpha-70` | `#0000004D` | 30% | Light overlays |
| `alpha-80` | `#00000033` | 20% | Subtle scrims |
| `alpha-90` | `#0000001A` | 10% | Very subtle shading |

---

## Tailwind color primitives (Layer 1 — reference only)

These exist in the system but **must not be used directly in component code**.
They are the raw palette that Layer 2 (Theme) picks from. Listed here for
reference when debugging or authoring new theme tokens.

Available scales (each has steps 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950):

`slate` `gray` `zinc` `neutral` `stone` `red` `orange` `amber` `yellow` `lime` `green` `emerald`

Plus base colors: `black` (#000000), `white` (#FFFFFF), `transparent`

---

## Rules for LLMs

1. **Always use semantic tokens** (`--primary`, `--background`, etc.), never hex values.
2. **Never use Tailwind color classes** (`bg-red-500`, `text-slate-700`) — use token-mapped
   classes (`bg-primary`, `text-foreground`, `bg-muted`, etc.).
3. **Foreground opacity is intentional.** `--foreground` is `#000000` at 87% opacity, not
   `#1A1A1A`. Do not "simplify" alpha values to opaque hex.
4. **Dark mode is automatic.** The Mode collection handles switching. Never write
   `dark:bg-[color]` overrides manually — the tokens do this.
5. **Chart colors are ordered.** Use `--chart-1` through `--chart-5` in sequence. Do not
   reassign chart colors based on data meaning (e.g., don't use `--chart-4` for "success"
   just because it's green).
6. **When in doubt, use `--muted` / `--muted-foreground`** for secondary content, not
   `--accent`. Accent is for interactive hover states.

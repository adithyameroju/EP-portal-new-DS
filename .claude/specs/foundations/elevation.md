# Elevation (Shadows) — Compass Foundation Spec

> **Purpose:** This file defines every shadow and elevation value in Compass.
> LLMs must use only these shadow tokens. No arbitrary box-shadow values.

---

## Box shadows (Theme + Effect collections)

Compass defines three categories of shadows: **drop shadows** for elevated surfaces,
**inset shadows** for recessed/pressed effects, and **focus rings** for keyboard navigation.

### Drop shadows

| Token | Offset Y | Blur | Spread | Color | Tailwind class | Typical usage |
|-------|----------|------|--------|-------|---------------|---------------|
| `shadow/2xs` | 1px | 0 | 0 | `#0000000D` (5%) | `shadow-2xs` | Subtle border-like shadow |
| `shadow/xs` | 1px | 2px | 0 | `#0000000D` (5%) | `shadow-xs` | Buttons and cards, resting state |
| `shadow/sm` | 1px | 2px + 3px (layered) | -1px + 0 | `#0000001A` (10%) | `shadow-sm` | Dropdowns resting |
| `shadow/md` | 2px + 4px | 4px + 6px (layered) | -2px + -1px | `#0000001A` (10%) | `shadow-md` | Elevated cards, popovers |
| `shadow/lg` | 4px + 10px | 6px + 15px (layered) | -4px + -3px | `#0000001A` (10%) | `shadow-lg` | Modals, dialogs |
| `shadow/xl` | 8px + 20px | 10px + 25px (layered) | -6px + -5px | `#0000001A` (10%) | `shadow-xl` | Prominent floating panels |
| `shadow/2xl` | 25px | 50px | -12px | `#00000040` (25%) | `shadow-2xl` | Maximum elevation |

> **Layered shadows:** `sm`, `md`, `lg`, and `xl` each use two shadow layers
> (two `box-shadow` values comma-separated) for more natural depth. This is
> standard Tailwind behavior — the token handles it automatically.

### Drop shadow filters

For use with `filter: drop-shadow()` (images, SVGs, non-rectangular elements).

| Token | Offset Y | Blur | Color | Tailwind class |
|-------|----------|------|-------|---------------|
| `drop-shadow/xs` | 1px | 1px | `#0000000D` (5%) | `drop-shadow-xs` |
| `drop-shadow/sm` | 1px | 2px | `#00000026` (15%) | `drop-shadow-sm` |
| `drop-shadow/md` | 3px | 3px | `#0000001F` (12%) | `drop-shadow-md` |
| `drop-shadow/lg` | 4px | 4px | `#00000026` (15%) | `drop-shadow-lg` |
| `drop-shadow/xl` | 9px | 7px | `#0000001A` (10%) | `drop-shadow-xl` |
| `drop-shadow/2xl` | 25px | 25px | `#00000026` (15%) | `drop-shadow-2xl` |

### Inset shadows

| Token | Offset Y | Blur | Color | Tailwind class | Typical usage |
|-------|----------|------|-------|---------------|---------------|
| `inset-shadow/2xs` | 1px | 0 | `#0000000D` (5%) | `inset-shadow-2xs` | Subtle pressed state |
| `inset-shadow/xs` | 1px | 1px | `#0000000D` (5%) | `inset-shadow-xs` | Input fields (inset) |
| `inset-shadow/sm` | 2px | 4px | `#0000000D` (5%) | `inset-shadow-sm` | Recessed panels |

### Focus rings

| Token | Spread | Color | Usage |
|-------|--------|-------|-------|
| `focus/default` | 3px | `#6841E640` (primary at 25%) | Default keyboard focus indicator |
| `focus/destructive` | 3px | `#DC262633` (destructive at 20%) | Focus on destructive elements |

> **Focus rings are not decorative.** They are accessibility-critical. Every
> interactive element must show a visible focus ring on keyboard navigation.
> The focus ring color matches the element's intent (primary or destructive).

---

## Elevation hierarchy

Use this to pick the right shadow level. Higher = more elevated = more shadow.

| Level | Shadow token | When to use |
|-------|-------------|-------------|
| 0 (flat) | none | Sections within the page, no elevation |
| 1 (subtle) | `shadow-2xs` or `shadow-xs` | Buttons, chips, cards, subtle separation |
| 2 (resting) | `shadow-sm` | List items on hover |
| 3 (raised) | `shadow-md` | Popovers, dropdown menus, tooltips |
| 4 (floating) | `shadow-lg` | Modals, dialogs, command palettes |
| 5 (overlay) | `shadow-xl` or `shadow-2xl` | Full-screen overlays, spotlight effects |

---

## Rules for LLMs

1. **Only use tokens from this file.** Do not write arbitrary `box-shadow` values.
2. **Use Tailwind shadow classes** (`shadow-md`, `shadow-lg`), not raw CSS.
3. **Cards default to `shadow-xs`** (1px border + `shadow-xs`, matching the Figma
   card — owner ruling 2026-07-07). Elevated on hover: `hover:shadow-md`.
4. **Dialogs and modals use `shadow-lg`.** Not `shadow-2xl` — that's for rare emphasis.
5. **Focus rings use `focus/default` or `focus/destructive`.** Implement via
   Tailwind's `focus-visible:ring-2 focus-visible:ring-ring` pattern.
6. **No shadows on text.** Text shadow is not part of Compass.
7. **Dark mode note:** Shadows are less visible on dark backgrounds by design.
   Do not increase shadow opacity for dark mode — the tokens handle it.

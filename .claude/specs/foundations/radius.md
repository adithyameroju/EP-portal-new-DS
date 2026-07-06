# Border Radius — Compass Foundation Spec

> **Purpose:** This file defines every border-radius value available in Compass.
> LLMs must pick from this closed set. No arbitrary radius values.

---

## Radius scale (Theme collection)

These are the semantic radius tokens defined in the Theme Figma collection.
In code, use Tailwind classes or `var(--radius-*)` CSS variables.

| Token | Value (px) | Tailwind class | Typical usage |
|-------|------------|---------------|---------------|
| `radius/xs` | 2 | `rounded-xs` | Subtle rounding (tags, inline badges) |
| `radius/sm` | 4 | `rounded-sm` | Small elements (checkboxes, small chips) |
| `radius/md` | 6 | `rounded-md` | Default component radius (inputs, buttons) |
| `radius/lg` | 8 | `rounded-lg` | Cards, dropdowns, dialogs |
| `radius/xl` | 12 | `rounded-xl` | Large cards, prominent containers |
| `radius/2xl` | 16 | `rounded-2xl` | Hero cards, large modals |
| `radius/3xl` | 20 | `rounded-3xl` | Feature sections |
| `radius/4xl` | 24 | `rounded-4xl` | Maximum decorative rounding |

### Special values

| Token | Value | Tailwind class | Usage |
|-------|-------|---------------|-------|
| `rounded-none` | 0 | `rounded-none` | No rounding (tables, full-bleed sections) |
| `rounded-full` | 9999px | `rounded-full` | Circles, pills, avatar containers |

---

## Common component mappings

| Component | Recommended radius | Token |
|-----------|--------------------|-------|
| Button | 6px | `rounded-md` |
| Input / Select / Textarea | 6px | `rounded-md` |
| Card | 8px | `rounded-lg` |
| Dialog / Sheet | 8–12px | `rounded-lg` or `rounded-xl` |
| Dropdown menu | 8px | `rounded-lg` |
| Tooltip | 6px | `rounded-md` |
| Badge / Tag | 4px | `rounded-sm` |
| Avatar | 9999px | `rounded-full` |
| Checkbox | 4px | `rounded-sm` |
| Switch (track) | 9999px | `rounded-full` |

---

## Rules for LLMs

1. **Only use values from the radius scale.** Do not invent values like
   `rounded-[7px]` or `rounded-[10px]`.
2. **Use Tailwind rounded classes** (`rounded-md`, `rounded-lg`), not raw CSS
   (`border-radius: 6px`).
3. **Default component radius is `rounded-md` (6px).** When in doubt, use this.
4. **Cards and containers use `rounded-lg` (8px).** Larger than individual components.
5. **`rounded-full` is only for circles and pills.** Avatars, status dots, pill-shaped
   buttons/badges. Not for cards or containers.
6. **Nested rounding rule:** inner radius should be smaller than outer radius.
   Example: a `rounded-lg` card containing a `rounded-md` button. Never the reverse.

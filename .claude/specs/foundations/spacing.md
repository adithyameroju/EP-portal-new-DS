# Spacing — Compass Foundation Spec

> **Purpose:** This file defines every spacing value available in Compass.
> LLMs must use only these values for margin, padding, gap, and sizing.
> If a spacing value isn't listed here, it doesn't exist in the system.

---

## Spacing scale (TailwindCSS collection)

Compass uses the standard Tailwind spacing scale. Values are in **pixels**.
In code, use Tailwind utility classes (`p-4`, `gap-6`, `mt-2`, etc.).

| Token | Tailwind class suffix | Value (px) |
|-------|----------------------|------------|
| `spacing/0` | `0` | 0 |
| `spacing/px` | `px` | 1 |
| `spacing/0.5` | `0.5` | 2 |
| `spacing/1` | `1` | 4 |
| `spacing/1.5` | `1.5` | 6 |
| `spacing/2` | `2` | 8 |
| `spacing/2.5` | `2.5` | 10 |
| `spacing/3` | `3` | 12 |
| `spacing/3.5` | `3.5` | 14 |
| `spacing/4` | `4` | 16 |
| `spacing/5` | `5` | 20 |
| `spacing/6` | `6` | 24 |
| `spacing/7` | `7` | 28 |
| `spacing/8` | `8` | 32 |
| `spacing/9` | `9` | 36 |
| `spacing/10` | `10` | 40 |
| `spacing/11` | `11` | 44 |
| `spacing/12` | `12` | 48 |
| `spacing/14` | `14` | 56 |
| `spacing/16` | `16` | 64 |
| `spacing/20` | `20` | 80 |
| `spacing/24` | `24` | 96 |
| `spacing/28` | `28` | 112 |
| `spacing/32` | `32` | 128 |
| `spacing/36` | `36` | 144 |
| `spacing/40` | `40` | 160 |
| `spacing/44` | `44` | 176 |
| `spacing/48` | `48` | 192 |
| `spacing/52` | `52` | 208 |
| `spacing/56` | `56` | 224 |
| `spacing/60` | `60` | 240 |
| `spacing/64` | `64` | 256 |
| `spacing/72` | `72` | 288 |
| `spacing/80` | `80` | 320 |
| `spacing/96` | `96` | 384 |

---

## Container sizes (Theme collection)

Fixed-width container tokens for constraining content areas.

| Token | Value (px) | Typical usage |
|-------|------------|---------------|
| `container/3xs` | 256 | Tiny panels, tooltips |
| `container/2xs` | 288 | Small dialogs |
| `container/xs` | 320 | Narrow sidebars, mobile content |
| `container/sm` | 384 | Compact content areas |
| `container/md` | 448 | Medium panels |
| `container/lg` | 512 | Standard content columns |
| `container/xl` | 576 | Wide content columns |
| `container/2xl` | 672 | Two-column content |
| `container/3xl` | 768 | Tablet-width content |
| `container/4xl` | 896 | Desktop content |
| `container/5xl` | 1024 | Wide desktop content |
| `container/6xl` | 1152 | Full-width sections |
| `container/7xl` | 1280 | Max content width |

---

## Responsive layout tokens (Custom collection)

These tokens change between desktop and mobile breakpoints.
They are defined in the Custom Figma collection with Desktop/Mobile modes.

| Token | Desktop | Mobile | Usage |
|-------|---------|--------|-------|
| `container-padding-x` | `spacing/6` (24px) | `spacing/4` (16px) | Horizontal page padding |
| `section-padding-y` | `spacing/24` (96px) | `spacing/16` (64px) | Vertical section spacing |
| `section-title-gap-xl` | `spacing/6` (24px) | `spacing/5` (20px) | Gap below XL section titles |
| `section-title-gap-lg` | `spacing/5` (20px) | `spacing/4` (16px) | Gap below LG section titles |
| `section-title-gap-md` | `spacing/5` (20px) | `spacing/4` (16px) | Gap below MD section titles |
| `section-title-gap-sm` | `spacing/4` (16px) | `spacing/3` (12px) | Gap below SM section titles |

---

## Breakpoints (Theme collection)

| Token | Value (px) | Usage |
|-------|------------|-------|
| `breakpoint/sm` | 640 | Mobile landscape |
| `breakpoint/md` | 768 | Tablet |
| `breakpoint/lg` | 1024 | Desktop |
| `breakpoint/xl` | 1280 | Wide desktop |
| `breakpoint/2xl` | 1536 | Ultra-wide |

---

## Common spacing patterns

These are not tokens — they're guidelines for consistent usage across components.

| Context | Recommended token | Example |
|---------|------------------|---------|
| Inline element gap (icon + text) | `gap-2` (8px) | Button icon spacing |
| Input internal padding | `px-3 py-2` (12px / 8px) | Text input |
| Card internal padding | `p-4` or `p-6` (16px / 24px) | Card content area |
| Stack gap (form fields) | `gap-4` (16px) | Vertical form layout |
| Section gap (page sections) | `gap-8` to `gap-16` (32–64px) | Between page sections |
| Page margin (mobile) | `px-4` (16px) | Mobile horizontal padding |
| Page margin (desktop) | `px-6` (24px) | Desktop horizontal padding |

---

## Rules for LLMs

1. **Only use values from the spacing scale.** Do not invent values like `p-[13px]`
   or `gap-[22px]`. If the design calls for a value not in the scale, use the nearest
   scale value.
2. **Use Tailwind spacing utilities** (`p-4`, `m-2`, `gap-6`), not raw CSS
   (`padding: 16px`). The audit script flags raw pixel values.
3. **Respect the 4px grid.** Almost all spacing values are multiples of 4px.
   The only exceptions are `px` (1px) and the half-steps (0.5=2px, 1.5=6px, etc.).
4. **Use responsive tokens** for page-level layout (container-padding, section-padding).
   Do not hardcode different mobile/desktop values manually.
5. **When Figma shows a spacing value**, map it to the nearest Tailwind class.
   Example: Figma says 24px padding → use `p-6`, not `p-[24px]`.

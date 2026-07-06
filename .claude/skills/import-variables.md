# Compass — Import Variables from Figma

> **Skill type:** Token synchronization
> **Trigger:** Designer exports updated tokens from Figma and wants them reflected in code
> **Tools:** Claude Code (primary) or Cursor
> **Input:** A `design-tokens.tokens.json` file exported from Figma (via Tokens Studio
> or similar plugin), or individual CSS variable values provided manually
> **Output:** Updated `globals.css` and relevant spec files

**Universal rule: Never silently substitute.** When a Figma token value doesn't
cleanly map, when a token's semantic role is unclear, or when a token appears to
conflict with an existing one, flag it and ask. Never guess at a token's intent.

---

## When to use this skill

- Acko's Figma token values have changed (new brand color, adjusted spacing, etc.)
- A new semantic token has been added to the Theme or Mode collection
- The Custom collection (headings, responsive spacing) has been updated
- Initial setup: converting the first token export into `globals.css`

---

## Before you start

1. **Read the current `globals.css`** (or `globals-draft.css` during initial setup)
   to understand what's already in place
2. **Read `.claude/specs/tokens/token-reference.md`** to understand the 3-layer architecture
3. **Read `.claude/specs/foundations/color.md`** for color token naming conventions

---

## Step-by-step process

### Step 1 — Parse the token export

Read the provided JSON file. It uses the Figma Tokens / Design Tokens format with
this structure:

```
{
  "1. tailwindcss": { ... },   // Layer 1: primitives
  "2. theme": { ... },          // Layer 2: semantic values with -light/-dark
  "3. mode": { ... },           // Layer 3: semantic names resolving per mode
  "4. custom": { ... },         // Responsive tokens (desktop/mobile)
  "5. icon library": { ... },   // Icon set toggles
  "color": { ... },             // Tailwind color primitives
  "font": { ... },              // Font composite tokens
  "effect": { ... },            // Shadow/effect definitions
  "typography": { ... }         // Typography composite tokens
}
```

**Focus on these sections for `globals.css`:**
- `2. theme` -> colors, font, radius, shadow, text sizes, font-weights, containers, breakpoints
- `3. mode` -> the semantic tokens that switch between light/dark

### Step 2 — Generate or update globals.css

The `globals.css` file uses a **3-layer token architecture** that mirrors Compass's
Figma variable collections. This is critical — do not flatten to 2 layers.

> **shadcn v4 / Tailwind v4 note:** The structure below reflects what Compass
> actually uses. shadcn v4 changed significantly from v2/v3 — the imports, the
> `@theme inline` block, and the dark mode variant declaration are all different.
> If you've seen older shadcn globals.css examples online, they will not match this.

**Required imports at the top (v4 specifics):**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));
```

- `@import "tailwindcss"` — replaces the old `@tailwind base/components/utilities` directives
- `@import "tw-animate-css"` — shadcn v4's animation library (replaces tailwindcss-animate)
- `@import "shadcn/tailwind.css"` — shadcn's base layer (replaces the old CSS variable block)
- `@custom-variant dark` — defines how the dark mode selector works (class strategy via next-themes)

**Full structure:**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

/*
 * Compass Design System — globals.css
 * Generated from Figma variable collections (design-tokens.tokens.json).
 * Do not edit hex values manually — re-export from Figma and re-run
 * the import-variables skill process.
 *
 * Architecture (3 layers):
 *   Layer 1: Tailwind's built-in scale — no overrides needed
 *   Layer 2: Acko semantic aliases (--acko-*-light / --acko-*-dark)
 *            These carry the actual oklch color values. Both light and dark
 *            aliases live in :root — they never change per mode.
 *   Layer 3: shadcn-compatible names (--primary, --background, etc.)
 *            These reference Layer 2 via var(). :root points to light aliases,
 *            .dark re-points the same names to dark aliases.
 */

/* --- Tailwind @theme bridge ------------------------------------------------ */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... all semantic color tokens ... */

  --font-sans: "Euclid Circular B", system-ui, sans-serif;
  --font-serif: "Euclid Circular B", Georgia, serif;
  --font-mono: "Euclid Circular B", monospace;

  --radius-xs: 2px;
  --radius-sm: 4px;
  /* ... all radius tokens ... */
}

/* --- :root ----------------------------------------------------------------- */
:root {
  /* Layer 2: Acko semantic aliases */
  --acko-background-light: oklch(/* converted from hex */);
  --acko-background-dark:  oklch(/* converted from hex */);
  /* ... */

  /* Layer 3: shadcn-compatible names */
  --background: var(--acko-background-light);
  --foreground: var(--acko-foreground-light);
  /* ... */
}

/* --- .dark ----------------------------------------------------------------- */
.dark {
  --background: var(--acko-background-dark);
  --foreground: var(--acko-foreground-dark);
  /* ... */
}
```

**Mapping rules:**

| Figma source | CSS destination (Layer 2 alias) | CSS destination (Layer 3 shadcn name) |
|-------------|-------------------------------|--------------------------------------|
| Theme/colors/background-light | `:root { --acko-background-light }` = oklch value | `:root { --background: var(--acko-background-light) }` |
| Theme/colors/background-dark | `:root { --acko-background-dark }` = oklch value | `.dark { --background: var(--acko-background-dark) }` |
| Theme/colors/primary-light | `:root { --acko-primary-light }` = oklch value | `:root { --primary: var(--acko-primary-light) }` |
| Theme/colors/primary-dark | `:root { --acko-primary-dark }` = oklch value | `.dark { --primary: var(--acko-primary-dark) }` |
| Theme/radius/md | `@theme inline { --radius-md }` = `6px` | (used directly, no alias needed) |
| Theme/font/font-sans | `@theme inline { --font-sans }` = Euclid Circular B | (used directly) |

**When adding a new semantic color token**, you must update three places:
1. `@theme inline`: add `--color-new-token: var(--new-token)` (this wires up the Tailwind utility class)
2. `:root` Layer 2: add `--acko-new-token-light` and `--acko-new-token-dark` with oklch values
3. `:root` Layer 3: add `--new-token: var(--acko-new-token-light)` and in `.dark`: `--new-token: var(--acko-new-token-dark)`

Missing step 1 means the Tailwind utility class `bg-new-token` won't resolve. Missing step 2/3 means the CSS variable doesn't exist.

**Color format:** shadcn v4 uses **oklch** color format in `globals.css` for
better perceptual uniformity. Convert hex values from the token export to oklch.
Use a conversion tool or library — do not eyeball conversions.

**Dark mode activation:** This skill only generates CSS values. The toggle behavior
(how `.dark` class gets applied to `<html>`) is handled by `next-themes` using the
class strategy, configured in `app/layout.tsx`. Wiring toggle behavior is a separate
task — if the designer asks "why doesn't dark mode work?", point them to the
`next-themes` setup, not to this skill.

### Step 3 — Identify what changed

If updating an existing `globals.css` (not initial setup):

1. Compare the new token export against the existing file
2. List every changed value with before/after
3. **Present the diff to the user before applying.** Example:
   > "3 tokens changed:
   > - `--primary` light: `#6841E6` -> `#5B35D9` (darker purple)
   > - `--radius-md`: `6px` -> `8px`
   > - New token: `--warning` added (light: `#F59E0B`, dark: `#FBBF24`)"

4. Wait for user confirmation before writing changes

### Step 4 — Update spec files

After updating `globals.css`, check if any spec files need updates:

- **New color token added?** -> Update `.claude/specs/foundations/color.md` with the new
  token, its values, and usage guidance
- **Radius values changed?** -> Update `.claude/specs/foundations/radius.md` and the
  component mapping table
- **New text size or heading preset?** -> Update `.claude/specs/foundations/typography.md`
- **Shadow values changed?** -> Update `.claude/specs/foundations/elevation.md`

**Always update `.claude/specs/tokens/token-reference.md`** to reflect any new or changed tokens.

### Step 5 — Verify

After updating:

1. Run the token audit script (when available): `npm run audit`
2. Check that the dev server still renders correctly (when repo exists)
3. Verify no hardcoded values were accidentally introduced

---

## Handling specific scenarios

### Initial setup (no existing globals.css)

Generate the complete file from scratch using the token export. This is the
Phase 2 Day 1 task — the JSON from Phase 0 becomes the production `globals.css`.

### Adding a new semantic token

When the designer adds a new token to the Theme/Mode collections:

1. Add the **Layer 2 Acko aliases** (both `-light` and `-dark`) to `:root` in `globals.css`
2. Add the **Layer 3 shadcn-compatible name** to `:root` (pointing to `-light` alias)
   and to `.dark` (pointing to `-dark` alias)
3. Add it to the token reference map
4. Add it to the relevant foundation spec
5. If it's for a specific component, add it to that component's spec

### Removing a token

**Do not remove tokens from `globals.css` without explicit confirmation.**
Removed tokens may break existing components. Flag it:
"Token `--old-token` is no longer in the Figma export. Should I remove it
from `globals.css`? This may break components that reference it."

### Token name changed

Treat as remove + add. Flag both operations. Search the codebase for usages
of the old name before removing.

---

## What this skill does NOT do

- **Does not modify component files.** Token changes flow through CSS variables
  automatically — components don't need to change when token values change.
- **Does not create Tailwind config overrides.** Standard Tailwind scale tokens
  (spacing, opacity, etc.) are inherited from Tailwind defaults, not custom-configured.
- **Does not decide which tokens to add or remove.** That's a design decision
  made in Figma. This skill only syncs what exists.
- **Does not handle icon library changes.** Switching icon sets requires package
  installation and import updates — that's a separate task.

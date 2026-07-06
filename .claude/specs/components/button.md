# Button — Compass Component Spec

> **Purpose:** This file is the complete specification for the Button component.
> LLMs must follow this spec exactly when generating code that includes buttons.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Button } from "@/components/ui/button"
File:   components/ui/button.tsx
```

---

## Variants

Compass Button has **6 variants**, matching the Figma component set exactly.

| Variant | Tailwind prop | Background | Text | Border | Usage |
|---------|--------------|------------|------|--------|-------|
| Default | `variant="default"` | `bg-primary` | `text-primary-foreground` | none | Primary actions (Submit, Save, Continue) |
| Secondary | `variant="secondary"` | `bg-secondary` | `text-secondary-foreground` | none | Secondary actions (Cancel, Back) |
| Destructive | `variant="destructive"` | `bg-destructive` | `text-destructive-foreground` | none | Dangerous actions (Delete, Remove) |
| Outline | `variant="outline"` | transparent | `text-foreground` | `border-input` | Tertiary actions, form controls |
| Ghost | `variant="ghost"` | transparent | `text-foreground` | none | Toolbar actions, inline actions, minimal UI |
| Link | `variant="link"` | transparent | `text-primary` | none | Navigational text that behaves like a link |

**Default variant when none specified: `"default"` (primary).**

### Variant selection guide

- **One primary action per visible area.** A card, a form, a dialog — each gets
  at most one `variant="default"` button. Others use secondary, outline, or ghost.
- **Destructive is for irreversible actions only.** "Delete account" yes. "Remove
  filter" no — that's outline or ghost.
- **Ghost vs Outline:** Ghost has no border and is more subtle. Use ghost for
  toolbar/icon-only actions. Use outline when the button needs visible boundaries
  (e.g., in a form alongside inputs).

---

## Sizes

| Size | Tailwind prop | Height | Padding | Font size | Icon size | Usage |
|------|--------------|--------|---------|-----------|-----------|-------|
| Default | `size="default"` | h-9 (36px) | px-4 py-2 | text-sm (14px) | size-4 (16px) | Standard buttons |
| Small | `size="sm"` | h-8 (32px) | px-3 | text-sm (14px) | size-4 (16px) | Compact UI, tables, toolbars |
| Large | `size="lg"` | h-10 (40px) | px-6 | text-base (16px) | size-5 (20px) | Hero CTAs, prominent actions |
| Icon | `size="icon"` | h-9 w-9 (36px) | — | — | size-4 (16px) | Icon-only buttons (no text) |

**Default size when none specified: `"default"`.**

---

## States

This is the critical section. Figma expresses states as visual variants in the
component set. Code handles them differently. This mapping prevents drift.

### States handled automatically by CSS (no props needed)

| Figma state | Code mechanism | Notes |
|-------------|---------------|-------|
| **Hover** | `:hover` pseudo-class | Tailwind applies via `hover:` modifier automatically. Background lightens/darkens slightly. No custom styling needed. |
| **Pressed / Active** | `:active` pseudo-class | Tailwind applies via `active:` modifier automatically. Do NOT create a "pressed" variant or prop. |
| **Focused** | `:focus-visible` pseudo-class | Shows focus ring (`ring-ring`). Handled by shadcn's base button styles. Do not modify. |

### States requiring props or wrapper logic

| Figma state | Code mechanism | Implementation |
|-------------|---------------|----------------|
| **Disabled** | `disabled` prop | `<Button disabled>` — reduces opacity, removes pointer events. Native HTML attribute. |
| **Loading** | **See decision below** | Not a native shadcn Button prop. Requires explicit handling. |

### Loading state — decision record

**The problem:** Figma shows "Loading" as a button variant/state with a spinner
replacing or alongside the label. shadcn's base Button does NOT have a `loading`
prop. This is the gap the chat transcript flagged.

**Decision: Use children composition, not a loading prop.**

```tsx
// CORRECT — loading via children composition
<Button disabled>
  <Loader2 className="animate-spin" />
  Saving...
</Button>

// WRONG — inventing a loading prop that doesn't exist
<Button loading={true}>Save</Button>
```

**Why:** Adding a `loading` prop requires modifying `button.tsx`, which is a
shadcn primitive owned by CODEOWNERS review. Children composition works with the
stock component, is visually identical, and the `disabled` prop prevents
double-clicks during loading. If a `loading` prop is added later as a component
extension, this spec will be updated.

**Rules for loading state:**
1. Always pair loading spinner with `disabled` prop
2. Import spinner: `import { Loader2 } from "lucide-react"`
3. Add `animate-spin` class to the spinner icon
4. Replace or prepend the label (e.g., "Save" → "Saving...")
5. Use `size-4` for the spinner icon to match button icon sizing

---

## Icons in buttons

| Pattern | Code | When |
|---------|------|------|
| Icon left of text | `<Button><Icon className="size-4" /> Label</Button>` | Most common — indicates action type |
| Icon right of text | `<Button>Label <Icon className="size-4" /></Button>` | "Next", "External link", directional |
| Icon only | `<Button variant="outline" size="icon"><Icon className="size-4" /></Button>` | Toolbars, compact actions |

**Rules:**
- Icon size matches button size tier: `size-4` for default/small, `size-5` for large
- Gap between icon and text is handled by the button's flex gap (built into shadcn) — do not add manual `mr-2` or `ml-2`
- Icon-only buttons MUST have `size="icon"` and should include an accessible label via `aria-label`

```tsx
// CORRECT — icon-only with accessibility
<Button variant="outline" size="icon" aria-label="Close dialog">
  <X className="size-4" />
</Button>

// WRONG — no accessible label
<Button variant="outline" size="icon">
  <X className="size-4" />
</Button>
```

---

## Button as link

When a button should navigate (not perform an action), use the `render` prop pattern:

```tsx
import Link from "next/link"

<Button render={<Link href="/settings" />} variant="link">
  Go to settings
</Button>
```

Do not put `onClick` with `router.push()` on a Button for navigation. Use `render={<Link href="..." />}`.

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Solid purple button | `<Button variant="default">` |
| Gray/muted button | `<Button variant="secondary">` |
| Red button | `<Button variant="destructive">` |
| White button with border | `<Button variant="outline">` |
| No background, no border | `<Button variant="ghost">` |
| Underlined text-style button | `<Button variant="link">` |
| Small/compact button | `size="sm"` |
| Large/hero button | `size="lg"` |
| Square button with only icon | `size="icon"` |
| Button with spinner | `<Button disabled><Loader2 className="animate-spin" /> Loading...</Button>` |
| Grayed-out button | `<Button disabled>` |

---

## Inline text-style actions (the "Forgot your password?" pattern)

When Figma shows a small text-style action adjacent to a label or inside a form
row — not a standalone CTA — choose based on color:

| Figma shows | Use |
|-------------|-----|
| Purple/primary colored text that navigates | `<Button render={<Link href="..." />} variant="link">` |
| Purple/primary colored text (no route yet) | `<Button variant="link" type="button">` |
| Foreground-colored text (gray, not purple) | `<Button variant="ghost" size="sm">` |

**For ghost in this context:** accept the subtle hover background — it is
intentional and on-brand. Do NOT override it with className.

```tsx
// ✅ CORRECT — foreground-colored inline action
<Button variant="ghost" size="sm" type="button">
  Forgot your password?
</Button>

// ❌ WRONG — fighting the button with className overrides
<Button variant="ghost" className="h-auto p-0 hover:bg-transparent shadow-none font-normal">
  Forgot your password?
</Button>
```

The className override version violates Rule 7 below and produces fragile,
hard-to-maintain code. If the ghost hover still looks wrong, the correct fix
is to adjust the token system — not to override individual button instances.

---

## Rules for LLMs

1. **One default (primary) button per visible area.** Multiple primary buttons
   in the same card/form/dialog is always wrong.
2. **Never create a custom button component.** All buttons use `@/components/ui/button`.
   No `<button className="...">` with hand-written styles.
3. **Loading = children composition + disabled.** Do not invent a `loading` prop.
4. **Icon-only buttons need `aria-label`.** Every time.
5. **Navigation = `render={<Link href="..." />}`.** Not `onClick` + `router.push()`, and not `asChild` (that's Radix — this repo uses Base UI).
6. **Pressed/active is CSS.** Do not create a "pressed" state prop or variant.
7. **Do not override Button's built-in styles with className.** This means:
   - No `hover:bg-transparent`, `hover:bg-*`, or any other custom `hover:` class
   - No structural overrides like `h-auto`, `p-0`, `shadow-none` to make a button "look like text"
   - If a button needs to look like text, choose the right variant (`link` or `ghost`) — do not fight the variant's defaults
   - The only acceptable className additions are layout utilities (`w-full`, `shrink-0`, `mt-2`) that don't override visual token properties

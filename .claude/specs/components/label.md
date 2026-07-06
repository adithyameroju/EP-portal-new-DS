# Label — Compass Component Spec

> **Purpose:** This file is the complete specification for the Label component.
> LLMs must follow this spec exactly when generating form labels.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Label } from "@/components/ui/label"

File: components/ui/label.tsx
```

---

## What Label is

`Label` is a thin wrapper around the native HTML `<label>` element. It applies
consistent typography (`text-sm font-medium leading-none`) and automatic
disabled-state dimming. It has no variants, no size props, and no sub-components.

---

## Default styling

| Property | Value |
|----------|-------|
| Font size | `text-sm` (14px) |
| Font weight | `font-medium` |
| Line height | `leading-none` |
| Layout | `flex items-center gap-2` — handles icon + text inline |
| User select | `select-none` |

---

## Automatic disabled dimming

Label dims automatically in two cases — no extra className needed:

| Situation | Mechanism |
|-----------|-----------|
| Paired input is `disabled` (standalone pattern) | `peer-disabled:opacity-50` — the input must be rendered **before** the label in DOM order |
| Inside a disabled `Field` component | `group-data-[disabled=true]:opacity-50` — handled by Field's group context |

When using a standalone `disabled` input + label **without** a `Field`, the
input must come first in DOM order for the peer selector to work. If you
reverse the order, add `opacity-50` to the Label manually.

---

## Common patterns

### Label with an input (standard)

```tsx
<div className="grid gap-1.5">
  <Label htmlFor="email">Email address</Label>
  <Input id="email" type="email" />
</div>
```

### Label with disabled input (standalone)

The input must come before the label for auto-dimming to work:

```tsx
<div className="flex items-center gap-2">
  <Input id="readonly-field" disabled />
  <Label htmlFor="readonly-field">Read-only field</Label>
</div>
```

Or add `opacity-50` manually if label comes first:

```tsx
<div className="grid gap-1.5">
  <Label htmlFor="readonly-field" className="opacity-50">Read-only field</Label>
  <Input id="readonly-field" disabled />
</div>
```

### Label inside a Field (preferred for forms)

Inside a `Field`, disabled state is handled automatically regardless of DOM order:

```tsx
import { Field, FieldLabel } from "@/components/ui/field"

<Field>
  <FieldLabel htmlFor="policy-name">Policy name</FieldLabel>
  <Input id="policy-name" />
</Field>
```

> Prefer `FieldLabel` (from the Field component) over raw `Label` when building
> form fields with descriptions or error states. Use raw `Label` for simple
> one-off pairings (checkboxes, switches, toggle groups).

### Label with icon

Label's built-in `flex items-center gap-2` handles an icon before the text:

```tsx
<Label htmlFor="search">
  <SearchIcon className="size-3.5" />
  Search policies
</Label>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Form field label text | `<Label htmlFor="x">text</Label>` |
| Grayed-out label (disabled state) | `Label` auto-dims — add `opacity-50` only if peer selector won't work |
| Label with icon to the left | `<Label>` with icon + text (flex gap-2 is built in) |
| Label + description + input group | Use `FieldLabel` inside `Field`, not raw `Label` |

---

## Rules for LLMs

1. **Always connect Label to its control via `htmlFor`/`id`.** A label that
   is not programmatically associated with an input is inaccessible:
   ```tsx
   // ✅ CORRECT
   <Label htmlFor="name">Full name</Label>
   <Input id="name" />

   // ❌ WRONG — no association
   <Label>Full name</Label>
   <Input />
   ```

2. **Do not add `text-sm` or `font-medium` to Label.** They are already
   applied. Adding them again does nothing but creates noise.

3. **Do not add `className="opacity-50"` inside a Field.** The Field's
   group context handles dimming automatically when the field is disabled.
   Only add `opacity-50` for standalone label + disabled input patterns
   where the input appears after the label in DOM order.

4. **Use `FieldLabel` instead of `Label` when inside a `Field`.** `FieldLabel`
   adds the correct `htmlFor` binding and field context. Raw `Label` works,
   but `FieldLabel` is the right component for that context.

5. **Do not use `<label>` directly.** Always import and use `Label` from
   `@/components/ui/label`. The raw element lacks the consistent styling and
   disabled-state behaviour.

6. **Label has no size variants.** `text-sm` is always correct. Do not add
   `text-xs`, `text-base`, or `text-lg` size overrides.

# Input — Compass Component Spec

> **Purpose:** This file is the complete specification for text input fields.
> LLMs must follow this spec exactly when generating code that includes inputs.

---

## Component location

```
Import: import { Input } from "@/components/ui/input"
File:   components/ui/input.tsx
```

### Related components

For complete form patterns, Input is often used with these companions:

```tsx
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Field, FieldLabel, FieldDescription,
  FieldError, FieldGroup
} from "@/components/ui/field"
```

> This repo does not have a `form.tsx` (react-hook-form) component. Use the
> `Field` system for all form field structure — see `specs/components/field.md`.

---

## Basic usage

```tsx
// Standalone input with label
<div className="grid gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="name@acko.com" />
</div>
```

```tsx
// Inside the Field system (forms with help text / validation)
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" placeholder="name@acko.com" />
  <FieldDescription>Your work email address.</FieldDescription>
  <FieldError errors={emailErrors} />
</Field>
```

---

## Anatomy

The shadcn Input is a styled `<input>` element. It does NOT have built-in
icons, prefixes, or suffixes — those are composed by wrapping.

| Element | Implementation | Token |
|---------|---------------|-------|
| Border | `border-input` | `var(--input)` |
| Background | `bg-transparent` | Transparent (`dark:bg-input/30` in dark mode) |
| Text | `text-foreground` | `var(--foreground)` |
| Placeholder | `text-muted-foreground` | `var(--muted-foreground)` |
| Focus ring | `focus-visible:ring-3 focus-visible:ring-ring/50` + `focus-visible:border-ring` | `var(--ring)` at 50% opacity, 3px — Acko purple |
| Border radius | `rounded-lg` | 8px |
| Height | `h-8` | 32px |
| Padding | `px-2.5 py-1` | 10px horizontal, 4px vertical |
| Font size | `text-base md:text-sm` | 16px on mobile, 14px at `md` and up |

---

## Input types

Use the correct `type` attribute. This affects mobile keyboard, browser
autofill, and validation behavior.

| Figma pattern | `type` prop | Notes |
|--------------|-------------|-------|
| Plain text field | `type="text"` | Default |
| Email field | `type="email"` | Mobile shows @ keyboard |
| Password field | `type="password"` | Browser hides characters |
| Number field | `type="number"` | Mobile shows numeric keyboard |
| Search field | `type="search"` | Browser may add clear button |
| Phone number | `type="tel"` | Mobile shows phone keyboard |
| URL | `type="url"` | Mobile shows .com keyboard |
| Date | `type="date"` | Native date picker |
| File upload | `type="file"` | Different styling — see note below |

**File inputs** have special styling in shadcn. The component handles this
internally. Do not add custom file input styling.

---

## States

| Figma state | Code mechanism | Implementation |
|-------------|---------------|----------------|
| **Default** | No additional props | Standard appearance |
| **Focused** | `:focus-visible` | Auto — shows ring in Acko purple. Do not customize. |
| **Disabled** | `disabled` prop | `<Input disabled />` — reduced opacity, no interaction |
| **Error / Invalid** | Wrapper styling | Apply `border-destructive` via wrapper class or `FieldError` in the Field system (see below) |
| **Read-only** | `readOnly` prop | `<Input readOnly />` — selectable but not editable |
| **With value** | Controlled via `value` prop | No visual difference from default |

### Error state pattern

shadcn Input does NOT have a built-in error prop. Error styling is applied
through the Field system, or manually:

```tsx
// With the Field system (preferred) — FieldError shows the error message
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
  <FieldError errors={emailErrors} /> {/* Renders nothing when errors is empty */}
</Field>

// Manual error styling (when not using Field)
<div className="grid gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
  />
  {hasError && (
    <p className="text-sm text-destructive">Please enter a valid email.</p>
  )}
</div>
```

---

## Input with icon/prefix/suffix

shadcn Input has no built-in icon slot. Compose by wrapping:

```tsx
// Input with icon on the left
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
  <Input className="pl-9" placeholder="Search..." />
</div>

// Input with suffix text
<div className="relative">
  <Input className="pr-12" placeholder="0.00" />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
    INR
  </span>
</div>
```

**Rules for icon inputs:**
- Icon is `size-4` and `text-muted-foreground`
- Position with `absolute` + centering, not flexbox
- Adjust input padding to accommodate: `pl-9` for left icon, `pr-9` for right icon
- Do NOT modify `input.tsx` to add icon slots — compose externally

---

## Input vs Textarea

| When | Use |
|------|-----|
| Single-line text | `<Input />` |
| Multi-line text (comments, descriptions) | `<Textarea />` |
| Figma shows a tall text box | `<Textarea />` |

Textarea uses the same tokens and styling conventions as Input (same border,
focus ring, font size, placeholder color). Import separately:
`import { Textarea } from "@/components/ui/textarea"`

---

## Label pairing

**Every Input must have a Label.** Either visible (`<Label>`) or invisible
(`aria-label` attribute). No exceptions.

```tsx
// CORRECT — visible label
<Label htmlFor="name">Full name</Label>
<Input id="name" />

// CORRECT — hidden label for icon-only search
<Input aria-label="Search policies" placeholder="Search..." />

// WRONG — no label at all
<Input placeholder="Full name" />
```

The `htmlFor` on Label must match the `id` on Input. This is an accessibility
requirement, not a style preference.

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Simple text input | `<Input />` |
| Input with label above | `<Label>` + `<Input>` in a `gap-1.5` wrapper |
| Input with helper text below | Use `FieldDescription` (with Field) or `<p className="text-sm text-muted-foreground">` |
| Input with error message | Use `FieldError` (with Field) or manual error pattern |
| Input with left icon (e.g., search) | Relative wrapper + absolute icon + padded Input |
| Disabled/grayed input | `<Input disabled />` |
| Multi-line text area | `<Textarea />` (not Input) |
| Group of labeled inputs (form) | Use `FieldGroup` wrapping multiple `Field` |

---

## Rules for LLMs

1. **Always pair Input with Label.** Visible or `aria-label`, no exceptions.
2. **Never modify `input.tsx`.** Compose icons and prefixes externally.
3. **Use the correct `type` attribute.** Email fields get `type="email"`, etc.
4. **Error state = `border-destructive` + error message.** Not a red background,
   not a custom error prop.
5. **For forms with validation, use the Field system.** Field, FieldLabel,
   FieldDescription, FieldError (and FieldGroup for multiple fields) — see
   `specs/components/field.md`. This repo has no `form.tsx`.
6. **Textarea for multi-line.** Do not set `rows` on Input or use CSS to make
   Input look multi-line.
7. **Placeholder is not a label.** Placeholder text disappears on input. It
   supplements the label, never replaces it.

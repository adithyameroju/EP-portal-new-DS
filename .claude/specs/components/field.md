# Field — Compass Component Spec

> **Purpose:** This file is the complete specification for the Field component
> system — Compass's approach to form field layout, labels, help text, and
> error messages. LLMs must follow this spec exactly when generating forms.
>
> ⚠️ **This repo does not have a `form.tsx` (react-hook-form) component.**
> The equivalent is `field.tsx` — a framework-agnostic field layout system.
> Use `Field` + `FieldError` for all form field structure.

---

## Component location

```
Import: import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"

File: components/ui/field.tsx
```

---

## When to use Field vs standalone Label + Input

| Situation | Use |
|-----------|-----|
| Full form with validation, help text, and errors | `Field` system |
| Simple 1–2 inputs inside a Card (login form, search) | Standalone `Label` + `Input` in a `div` |
| Group of related checkboxes or radio buttons | `FieldSet` + `FieldLegend` |
| Settings page with horizontal label/input rows | `Field orientation="horizontal"` |
| Mobile-first form that goes horizontal at a breakpoint | `Field orientation="responsive"` |

**Rule of thumb:** If you need error messages or description text, use `Field`.
If it's a simple card-level form (2–3 fields, no validation UI), use standalone
`Label` + `Input` pairs (see `specs/components/card.md` — "Card as a form container").

---

## Anatomy

```
FieldGroup
  └── Field (orientation: vertical | horizontal | responsive)
        ├── FieldLabel (or FieldTitle)
        ├── <Input> / <Select> / <Textarea> / etc.
        ├── FieldDescription  (optional — help text)
        └── FieldError        (conditional — error message)

For grouped controls (checkbox/radio):
FieldSet
  ├── FieldLegend
  └── Field (for each item)
        ├── FieldContent
        │     ├── FieldTitle
        │     └── FieldDescription
        └── <Checkbox> / <RadioGroupItem>
```

| Sub-component | HTML | Role | Required? |
|--------------|------|------|-----------|
| `FieldGroup` | `<div>` | Wrapper for multiple fields — controls vertical spacing | When form has 2+ fields |
| `Field` | `<div role="group">` | Single field container — manages orientation + invalid state | Always |
| `FieldLabel` | `<label>` | Label that connects to the input | For most inputs |
| `FieldTitle` | `<div>` | Non-label heading text (for content-only slots) | When no `htmlFor` needed |
| `FieldDescription` | `<p>` | Helper text below the input | Optional |
| `FieldError` | `<div role="alert">` | Error message — shown when validation fails | When using validation |
| `FieldContent` | `<div>` | Stacks title + description for checkbox/radio items | For Checkbox/RadioGroup items |
| `FieldSet` | `<fieldset>` | Semantic grouping for radio/checkbox groups | For radio/checkbox groups |
| `FieldLegend` | `<legend>` | Heading for a fieldset | When using `FieldSet` |
| `FieldSeparator` | `<div>` | Visual separator between fields, optionally with text | Optional |

---

## Field orientation

`Field` has three layout modes controlled by the `orientation` prop:

| Value | Layout | When |
|-------|--------|------|
| `"vertical"` (default) | Label above input | Standard forms |
| `"horizontal"` | Label left, input right | Settings pages, compact rows |
| `"responsive"` | Vertical on mobile, horizontal at `md` breakpoint | Adaptive layouts |

```tsx
// Vertical (default)
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" />
</Field>

// Horizontal
<Field orientation="horizontal">
  <FieldLabel htmlFor="notifications">Email notifications</FieldLabel>
  <Switch id="notifications" />
</Field>

// Responsive
<Field orientation="responsive">
  <FieldLabel htmlFor="name">Full Name</FieldLabel>
  <Input id="name" />
</Field>
```

---

## FieldError — error messages

`FieldError` accepts errors in two ways:

**Option A — pass `errors` array** (for react-hook-form or any validation library):
```tsx
// Single error
<FieldError errors={[{ message: "Email is required" }]} />

// Multiple errors (renders as a list)
<FieldError errors={[
  { message: "Must be at least 8 characters" },
  { message: "Must contain a number" },
]} />
```

**Option B — pass children directly**:
```tsx
<FieldError>This field is required</FieldError>
```

`FieldError` renders nothing when `errors` is empty or undefined. It is safe to always render it — it only appears when there's content.

---

## Common patterns

### Standard form with validation

```tsx
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

<form className="grid gap-6">
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Full Name</FieldLabel>
      <Input id="name" placeholder="Rahul Sharma" />
    </Field>

    <Field>
      <FieldLabel htmlFor="email">Email Address</FieldLabel>
      <Input id="email" type="email" placeholder="rahul@acko.com" />
      <FieldDescription>
        We'll send your policy documents to this address.
      </FieldDescription>
      <FieldError errors={emailErrors} />
    </Field>

    <Field>
      <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
      <Input id="phone" type="tel" placeholder="+91 98765 43210" />
      <FieldError>Please enter a valid 10-digit number</FieldError>
    </Field>
  </FieldGroup>

  <Button type="submit" className="w-full">Continue</Button>
</form>
```

### Checkbox group with FieldSet

```tsx
import { FieldSet, FieldLegend, Field, FieldContent, FieldTitle, FieldDescription } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

<FieldSet>
  <FieldLegend>Notification preferences</FieldLegend>
  <Field orientation="horizontal">
    <Checkbox id="email-notif" />
    <FieldContent>
      <FieldTitle>Email</FieldTitle>
      <FieldDescription>Receive policy updates by email.</FieldDescription>
    </FieldContent>
  </Field>
  <Field orientation="horizontal">
    <Checkbox id="sms-notif" />
    <FieldContent>
      <FieldTitle>SMS</FieldTitle>
      <FieldDescription>Receive alerts by text message.</FieldDescription>
    </FieldContent>
  </Field>
</FieldSet>
```

### Horizontal settings row

```tsx
<Field orientation="horizontal">
  <FieldLabel htmlFor="dark-mode">Dark mode</FieldLabel>
  <Switch id="dark-mode" />
</Field>
```

### Field with separator

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="first-name">First Name</FieldLabel>
    <Input id="first-name" />
  </Field>
  <FieldSeparator>or</FieldSeparator>
  <Field>
    <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
    <Input id="full-name" />
  </FieldSeparator>
</FieldGroup>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Label above input | `Field` (default vertical) + `FieldLabel` |
| Label left, input right | `Field orientation="horizontal"` |
| Helper text below input | `FieldDescription` |
| Red error text below input | `FieldError` |
| Group of related fields | `FieldGroup` wrapping multiple `Field` |
| Group of checkboxes with heading | `FieldSet` + `FieldLegend` |
| Checkbox/radio with title + description | `FieldContent` with `FieldTitle` + `FieldDescription` |
| Divider between field sections | `FieldSeparator` |

---

## Rules for LLMs

1. **Use `Field` when you need errors or descriptions. Use standalone
   `Label` + `Input` for simple card forms.** Over-engineering a 2-field
   login card with `Field`/`FieldGroup` adds unnecessary complexity.

2. **`FieldLabel` uses `htmlFor` — same rule as `Label`.**
   The `htmlFor` on `FieldLabel` must match the `id` on the input:
   ```tsx
   // ✅ CORRECT
   <Field>
     <FieldLabel htmlFor="email">Email</FieldLabel>
     <Input id="email" />
   </Field>

   // ❌ WRONG — no id, no htmlFor
   <Field>
     <FieldLabel>Email</FieldLabel>
     <Input />
   </Field>
   ```

3. **`FieldError` is safe to always render.** It returns nothing when errors
   is empty — no need to conditionally hide it.

4. **`FieldSet` + `FieldLegend` for checkbox/radio groups.** These are the
   semantically correct HTML elements for grouped controls. Using a plain
   `div` with a heading for a group of checkboxes is an accessibility violation.

5. **`FieldContent` goes inside `Field` for checkbox/radio items.**
   When a checkbox needs a title and description to its right, use
   `FieldContent` — not a manual `div`:
   ```tsx
   // ✅ CORRECT
   <Field orientation="horizontal">
     <Checkbox id="terms" />
     <FieldContent>
       <FieldTitle>Accept terms</FieldTitle>
       <FieldDescription>I agree to the policy terms.</FieldDescription>
     </FieldContent>
   </Field>
   ```

6. **Do not nest `FieldGroup` inside `FieldGroup`.** One level of grouping
   is enough for standard forms.

7. **`FieldLegend` only works meaningfully inside `FieldSet`.**
   Using it outside a fieldset has no semantic value.

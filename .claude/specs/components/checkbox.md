# Checkbox — Compass Component Spec

> **Purpose:** This file is the complete specification for the Checkbox component.
> LLMs must follow this spec exactly when generating checkboxes.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Checkbox } from "@/components/ui/checkbox"

File: components/ui/checkbox.tsx
```

---

## When to use Checkbox vs Switch vs RadioGroup

| Situation | Use |
|-----------|-----|
| One or more independent options in a form (submitted on Save) | `Checkbox` |
| A single setting that takes effect immediately on toggle | `Switch` |
| Selecting exactly one option from a mutually exclusive set | `RadioGroup` |
| "Select all" with child selections | `Checkbox` (indeterminate state) |
| Terms & conditions / consent | `Checkbox` |

**The key distinction between Checkbox and Switch:**
- `Checkbox` = the user marks a preference that takes effect when they submit the form
- `Switch` = the change happens instantly (no form submission needed)

---

## Anatomy

Checkbox is a single component with no sub-components. It pairs with:
- `Label` — for the visible text label
- `Field` system (`FieldSet`, `FieldLegend`, `FieldContent`) — for groups with descriptions

---

## Default styling

| Property | Value | Notes |
|----------|-------|-------|
| Size | `size-4` (16px × 16px) | Fixed — no size variants |
| Border radius | `rounded-[4px]` | Slightly rounded square |
| Unchecked | `border border-input` | Border only, transparent background |
| Checked | `bg-primary border-primary text-primary-foreground` | Filled with primary color |
| Checkmark icon | `CheckIcon` (12px) | Built-in — do not add manually |
| Focus ring | `ring-3 ring-ring/50` | Keyboard accessible |
| Disabled | `opacity-50 cursor-not-allowed` | |
| Error state | `border-destructive ring-destructive/20` | Set `aria-invalid` on the element |
| Inside disabled Field | `group-has-disabled/field:opacity-50` | Automatically dims when parent Field is disabled |

---

## Common patterns

### Checkbox with Label (standard)

Always pair `Checkbox` with a `Label`. Connect them via matching `id` and `htmlFor`.

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">
    I agree to the terms and conditions
  </Label>
</div>
```

### Checkbox group with FieldSet

For multiple related checkboxes, use the `Field` system:

```tsx
import { FieldSet, FieldLegend, Field, FieldContent, FieldTitle, FieldDescription } from "@/components/ui/field"

<FieldSet>
  <FieldLegend>Select coverage types</FieldLegend>

  <Field orientation="horizontal">
    <Checkbox id="coverage-own-damage" />
    <FieldContent>
      <FieldTitle>Own Damage</FieldTitle>
      <FieldDescription>Covers damage to your own vehicle.</FieldDescription>
    </FieldContent>
  </Field>

  <Field orientation="horizontal">
    <Checkbox id="coverage-third-party" />
    <FieldContent>
      <FieldTitle>Third-Party Liability</FieldTitle>
      <FieldDescription>Covers damage caused to others.</FieldDescription>
    </FieldContent>
  </Field>

  <Field orientation="horizontal">
    <Checkbox id="coverage-personal-accident" />
    <FieldContent>
      <FieldTitle>Personal Accident</FieldTitle>
      <FieldDescription>Covers injury or death of the driver.</FieldDescription>
    </FieldContent>
  </Field>
</FieldSet>
```

### Controlled checkbox

```tsx
const [checked, setChecked] = React.useState(false)

<div className="flex items-center gap-2">
  <Checkbox
    id="notifications"
    checked={checked}
    onCheckedChange={setChecked}
  />
  <Label htmlFor="notifications">Receive email notifications</Label>
</div>
```

### Checkbox with error state

```tsx
<div className="flex flex-col gap-1.5">
  <div className="flex items-center gap-2">
    <Checkbox id="consent" aria-invalid={!hasConsented} />
    <Label htmlFor="consent">I have read the policy document</Label>
  </div>
  {!hasConsented && (
    <p className="text-sm text-destructive">You must read and agree before continuing.</p>
  )}
</div>
```

### Disabled checkbox

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="auto-renew" disabled />
  <Label htmlFor="auto-renew" className="opacity-50">
    Auto-renew (not available for this policy type)
  </Label>
</div>
```

### "Select all" with indeterminate state

```tsx
const allChecked = items.every(i => i.checked)
const someChecked = items.some(i => i.checked)

<div className="flex items-center gap-2">
  <Checkbox
    id="select-all"
    checked={allChecked}
    indeterminate={!allChecked && someChecked}
    onCheckedChange={(checked) => selectAll(checked)}
  />
  <Label htmlFor="select-all">Select all</Label>
</div>
```

Base UI's `checked` prop is a plain `boolean`. The mixed state is a separate
`indeterminate` boolean prop — there is no `checked="indeterminate"` value
(that is the Radix API, which this repo does not use).

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Square checkbox unchecked | `<Checkbox id="x" />` |
| Square checkbox checked (purple fill) | `<Checkbox id="x" checked />` or controlled via `checked` prop |
| Checkbox with label to the right | `<Checkbox>` + `<Label>` in a `flex items-center gap-2` div |
| Group of checkboxes with heading | `FieldSet` + `FieldLegend` |
| Checkbox with title + description text | `Field orientation="horizontal"` + `FieldContent` |
| Dash/minus indeterminate state | `indeterminate` prop, e.g. `<Checkbox indeterminate />` (separate from `checked`) |
| Disabled/grayed out checkbox | `<Checkbox disabled>` + `Label className="opacity-50"` |

---

## Rules for LLMs

1. **Always pair Checkbox with Label via `htmlFor`/`id`.**
   A checkbox without a label is inaccessible:
   ```tsx
   // ✅ CORRECT
   <Checkbox id="accept" />
   <Label htmlFor="accept">Accept terms</Label>

   // ❌ WRONG — no label
   <Checkbox />
   ```

2. **Use `FieldSet` + `FieldLegend` for checkbox groups.** Three or more
   related checkboxes should be inside a `<fieldset>` with a `<legend>`.
   A `<div>` with a heading is not semantically correct.

3. **Checkbox is 16px — do not resize it.** `size-4` is fixed. Never add
   `size-5`, `size-6`, or `w-5 h-5` className overrides.

4. **Disabled Label needs `opacity-50` manually.** When the checkbox is
   `disabled`, the label does not automatically dim unless it's inside a
   `Field` with `group-has-disabled/field:opacity-50`. Add `className="opacity-50"`
   to the Label when using standalone checkbox + label pattern.

5. **Use `onCheckedChange`, not `onChange`.** Checkbox uses the Base UI
   API — the prop is `onCheckedChange`, not the native `onChange`.

6. **Checkbox vs Switch — never substitute one for the other.** If Figma
   shows a toggle/switch shape, use `Switch`. If it shows a square checkbox,
   use `Checkbox`. Do not use either where the other is shown.

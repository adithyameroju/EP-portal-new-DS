# RadioGroup — Compass Component Spec

> **Purpose:** This file is the complete specification for the RadioGroup component.
> LLMs must follow this spec exactly when generating radio button groups.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

File: components/ui/radio-group.tsx
```

---

## When to use RadioGroup vs Checkbox vs Select

| Situation | Use |
|-----------|-----|
| Exactly one option from a mutually exclusive set (2–5 options) | `RadioGroup` |
| One or more independent options in a form | `Checkbox` |
| Exactly one option from a long list (6+ options) | `Select` |
| A setting that takes effect immediately on toggle | `Switch` |
| "I agree / I don't agree" binary choice | `RadioGroup` |

**The key rule:** `RadioGroup` is for choosing exactly one option from a
visible set. If the set is too long to show all at once, use `Select` instead.

---

## Anatomy

```
RadioGroup (root — grid container, manages selected value)
  └── div (flex row wrapper — one per option)
        ├── RadioGroupItem (the radio circle)
        └── Label (the option label — paired via htmlFor/id)
```

`RadioGroup` has no sub-components for layout — you compose the pairing
with `Label` yourself, the same as `Checkbox`.

---

## Props

### RadioGroup

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `value` | `string` | — | Controlled selected value |
| `onValueChange` | `(value: string) => void` | — | Controlled change handler |
| `defaultValue` | `string` | — | Uncontrolled initial value |
| `disabled` | `boolean` | `false` | Disables all items in the group |

### RadioGroupItem

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `value` | `string` | — | The value this item represents (required) |
| `id` | `string` | — | For pairing with Label's `htmlFor` |
| `disabled` | `boolean` | `false` | Disables this individual item |
| `aria-invalid` | `boolean` | — | Error state |

---

## Default styling

| State | Appearance |
|-------|-----------|
| Unchecked | `border border-input` (ring only, transparent center) |
| Checked | `border-primary bg-primary` + white dot indicator |
| Focus | `ring-3 ring-ring/50 border-ring` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Error | `border-destructive ring-3 ring-destructive/20` |

Size: fixed `size-4` (16px circle) — same as Checkbox.

---

## Common patterns

### Standard radio group (vertical)

```tsx
<RadioGroup defaultValue="motor">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="motor" id="type-motor" />
    <Label htmlFor="type-motor">Motor</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="health" id="type-health" />
    <Label htmlFor="type-health">Health</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="life" id="type-life" />
    <Label htmlFor="type-life">Life</Label>
  </div>
</RadioGroup>
```

### Controlled radio group

```tsx
const [value, setValue] = React.useState("monthly")

<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="monthly" id="pay-monthly" />
    <Label htmlFor="pay-monthly">Monthly</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="annual" id="pay-annual" />
    <Label htmlFor="pay-annual">Annual (save 20%)</Label>
  </div>
</RadioGroup>
```

### Radio group inside a FieldSet

Use `FieldSet` + `FieldLegend` for accessible grouping with a heading:

```tsx
import { FieldSet, FieldLegend } from "@/components/ui/field"

<FieldSet>
  <FieldLegend>Coverage type</FieldLegend>
  <RadioGroup defaultValue="comprehensive">
    <div className="flex items-center gap-2">
      <RadioGroupItem value="comprehensive" id="cov-comp" />
      <Label htmlFor="cov-comp">Comprehensive</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="third-party" id="cov-tp" />
      <Label htmlFor="cov-tp">Third-party only</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="own-damage" id="cov-od" />
      <Label htmlFor="cov-od">Own damage only</Label>
    </div>
  </RadioGroup>
</FieldSet>
```

### Radio group with description per option

Use the `Field` system for rich radio items:

```tsx
import { FieldSet, FieldLegend, Field, FieldContent, FieldTitle, FieldDescription } from "@/components/ui/field"

<FieldSet>
  <FieldLegend>Payment frequency</FieldLegend>
  <RadioGroup defaultValue="annual">
    <Field orientation="horizontal">
      <RadioGroupItem value="monthly" id="freq-monthly" />
      <FieldContent>
        <FieldTitle>Monthly</FieldTitle>
        <FieldDescription>₹1,050/month — pay as you go</FieldDescription>
      </FieldContent>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="annual" id="freq-annual" />
      <FieldContent>
        <FieldTitle>Annual</FieldTitle>
        <FieldDescription>₹12,000/year — save ₹600</FieldDescription>
      </FieldContent>
    </Field>
  </RadioGroup>
</FieldSet>
```

### Horizontal radio group (compact)

```tsx
<RadioGroup defaultValue="active" className="flex flex-row gap-4">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="active" id="status-active" />
    <Label htmlFor="status-active">Active</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="inactive" id="status-inactive" />
    <Label htmlFor="status-inactive">Inactive</Label>
  </div>
</RadioGroup>
```

### Radio group with error state

```tsx
<div className="flex flex-col gap-2">
  <RadioGroup aria-invalid={!hasSelection}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="yes" id="consent-yes" aria-invalid={!hasSelection} />
      <Label htmlFor="consent-yes">Yes, I consent</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="no" id="consent-no" aria-invalid={!hasSelection} />
      <Label htmlFor="consent-no">No, I decline</Label>
    </div>
  </RadioGroup>
  {!hasSelection && (
    <p className="text-sm text-destructive">Please select an option to continue.</p>
  )}
</div>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Circular radio button unchecked | `<RadioGroupItem value="x" id="x" />` |
| Circular radio button checked | Controlled via `value` on `RadioGroup` |
| Radio with label | `RadioGroupItem` + `Label` in `flex items-center gap-2` |
| Group heading above radios | `FieldSet` + `FieldLegend` |
| Radio with title + description | `Field orientation="horizontal"` + `FieldContent` |
| Horizontal row of radios | `RadioGroup className="flex flex-row gap-4"` |

---

## Rules for LLMs

1. **Always pair `RadioGroupItem` with `Label` via `htmlFor`/`id`.**
   A radio without a label is inaccessible.

2. **Each `RadioGroupItem` needs a unique `value` and `id`.**
   The `value` is used for selection state; the `id` links to the label.

3. **Use `FieldSet` + `FieldLegend` for radio groups with a heading.**
   Three or more related radio items should be inside a semantic `<fieldset>`
   with a `<legend>`. A `<div>` with a heading is not semantically correct.

4. **`RadioGroup` defaults to a vertical grid (`grid gap-2`).** Override
   with `className="flex flex-row gap-4"` for horizontal layout.

5. **Disabled Label needs `opacity-50` manually.** Same rule as Checkbox:
   when `RadioGroupItem` is disabled without being inside a `Field`, add
   `className="opacity-50"` to the Label.

6. **Do not resize `RadioGroupItem`.** It is `size-4` (16px) — the same
   as `Checkbox`. Do not add `size-5` or `w-5 h-5` overrides.

7. **For 6+ options, use `Select` instead.** Showing more than 5 radio
   buttons clutters the form. Switch to `Select` when the option count grows.

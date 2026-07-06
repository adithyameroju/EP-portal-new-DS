# Select — Compass Component Spec

> **Purpose:** This file is the complete specification for the Select component.
> LLMs must follow this spec exactly when generating code that includes dropdowns.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

File: components/ui/select.tsx
```

---

## When to use Select vs Combobox

| Situation | Use |
|-----------|-----|
| Short list (≤15 items), user picks from fixed options | `Select` |
| Long list (15+ items) or user may type to search | `Combobox` |
| User needs to pick multiple items | `Combobox` (multi) or `Checkbox` group |
| Options are fixed and known at design time | `Select` |
| Options are dynamic or fetched from API | `Combobox` |

**Select is for fixed, short option sets.** When in doubt about list length, default to Select — it's simpler to implement and sufficient for most Acko form fields.

---

## Anatomy

```
┌─────────────────────────────┐
│  SelectTrigger              │
│    SelectValue   [chevron]  │
└─────────────────────────────┘

On open:
┌─────────────────────────────┐
│  SelectContent              │
│  ┌─ SelectGroup ──────────┐ │
│  │  SelectLabel           │ │
│  │  SelectItem  ✓         │ │
│  │  SelectItem            │ │
│  └────────────────────────┘ │
│  SelectSeparator            │
│  ┌─ SelectGroup ──────────┐ │
│  │  SelectItem            │ │
│  └────────────────────────┘ │
└─────────────────────────────┘
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Select` | Root — manages open/value state | Always |
| `SelectTrigger` | The button that opens the dropdown | Always |
| `SelectValue` | Displays the selected value (or placeholder) | Always |
| `SelectContent` | The dropdown popup container | Always |
| `SelectItem` | An individual option | Always (at least one) |
| `SelectGroup` | Groups related items | When items have logical categories |
| `SelectLabel` | Label for a group | When using `SelectGroup` |
| `SelectSeparator` | Horizontal divider between groups | Optional |

---

## Default styling

| Property | Value | Notes |
|----------|-------|-------|
| Trigger height (default) | `h-8` (32px) | Compact — matches form input height |
| Trigger height (sm) | `h-7` (28px) | For very dense UIs |
| Trigger background | `bg-transparent` | Border-only by default |
| Trigger border | `border border-input` | |
| Trigger radius | `rounded-lg` | |
| Focus ring | `ring-3 ring-ring/50` | Matches input focus style |
| Error state | `aria-invalid` → `border-destructive` + `ring-destructive/20` | |
| Disabled | `opacity-50 cursor-not-allowed` | |
| Content background | `bg-popover` | |
| Content shadow | `shadow-md` | |
| Content border | `ring-1 ring-foreground/10` | |
| Selected item indicator | `CheckIcon` on the right | Built-in — do not add manually |
| Item hover | `bg-accent text-accent-foreground` | |

---

## SelectTrigger sizes

| Size | Prop | Height | When |
|------|------|--------|------|
| Default | `size="default"` | 32px | Standard forms |
| Small | `size="sm"` | 28px | Dense UI, tables, toolbars |

---

## Common patterns

### Basic select with placeholder

```tsx
<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select a state" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
    <SelectItem value="pending">Pending</SelectItem>
  </SelectContent>
</Select>
```

### Select with groups and labels

```tsx
<Select>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Select policy type" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Motor</SelectLabel>
      <SelectItem value="car">Car Insurance</SelectItem>
      <SelectItem value="bike">Two-Wheeler Insurance</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Health</SelectLabel>
      <SelectItem value="individual">Individual Health</SelectItem>
      <SelectItem value="family">Family Health</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### Select paired with Label (in a form)

```tsx
<div className="grid gap-1.5">
  <Label htmlFor="policy-type">Policy Type</Label>
  <Select>
    <SelectTrigger id="policy-type" className="w-full">
      <SelectValue placeholder="Select type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="motor">Motor</SelectItem>
      <SelectItem value="health">Health</SelectItem>
      <SelectItem value="life">Life</SelectItem>
    </SelectContent>
  </Select>
</div>
```

> **Note:** The `id` prop goes on `SelectTrigger`, not `Select`, so the Label's
> `htmlFor` connects to the correct element for accessibility.

### Disabled select

```tsx
<Select disabled>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Not available" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option">Option</SelectItem>
  </SelectContent>
</Select>
```

### Select with disabled items

```tsx
<Select>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="basic">Basic</SelectItem>
    <SelectItem value="standard">Standard</SelectItem>
    <SelectItem value="premium" disabled>
      Premium (unavailable in your region)
    </SelectItem>
  </SelectContent>
</Select>
```

### Controlled select

```tsx
const [value, setValue] = React.useState("")

<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="expired">Expired</SelectItem>
  </SelectContent>
</Select>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Dropdown with fixed options | `Select` |
| Dropdown trigger/button | `SelectTrigger` with `SelectValue` inside |
| Placeholder text ("Select...") | `<SelectValue placeholder="...">` |
| Grouped options with headers | `SelectGroup` + `SelectLabel` |
| Divider between option groups | `SelectSeparator` |
| Checkmark on selected item | Built-in — do not add manually |
| Compact dropdown | `SelectTrigger size="sm"` |
| Searchable dropdown | Use `Combobox` instead |

---

## Rules for LLMs

1. **Always pair `SelectTrigger` with `SelectValue` inside it.** A trigger
   without `SelectValue` shows nothing when an item is selected.

2. **Put the `id` for Label pairing on `SelectTrigger`, not `Select`.**
   `Select` is a non-DOM root; `SelectTrigger` is the actual button element.

3. **Give `SelectTrigger` an explicit width.** The default is `w-fit` which
   shrinks to content. In forms, always use `w-full` or a fixed width:
   ```tsx
   // ✅ CORRECT — full width in a form
   <SelectTrigger className="w-full">

   // ✅ CORRECT — fixed width when standalone
   <SelectTrigger className="w-48">

   // ❌ WRONG — w-fit collapses to the placeholder text width
   <SelectTrigger>
   ```

4. **Do not add a chevron icon manually.** `SelectTrigger` renders
   `ChevronDownIcon` automatically.

5. **Do not add a checkmark to `SelectItem` manually.** The selected item
   indicator (`CheckIcon`) is built into `SelectItem`.

6. **`SelectLabel` only works inside `SelectGroup`.** Never use `SelectLabel`
   as a standalone heading outside a group.

7. **Use `SelectSeparator` between groups, not inside them.** It goes between
   two `SelectGroup` blocks, not between individual items.

8. **Do not use Select for boolean toggles.** "Yes/No" or "On/Off" choices
   belong in a `Switch` or `Checkbox`, not a Select.

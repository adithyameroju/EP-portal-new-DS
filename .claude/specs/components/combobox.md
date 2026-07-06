# Combobox — Compass Component Spec

> **Purpose:** This file is the complete specification for the Combobox component.
> LLMs must follow this spec exactly when generating searchable selects.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox"

File: components/ui/combobox.tsx
```

---

## When to use Combobox vs Select

| Situation | Use |
|-----------|-----|
| 15 or fewer options, no search needed | `Select` |
| 15+ options, or user needs to search/filter | `Combobox` |
| Multi-select with chip tags | `Combobox` (chips mode) |
| Free-text entry that also suggests options | `Combobox` |
| Simple dropdown for a form field | `Select` |

---

## Two modes

### Mode 1 — Single input (standard combobox)

An input field with a chevron trigger. User types to filter options.

### Mode 2 — Chips input (multi-select)

A tag-input where each selected item becomes a removable chip inside the
input field.

---

## Anatomy

**Standard mode:**
```
Combobox (root)
  ├── ComboboxInput (input + chevron trigger, all-in-one)
  └── ComboboxContent (popup)
        └── ComboboxList
              ├── ComboboxEmpty (shown when no matches)
              ├── ComboboxGroup
              │     ├── ComboboxLabel (group heading)
              │     └── ComboboxItem (one option)
              └── ComboboxSeparator
```

**Chips mode:**
```
Combobox (root)
  ├── ComboboxChips (chip container — also the anchor)
  │     ├── ComboboxChip (one selected item tag)
  │     └── ComboboxChipsInput (type-in search)
  └── ComboboxContent (popup, anchored to ComboboxChips)
        └── ComboboxList
              └── ComboboxItem
```

---

## ComboboxInput props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `showTrigger` | `boolean` | `true` | Shows the chevron ▾ button |
| `showClear` | `boolean` | `false` | Shows an × clear button when a value is selected |
| `disabled` | `boolean` | `false` | Disables the input |
| `placeholder` | `string` | — | Placeholder text |

---

## Common patterns

### Standard combobox (searchable single-select)

```tsx
<Combobox>
  <ComboboxInput placeholder="Select insurer..." />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxEmpty>No insurers found.</ComboboxEmpty>
      <ComboboxItem value="acko">Acko</ComboboxItem>
      <ComboboxItem value="hdfc-ergo">HDFC Ergo</ComboboxItem>
      <ComboboxItem value="bajaj-allianz">Bajaj Allianz</ComboboxItem>
      <ComboboxItem value="icici-lombard">ICICI Lombard</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

### Controlled combobox

```tsx
const [value, setValue] = React.useState("")

<Combobox value={value} onValueChange={setValue}>
  <ComboboxInput placeholder="Select city..." showClear />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxEmpty>No city found.</ComboboxEmpty>
      {cities.map((city) => (
        <ComboboxItem key={city.value} value={city.value}>
          {city.label}
        </ComboboxItem>
      ))}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

### Combobox with grouped options

```tsx
<Combobox>
  <ComboboxInput placeholder="Select coverage..." />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxEmpty>No coverage found.</ComboboxEmpty>
      <ComboboxGroup>
        <ComboboxLabel>Motor</ComboboxLabel>
        <ComboboxItem value="own-damage">Own Damage</ComboboxItem>
        <ComboboxItem value="third-party">Third Party</ComboboxItem>
      </ComboboxGroup>
      <ComboboxSeparator />
      <ComboboxGroup>
        <ComboboxLabel>Health</ComboboxLabel>
        <ComboboxItem value="individual">Individual</ComboboxItem>
        <ComboboxItem value="family-floater">Family Floater</ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

### Multi-select with chips

Use the chips mode when users should select multiple values:

```tsx
const anchor = useComboboxAnchor()

<Combobox multiple>
  <ComboboxChips ref={anchor}>
    <ComboboxChip value="motor">Motor</ComboboxChip>
    <ComboboxChip value="health">Health</ComboboxChip>
    <ComboboxChipsInput placeholder="Add coverage..." />
  </ComboboxChips>
  <ComboboxContent anchor={anchor}>
    <ComboboxList>
      <ComboboxItem value="motor">Motor</ComboboxItem>
      <ComboboxItem value="health">Health</ComboboxItem>
      <ComboboxItem value="life">Life</ComboboxItem>
      <ComboboxItem value="travel">Travel</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

### Combobox inside a Field (with label and error)

```tsx
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

<Field>
  <FieldLabel>Policy type</FieldLabel>
  <Combobox>
    <ComboboxInput placeholder="Select type..." className="w-full" />
    <ComboboxContent>
      <ComboboxList>
        <ComboboxEmpty>No types found.</ComboboxEmpty>
        <ComboboxItem value="motor">Motor</ComboboxItem>
        <ComboboxItem value="health">Health</ComboboxItem>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <FieldError />
</Field>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Search input with dropdown | `Combobox` + `ComboboxInput` + `ComboboxContent` |
| No results / empty state | `ComboboxEmpty` inside `ComboboxList` |
| Grouped options with heading | `ComboboxGroup` + `ComboboxLabel` |
| Multi-select chips input | `ComboboxChips` + `ComboboxChip` + `ComboboxChipsInput` |
| Checkmark on selected option | Built-in via `ComboboxItem` (no manual code) |
| Clear × button in input | `ComboboxInput showClear` |

---

## Rules for LLMs

1. **Always include `ComboboxEmpty`.** Without it, the popup appears empty
   with no feedback when the search yields no results.

2. **Selected item checkmark is built in.** `ComboboxItem` includes a
   `CheckIcon` indicator automatically. Do not add a manual checkmark.

3. **Use `useComboboxAnchor` for chips mode.** The chips container needs
   to be passed as `anchor` to `ComboboxContent` so the popup positions
   relative to the chip container, not just the input:
   ```tsx
   const anchor = useComboboxAnchor()
   <ComboboxChips ref={anchor}>...</ComboboxChips>
   <ComboboxContent anchor={anchor}>...</ComboboxContent>
   ```

4. **Combobox vs Select:** If the list has 15+ items, or the user needs to
   type to find an option, use `Combobox`. For a short, static list, use
   `Select`.

5. **`ComboboxInput` width defaults to `w-auto`.** Add `className="w-full"`
   or a fixed width when inside a form field.

6. **`showClear` shows an × only when a value is selected.** Use it when
   the field should be clearable (not all comboboxes need this).

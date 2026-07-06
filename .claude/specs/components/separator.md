# Separator — Compass Component Spec

> **Purpose:** This file is the complete specification for the Separator component.
> LLMs must follow this spec exactly when generating dividers.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Separator } from "@/components/ui/separator"

File: components/ui/separator.tsx
```

---

## What Separator is

`Separator` is a single-component visual divider built on Base UI's
`@base-ui/react/separator` primitive. It renders a thin line to divide
sections of content. It has one prop (`orientation`), no sub-components,
and no variants.

---

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the line |

---

## Default styling

| Orientation | Dimensions | Color |
|-------------|-----------|-------|
| `horizontal` | `h-px w-full` | `bg-border` |
| `vertical` | `w-px self-stretch` | `bg-border` |

`self-stretch` on vertical means the separator fills the full height of its
flex container — no need to set an explicit height.

---

## Common patterns

### Horizontal separator (default)

Between sections on a page or card:

```tsx
<div className="flex flex-col gap-4">
  <p>Section one content</p>
  <Separator />
  <p>Section two content</p>
</div>
```

### Vertical separator

Between items in a horizontal toolbar or inline row:

```tsx
<div className="flex items-center gap-2">
  <Button variant="ghost" size="icon"><BoldIcon /></Button>
  <Button variant="ghost" size="icon"><ItalicIcon /></Button>
  <Separator orientation="vertical" />
  <Button variant="ghost" size="icon"><AlignLeftIcon /></Button>
</div>
```

### Separator inside a Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Policy Details</CardTitle>
  </CardHeader>
  <Separator />
  <CardContent>
    <p>Premium: ₹12,500 / year</p>
  </CardContent>
</Card>
```

### Separator in a settings section list

```tsx
<div className="flex flex-col divide-y">
  <div className="py-4">Row 1</div>
  <div className="py-4">Row 2</div>
</div>
```

> For lists of rows that all need dividers, use Tailwind's `divide-y` on
> the container rather than inserting `<Separator />` between each item.
> Use `<Separator />` explicitly when you need a one-off divider between
> two specific sections.

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Thin horizontal line between sections | `<Separator />` |
| Thin vertical line between toolbar items | `<Separator orientation="vertical" />` |
| Rows separated by lines (list) | `divide-y` on the container |

---

## Rules for LLMs

1. **`Separator` is decorative — it carries no semantic meaning.** It has
   `role="separator"` from the Base UI primitive. Do not use it as a
   structural container or wrap content inside it.

2. **Do not set explicit `h-` or `w-` on Separator.** `h-px w-full` and
   `w-px self-stretch` are built in. Adding `h-4` or `w-full` overrides
   break the orientation logic.

3. **Use `divide-y` / `divide-x` for lists, not repeated `<Separator />`.** 
   If you need dividers between every item in a list, `divide-y` on the
   parent is cleaner and more maintainable.

4. **Vertical Separator requires a flex container.** `self-stretch` only
   works inside a flex row. Place vertical separators inside
   `flex items-center` containers.

5. **Do not add color overrides.** `bg-border` is the correct token for
   all dividers. Do not use `bg-gray-200`, `bg-slate-300`, or any
   hardcoded color.

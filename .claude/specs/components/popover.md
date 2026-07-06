# Popover — Compass Component Spec

> **Purpose:** This file is the complete specification for the Popover component.
> LLMs must follow this spec exactly when generating click-triggered floating panels.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/ui/popover"

File: components/ui/popover.tsx
```

---

## What Popover is

`Popover` is a click-triggered floating panel. It opens when the user clicks
the trigger and closes when they click outside or press Escape. Built on
Base UI's `@base-ui/react/popover` primitive.

**Popover vs HoverCard vs Tooltip:**

| Component | Trigger | Content type |
|-----------|---------|-------------|
| `Tooltip` | Hover | Short text only, non-interactive |
| `HoverCard` | Hover | Rich read-only preview |
| `Popover` | Click | Interactive content (forms, pickers, filters) |

---

## Anatomy

```
Popover (root — manages open state)
  ├── PopoverTrigger (click target)
  └── PopoverContent (the floating panel — portal-rendered)
        ├── PopoverHeader
        │     ├── PopoverTitle
        │     └── PopoverDescription
        └── (your content)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Popover` | Root — state management | Always |
| `PopoverTrigger` | Click target | Always |
| `PopoverContent` | Floating panel | Always |
| `PopoverHeader` | Title + description section | When panel has a heading |
| `PopoverTitle` | Panel heading | When using PopoverHeader |
| `PopoverDescription` | Subtitle / help text | Optional |

---

## PopoverContent props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `side` | `"top" \| "right" \| "bottom" \| "left" \| "inline-start" \| "inline-end"` | `"bottom"` | Which side the panel opens on |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side axis |
| `sideOffset` | `number` | `4` | Gap in px between trigger and panel |
| `alignOffset` | `number` | `0` | Shift in px along alignment axis |

---

## Default styling

| Property | Value |
|----------|-------|
| Width | `w-72` (288px) |
| Padding | `p-2.5` |
| Gap | `gap-2.5` (flex-col) |
| Background | `bg-popover text-popover-foreground` |
| Border radius | `rounded-lg` |
| Shadow | `shadow-md ring-1 ring-foreground/10` |

---

## Common patterns

### Date picker (Calendar in Popover)

The standard date picker pattern:

```tsx
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const [date, setDate] = React.useState<Date | undefined>()

<Popover>
  <PopoverTrigger render={<Button variant="outline" className="w-48 justify-start font-normal" />}>
    <CalendarIcon className="size-4" />
    {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} autoFocus />
  </PopoverContent>
</Popover>
```

### Filter panel

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    <SlidersHorizontal className="size-4" />
    Filters
  </PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Filter policies</PopoverTitle>
      <PopoverDescription>Narrow down results by type and status.</PopoverDescription>
    </PopoverHeader>
    <div className="flex flex-col gap-3">
      <div className="grid gap-1.5">
        <Label>Policy type</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="motor">Motor</SelectItem>
            <SelectItem value="health">Health</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Status</Label>
        <Select>
          <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full">Apply filters</Button>
    </div>
  </PopoverContent>
</Popover>
```

### Info popover (supplementary details on click)

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="ghost" size="icon" />}>
    <InfoIcon className="size-4" />
  </PopoverTrigger>
  <PopoverContent side="right">
    <PopoverHeader>
      <PopoverTitle>Zero Depreciation Cover</PopoverTitle>
    </PopoverHeader>
    <p className="text-sm text-muted-foreground">
      This add-on ensures you receive the full claim amount without any
      deduction for depreciation on replaced parts.
    </p>
  </PopoverContent>
</Popover>
```

### Controlled popover

```tsx
const [open, setOpen] = React.useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger render={<Button />}>
    Open
  </PopoverTrigger>
  <PopoverContent>
    {/* content */}
    <Button onClick={() => setOpen(false)}>Close</Button>
  </PopoverContent>
</Popover>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Floating panel from a button click | `Popover` + `PopoverTrigger render={<Button />}` + `PopoverContent` |
| Panel opening below trigger | `PopoverContent` (default `side="bottom"`) |
| Panel opening to the right | `PopoverContent side="right"` |
| Panel with title + description | `PopoverHeader` + `PopoverTitle` + `PopoverDescription` |
| Date picker calendar popup | `PopoverContent className="w-auto p-0"` + `Calendar` |

---

## Rules for LLMs

1. **`PopoverTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` — the trigger's children become
   `PopoverTrigger`'s children:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <PopoverTrigger render={<Button variant="outline" />}>
     Filters
   </PopoverTrigger>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <PopoverTrigger asChild>
     <Button variant="outline">Filters</Button>
   </PopoverTrigger>
   ```

2. **For Calendar inside Popover, use `className="w-auto p-0"`.** The
   default `w-72 p-2.5` will constrain and pad the calendar incorrectly.
   The calendar has its own internal `p-2` padding.

3. **`PopoverContent` default width is `w-72`.** This fits most filter
   panels and info panels. Override with `className="w-80"` or `className="w-auto"`
   as needed.

4. **Do not use Popover for read-only hover previews.** Use `HoverCard`
   for hover-triggered read-only content. Reserve `Popover` for interactive
   panels that open on click.

5. **Do not add `z-index` to `PopoverContent`.** It renders in a portal
   with `z-50` already applied.

6. **`PopoverHeader` is optional.** If the panel has no title (e.g., just
   a Calendar), skip it entirely.

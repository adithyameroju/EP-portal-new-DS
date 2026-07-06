# Tooltip — Compass Component Spec

> **Purpose:** This file is the complete specification for the Tooltip component.
> LLMs must follow this spec exactly when generating tooltips.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

File: components/ui/tooltip.tsx
```

---

## What Tooltip is

`Tooltip` is a small label that appears on hover (or keyboard focus) to
provide supplementary context for an element — typically an icon button,
a truncated label, or an abbreviation. It is built on Base UI's
`@base-ui/react/tooltip` primitive.

Tooltips are **non-interactive supplementary information only.** They must
not contain buttons, links, or form controls.

---

## Anatomy

```
TooltipProvider (wraps multiple tooltips — usually at page/layout level)
  └── Tooltip (root — manages open state)
        ├── TooltipTrigger (the element that shows the tooltip)
        └── TooltipContent (the popup label — portal-rendered)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `TooltipProvider` | Shared delay configuration for all tooltips | Recommended — wrap at layout level |
| `Tooltip` | Root — manages open/closed state | Always |
| `TooltipTrigger` | The element that triggers the tooltip | Always |
| `TooltipContent` | The popup text — renders into a portal | Always |

---

## TooltipContent props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"top"` | Which side the popup appears on |
| `sideOffset` | `number` | `4` | Gap in px between trigger and popup |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side axis |
| `alignOffset` | `number` | `0` | Shift in px along the alignment axis |

## TooltipProvider props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `delay` | `number` | `0` | Hover delay in ms before tooltip appears |

---

## Default styling

| Property | Value |
|----------|-------|
| Background | `bg-foreground` (dark) |
| Text color | `text-background` (light on dark) |
| Font size | `text-xs` (12px) |
| Padding | `px-3 py-1.5` |
| Border radius | `rounded-md` |
| Max width | `max-w-xs` |
| Arrow | Built-in, matches `bg-foreground` |
| Animation | Fade + zoom in from the trigger side |

---

## Common patterns

### Icon button with tooltip (most common)

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Download policy" />}>
      <DownloadIcon />
    </TooltipTrigger>
    <TooltipContent>Download policy PDF</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Tooltip on the right side

```tsx
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
    <InfoIcon />
  </TooltipTrigger>
  <TooltipContent side="right">
    This coverage applies to third-party damage only.
  </TooltipContent>
</Tooltip>
```

### Multiple tooltips sharing a provider (layout-level pattern)

Wrap the whole page or layout in one `TooltipProvider` rather than creating
one per tooltip:

```tsx
// In your layout component
<TooltipProvider delay={200}>
  {children}
</TooltipProvider>

// In individual components — no TooltipProvider needed
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
    <EditIcon />
  </TooltipTrigger>
  <TooltipContent>Edit policy</TooltipContent>
</Tooltip>
```

### Tooltip on a disabled button

Disabled elements cannot receive focus, which prevents tooltips from showing.
Wrap the disabled button in a `<span>` to restore hover:

```tsx
<Tooltip>
  <TooltipTrigger render={<span tabIndex={0} />}>
    <Button disabled>Renew</Button>
  </TooltipTrigger>
  <TooltipContent>Renewal not available for this policy type.</TooltipContent>
</Tooltip>
```

### Tooltip with keyboard shortcut

```tsx
import { Kbd } from "@/components/ui/kbd"

<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
    <SearchIcon />
  </TooltipTrigger>
  <TooltipContent>
    Search
    <Kbd>⌘K</Kbd>
  </TooltipContent>
</Tooltip>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Dark pill label appearing above element | `TooltipContent` (default `side="top"`) |
| Dark pill label on the right | `TooltipContent side="right"` |
| Icon button with hover label | `TooltipTrigger render={<Button ... />}` + icon as child |
| Tooltip with keyboard shortcut label | `TooltipContent` with `Kbd` inside |

---

## Rules for LLMs

1. **`TooltipTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` — the trigger's children become
   `TooltipTrigger`'s children:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
     <EditIcon />
   </TooltipTrigger>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <TooltipTrigger asChild>
     <Button variant="ghost" size="icon"><EditIcon /></Button>
   </TooltipTrigger>

   // ❌ WRONG — creates a nested button
   <TooltipTrigger>
     <Button variant="ghost" size="icon"><EditIcon /></Button>
   </TooltipTrigger>
   ```

2. **Tooltip content must be text only.** Do not put buttons, links, or
   inputs inside `TooltipContent`. For interactive popovers, use `Popover`.

3. **Wrap `TooltipProvider` at layout level, not per-tooltip.** A single
   provider handles all tooltips on a page. Creating one per tooltip is
   wasteful but functional — just not the right pattern.

4. **Icon-only buttons must have both `aria-label` and a tooltip.** The
   `aria-label` is for screen readers (always present); the tooltip is for
   sighted mouse users. Both are required.

5. **Do not use `Tooltip` for form field descriptions.** That's `FieldDescription`
   in the Field system. Tooltip is for supplementary context on interactive
   elements, not form help text.

6. **Do not add `z-index` to `TooltipContent`.** It renders in a portal with
   `z-50` already applied.

7. **`side="top"` is the default.** Only specify `side` if top placement
   causes clipping (e.g., element near the top edge of the viewport).

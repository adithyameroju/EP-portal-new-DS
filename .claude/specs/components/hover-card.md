# HoverCard — Compass Component Spec

> **Purpose:** This file is the complete specification for the HoverCard component.
> LLMs must follow this spec exactly when generating hover preview cards.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

File: components/ui/hover-card.tsx
```

> **Note:** HoverCard is built on Base UI's `@base-ui/react/preview-card`
> primitive — the PreviewCard. Do not confuse with a card component.

---

## What HoverCard is

`HoverCard` is a rich preview popup that appears when the user **hovers**
over a trigger element. It is designed for displaying supplementary
context about a link, user, or entity — without requiring a click.

**HoverCard vs Tooltip:**
- `Tooltip` — short text label (1 line), appears instantly, no rich content
- `HoverCard` — rich card content (avatar, metadata, stats), has open delay, can contain links

**HoverCard vs Popover:**
- `HoverCard` — opens on hover, read-only content
- `Popover` — opens on click, can contain interactive controls (forms, buttons)

---

## Anatomy

```
HoverCard (root)
  ├── HoverCardTrigger (the element hovered to open)
  └── HoverCardContent (the preview card — portal-rendered)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `HoverCard` | Root — manages open state | Always |
| `HoverCardTrigger` | Hover target | Always |
| `HoverCardContent` | The popup card | Always |

---

## HoverCardContent props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Which side the card opens on |
| `sideOffset` | `number` | `4` | Gap in px between trigger and card |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment along the side axis |
| `alignOffset` | `number` | `4` | Shift in px along alignment axis |

---

## Default styling

| Property | Value |
|----------|-------|
| Width | `w-64` (256px) — fixed |
| Padding | `p-2.5` |
| Background | `bg-popover text-popover-foreground` |
| Border radius | `rounded-lg` |
| Shadow | `shadow-md ring-1 ring-foreground/10` |
| Animation | Fade + zoom from trigger side |

---

## Common patterns

### User profile hover card

```tsx
<HoverCard>
  <HoverCardTrigger render={<Button variant="link" className="p-0 h-auto" />}>
    @nikhil.thakkar
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex items-start gap-3">
      <Avatar>
        <AvatarImage src="/nikhil.jpg" alt="Nikhil Thakkar" />
        <AvatarFallback>NT</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Nikhil Thakkar</p>
        <p className="text-xs text-muted-foreground">Product Design Lead</p>
        <p className="text-xs text-muted-foreground">Joined March 2021</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

### Policy preview on hover

```tsx
<HoverCard>
  <HoverCardTrigger render={<Button variant="link" className="p-0 h-auto font-normal" />}>
    {policy.id}
  </HoverCardTrigger>
  <HoverCardContent side="right">
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{policy.name}</p>
        <Badge variant={statusVariant}>{policy.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>Premium</span>
        <span>₹{policy.premium}/yr</span>
        <span>Expires</span>
        <span>{policy.expiryDate}</span>
        <span>Sum insured</span>
        <span>₹{policy.sumInsured}</span>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

### Term definition on hover

```tsx
<HoverCard>
  <HoverCardTrigger render={<span className="cursor-help underline decoration-dotted" />}>
    IDV
  </HoverCardTrigger>
  <HoverCardContent>
    <p className="text-sm font-medium">Insured Declared Value</p>
    <p className="text-xs text-muted-foreground mt-1">
      The maximum sum insured that the insurance company will pay in case of
      total loss or theft of the vehicle.
    </p>
  </HoverCardContent>
</HoverCard>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Card popup appearing on hover over a link | `HoverCard` + `HoverCardTrigger render={<Button ... />}` + `HoverCardContent` |
| Preview card opening below trigger | `HoverCardContent` (default `side="bottom"`) |
| Preview card opening to the right | `HoverCardContent side="right"` |
| User avatar + name + metadata in popup | Custom content inside `HoverCardContent` |

---

## Rules for LLMs

1. **`HoverCardTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` — the trigger's children become
   `HoverCardTrigger`'s children:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <HoverCardTrigger render={<Button variant="link" />}>
     @username
   </HoverCardTrigger>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <HoverCardTrigger asChild>
     <Button variant="link">@username</Button>
   </HoverCardTrigger>

   // ❌ WRONG — creates an unstyled wrapper
   <HoverCardTrigger>
     <Button variant="link">@username</Button>
   </HoverCardTrigger>
   ```

2. **HoverCard content must be read-only.** Do not place buttons, inputs,
   or other interactive controls inside `HoverCardContent` — it is a
   preview, not a control surface. For interactive content, use `Popover`.

3. **HoverCard is not a Tooltip.** For simple one-line text hints, use
   `Tooltip`. Use `HoverCard` when the preview needs layout — avatar,
   multiple lines, metadata rows.

4. **`HoverCardContent` has fixed `w-64`.** Do not override with a wider
   width for standard previews. If you need a wider card, add
   `className="w-80"` but keep it constrained.

5. **Do not add `z-index` to `HoverCardContent`.** It renders in a portal
   with `z-50` already applied.

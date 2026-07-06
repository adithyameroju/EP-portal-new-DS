# Collapsible — Compass Component Spec

> **Purpose:** This file is the complete specification for the Collapsible component.
> LLMs must follow this spec exactly when generating show/hide sections.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

File: components/ui/collapsible.tsx
```

---

## What Collapsible is

`Collapsible` is a minimal show/hide primitive built on Base UI's
`@base-ui/react/collapsible`. It has no built-in styling — it is a
behaviour-only wrapper that you style with Tailwind.

**Collapsible vs Accordion:** Use `Collapsible` for a single independent
expandable section. Use `Accordion` when you have multiple sections where
only one should be open at a time (or a managed group).

---

## Anatomy

```
Collapsible (root — manages open/closed state)
  ├── CollapsibleTrigger (button that toggles)
  └── CollapsibleContent (content that shows/hides)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Collapsible` | Root — state management | Always |
| `CollapsibleTrigger` | Toggle button | Always |
| `CollapsibleContent` | The expandable content | Always |

---

## Collapsible props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Controlled change handler |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state |
| `disabled` | `boolean` | `false` | Prevents toggling |

---

## CollapsibleContent (panel) props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `keepMounted` | `boolean` | `false` | Keep DOM content when closed (for pre-rendering) |

---

## Common patterns

### Basic collapsible section

```tsx
<Collapsible>
  <CollapsibleTrigger render={<Button variant="ghost" className="flex w-full justify-between" />}>
    Additional details
    <ChevronDownIcon className="size-4" />
  </CollapsibleTrigger>
  <CollapsibleContent className="px-4 pt-2 pb-4">
    <p className="text-sm text-muted-foreground">
      This policy includes zero depreciation cover, roadside assistance,
      and engine protection add-ons.
    </p>
  </CollapsibleContent>
</Collapsible>
```

### Collapsible with animated chevron

Use a `data-state` CSS selector or a controlled state variable to rotate
the chevron when open:

```tsx
const [open, setOpen] = React.useState(false)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger render={<Button variant="ghost" className="flex w-full justify-between" />}>
    Claim history
    <ChevronDownIcon
      className={cn("size-4 transition-transform", open && "rotate-180")}
    />
  </CollapsibleTrigger>
  <CollapsibleContent className="px-4 pt-2 pb-4 space-y-2">
    {claims.map((claim) => (
      <div key={claim.id} className="text-sm">{claim.description}</div>
    ))}
  </CollapsibleContent>
</Collapsible>
```

### Collapsible inside a Card

```tsx
<Card>
  <CardHeader className="p-0">
    <Collapsible>
      <CollapsibleTrigger render={<Button variant="ghost" className="flex w-full items-center justify-between rounded-none px-6 py-4" />}>
        <CardTitle>Policy Add-ons</CardTitle>
        <ChevronDownIcon className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-sm">
            <li>Zero Depreciation Cover</li>
            <li>Engine Protect</li>
            <li>Roadside Assistance</li>
          </ul>
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  </CardHeader>
</Card>
```

### Controlled collapsible

```tsx
const [open, setOpen] = React.useState(false)

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
    {open ? "Hide" : "Show"} details
  </CollapsibleTrigger>
  <CollapsibleContent className="mt-2">
    {/* content */}
  </CollapsibleContent>
</Collapsible>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Section with expand/collapse toggle | `Collapsible` + `CollapsibleTrigger` + `CollapsibleContent` |
| Chevron that rotates on open | Controlled state + `rotate-180` className |
| Multiple independent expandable sections | Multiple `Collapsible` components |
| One-at-a-time accordion (only one open) | Use `Accordion` component instead |

---

## Rules for LLMs

1. **`CollapsibleTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` — the trigger's children become
   `CollapsibleTrigger`'s children:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <CollapsibleTrigger render={<Button variant="ghost" />}>
     Show more
   </CollapsibleTrigger>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <CollapsibleTrigger asChild>
     <Button variant="ghost">Show more</Button>
   </CollapsibleTrigger>

   // ❌ WRONG — renders an unstyled button inside your button
   <CollapsibleTrigger>
     <Button variant="ghost">Show more</Button>
   </CollapsibleTrigger>
   ```

2. **`CollapsibleContent` has no built-in padding.** Add padding via
   `className` — e.g. `className="px-4 pb-4"`.

3. **Use `Accordion` instead for grouped expand/collapse.** If you have
   multiple sections and want only one open at a time (or any group
   management), use the `Accordion` component. `Collapsible` is for a
   single independent section.

4. **The chevron icon does not animate automatically.** Use controlled
   state and a `rotate-180` class conditioned on `open` to animate the
   indicator. There is no built-in data attribute on `CollapsibleTrigger`
   that drives CSS transitions (unlike Accordion).

5. **`CollapsibleContent` maps to Base UI `Panel`.** The export name is
   `CollapsibleContent` but it renders `CollapsiblePrimitive.Panel` under
   the hood. Do not try to import `CollapsiblePanel` — it does not exist.

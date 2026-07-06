# Sheet — Compass Component Spec

> **Purpose:** This file is the complete specification for the Sheet component.
> LLMs must follow this spec exactly when generating slide-over panels.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

File: components/ui/sheet.tsx
```

> **Note:** Sheet uses the same Base UI Dialog primitive as `Dialog`.
> They share overlay and animation behaviour but have different layouts.
> Do not mix Sheet sub-components with Dialog sub-components.

---

## When to use Sheet vs Dialog vs Drawer

| Situation | Use |
|-----------|-----|
| Full-height side panel with detailed content or a form | `Sheet` |
| Compact confirmation or short form in the center of the screen | `Dialog` |
| Mobile-optimised bottom panel (snap points, touch-friendly) | `Drawer` |
| Destructive confirmation requiring explicit choice | `AlertDialog` |
| Navigation sidebar on mobile | `Sidebar` (uses Sheet internally) |

**Sheet is for tasks that need more space than a Dialog but shouldn't navigate
away from the current page** — editing a record, viewing details, multi-step
forms, filters/configuration panels.

---

## Anatomy

```
Sheet (root)
  └── SheetTrigger
  └── SheetContent (side="right" by default)
        ├── [×] close button (built-in)
        ├── SheetHeader
        │     ├── SheetTitle
        │     └── SheetDescription
        ├── (your content)
        └── SheetFooter
              └── action buttons
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Sheet` | Root — manages open/closed state | Always |
| `SheetTrigger` | Element that opens the sheet | Usually |
| `SheetContent` | The slide-over panel | Always |
| `SheetHeader` | Top section — `p-4`, `gap-0.5` | When sheet has a title |
| `SheetTitle` | Panel heading | When using SheetHeader |
| `SheetDescription` | Subtitle below heading | Optional |
| `SheetFooter` | Bottom section — `mt-auto p-4`, stacks above keyboard | When sheet has actions |
| `SheetClose` | Explicit close trigger for custom close buttons | Optional |

---

## SheetContent props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | Which edge the panel slides from |
| `showCloseButton` | `boolean` | `true` | Ghost ×  button in top-right corner |

---

## Default styling by side

| Side | Width/Height | Max size | Border |
|------|-------------|----------|--------|
| `right` | `w-3/4` | `sm:max-w-sm` (384px) | `border-l` |
| `left` | `w-3/4` | `sm:max-w-sm` (384px) | `border-r` |
| `bottom` | `h-auto` | — | `border-t` |
| `top` | `h-auto` | — | `border-b` |

All sides:
- Background: `bg-popover`
- Text: `text-popover-foreground`
- Shadow: `shadow-lg`
- Animation: slides in/out from the appropriate edge

---

## Common patterns

### Standard right-side panel (edit/detail)

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline">Edit Policy</Button>} />
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Policy</SheetTitle>
      <SheetDescription>
        Make changes to the policy details below.
      </SheetDescription>
    </SheetHeader>
    <div className="flex flex-col gap-4 px-4">
      <div className="grid gap-1.5">
        <Label htmlFor="policy-name">Policy Name</Label>
        <Input id="policy-name" defaultValue="Motor Insurance 2024" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="premium">Annual Premium</Label>
        <Input id="premium" type="number" defaultValue="12500" />
      </div>
    </div>
    <SheetFooter>
      <SheetClose render={<Button variant="outline">Cancel</Button>} />
      <Button type="submit">Save Changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Left-side filter panel

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline"><SlidersHorizontal className="size-4" />Filters</Button>} />
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Filter Policies</SheetTitle>
    </SheetHeader>
    <div className="flex flex-col gap-4 px-4">
      {/* filter controls */}
    </div>
    <SheetFooter>
      <SheetClose render={<Button variant="outline" className="w-full">Clear</Button>} />
      <Button className="w-full">Apply</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Bottom sheet (mobile-friendly)

```tsx
<Sheet>
  <SheetTrigger render={<Button>More Options</Button>} />
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Options</SheetTitle>
    </SheetHeader>
    <div className="flex flex-col gap-2 px-4 pb-2">
      <Button variant="outline" className="w-full justify-start">Download PDF</Button>
      <Button variant="outline" className="w-full justify-start">Share</Button>
      <Button variant="destructive" className="w-full justify-start">Cancel Policy</Button>
    </div>
  </SheetContent>
</Sheet>
```

### Controlled sheet

```tsx
const [open, setOpen] = React.useState(false)

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger render={<Button>Open Details</Button>} />
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Policy Details</SheetTitle>
    </SheetHeader>
    {/* content */}
    <SheetFooter>
      <Button onClick={() => setOpen(false)}>Done</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Sheet without a trigger (opened programmatically)

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Notification Details</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Panel sliding from right | `SheetContent` (default `side="right"`) |
| Panel sliding from left | `SheetContent side="left"` |
| Panel from bottom | `SheetContent side="bottom"` |
| Panel title | `SheetHeader` + `SheetTitle` |
| Subtitle below title | `SheetDescription` |
| Cancel + confirm buttons at bottom | `SheetFooter` with `SheetClose` + `Button` |
| Close × button | Built-in (`showCloseButton` defaults to `true`) |
| Panel without close button | `SheetContent showCloseButton={false}` |

---

## Rules for LLMs

1. **`SheetTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` so it renders as your Button:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <SheetTrigger render={<Button variant="outline">Open</Button>} />

   // ❌ WRONG — asChild is the Radix pattern, causes React warnings in this repo
   <SheetTrigger asChild>
     <Button>Open</Button>
   </SheetTrigger>

   // ❌ WRONG — creates a button inside a button
   <SheetTrigger>
     <Button>Open</Button>
   </SheetTrigger>
   ```

2. **`SheetTitle` is required when `SheetHeader` is used.** Accessibility
   requires a title on all modal-like surfaces.

3. **`SheetFooter` stacks with `mt-auto`.** It automatically pushes to the
   bottom of the panel regardless of content height. Do not add `mt-auto`
   manually to the footer.

4. **Content between header and footer needs padding.** Unlike Card,
   `SheetContent` does not apply padding to its children — add `px-4`
   to content divs between `SheetHeader` and `SheetFooter`.

5. **Do not set a fixed height on `SheetContent` for right/left sides.**
   Right and left sheets are always full-height (`h-full`). Setting a
   height will break the layout.

6. **Use `SheetClose render={<Button />}` for a labelled cancel button in the footer.**
   The built-in `showCloseButton` (the × icon) is separate — you can have
   both simultaneously:
   ```tsx
   <SheetClose render={<Button variant="outline">Cancel</Button>} />
   ```

7. **Sheet vs Dialog:** If the content fits comfortably in a centered modal
   (under ~500px tall), use `Dialog`. If it needs the full viewport height
   or a scrollable panel, use `Sheet`.

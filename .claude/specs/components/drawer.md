# Drawer — Compass Component Spec

> **Purpose:** This file is the complete specification for the Drawer component.
> LLMs must follow this spec exactly when generating mobile-friendly bottom panels.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"

File: components/ui/drawer.tsx
```

> **Note:** Drawer is built on the `vaul` library — not Base UI.
> It has drag-to-dismiss and snap-point support suited for mobile.

---

## When to use Drawer vs Sheet

| Situation | Use |
|-----------|-----|
| Mobile-first bottom panel with touch drag-to-dismiss | `Drawer` |
| Full-height side panel on desktop | `Sheet` |
| Action sheet with a few options (mobile) | `Drawer side="bottom"` |
| Persistent panel alongside content | `Sheet` |
| Desktop app with responsive mobile panel | `Drawer` for mobile, `Sheet` for desktop |

**The key distinction:** `Drawer` is optimised for touch — it has a visible
drag handle, momentum-based dismissal, and snap points. `Sheet` is a
keyboard/pointer panel suited for desktop workflows.

---

## Anatomy

```
Drawer (root — vaul)
  ├── DrawerTrigger (opens the drawer)
  └── DrawerContent (the panel — includes overlay automatically)
        ├── [drag handle] — built-in for bottom/top drawers
        ├── DrawerHeader
        │     ├── DrawerTitle
        │     └── DrawerDescription
        ├── (your content)
        └── DrawerFooter
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Drawer` | Root — vaul Drawer.Root | Always |
| `DrawerTrigger` | Element that opens the drawer | Usually |
| `DrawerContent` | The panel — includes overlay | Always |
| `DrawerHeader` | Title + description section | When drawer has a heading |
| `DrawerTitle` | Heading | When using DrawerHeader |
| `DrawerDescription` | Subtitle | Optional |
| `DrawerFooter` | Action buttons at bottom | When drawer has actions |
| `DrawerClose` | Explicit close trigger | Optional |

---

## Direction and sizing

| Direction | Size | Notes |
|-----------|------|-------|
| `bottom` (default) | `max-h-[80vh]` | Rounded top corners, drag handle visible |
| `top` | `max-h-[80vh]` | Rounded bottom corners, drag handle visible |
| `left` | `w-3/4`, `sm:max-w-sm` | Rounded right corners |
| `right` | `w-3/4`, `sm:max-w-sm` | Rounded left corners |

Set direction on the `Drawer` root: `<Drawer direction="bottom">`.

The drag handle pill (`h-1 w-[100px] bg-muted`) appears automatically
for `bottom` and `top` directions only.

---

## DrawerHeader text alignment

| Context | Alignment |
|---------|-----------|
| `bottom` or `top` drawer | Centered on mobile, left-aligned on `md+` |
| `left` or `right` drawer | Always left-aligned |

---

## Common patterns

### Standard bottom drawer (action sheet)

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button>More Options</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Policy Actions</DrawerTitle>
      <DrawerDescription>Choose an action for this policy.</DrawerDescription>
    </DrawerHeader>
    <div className="flex flex-col gap-2 px-4 pb-2">
      <Button variant="outline" className="w-full justify-start">
        <Download />
        Download PDF
      </Button>
      <Button variant="outline" className="w-full justify-start">
        <Share />
        Share
      </Button>
      <Button variant="destructive" className="w-full justify-start">
        <Trash2 />
        Cancel Policy
      </Button>
    </div>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="outline">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Drawer with form content

```tsx
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Edit Details</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Edit Policy</DrawerTitle>
    </DrawerHeader>
    <div className="flex flex-col gap-4 px-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Policy name</Label>
        <Input id="name" defaultValue="Motor Insurance 2024" />
      </div>
    </div>
    <DrawerFooter>
      <Button>Save Changes</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Controlled drawer

```tsx
const [open, setOpen] = React.useState(false)

<Drawer open={open} onOpenChange={setOpen}>
  <DrawerTrigger asChild>
    <Button>Open</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Details</DrawerTitle>
    </DrawerHeader>
    {/* content */}
    <DrawerFooter>
      <Button onClick={() => setOpen(false)}>Done</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### Responsive: Drawer on mobile, Sheet on desktop

```tsx
import { useIsMobile } from "@/hooks/use-mobile"

function PolicyPanel({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>Policy Details</DrawerTitle></DrawerHeader>
          {/* content */}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle>Policy Details</SheetTitle></SheetHeader>
        {/* content */}
      </SheetContent>
    </Sheet>
  )
}
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Bottom panel on mobile with drag handle | `Drawer` (default `direction="bottom"`) |
| Panel from left or right on mobile | `Drawer direction="left/right"` |
| Panel title | `DrawerHeader` + `DrawerTitle` |
| Action buttons at bottom | `DrawerFooter` |
| Drag handle pill at top | Built-in for bottom/top drawers |

---

## Rules for LLMs

1. **`DrawerTrigger` uses `asChild`.** Same as SheetTrigger, DialogTrigger:
   ```tsx
   // ✅ CORRECT
   <DrawerTrigger asChild>
     <Button>Open</Button>
   </DrawerTrigger>
   ```

2. **`DrawerContent` includes the overlay automatically.** Do not add a
   `DrawerOverlay` manually — it is rendered inside `DrawerContent`.

3. **The drag handle is automatic for bottom/top.** Do not add a manual
   drag handle div — it appears for `direction="bottom"` and `direction="top"`.

4. **`DrawerFooter` buttons stack vertically.** `DrawerFooter` uses
   `flex-col gap-2`. For a side-by-side Cancel + Confirm pattern, wrap
   them in a `flex flex-row gap-2` div inside `DrawerFooter`.

5. **Drawer is for mobile; Sheet is for desktop.** Default to `Sheet` on
   desktop layouts. Use `Drawer` when targeting mobile or building a
   responsive component that needs touch-friendly behaviour.

6. **`DrawerTitle` is required when `DrawerHeader` is used.** Accessibility
   requires a title on all modal surfaces.

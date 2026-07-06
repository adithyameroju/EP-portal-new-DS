# Dropdown Menu — Compass Component Spec

> **Purpose:** This file is the complete specification for the DropdownMenu component.
> LLMs must follow this spec exactly when generating dropdown menus and action menus.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

File: components/ui/dropdown-menu.tsx
```

---

## When to use DropdownMenu vs Select vs other components

| Situation | Use |
|-----------|-----|
| List of **actions** triggered from a button (Edit, Delete, Export) | `DropdownMenu` |
| Selecting a **value** for a form field | `Select` |
| Top-level application navigation | `NavigationMenu` |
| Right-click context actions on an element | `DropdownMenu` (triggered programmatically) |
| Single-level action list with 2–5 items | `DropdownMenu` |
| Actions with sub-menus or groupings | `DropdownMenu` |

**The key distinction:** `DropdownMenu` is for **triggering actions**;
`Select` is for **choosing a value**.

---

## Anatomy

```
DropdownMenu (root)
  ├── DropdownMenuTrigger (button that opens the menu)
  └── DropdownMenuContent (the popup list)
        ├── DropdownMenuLabel (section heading)
        ├── DropdownMenuGroup
        │     └── DropdownMenuItem (action item)
        │           └── DropdownMenuShortcut (keyboard shortcut label)
        ├── DropdownMenuSeparator
        ├── DropdownMenuCheckboxItem (toggleable item)
        ├── DropdownMenuRadioGroup
        │     └── DropdownMenuRadioItem (mutually exclusive item)
        └── DropdownMenuSub (nested sub-menu)
              ├── DropdownMenuSubTrigger
              └── DropdownMenuSubContent
                    └── DropdownMenuItem
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `DropdownMenu` | Root — manages open state | Always |
| `DropdownMenuTrigger` | Element that opens the menu | Always |
| `DropdownMenuContent` | The popup panel | Always |
| `DropdownMenuItem` | A single action item | For standard actions |
| `DropdownMenuGroup` | Groups related items (no visual divider) | When grouping semantically |
| `DropdownMenuLabel` | Section heading above a group | When group needs a label |
| `DropdownMenuSeparator` | Visual divider between sections | For visual grouping |
| `DropdownMenuShortcut` | Keyboard shortcut hint — right-aligned | Optional |
| `DropdownMenuCheckboxItem` | Toggleable item with checkmark | For on/off settings |
| `DropdownMenuRadioGroup` | Container for mutually exclusive items | For single-select options |
| `DropdownMenuRadioItem` | Single-select item with indicator | Inside RadioGroup |
| `DropdownMenuSub` | Sub-menu root | For nested menus |
| `DropdownMenuSubTrigger` | Item that opens a sub-menu (has › icon built in) | When using Sub |
| `DropdownMenuSubContent` | Sub-menu popup | When using Sub |

---

## DropdownMenuContent props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Which side of trigger the menu opens |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment along the side axis |
| `sideOffset` | `number` | `4` | Gap in px between trigger and menu |
| `alignOffset` | `number` | `0` | Shift in px along alignment axis |

## DropdownMenuItem props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "destructive"` | `"default"` | Destructive = red text, red hover bg |
| `inset` | `boolean` | `false` | Adds `pl-7` to align text with icon items |

## DropdownMenuLabel props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `inset` | `boolean` | `false` | Adds `pl-7` to align label with icon items |

---

## Default styling

| Element | Styling |
|---------|---------|
| Content panel | `bg-popover text-popover-foreground` rounded-lg, `shadow-md`, `ring-1 ring-foreground/10` |
| Item height | `py-1 px-1.5` — height is content-driven |
| Item font size | `text-sm` |
| Item hover | `bg-accent text-accent-foreground` |
| Destructive item | `text-destructive`, hover `bg-destructive/10` |
| Disabled item | `opacity-50 pointer-events-none` |
| Icon in item | Auto-sized to `size-4` (16px) |
| Separator | `h-px bg-border -mx-1 my-1` |
| Label | `text-xs text-muted-foreground` |
| Shortcut | `text-xs text-muted-foreground` right-aligned |

---

## Common patterns

### Standard action menu (most common — table row actions)

```tsx
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
    <MoreHorizontal />
    <span className="sr-only">Open actions</span>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>
      <Eye />
      View details
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Edit />
      Edit policy
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">
      <Trash2 />
      Cancel policy
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Menu with grouped sections and labels

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Actions
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Policy</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <FileText />
        View document
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Download />
        Download PDF
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>Support</DropdownMenuLabel>
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <Phone />
        Contact agent
      </DropdownMenuItem>
      <DropdownMenuItem>
        <MessageSquare />
        Raise a query
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### Menu with keyboard shortcuts

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>
    <Search />
    Search
    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
  </DropdownMenuItem>
  <DropdownMenuItem>
    <Download />
    Export
    <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
  </DropdownMenuItem>
</DropdownMenuContent>
```

### Checkbox items (view settings toggle)

```tsx
<DropdownMenuContent>
  <DropdownMenuLabel>View options</DropdownMenuLabel>
  <DropdownMenuCheckboxItem checked={showPremium} onCheckedChange={setShowPremium}>
    Show premium amount
  </DropdownMenuCheckboxItem>
  <DropdownMenuCheckboxItem checked={showExpiry} onCheckedChange={setShowExpiry}>
    Show expiry date
  </DropdownMenuCheckboxItem>
</DropdownMenuContent>
```

### Radio items (sorting)

```tsx
<DropdownMenuContent>
  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
    <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="date">Date issued</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="premium">Premium amount</DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
</DropdownMenuContent>
```

### Sub-menu

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>View</DropdownMenuItem>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
    <DropdownMenuSubContent>
      <DropdownMenuItem>Email link</DropdownMenuItem>
      <DropdownMenuItem>Copy link</DropdownMenuItem>
      <DropdownMenuItem>WhatsApp</DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
</DropdownMenuContent>
```

### Inset alignment (when mixing icon and no-icon items)

Use `inset` to align text in icon-less items with text in icon items:

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>
    <Edit />
    Edit
  </DropdownMenuItem>
  <DropdownMenuItem inset>Rename</DropdownMenuItem>
  <DropdownMenuItem inset>Duplicate</DropdownMenuItem>
</DropdownMenuContent>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| ⋯ button that opens a list | `DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}` |
| List items with icons + labels | `DropdownMenuItem` with icon + text |
| Red/danger item | `DropdownMenuItem variant="destructive"` |
| Section heading in menu | `DropdownMenuLabel` |
| Divider between sections | `DropdownMenuSeparator` |
| Checkmark toggle item | `DropdownMenuCheckboxItem` |
| Selected radio item | `DropdownMenuRadioItem` inside `DropdownMenuRadioGroup` |
| Item with ›  arrow (nested menu) | `DropdownMenuSubTrigger` (chevron is built-in) |
| Keyboard shortcut text on right | `DropdownMenuShortcut` inside `DropdownMenuItem` |

---

## Rules for LLMs

1. **`DropdownMenuTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   Pass the trigger element via `render` — the trigger's children become
   `DropdownMenuTrigger`'s children:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
     <MoreHorizontal />
   </DropdownMenuTrigger>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <DropdownMenuTrigger asChild>
     <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
   </DropdownMenuTrigger>

   // ❌ WRONG — creates nested button
   <DropdownMenuTrigger>
     <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
   </DropdownMenuTrigger>
   ```

2. **`DropdownMenu` is for actions, not form values.** If the user is
   picking a value to submit in a form, use `Select`. If they're choosing
   an action to execute, use `DropdownMenu`.

3. **Always put a destructive action below a separator.** Destructive
   items (`variant="destructive"`) must be separated from non-destructive
   items with a `DropdownMenuSeparator`.

4. **`DropdownMenuShortcut` must be the last child of `DropdownMenuItem`.**
   It uses `ml-auto` to push to the right edge — placing it first will
   push all other content right.

5. **Icons inside items are automatically `size-4`.** Do not add `className`
   to icons — `[&_svg:not([class*='size-'])]:size-4` enforces 16px.

6. **`DropdownMenuSubTrigger` has a ChevronRight built in.** Do not add a
   `<ChevronRight />` manually — it will appear twice.

7. **Use `inset` when mixing icon and no-icon items in the same list.**
   Without `inset`, text in icon-less items will be left-aligned while
   text in icon items is indented, creating visual misalignment.

8. **`align="end"` for menus that open from a right-edge button.** The
   default `align="start"` aligns the left edge of the menu with the
   trigger. For ⋯ buttons at the right of a table row, use `align="end"`
   so the menu's right edge aligns with the trigger instead.

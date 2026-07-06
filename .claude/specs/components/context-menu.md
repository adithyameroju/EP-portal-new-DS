# Context Menu — Compass Component Spec

> **Purpose:** This file is the complete specification for the ContextMenu component.
> LLMs must follow this spec exactly when generating right-click menus.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui/context-menu"

File: components/ui/context-menu.tsx
```

---

## What ContextMenu is

`ContextMenu` is a right-click menu. It opens when the user right-clicks
(or long-presses on touch) on the trigger element. It is built on Base UI's
`@base-ui/react/context-menu` primitive.

**ContextMenu vs DropdownMenu:**
- `ContextMenu` — triggered by right-click on an area (table row, file, canvas item)
- `DropdownMenu` — triggered by clicking a button (⋯ action button)

Both have identical item APIs. The only difference is how they open.

---

## Anatomy

Identical structure to `DropdownMenu`:

```
ContextMenu (root)
  ├── ContextMenuTrigger (right-click target area)
  └── ContextMenuContent (the popup menu)
        ├── ContextMenuLabel (section heading)
        ├── ContextMenuGroup
        │     └── ContextMenuItem
        │           └── ContextMenuShortcut
        ├── ContextMenuSeparator
        ├── ContextMenuCheckboxItem
        ├── ContextMenuRadioGroup
        │     └── ContextMenuRadioItem
        └── ContextMenuSub
              ├── ContextMenuSubTrigger
              └── ContextMenuSubContent
```

| Sub-component | Role |
|--------------|------|
| `ContextMenu` | Root — manages open state |
| `ContextMenuTrigger` | Right-click target (`select-none` built in) |
| `ContextMenuContent` | The popup panel |
| `ContextMenuItem` | Standard action item |
| `ContextMenuLabel` | Section heading |
| `ContextMenuGroup` | Semantic grouping |
| `ContextMenuSeparator` | Visual divider |
| `ContextMenuShortcut` | Keyboard hint — right-aligned |
| `ContextMenuCheckboxItem` | Toggleable item with checkmark |
| `ContextMenuRadioGroup` / `ContextMenuRadioItem` | Single-select item group |
| `ContextMenuSub` / `ContextMenuSubTrigger` / `ContextMenuSubContent` | Nested sub-menu |

---

## ContextMenuItem props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `"default" \| "destructive"` | `"default"` | Destructive = red text |
| `inset` | `boolean` | `false` | Adds `pl-7` for text alignment with icon items |

---

## Common patterns

### Table row context menu

```tsx
<ContextMenu>
  <ContextMenuTrigger render={<TableRow className="cursor-context-menu" />}>
    <TableCell>{policy.name}</TableCell>
    <TableCell>{policy.premium}</TableCell>
    <TableCell>
      <Badge variant={statusVariant}>{policy.status}</Badge>
    </TableCell>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      <Eye />
      View details
    </ContextMenuItem>
    <ContextMenuItem>
      <Download />
      Download PDF
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">
      <Trash2 />
      Cancel policy
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Context menu on a card or list item

```tsx
<ContextMenu>
  <ContextMenuTrigger render={<Card className="cursor-context-menu" />}>
    <CardHeader>
      <CardTitle>{document.name}</CardTitle>
      <CardDescription>{document.date}</CardDescription>
    </CardHeader>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Open</ContextMenuItem>
    <ContextMenuItem>Rename</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuSub>
      <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>Email link</ContextMenuItem>
        <ContextMenuItem>Copy link</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### Context menu with checkbox and radio items

```tsx
<ContextMenuContent>
  <ContextMenuLabel>View</ContextMenuLabel>
  <ContextMenuCheckboxItem checked={showThumbnails} onCheckedChange={setShowThumbnails}>
    Show thumbnails
  </ContextMenuCheckboxItem>
  <ContextMenuSeparator />
  <ContextMenuLabel>Sort by</ContextMenuLabel>
  <ContextMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
    <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
    <ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
    <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
  </ContextMenuRadioGroup>
</ContextMenuContent>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Menu that appears on right-click | `ContextMenu` + `ContextMenuTrigger` |
| Standard action item | `ContextMenuItem` |
| Red/danger action | `ContextMenuItem variant="destructive"` |
| Section heading | `ContextMenuLabel` |
| Divider | `ContextMenuSeparator` |
| Toggle item | `ContextMenuCheckboxItem` |
| Nested menu with › | `ContextMenuSub` + `ContextMenuSubTrigger` |

---

## Rules for LLMs

1. **`ContextMenuTrigger` uses the `render` prop** (Base UI pattern, NOT `asChild`).
   The trigger must be the actual right-click target — pass it via `render`:
   ```tsx
   // ✅ CORRECT — Base UI render prop, TableRow is the right-click target
   <ContextMenuTrigger render={<TableRow />}>
     ...
   </ContextMenuTrigger>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <ContextMenuTrigger asChild>
     <TableRow>...</TableRow>
   </ContextMenuTrigger>

   // ❌ WRONG — creates an extra div as the trigger
   <ContextMenuTrigger>
     <TableRow>...</TableRow>
   </ContextMenuTrigger>
   ```

2. **Use `ContextMenu` for right-click, `DropdownMenu` for button click.**
   Never use `ContextMenu` as a substitute for a button-triggered menu.

3. **`ContextMenuSubTrigger` has a ChevronRight built in.** Do not add a
   manual `<ChevronRight />` — it will appear twice.

4. **Destructive actions must be below a separator.** Same rule as
   `DropdownMenu`.

5. **`ContextMenuTrigger` adds `select-none` automatically.** Text inside
   the trigger area will not be selectable while the context menu is active.
   This is intentional — do not override it.

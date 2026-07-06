# Menubar — Compass Component Spec

> **Purpose:** This file is the complete specification for the Menubar component.
> LLMs must follow this spec exactly when generating desktop-style menu bars.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/ui/menubar"

File: components/ui/menubar.tsx
```

---

## What Menubar is

`Menubar` is a horizontal row of menu triggers — the classic "File Edit View"
desktop-app menu pattern. Each trigger opens a dropdown when clicked.

**Menubar vs NavigationMenu:**
- `Menubar` — desktop app menu bar (File, Edit, View, Help). Click to open.
- `NavigationMenu` — website top nav with hover-triggered mega-menu panels.

**Menubar vs DropdownMenu:**
- `Menubar` — multiple menus in a pill container, keyboard-navigable as a group
- `DropdownMenu` — single standalone dropdown from a button

---

## Anatomy

```
Menubar (the horizontal pill container — h-8, border)
  └── MenubarMenu (one menu = DropdownMenu root)
        ├── MenubarTrigger (the menu label button)
        └── MenubarContent (the dropdown panel)
              ├── MenubarLabel
              ├── MenubarGroup
              │     └── MenubarItem
              │           └── MenubarShortcut
              ├── MenubarSeparator
              ├── MenubarCheckboxItem
              ├── MenubarRadioGroup
              │     └── MenubarRadioItem
              └── MenubarSub
                    ├── MenubarSubTrigger
                    └── MenubarSubContent
```

---

## Key differences from DropdownMenu

| Feature | DropdownMenu | Menubar |
|---------|-------------|---------|
| Trigger | Ghost button | Styled `MenubarTrigger` (no asChild needed) |
| Checkbox indicator | Right side | **Left side** (`pl-7`) |
| Radio indicator | Right side | **Left side** (`pl-7`) |
| Container | Standalone | Wrapped in `Menubar` pill |

---

## Common patterns

### Standard app menubar

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        New Policy
        <MenubarShortcut>⌘N</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        Open
        <MenubarShortcut>⌘O</MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
      <MenubarItem>
        Export PDF
        <MenubarShortcut>⌘E</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>

  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>
        Undo
        <MenubarShortcut>⌘Z</MenubarShortcut>
      </MenubarItem>
      <MenubarItem>
        Redo
        <MenubarShortcut>⇧⌘Z</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  </MenubarMenu>

  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
        Sidebar
      </MenubarCheckboxItem>
      <MenubarCheckboxItem checked={showPreview} onCheckedChange={setShowPreview}>
        Preview
      </MenubarCheckboxItem>
      <MenubarSeparator />
      <MenubarLabel>Sort by</MenubarLabel>
      <MenubarRadioGroup value={sortBy} onValueChange={setSortBy}>
        <MenubarRadioItem value="name">Name</MenubarRadioItem>
        <MenubarRadioItem value="date">Date</MenubarRadioItem>
        <MenubarRadioItem value="premium">Premium</MenubarRadioItem>
      </MenubarRadioGroup>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Horizontal row of menu labels | `Menubar` wrapping `MenubarMenu` components |
| A single menu label (File, Edit...) | `MenubarTrigger` |
| Dropdown from that label | `MenubarContent` |
| Action item | `MenubarItem` |
| Toggle item with checkmark | `MenubarCheckboxItem` |
| Mutually exclusive radio item | `MenubarRadioItem` in `MenubarRadioGroup` |
| Keyboard shortcut on right | `MenubarShortcut` |

---

## Rules for LLMs

1. **`MenubarTrigger` does not use `asChild`.** It is already the styled
   button. Do not wrap it in another button.

2. **Checkbox and radio indicators are on the LEFT in Menubar.** Unlike
   `DropdownMenu` where indicators are right-aligned, Menubar shows them
   left-aligned (`pl-7` for content indentation).

3. **`MenubarMenu` wraps each individual menu** (one per "File", "Edit", etc.).
   The `Menubar` root wraps all of them.

4. **`MenubarSubTrigger` has ChevronRight built in.** Do not add a manual icon.

5. **Use `Menubar` for desktop app interfaces only.** For website top
   navigation with hover panels, use `NavigationMenu`. For a single
   contextual action menu from a button, use `DropdownMenu`.

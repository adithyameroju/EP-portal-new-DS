# NavigationMenu — Compass Component Spec

> **Purpose:** This file is the complete specification for the NavigationMenu component.
> LLMs must follow this spec exactly when generating top navigation bars with dropdowns.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

File: components/ui/navigation-menu.tsx
```

---

## What NavigationMenu is

`NavigationMenu` is a horizontal navigation bar where menu items can open
rich dropdown panels (mega-menus) on hover. It is built on Base UI's
`@base-ui/react/navigation-menu` primitive.

**NavigationMenu vs Menubar vs Sidebar:**
- `NavigationMenu` — website-style top nav, hover-triggered dropdown panels
- `Menubar` — desktop app "File Edit View" menus, click-triggered
- `Sidebar` — persistent left/right navigation for app layouts

---

## Anatomy

```
NavigationMenu (root — contains positioner internally)
  └── NavigationMenuList (<ul> of items)
        ├── NavigationMenuItem (<li>)
        │     ├── NavigationMenuTrigger (hover to open panel — has ChevronDown built in)
        │     └── NavigationMenuContent (the dropdown panel)
        │           └── NavigationMenuLink (links inside the panel)
        └── NavigationMenuItem (<li>)
              └── NavigationMenuLink (direct link, no dropdown)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `NavigationMenu` | Root — includes portal positioner | Always |
| `NavigationMenuList` | `<ul>` row of nav items | Always |
| `NavigationMenuItem` | `<li>` wrapper | One per item |
| `NavigationMenuTrigger` | Hover trigger with ChevronDown | When item has a dropdown |
| `NavigationMenuContent` | Dropdown panel content | When item has a dropdown |
| `NavigationMenuLink` | An actual navigation link | For links (both in and outside panels) |
| `NavigationMenuIndicator` | Animated dot/arrow indicator | Optional |
| `navigationMenuTriggerStyle` | CVA style export for standalone links | When a direct link should look like a trigger |

---

## NavigationMenu props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment of dropdown panels relative to the menu |

---

## NavigationMenuContent props

The content panel inherits positioning from the root via
`NavigationMenuPositioner`, which the root renders automatically. No
positioning props needed on `NavigationMenuContent`.

---

## NavigationMenuTrigger behaviour

- Has a `ChevronDownIcon` built in (rotates 180° when open)
- Opens the associated `NavigationMenuContent` on hover
- Click also toggles
- Animated: panel slides in from left/right as you move between items

---

## Common patterns

### Top nav with dropdown panel

```tsx
import Link from "next/link"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid grid-cols-2 gap-2 p-4 w-96">
          <NavigationMenuLink render={<Link href="/products/motor" className="flex flex-col gap-1 rounded-md p-3 hover:bg-muted" />}>
            <span className="text-sm font-medium">Motor Insurance</span>
            <span className="text-xs text-muted-foreground">Comprehensive coverage for your vehicle</span>
          </NavigationMenuLink>
          <NavigationMenuLink render={<Link href="/products/health" className="flex flex-col gap-1 rounded-md p-3 hover:bg-muted" />}>
            <span className="text-sm font-medium">Health Insurance</span>
            <span className="text-xs text-muted-foreground">Individual and family health plans</span>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-1 p-2 w-48">
          <NavigationMenuLink render={<Link href="/solutions/enterprise" />}>
            Enterprise
          </NavigationMenuLink>
          <NavigationMenuLink render={<Link href="/solutions/smb" />}>
            Small Business
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>

    <NavigationMenuItem>
      <NavigationMenuLink render={<Link href="/about" />} className={navigationMenuTriggerStyle()}>
        About
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Simple nav with direct links only (no dropdowns)

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink render={<Link href="/dashboard" />} className={navigationMenuTriggerStyle()}>
        Dashboard
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink render={<Link href="/policies" />} className={navigationMenuTriggerStyle()}>
        Policies
      </NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink render={<Link href="/claims" />} className={navigationMenuTriggerStyle()}>
        Claims
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Horizontal nav bar with hover dropdowns | `NavigationMenu` + `NavigationMenuList` |
| Nav item that opens a panel | `NavigationMenuTrigger` (ChevronDown built-in) |
| Dropdown panel with links | `NavigationMenuContent` with `NavigationMenuLink` |
| Direct nav link (no dropdown) | `NavigationMenuLink render={<Link href="..." />}` + `navigationMenuTriggerStyle()` |

---

## Rules for LLMs

1. **`NavigationMenuLink` uses the `render` prop for router links** (Base UI pattern, NOT `asChild`).
   Pass the Next.js `Link` via `render` — the link's children become
   `NavigationMenuLink`'s children:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <NavigationMenuLink render={<Link href="/dashboard" />}>
     Dashboard
   </NavigationMenuLink>

   // ❌ WRONG — asChild is the Radix pattern, not used in this repo
   <NavigationMenuLink asChild>
     <Link href="/dashboard">Dashboard</Link>
   </NavigationMenuLink>

   // ❌ WRONG — renders a nested anchor
   <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
   ```

2. **Use `navigationMenuTriggerStyle()` for direct-link items.** When a nav
   item is a plain link (no dropdown), apply `navigationMenuTriggerStyle()`
   as its className so it matches the visual style of items with dropdowns.

3. **`NavigationMenuTrigger` has ChevronDown built in.** Do not add a
   manual chevron icon.

4. **`NavigationMenuPositioner` is rendered automatically.** It is exported
   from `components/ui/navigation-menu.tsx`, but the `NavigationMenu` root
   already includes it, so you normally never need to import or add it
   manually.

5. **`NavigationMenu` is for website-style horizontal nav.** For app
   sidebars, use `Sidebar`. For desktop app menu bars (File/Edit/View),
   use `Menubar`.

6. **`NavigationMenuContent` does not have a fixed width.** The panel
   width is determined by its content. Set width via className on the
   inner container div (e.g., `className="w-96"`).

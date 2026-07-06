# Sidebar — Compass Component Spec

> **Purpose:** This file is the complete specification for the Sidebar component
> system. LLMs must follow this spec exactly when generating navigation sidebars.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

File: components/ui/sidebar.tsx
```

---

## Architecture — how the Sidebar system works

The Sidebar is not a single component — it's a system that requires a **provider** wrapping the entire page layout:

```
SidebarProvider (wraps the full page)
  ├── Sidebar (the panel itself)
  │     ├── SidebarHeader
  │     ├── SidebarContent (scrollable area)
  │     │     └── SidebarGroup(s)
  │     └── SidebarFooter
  └── SidebarInset (the main content area — <main>)
        ├── header with SidebarTrigger
        └── page content
```

**`SidebarProvider` must wrap both `Sidebar` and `SidebarInset`.** The provider manages open/closed state, mobile behaviour, and the cookie that persists sidebar state across page loads.

**On mobile:** The Sidebar automatically renders as a `Sheet` (slide-over panel). This is built-in — no extra code needed.

**Keyboard shortcut:** `Cmd+B` (Mac) / `Ctrl+B` (Windows) toggles the sidebar. Built-in via `SidebarProvider`.

---

## Anatomy

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `SidebarProvider` | Root — state management, mobile behaviour, cookie persistence | Always |
| `Sidebar` | The panel container | Always |
| `SidebarHeader` | Top section (logo, workspace switcher) | Usually |
| `SidebarContent` | Scrollable main area | Always |
| `SidebarFooter` | Bottom section (user profile, settings) | Usually |
| `SidebarGroup` | A labelled section of menu items | When nav has sections |
| `SidebarGroupLabel` | Section heading (hidden when collapsed to icons) | When using SidebarGroup |
| `SidebarGroupContent` | Wrapper for group's content | When using SidebarGroup |
| `SidebarMenu` | `<ul>` — list of nav items | Always inside SidebarGroup |
| `SidebarMenuItem` | `<li>` — a single nav item | One per nav item |
| `SidebarMenuButton` | The clickable button/link in a nav item | Always inside SidebarMenuItem |
| `SidebarMenuBadge` | Count badge on a menu item (notifications, unread) | Optional |
| `SidebarMenuSub` | Sub-navigation list | When nav has nested items |
| `SidebarMenuSubItem` | `<li>` inside sub-nav | One per sub-nav item |
| `SidebarMenuSubButton` | Clickable link in sub-nav | Always inside SidebarMenuSubItem |
| `SidebarInset` | `<main>` — the page content area | Always (alongside Sidebar) |
| `SidebarTrigger` | Ghost icon button that toggles sidebar | In page header |
| `SidebarRail` | Thin drag target to collapse/expand sidebar | Optional |
| `SidebarSeparator` | Divider between sections | Optional |
| `SidebarInput` | Search input styled for sidebar | Optional |

---

## Sidebar props

### `Sidebar`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `side` | `"left" \| "right"` | `"left"` | Which edge the sidebar attaches to |
| `variant` | `"sidebar" \| "floating" \| "inset"` | `"sidebar"` | Visual treatment — see below |
| `collapsible` | `"offcanvas" \| "icon" \| "none"` | `"offcanvas"` | How it collapses — see below |

**Variant:**
- `"sidebar"` — full-height panel flush with the viewport edge, with a border
- `"floating"` — panel with rounded corners, shadow, and a gap from the edge
- `"inset"` — the `SidebarInset` (`<main>`) gets a rounded, elevated appearance

**Collapsible:**
- `"offcanvas"` — slides off-screen when collapsed (full hide)
- `"icon"` — collapses to icon-only width (3rem / 48px), labels hidden
- `"none"` — always expanded, cannot be collapsed

### `SidebarMenuButton`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `isActive` | `boolean` | `false` | Marks the current active route |
| `variant` | `"default" \| "outline"` | `"default"` | `"outline"` adds a visible border |
| `size` | `"default" \| "sm" \| "lg"` | `"default"` | Item height: 32px / 28px / 48px |
| `tooltip` | `string \| TooltipContent props` | — | Shown when sidebar is collapsed to icons |

### `SidebarProvider`

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `defaultOpen` | `boolean` | `true` | Initial open state |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Controlled change handler |

---

## Common patterns

### Standard app layout

```tsx
import Link from "next/link"
import {
  Home, FileText, BarChart2, Settings, User
} from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <img src="/logo.svg" alt="Acko" className="h-6" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/dashboard" />} isActive>
                    <Home className="size-4" />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/policies" />}>
                    <FileText className="size-4" />
                    Policies
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link href="/claims" />}>
                    <BarChart2 className="size-4" />
                    Claims
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link href="/profile" />} size="lg">
                <User className="size-5" />
                Nikhil Thakkar
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-sm font-medium">Dashboard</h1>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Collapsible to icons with tooltips

```tsx
<Sidebar collapsible="icon">
  <SidebarContent>
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Dashboard" isActive>
            <Home />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Policies">
            <FileText />
            <span>Policies</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
```

> When `collapsible="icon"`, the `tooltip` prop shows a tooltip on hover
> while collapsed — always provide it for icon-mode sidebars.

### Menu item with badge (notification count)

```tsx
<SidebarMenuItem>
  <SidebarMenuButton render={<Link href="/claims" />}>
    <FileText className="size-4" />
    Claims
  </SidebarMenuButton>
  <SidebarMenuBadge>3</SidebarMenuBadge>
</SidebarMenuItem>
```

### Sub-navigation

```tsx
<SidebarMenuItem>
  <SidebarMenuButton>
    <Settings />
    <span>Settings</span>
  </SidebarMenuButton>
  <SidebarMenuSub>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton render={<Link href="/settings/profile" />} isActive>
        Profile
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
    <SidebarMenuSubItem>
      <SidebarMenuSubButton render={<Link href="/settings/notifications" />}>
        Notifications
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  </SidebarMenuSub>
</SidebarMenuItem>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Full app layout with left nav | `SidebarProvider` + `Sidebar` + `SidebarInset` |
| Nav items with icons and labels | `SidebarMenuButton` with icon + `<span>` |
| Active/current page item | `SidebarMenuButton isActive` |
| Section heading in nav | `SidebarGroupLabel` |
| Collapse/expand button | `SidebarTrigger` in page header |
| Icon-only collapsed state | `Sidebar collapsible="icon"` |
| Nav item with notification count | `SidebarMenuBadge` inside `SidebarMenuItem` |
| Nested nav items | `SidebarMenuSub` + `SidebarMenuSubItem` + `SidebarMenuSubButton` |
| User profile at bottom | `SidebarMenuButton size="lg"` in `SidebarFooter` |
| Search in sidebar | `SidebarInput` |

---

## Rules for LLMs

1. **`SidebarProvider` must wrap the entire page layout**, not just the sidebar.
   Both `Sidebar` and `SidebarInset` must be children of `SidebarProvider`.

2. **`SidebarMenuButton` uses `render` prop for navigation links.** This repo
   uses shadcn v4 / Base UI — NOT Radix. Composition uses `render`, not `asChild`:
   ```tsx
   // ✅ CORRECT — Base UI render prop
   <SidebarMenuButton render={<Link href="/dashboard" />}>
     <Home className="size-4" />
     Dashboard
   </SidebarMenuButton>

   // ❌ WRONG — asChild is the Radix pattern, causes React warnings here
   <SidebarMenuButton asChild>
     <Link href="/dashboard"><Home /><span>Dashboard</span></Link>
   </SidebarMenuButton>

   // ❌ WRONG — onClick for navigation
   <SidebarMenuButton onClick={() => router.push("/dashboard")}>
   ```

3. **Always provide `tooltip` when using `collapsible="icon"`.** When the
   sidebar collapses to icons, labels are hidden — tooltips are the only
   affordance for the user to identify items.

4. **`isActive` marks the current route.** Set it on the `SidebarMenuButton`
   that matches the current page. Derive this from the current pathname.

5. **`SidebarGroupLabel` hides automatically when collapsed.** Do not manually
   hide it — the `group-data-[collapsible=icon]:-mt-8 opacity-0` handles this.

6. **`SidebarInset` is `<main>`.** Do not wrap it in another `<main>`.
   The page's content, header, and breadcrumbs all go inside `SidebarInset`.

7. **Always include `<SidebarTrigger />` in the page header inside `SidebarInset`.**
   Without it, users have no visible way to toggle the sidebar (though
   `Cmd/Ctrl+B` still works).

8. **Do not use `SidebarMenuBadge` for status — use it for counts only.**
   For status labels (Active, Expired), use `Badge` in the page content,
   not inside sidebar menu items.

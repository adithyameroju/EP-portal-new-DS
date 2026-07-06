# Breadcrumb — Compass Component Spec

> **Purpose:** This file is the complete specification for the Breadcrumb component.
> LLMs must follow this spec exactly when generating navigation breadcrumbs.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"

File: components/ui/breadcrumb.tsx
```

---

## Anatomy

```
Breadcrumb (<nav aria-label="breadcrumb">)
  └── BreadcrumbList (<ol>)
        ├── BreadcrumbItem (<li>)
        │     └── BreadcrumbLink (ancestor page link)
        ├── BreadcrumbSeparator (<li> — chevron divider)
        ├── BreadcrumbItem (<li>)
        │     └── BreadcrumbEllipsis (collapsed middle pages)
        ├── BreadcrumbSeparator
        └── BreadcrumbItem (<li>)
              └── BreadcrumbPage (current page — not a link)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Breadcrumb` | Root `<nav>` with `aria-label="breadcrumb"` | Always |
| `BreadcrumbList` | `<ol>` list container | Always |
| `BreadcrumbItem` | `<li>` wrapper for each crumb | One per crumb |
| `BreadcrumbLink` | Clickable ancestor link | For navigable ancestors |
| `BreadcrumbPage` | Current page label — not interactive | For the last crumb |
| `BreadcrumbSeparator` | Divider between items (ChevronRight by default) | Between every pair |
| `BreadcrumbEllipsis` | `…` placeholder for collapsed middle pages | When collapsing long trails |

---

## Default styling

| Element | Styling |
|---------|---------|
| List | `flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground` |
| Link | `text-muted-foreground hover:text-foreground` — inherits muted, brightens on hover |
| Current page | `text-foreground font-normal` — same weight as links, but full foreground color |
| Separator | `ChevronRightIcon size-3.5`, `aria-hidden="true"` |
| Ellipsis | `MoreHorizontalIcon size-4` in a 20px span, `aria-hidden="true"` |

---

## BreadcrumbLink — using with Next.js Link

`BreadcrumbLink` uses the `render` prop pattern (same as `Badge variant="link"`),
**not** `asChild`. Pass a `render` prop with your router Link component:

```tsx
import Link from "next/link"

<BreadcrumbLink render={<Link href="/dashboard" />}>
  Dashboard
</BreadcrumbLink>
```

Without `render`, it renders as a plain `<a>` tag.

---

## Common patterns

### Standard 3-level breadcrumb

```tsx
import Link from "next/link"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink render={<Link href="/dashboard" />}>
        Dashboard
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink render={<Link href="/policies" />}>
        Policies
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Motor Insurance 2024</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Breadcrumb with collapsed middle (ellipsis)

Use `BreadcrumbEllipsis` when the trail is long and middle crumbs are hidden:

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink render={<Link href="/policies" />}>Policies</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Claim Details</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Custom separator

Override the default ChevronRight by passing children to `BreadcrumbSeparator`:

```tsx
<BreadcrumbSeparator>/</BreadcrumbSeparator>
```

### Breadcrumb in a page header

```tsx
<header className="flex flex-col gap-1 px-4 py-3 border-b">
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink render={<Link href="/dashboard" />}>Dashboard</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Claims</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
  <h1 className="text-lg font-semibold">Claims</h1>
</header>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Trail of page names with › separators | `Breadcrumb` + `BreadcrumbList` + items |
| Clickable ancestor page name | `BreadcrumbLink render={<Link href="..." />}` |
| Current page name (not clickable) | `BreadcrumbPage` |
| › chevron divider | `BreadcrumbSeparator` (built-in) |
| … ellipsis for collapsed items | `BreadcrumbEllipsis` inside a `BreadcrumbItem` |
| Custom `/` or `>` separator | `<BreadcrumbSeparator>/</BreadcrumbSeparator>` |

---

## Rules for LLMs

1. **`BreadcrumbLink` uses the `render` prop, not `asChild`.** This component
   uses Base UI's `useRender` pattern:
   ```tsx
   // ✅ CORRECT
   <BreadcrumbLink render={<Link href="/policies" />}>Policies</BreadcrumbLink>

   // ❌ WRONG — asChild is not a prop on BreadcrumbLink
   <BreadcrumbLink asChild><Link href="/policies">Policies</Link></BreadcrumbLink>
   ```

2. **`BreadcrumbSeparator` must be its own `BreadcrumbItem`-level sibling.**
   It goes between `BreadcrumbItem` elements, not inside them:
   ```tsx
   // ✅ CORRECT
   <BreadcrumbItem>...</BreadcrumbItem>
   <BreadcrumbSeparator />
   <BreadcrumbItem>...</BreadcrumbItem>

   // ❌ WRONG — separator inside item
   <BreadcrumbItem>
     ... <BreadcrumbSeparator /> ...
   </BreadcrumbItem>
   ```

3. **The last crumb is always `BreadcrumbPage`, never `BreadcrumbLink`.**
   `BreadcrumbPage` has `aria-current="page"` and `aria-disabled="true"` —
   it is semantically the current location, not a navigation target.

4. **`BreadcrumbEllipsis` goes inside a `BreadcrumbItem`.** It is a
   presentational element, not a link. Wrap it in `BreadcrumbItem` to
   maintain proper list structure.

5. **Do not add `aria-label="breadcrumb"` manually.** It is built into
   the `Breadcrumb` component's `<nav>` element.

6. **`BreadcrumbSeparator` is `aria-hidden`.** Screen readers skip it —
   they infer navigation structure from the list. Do not put meaningful
   content inside a separator.

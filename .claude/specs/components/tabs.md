# Tabs — Compass Component Spec

> **Purpose:** This file is the complete specification for the Tabs component.
> LLMs must follow this spec exactly when generating code that includes tabs.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

File: components/ui/tabs.tsx
```

---

## When to use Tabs vs other navigation patterns

| Situation | Use |
|-----------|-----|
| Switching between related content views on the same page | `Tabs` |
| Top-level app navigation (moves between pages/routes) | `Sidebar` or `NavigationMenu` |
| Filtering a list or table (e.g. All / Active / Expired) | `Tabs` (with `variant="line"`) |
| Step-by-step wizard with linear flow | `Stepper` (custom) — not Tabs |
| Toggling between two views | `Tabs` with 2 triggers |

**Key rule:** Tabs should not cause page navigation. If clicking a tab changes
the URL, use `NavigationMenu` or page-level routing instead. Tabs are for
in-page view switching only.

---

## Anatomy

```
Tabs (root)
  └── TabsList (the tab bar)
        ├── TabsTrigger  TabsTrigger  TabsTrigger
  └── TabsContent (for tab 1)
  └── TabsContent (for tab 2)
  └── TabsContent (for tab 3)
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Tabs` | Root — manages active tab state | Always |
| `TabsList` | The row of tab buttons | Always |
| `TabsTrigger` | An individual tab button | Always (one per tab) |
| `TabsContent` | The content panel for a tab | Always (one per tab, matching trigger `value`) |

---

## Variants

### TabsList variants

| Variant | Prop | Appearance | When |
|---------|------|-----------|------|
| Default | `variant="default"` (default) | Pill tabs on muted background | Standard content switching |
| Line | `variant="line"` | Underline indicator, transparent background | Filtering tables/lists, secondary nav |

```tsx
// Default (pill style)
<TabsList>
  <TabsTrigger value="overview">Overview</TabsTrigger>
  <TabsTrigger value="claims">Claims</TabsTrigger>
</TabsList>

// Line style
<TabsList variant="line">
  <TabsTrigger value="all">All</TabsTrigger>
  <TabsTrigger value="active">Active</TabsTrigger>
  <TabsTrigger value="expired">Expired</TabsTrigger>
</TabsList>
```

### Tabs orientation

| Value | Prop | Layout | When |
|-------|------|--------|------|
| Horizontal | `orientation="horizontal"` (default) | Tab bar above content | Standard |
| Vertical | `orientation="vertical"` | Tab bar left of content | Settings pages, side-nav style |

```tsx
// Horizontal (default)
<Tabs defaultValue="details">
  <TabsList>...</TabsList>
  <TabsContent value="details">...</TabsContent>
</Tabs>

// Vertical
<Tabs orientation="vertical" defaultValue="details">
  <TabsList>...</TabsList>
  <TabsContent value="details">...</TabsContent>
</Tabs>
```

---

## Default styling

| Property | Value | Notes |
|----------|-------|-------|
| TabsList height | `h-8` (32px) | Horizontal orientation |
| TabsList background (default) | `bg-muted` | Pill container |
| TabsList background (line) | `bg-transparent` | No background |
| TabsList border radius | `rounded-lg` | |
| TabsList padding | `p-[3px]` | Tight inner padding |
| Active trigger (default) | `bg-background` + `shadow-sm` | White pill on muted bg |
| Active trigger (line) | Underline `after:` pseudo-element | `bg-foreground` bottom border |
| Inactive trigger text | `text-foreground/60` | Muted |
| Active trigger text | `text-foreground` | Full opacity |
| Trigger hover | `hover:text-foreground` | Text brightens |
| Focus ring | `ring-3 ring-ring/50` | Keyboard accessible |
| Disabled trigger | `opacity-50 pointer-events-none` | |

---

## Common patterns

### Standard content tabs (default variant)

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
    <TabsTrigger value="history">History</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p className="text-sm text-muted-foreground">Policy overview content.</p>
  </TabsContent>
  <TabsContent value="documents">
    <p className="text-sm text-muted-foreground">Uploaded documents.</p>
  </TabsContent>
  <TabsContent value="history">
    <p className="text-sm text-muted-foreground">Claims and activity history.</p>
  </TabsContent>
</Tabs>
```

### Filter tabs (line variant)

Use `variant="line"` when tabs filter a list or table rather than switch
between distinct content panels.

```tsx
<Tabs defaultValue="all">
  <TabsList variant="line">
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
    <TabsTrigger value="expired">Expired</TabsTrigger>
    <TabsTrigger value="pending">Pending</TabsTrigger>
  </TabsList>
  <TabsContent value="all">
    <Table>{/* all policies */}</Table>
  </TabsContent>
  <TabsContent value="active">
    <Table>{/* active policies only */}</Table>
  </TabsContent>
  {/* ... */}
</Tabs>
```

### Controlled tabs (value managed externally)

```tsx
const [tab, setTab] = React.useState("overview")

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="claims">Claims</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="claims">...</TabsContent>
</Tabs>
```

### Tabs with icons

```tsx
import { FileText, History, User } from "lucide-react"

<TabsList>
  <TabsTrigger value="details">
    <User className="size-4" />
    Details
  </TabsTrigger>
  <TabsTrigger value="documents">
    <FileText className="size-4" />
    Documents
  </TabsTrigger>
  <TabsTrigger value="history">
    <History className="size-4" />
    History
  </TabsTrigger>
</TabsList>
```

### Vertical tabs (settings layout)

```tsx
<Tabs orientation="vertical" defaultValue="profile" className="gap-4">
  <TabsList className="w-40">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">
    <Card>...</Card>
  </TabsContent>
  <TabsContent value="notifications">
    <Card>...</Card>
  </TabsContent>
  <TabsContent value="security">
    <Card>...</Card>
  </TabsContent>
</Tabs>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Tab bar with pill/capsule active state | `TabsList variant="default"` |
| Tab bar with underline active state | `TabsList variant="line"` |
| Horizontal tabs above content | `Tabs` (default orientation) |
| Vertical tabs to the left of content | `Tabs orientation="vertical"` |
| Tab with icon + label | `TabsTrigger` with `<Icon className="size-4" />` inside |
| Disabled tab | `<TabsTrigger value="x" disabled>` |
| Content panels below tabs | `TabsContent` with matching `value` |

---

## Rules for LLMs

1. **`value` must match between `TabsTrigger` and `TabsContent`.**
   A mismatch means a tab click shows nothing:
   ```tsx
   // ✅ CORRECT — values match
   <TabsTrigger value="claims">Claims</TabsTrigger>
   <TabsContent value="claims">...</TabsContent>

   // ❌ WRONG — mismatch, content never shows
   <TabsTrigger value="claims">Claims</TabsTrigger>
   <TabsContent value="claim">...</TabsContent>
   ```

2. **Always set `defaultValue` on `Tabs`.** Without it, no tab is active
   on first render and all content panels are hidden.

3. **Choose variant based on Figma's active indicator, not aesthetics.**
   - Pill/capsule active state → `variant="default"`
   - Underline active state → `variant="line"`

4. **Tabs are not navigation.** If a tab changes the URL or routes to a new
   page, use `NavigationMenu` or Next.js `Link` routing instead.

5. **One `TabsContent` per `TabsTrigger`.** Every trigger must have exactly
   one matching content panel.

6. **Do not add padding to `TabsContent` directly.** Wrap content in a
   `Card` or `div` with padding inside the content panel:
   ```tsx
   // ✅ CORRECT
   <TabsContent value="overview">
     <div className="pt-4">...</div>
   </TabsContent>

   // ❌ WRONG — className on TabsContent itself causes layout issues
   <TabsContent value="overview" className="p-4">...</TabsContent>
   ```

7. **Icon size in TabsTrigger is `size-4`.** Match the default size tier.
   Icons are inline — the built-in `gap-1.5` handles spacing automatically.

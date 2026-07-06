# Badge — Compass Component Spec

> **Purpose:** This file is the complete specification for the Badge component.
> LLMs must follow this spec exactly when generating status labels, tags, and
> count indicators. It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Badge } from "@/components/ui/badge"

File: components/ui/badge.tsx
```

---

## Variants

Badge has **6 variants**. Choose based on semantic meaning, not aesthetics.

| Variant | Appearance | Semantic meaning | When to use |
|---------|-----------|-----------------|-------------|
| `default` | Solid primary (purple) background | Positive / active / primary state | Active, Approved, Verified, Published |
| `secondary` | Muted gray background | Neutral / inactive | Inactive, Cancelled, Draft |
| `destructive` | Soft red (`bg-destructive/10 text-destructive`) | Negative / error / danger | Expired, Failed, Rejected, Overdue |
| `outline` | Border only, no background fill | Informational / in-progress | Pending, Processing, In Review |
| `ghost` | No background or border, shows on hover | Subtle / supplementary | Tags, categories, labels that are secondary |
| `link` | Text with underline on hover | Navigational label | When the badge itself should be a link |

> ⚠️ **`destructive` is intentionally soft.** It uses `bg-destructive/10`
> (10% opacity) with `text-destructive` — not a solid red background. This
> is by design for enterprise UI where harsh red backgrounds are inappropriate
> for status labels. Do not override it with a solid red className.

---

## Default styling

| Property | Value |
|----------|-------|
| Height | `h-5` (20px) |
| Padding | `px-2 py-0.5` |
| Border radius | `rounded-4xl` (fully rounded / pill shape) |
| Font size | `text-xs` (12px) |
| Font weight | `font-medium` |
| Icon size (when used) | `size-3` (12px) — enforced automatically |

Badge has no size variants — it is always the same size.

---

## Acko status → badge variant mapping

Use this mapping consistently across all Acko enterprise screens:

| Status | Badge variant |
|--------|--------------|
| Active | `default` |
| Approved | `default` |
| Verified | `default` |
| Renewed | `default` |
| Pending | `outline` |
| Processing | `outline` |
| In Review | `outline` |
| Draft | `secondary` |
| Inactive | `secondary` |
| Cancelled | `secondary` |
| Expired | `destructive` |
| Failed | `destructive` |
| Rejected | `destructive` |
| Overdue | `destructive` |

---

## Common patterns

### Status badge (most common usage)

```tsx
<Badge variant="default">Active</Badge>
<Badge variant="outline">Pending</Badge>
<Badge variant="destructive">Expired</Badge>
<Badge variant="secondary">Cancelled</Badge>
```

### Badge in a table cell

```tsx
<TableCell>
  <Badge variant="outline">Pending</Badge>
</TableCell>
```

### Badge with icon

Icons inside Badge are automatically sized to `size-3` (12px).

```tsx
import { CheckCircle2 } from "lucide-react"

<Badge variant="default">
  <CheckCircle2 />
  Verified
</Badge>
```

### Badge as a tag/category label

```tsx
<Badge variant="outline">Motor</Badge>
<Badge variant="outline">Health</Badge>
<Badge variant="outline">Life</Badge>
```

### Badge rendered as a link

Use the `render` prop to render Badge as an anchor or Next.js Link:

```tsx
import Link from "next/link"

<Badge variant="link" render={<Link href="/policies/active" />}>
  View active policies
</Badge>
```

### Badge in a card header

```tsx
<CardHeader>
  <div className="flex items-center justify-between">
    <CardTitle>Motor Insurance</CardTitle>
    <Badge variant="default">Active</Badge>
  </div>
  <CardDescription>Expires Dec 2026</CardDescription>
</CardHeader>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Solid purple pill label | `Badge variant="default"` |
| Gray/muted pill label | `Badge variant="secondary"` |
| Red/error pill label | `Badge variant="destructive"` |
| Border-only pill label | `Badge variant="outline"` |
| Plain text label (no background, no border) | `Badge variant="ghost"` |
| Underlined text label that navigates | `Badge variant="link" render={<Link>}` |
| Badge with icon + text | `Badge` with `<Icon />` inside (auto-sized to 12px) |

---

## Rules for LLMs

1. **Badge is for labels, not for actions.** If the element needs to be
   clicked to trigger an action (not navigate), use `Button`, not `Badge`.

2. **Use the status mapping table above for all Acko status values.** Do
   not invent new semantics — if a status maps to `destructive`, always use
   `destructive`. Do not use `secondary` for "Expired" to soften it visually.

3. **Do not override `destructive` with solid red.** The soft red
   (`bg-destructive/10`) is intentional for enterprise UI. Never add
   `className="bg-destructive text-white"` to override it.

4. **Do not add size classes to Badge.** Badge has no size variants.
   `text-xs` and `h-5` are always correct. Never add `text-sm`, `h-6`, etc.

5. **Do not add `px-3` or other padding overrides.** `px-2` is the
   correct padding for all badges. Wider badges should have more text,
   not more padding.

6. **Icons inside Badge are automatically 12px.** Do not add `className`
   to the icon inside a Badge — the `[&>svg]:size-3!` rule enforces 12px.

7. **Prefer Badge over colored text for status.** Never write
   `<span className="text-green-600">Active</span>` —
   always use `<Badge variant="default">Active</Badge>`.

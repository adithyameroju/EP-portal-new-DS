# Table — Compass Component Spec

> **Purpose:** This file is the complete specification for the Table component.
> LLMs must follow this spec exactly when generating data tables.
> It covers composition patterns for Acko enterprise tables — not modifications
> to the Table primitive itself.

---

## Component location

```
Import: import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

File: components/ui/table.tsx
```

---

## Anatomy

```
┌─────────────────────────────────────────┐
│  Table (+ scroll container)             │
│  ┌─ TableHeader ──────────────────────┐ │
│  │  TableRow                          │ │
│  │    TableHead  TableHead  TableHead │ │
│  └────────────────────────────────────┘ │
│  ┌─ TableBody ────────────────────────┐ │
│  │  TableRow (hover: bg-muted/50)     │ │
│  │    TableCell  TableCell  TableCell │ │
│  │  TableRow                          │ │
│  │    TableCell  TableCell  TableCell │ │
│  └────────────────────────────────────┘ │
│  ┌─ TableFooter ──────────────────────┐ │
│  │  TableRow                          │ │
│  │    TableCell  TableCell  TableCell │ │
│  └────────────────────────────────────┘ │
│  TableCaption (below table)             │
└─────────────────────────────────────────┘
```

| Sub-component | HTML | Role | Required? |
|--------------|------|------|-----------|
| `Table` | `<table>` wrapped in scroll `<div>` | Outer container — handles overflow-x scroll | Always |
| `TableHeader` | `<thead>` | Column header section | Always |
| `TableBody` | `<tbody>` | Data rows | Always |
| `TableFooter` | `<tfoot>` | Summary row — `bg-muted/50`, bold text | When table has totals/summary |
| `TableRow` | `<tr>` | A row — includes hover state and selection state | Always |
| `TableHead` | `<th>` | Column header cell | Always (one per column) |
| `TableCell` | `<td>` | Data cell | Always (one per column per row) |
| `TableCaption` | `<caption>` | Accessibility caption and visible footnote | Optional |

---

## Default styling

| Property | Value | Notes |
|----------|-------|-------|
| Font size | `text-sm` | All cells |
| Column header height | `h-10` (40px) | `TableHead` |
| Column header padding | `px-2` | Left and right |
| Cell padding | `p-2` | All sides |
| Row hover | `hover:bg-muted/50` | Built into `TableRow` — do not override |
| Selected row | `data-[state=selected]:bg-muted` | Set `data-state="selected"` on `TableRow` |
| Header border | `border-b` on each row in `TableHeader` | |
| Row border | `border-b` on each `TableRow` | Last row in `TableBody` has no border |
| Footer | `bg-muted/50 border-t font-medium` | |
| Text alignment | Left (`text-left`) | Default for all cells — override per column as needed |
| Overflow | `overflow-x-auto` | The `Table` wrapper handles horizontal scroll automatically |
| Whitespace | `whitespace-nowrap` | Cells don't wrap by default |

---

## Common patterns

### Basic table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Policy</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Premium</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>POL-2024-001</TableCell>
      <TableCell>Motor</TableCell>
      <TableCell>₹12,500</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>POL-2024-002</TableCell>
      <TableCell>Health</TableCell>
      <TableCell>₹8,000</TableCell>
      <TableCell>Expired</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Table with status badges (Acko enterprise pattern)

Use `Badge` to represent policy status, claim status, or any categorical state
inside a table cell. Do not use colored text — always use `Badge`.

```tsx
import { Badge } from "@/components/ui/badge"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Policy Number</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Expiry</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>POL-2024-001</TableCell>
      <TableCell>Motor</TableCell>
      <TableCell>Dec 2026</TableCell>
      <TableCell>
        <Badge variant="default">Active</Badge>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>POL-2023-089</TableCell>
      <TableCell>Health</TableCell>
      <TableCell>Mar 2025</TableCell>
      <TableCell>
        <Badge variant="destructive">Expired</Badge>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell>POL-2024-012</TableCell>
      <TableCell>Life</TableCell>
      <TableCell>Jun 2027</TableCell>
      <TableCell>
        <Badge variant="outline">Pending</Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Status → Badge variant mapping:**

| Status | Badge variant |
|--------|--------------|
| Active / Approved / Success | `default` |
| Pending / Processing / Draft | `outline` |
| Expired / Failed / Rejected | `destructive` |
| Inactive / Cancelled | `secondary` |

### Table with linked text in cells

Use `Button variant="link"` (with the `render` prop + `Link`) for navigable text inside
cells. Do not use plain anchor tags or `<a>` elements.

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

<TableCell>
  <Button render={<Link href={`/policies/${policy.id}`} />} variant="link" className="p-0 h-auto">
    {policy.number}
  </Button>
</TableCell>
```

### Table with footer summary

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Policy</TableHead>
      <TableHead className="text-right">Premium</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Motor Insurance</TableCell>
      <TableCell className="text-right">₹12,500</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Health Insurance</TableCell>
      <TableCell className="text-right">₹8,000</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell className="text-right">₹20,500</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

### Table with pagination

Pagination sits below the `Table` in a flex row. Use `Pagination` component
from `@/components/ui/pagination` — do not build custom pagination:

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

<div className="flex flex-col gap-4">
  <Table>
    {/* ... */}
  </Table>
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" isActive>1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">2</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>
```

### Selected row

```tsx
<TableRow data-state="selected">
  <TableCell>POL-2024-001</TableCell>
  {/* ... */}
</TableRow>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Data table with headers | `Table` with `TableHeader` + `TableBody` |
| Column header cell | `TableHead` |
| Data cell | `TableCell` |
| Colored status label | `Badge` inside `TableCell` |
| Clickable policy number / link text | `Button render={<Link href="..." />} variant="link"` in `TableCell` |
| Summary/totals row at bottom | `TableFooter` with `TableRow` |
| Page 1/2/3 controls below table | `Pagination` component |
| Highlighted/selected row | `TableRow data-state="selected"` |
| Horizontal scroll on narrow screens | Built-in — `Table` wraps in `overflow-x-auto` |
| Right-aligned numbers | `TableHead className="text-right"` + `TableCell className="text-right"` |

---

## Rules for LLMs

1. **Always use the full sub-component tree.** Never use raw `<table>`,
   `<thead>`, `<tbody>`, `<tr>`, `<th>`, or `<td>` directly. The Compass
   components provide tokens, hover states, and scroll behaviour.

2. **Status = Badge. Never colored text.** Use `Badge` with the variant
   mapping above. Never write `<span className="text-green-600">Active</span>`.

3. **Linked cell text = `Button render={<Link href="..." />} variant="link"`.**
   Never use `<a>` or `onClick + router.push()` for navigation in cells.
   Never use `asChild` — that's the Radix pattern; this repo uses Base UI's `render` prop.

4. **`TableFooter` is for summary rows only.** Not for actions or pagination.
   Pagination goes below the `Table`, not inside it.

5. **Right-align numeric columns.** Add `className="text-right"` to both
   `TableHead` and `TableCell` for currency, counts, and percentage columns.

6. **Do not add manual hover styles to `TableRow`.** The `hover:bg-muted/50`
   is already built in. Adding additional hover classes creates doubled effects.

7. **`TableCaption` goes inside `Table`, not outside.** It renders below the
   table as an accessibility caption and visible footnote.

8. **Do not modify the Table primitive for one-off layouts.** If Figma shows
   a table with special row colours, custom borders, or non-standard structure,
   flag it in "What I assumed" and compose using Tailwind utilities on the
   existing sub-components rather than creating a new component.

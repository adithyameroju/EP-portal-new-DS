# Card — Compass Component Spec

> **Purpose:** This file is the complete specification for the Card component.
> LLMs must follow this spec exactly when generating code that includes cards.

---

## Component location

```
Import: import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

File: components/ui/card.tsx
```

---

## Anatomy

Card is a **composite component** with 7 parts. Use the sub-components —
do not recreate their layout manually with divs.

```
┌──────────────────────────────────────┐
│  CardHeader                          │
│    CardTitle          [CardAction]   │
│    CardDescription                   │
│                                      │
│  CardContent                         │
│    (main body — your content)        │
│                                      │
│  CardFooter                          │
│    (actions — buttons, links)        │
└──────────────────────────────────────┘
```

| Sub-component | HTML element | Role | Required? |
|--------------|-------------|------|-----------|
| `Card` | `<div>` | Outer container — border, radius, shadow, background | Always |
| `CardHeader` | `<div>` | Top section — spacing above content | When card has a title |
| `CardTitle` | `<div>` | Card heading text | When card has a title |
| `CardDescription` | `<div>` | Subtitle or summary below title | Optional |
| `CardAction` | `<div>` | Action slot (button, link, menu) positioned top-right of header via CSS grid. Only works inside `CardHeader`. | Optional |
| `CardContent` | `<div>` | Main body content area | Almost always |
| `CardFooter` | `<div>` | Bottom section — actions, metadata | When card has actions |

---

## Default styling tokens

> ⚠️ **shadcn v4 note:** The Card defaults changed significantly from v2/v3.
> The values below reflect what `components/ui/card.tsx` actually renders.
> Do NOT apply these as className overrides — they are already built into the component.

| Property | Built-in value | Notes |
|----------|---------------|-------|
| Background | `bg-card` | White in light, dark elevated gray in dark |
| Text | `text-card-foreground` | Inherits for all sub-components |
| Border | `border border-border` | 1px solid border (the `base/border` token) — matches the Figma card component |
| Border radius | `rounded-xl` | 12px outer (the `rounded-xl` token), sub-components round their corners too |
| Shadow | `shadow-xs` | Subtle drop shadow (the `shadow/xs` token) — matches the Figma card component |
| Outer vertical padding | `py-4` | 16px top/bottom on the Card itself |
| Header/content/footer padding | `px-4` | 16px left/right on each sub-component |
| Footer background | `bg-muted/50` | Footer is subtly differentiated from content |
| Gap between sections | `gap-4` | 16px between CardHeader, CardContent, CardFooter |

> **The Card ships with `border border-border` + `shadow-xs` + `rounded-xl` (12px)
> + `bg-card` by default — matching the Figma card component** (owner ruling,
> 2026-07-07). These are already built into `card.tsx`; do not re-apply them as
> className overrides, and do not add a SECOND `border` or `shadow` on top (that
> creates a double frame / double shadow).

---

## Common patterns

### Basic card with title and content

```tsx
<Card>
  <CardHeader>
    <CardTitle>Policy Details</CardTitle>
    <CardDescription>View and manage your active policy.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content here */}
  </CardContent>
</Card>
```

### Card with actions in footer

```tsx
<Card>
  <CardHeader>
    <CardTitle>Confirm Cancellation</CardTitle>
    <CardDescription>This action cannot be undone.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">
      Your policy will be cancelled effective immediately.
    </p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Go Back</Button>
    <Button variant="destructive">Cancel Policy</Button>
  </CardFooter>
</Card>
```

### Card as a form container

```tsx
<Card>
  <CardHeader>
    <CardTitle>Contact Information</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-4">
    <div className="grid gap-1.5">
      <Label htmlFor="name">Full Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
    <div className="grid gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@acko.com" />
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Save Changes</Button>
  </CardFooter>
</Card>
```

### Card with header action

Use `CardAction` when Figma shows a button, link, or icon positioned in the
top-right of the card header. `CardAction` uses CSS grid to place itself at
`col-start-2 row-span-2` — it sits opposite the title/description without
affecting their layout.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Login to your account</CardTitle>
    <CardAction>
      <Button variant="link" type="button">Sign up</Button>
    </CardAction>
    <CardDescription>Enter your email below to log in.</CardDescription>
  </CardHeader>
  <CardContent>
    {/* form fields */}
  </CardContent>
</Card>
```

**Rules for CardAction:**
- Only place `CardAction` inside `CardHeader` — it has no effect elsewhere.
- The DOM order must be: `CardTitle` → `CardAction` → `CardDescription`.
  This is required for the CSS grid to position `CardAction` correctly.
- Use `variant="link"` for primary-colored navigational text, `variant="ghost" size="sm"`
  for muted inline actions (see `specs/components/button.md` for the full pattern).

### Content-only card (no header)

```tsx
<Card className="p-6">
  <p className="text-sm text-muted-foreground">
    Simple content card with no structured header.
  </p>
</Card>
```

> When skipping all sub-components and putting content directly in Card,
> add `p-6` to Card itself since there's no CardContent to provide padding.

---

## Card in layouts

### Card grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

### Card list (stacked)

```tsx
<div className="flex flex-col gap-4">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

**Spacing between cards:** Use `gap-4` (16px) for compact lists, `gap-6` (24px)
for spacious grids. Do not use margin on individual cards.

---

## Interactive cards

When a card is clickable (navigates to a detail view):

```tsx
<Card className="cursor-pointer transition-colors hover:bg-accent">
  <CardHeader>
    <CardTitle>Motor Insurance</CardTitle>
    <CardDescription>Active until Dec 2026</CardDescription>
  </CardHeader>
</Card>
```

**Rules for interactive cards:**
- Add `hover:bg-accent` for hover state (not `hover:shadow-md`)
- Add `cursor-pointer` to indicate clickability
- If wrapping in a `<Link>`, use the link on the Card itself or a single
  wrapping anchor, not nested links inside
- Add `transition-colors` for smooth hover — not `transition-all`

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Rounded box with border | `<Card>` |
| Title text at top of card | `<CardHeader><CardTitle>` |
| Subtitle below title | `<CardDescription>` |
| Main content area | `<CardContent>` |
| Buttons at bottom of card | `<CardFooter>` with Button components |
| Card with form fields | Card wrapping FormField or Label+Input pairs |
| Grid of cards | `grid grid-cols-N gap-6` wrapper |
| Clickable card | Card with `hover:bg-accent cursor-pointer` |
| Card with no visible border | Add `border-0 shadow-none` overrides |
| Card with extra shadow | Use `shadow-md` override — the default is `shadow-xs` |

---

## Rules for LLMs

1. **Use ALL composite sub-components.** CardHeader, CardTitle, CardContent,
   CardFooter — not manual divs. Using `CardHeader` is not enough — you must
   also use `CardTitle` inside it for heading text and `CardDescription` for
   subtitle text.

2. **CardTitle is REQUIRED for any heading text inside CardHeader.**

   ```tsx
   // ❌ WRONG — manual divs inside CardHeader
   <CardHeader>
     <div className="text-base font-medium text-foreground">Title</div>
     <div className="text-sm text-muted-foreground">Subtitle</div>
   </CardHeader>

   // ✅ CORRECT — use the sub-components
   <CardHeader>
     <CardTitle>Title</CardTitle>
     <CardDescription>Subtitle</CardDescription>
   </CardHeader>
   ```

   This is the most common structural drift. The structural drift check in
   the Generate Code skill will fail if heading text is in a plain div instead
   of `<CardTitle>`.

3. **Do not recreate Card from scratch.** No `<div className="rounded-xl border shadow-xs bg-card ...">`.
   Import and use the Card component.

4. **Do not add a second `border` or `shadow` to Card.** The card already has a
   built-in `border border-border` and `shadow-xs` (matching Figma). Adding
   another `border`, or a heavier shadow, on top creates a double frame. Change
   the default only for a confirmed Figma exception, noted in "What I assumed."

5. **One CardTitle per card.** If you need multiple headings inside a card,
   use `text-lg font-semibold` on additional headings, not multiple CardTitle.

6. **Footer actions follow the button spec.** One primary button maximum per
   card (see `specs/components/button.md`).

7. **Card padding is built in.** Do not add explicit padding to CardHeader,
   CardContent, or CardFooter — they already have `px-4`. Card itself has `py-4`.

8. **Cards use `bg-card`, not `bg-background`.** Even though both may be white
   in light mode, `bg-card` is the correct semantic token for elevated surfaces.

9. **No nested cards.** If Figma shows a card inside a card, the inner element
   is a `div` with `bg-muted rounded-md p-4`, not another Card component.

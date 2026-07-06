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
| `CardTitle` | `<h3>` | Card heading text | When card has a title |
| `CardDescription` | `<p>` | Subtitle or summary below title | Optional |
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
| Border | `ring-1 ring-foreground/10` | Subtle ring — this IS the card border |
| Border radius | `rounded-xl` | 16px outer, sub-components round their corners too |
| Shadow | none | Card has no default shadow — add only if Figma explicitly shows one |
| Outer vertical padding | `py-4` | 16px top/bottom on the Card itself |
| Header/content/footer padding | `px-4` | 16px left/right on each sub-component |
| Footer background | `bg-muted/50` | Footer is subtly differentiated from content |
| Gap between sections | `gap-4` | 16px between CardHeader, CardContent, CardFooter |

> **Do NOT add `border border-border` to `<Card>`.** The `ring-1 ring-foreground/10`
> is the card's visual border. Adding an explicit `border` on top creates a visible
> double frame. If the Figma shows a border, that IS the ring — do not add a separate one.
>
> **Do NOT add `shadow-sm` or any shadow to `<Card>` by default.** Card has no built-in
> shadow. If the Figma frame shows a shadow on the card, add `shadow-sm` and note it
> in your "What I assumed" section — do not add shadow speculatively.

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
| Card with extra shadow | Use `shadow-md` override — but default `shadow-sm` is preferred |

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

3. **Do not recreate Card from scratch.** No `<div className="rounded-xl ring-1 bg-card ...">`.
   Import and use the Card component.

4. **Do not add `border` or `shadow` to Card unless Figma explicitly shows them.**
   The `ring-1 ring-foreground/10` IS the card's visual border — do not add
   `border border-border` on top. Only add a shadow class if the Figma frame
   clearly shows elevation. Note it in "What I assumed."

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

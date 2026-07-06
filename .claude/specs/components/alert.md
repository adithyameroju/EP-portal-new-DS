# Alert — Compass Component Spec

> **Purpose:** This file is the complete specification for the Alert component.
> LLMs must follow this spec exactly when generating inline notification banners.
> It overrides any general foundation spec where they conflict.

---

## Component location

```
Import: import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"

File: components/ui/alert.tsx
```

---

## What Alert is

`Alert` is an **inline, non-modal notification banner** for communicating
page-level feedback (errors, warnings, informational messages) without
interrupting the user's workflow. It is always visible in the page flow —
it is not a toast, not a dialog, and not a dismissible overlay.

---

## When to use Alert vs other feedback components

| Situation | Use |
|-----------|-----|
| Persistent status message visible in the page | `Alert` |
| Transient confirmation that disappears after a few seconds | Toast/Sonner |
| Blocking confirmation requiring an explicit user choice | `AlertDialog` |
| Status label on a record (Active, Expired) | `Badge` |
| Input validation error below a field | `FieldError` (in the Field system) |

---

## Anatomy

```
Alert (root div, role="alert")
  ├── [icon] — optional SVG placed directly inside Alert
  ├── AlertTitle
  ├── AlertDescription
  └── AlertAction — optional, absolutely positioned top-right
```

| Sub-component | Role | Required? |
|--------------|------|-----------|
| `Alert` | Root container, `role="alert"` | Always |
| `AlertTitle` | Bold heading line | When alert has a heading |
| `AlertDescription` | Body text / detail | Usually |
| `AlertAction` | Action button (e.g. close, retry) — top-right corner | Optional |

---

## Variants

| Variant | Appearance | When to use |
|---------|-----------|-------------|
| `default` | `bg-card` background, `text-card-foreground` | Informational or neutral messages |
| `destructive` | `bg-card` background, `text-destructive` text | Error states, failed operations |

> **Note:** The `destructive` variant does NOT use a red background. Both
> variants use `bg-card`. Destructive changes the text and icon color to
> `text-destructive` (red). This is intentional for enterprise UI where
> full red-background banners feel too alarming for inline status messages.

---

## Icon support

Placing an SVG directly inside `Alert` (as the first child) activates
a two-column grid layout automatically:

- The icon occupies the left column (`row-span-2`) — it sits beside both
  title and description
- Icons without an explicit size class are auto-sized to `size-4` (16px)

```tsx
import { AlertCircle } from "lucide-react"

<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Submission failed</AlertTitle>
  <AlertDescription>Please check your details and try again.</AlertDescription>
</Alert>
```

No className needed on the icon — the grid activates from the parent.

---

## Common patterns

### Informational alert

```tsx
<Alert>
  <AlertTitle>Policy renewal reminder</AlertTitle>
  <AlertDescription>
    Your motor policy expires in 30 days. Renew now to avoid a lapse in coverage.
  </AlertDescription>
</Alert>
```

### Error alert with icon

```tsx
import { AlertCircle } from "lucide-react"

<Alert variant="destructive">
  <AlertCircle />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>
    Your payment could not be processed. Please update your payment details.
  </AlertDescription>
</Alert>
```

### Alert with a close action

```tsx
import { Info, X } from "lucide-react"

<Alert>
  <Info />
  <AlertTitle>New feature available</AlertTitle>
  <AlertDescription>
    You can now download policy documents directly from the portal.
  </AlertDescription>
  <AlertAction>
    <Button variant="ghost" size="icon" className="size-6" aria-label="Dismiss">
      <X />
    </Button>
  </AlertAction>
</Alert>
```

### Alert with a link in the description

Links inside `AlertDescription` are automatically underlined:

```tsx
<Alert>
  <AlertTitle>Documents required</AlertTitle>
  <AlertDescription>
    Upload your RC book and driving licence to complete KYC.{" "}
    <a href="/upload">Upload now</a>
  </AlertDescription>
</Alert>
```

### Destructive alert without icon

```tsx
<Alert variant="destructive">
  <AlertTitle>Claim rejected</AlertTitle>
  <AlertDescription>
    Your claim #CLM-2024-00892 was rejected. Contact support for details.
  </AlertDescription>
</Alert>
```

---

## Figma → code translation cheat sheet

| What you see in Figma | What you write in code |
|-----------------------|----------------------|
| Inline banner with title + body | `Alert` + `AlertTitle` + `AlertDescription` |
| Banner with icon on the left | SVG as first child of `Alert` (grid activates automatically) |
| Red/error banner | `Alert variant="destructive"` |
| Neutral/info banner | `Alert` (default variant) |
| Close × button in top-right corner | `AlertAction` with a ghost `Button size="icon"` |

---

## Rules for LLMs

1. **`Alert` is inline — it is not a dialog.** Do not add `fixed`, `absolute`,
   `z-50`, or any positioning that lifts it out of the page flow. It sits
   inline where you place it in the JSX.

2. **`AlertAction` is absolutely positioned top-right.** When using
   `AlertAction`, the alert automatically adds `pr-18` to prevent text
   overlapping the action. Do not add extra padding manually.

3. **Icon must be the direct first child of `Alert`.** The two-column grid
   activates via `has-[>svg]`. An icon inside `AlertTitle` or `AlertDescription`
   will not trigger the layout:
   ```tsx
   // ✅ CORRECT — icon directly in Alert
   <Alert>
     <AlertCircle />
     <AlertTitle>Error</AlertTitle>
   </Alert>

   // ❌ WRONG — icon inside AlertTitle
   <Alert>
     <AlertTitle><AlertCircle /> Error</AlertTitle>
   </Alert>
   ```

4. **Do not use Alert for field validation errors.** For errors below a
   specific input, use `FieldError` from the Field system. Use `Alert`
   for page-level or section-level messages only.

5. **Do not override `bg-card` with a colored background.** The destructive
   variant uses `text-destructive` on a card background — not a solid red
   background. Do not add `className="bg-destructive"` or `bg-red-50`.

6. **`role="alert"` is built in.** Do not add it manually. Screen readers
   will announce the content of `Alert` immediately when it appears.

7. **`AlertTitle` and `AlertDescription` are `<div>` elements.** Do not
   wrap them in `<p>` or `<h3>` — they render as divs already.

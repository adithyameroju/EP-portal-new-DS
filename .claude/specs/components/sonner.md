# Sonner — Compass Component Spec (lightweight)

> **Purpose:** Sonner is for **transient success confirmations** — short messages
> like "Saved" or "Sent" that appear briefly and disappear after a few seconds.
> It traces to the Alert spec's feedback table: "Transient confirmation that
> disappears after a few seconds → Toast/Sonner"
> ([`alert.md`](alert.md), line 33).

---

## When to use Sonner vs alternatives

Mirrors the feedback table in [`alert.md`](alert.md):

| Situation | Use |
|-----------|-----|
| Transient confirmation that disappears after a few seconds | Sonner |
| Persistent status message visible in the page | `Alert` |
| Blocking confirmation requiring an explicit user choice | `AlertDialog` |

---

## Compass defaults

Compass adopts **Sonner's own library defaults**: toasts appear in the
**bottom-right** position and last **~4 seconds** before dismissing. These are
the library defaults, not new Compass opinions — Compass simply keeps them.

---

## Usage

Render the app-level `<Toaster />` once (from
[`components/ui/sonner.tsx`](../../../components/ui/sonner.tsx)), then call
`toast()` from the `sonner` package to show a confirmation:

```tsx
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Mount once at the app level:
<Toaster />

// Fire a transient confirmation:
toast("Saved")
```

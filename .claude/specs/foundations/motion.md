# Motion — Compass Foundation Spec

> **Purpose:** This file defines the motion and animation guidelines for Compass.
> LLMs must use only these duration and easing values for transitions and animations.

---

## Status

The Figma token export does not include motion/animation tokens. The values below
are based on **Tailwind CSS v4 defaults** and **shadcn/ui component conventions**,
which Compass inherits. These are the standard values used across all shadcn components.

If Acko-specific motion tokens are added to Figma later, this file will be updated
to reflect them. Until then, these defaults are the system's source of truth for motion.

---

## Duration scale

| Token | Value | Tailwind class | Typical usage |
|-------|-------|---------------|---------------|
| `duration-75` | 75ms | `duration-75` | Instant feedback (opacity flashes) |
| `duration-100` | 100ms | `duration-100` | Micro-interactions (checkbox, toggle) |
| `duration-150` | 150ms | `duration-150` | Button hover/press states (default) |
| `duration-200` | 200ms | `duration-200` | Tooltip show/hide, dropdown open |
| `duration-300` | 300ms | `duration-300` | Panel slide, accordion expand |
| `duration-500` | 500ms | `duration-500` | Page transitions, large layout shifts |
| `duration-700` | 700ms | `duration-700` | Rare — slow reveals |
| `duration-1000` | 1000ms | `duration-1000` | Rare — background fades |

> **Default transition duration: 150ms.** This is what shadcn/ui uses for most
> component state changes. Don't change it unless the design explicitly calls for
> a different speed.

---

## Easing curves

| Token | Value | Tailwind class | Usage |
|-------|-------|---------------|-------|
| `ease-linear` | `linear` | `ease-linear` | Progress bars, loading indicators |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | `ease-in` | Elements exiting the screen |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | `ease-out` | Elements entering the screen |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease-in-out` | State changes in place (default) |

> **Default easing: `ease-in-out`.** Used for hover states, focus transitions,
> color changes, and most UI state transitions.

---

## Common transition patterns

| Pattern | Classes | When |
|---------|---------|------|
| Button hover | `transition-colors duration-150` | Color changes on hover/focus |
| Dropdown open | `transition-all duration-200 ease-out` | Dropdown appearing |
| Dropdown close | `transition-all duration-150 ease-in` | Dropdown disappearing |
| Accordion expand | `transition-all duration-300 ease-in-out` | Content height change |
| Dialog enter | `transition-opacity duration-200 ease-out` | Modal fade in |
| Dialog exit | `transition-opacity duration-150 ease-in` | Modal fade out |
| Sidebar collapse | `transition-all duration-300 ease-in-out` | Width/layout change |
| Tooltip show | `transition-opacity duration-200` | Tooltip appearing |

---

## Animation presets (shadcn defaults)

These keyframe animations are built into shadcn/ui components.

| Animation | Description | Used by |
|-----------|-------------|---------|
| `accordion-down` | Expand from 0 to auto height | Accordion |
| `accordion-up` | Collapse from auto to 0 height | Accordion |
| `fadeIn` | Opacity 0 → 1 | Dialog, Popover, Tooltip |
| `fadeOut` | Opacity 1 → 0 | Dialog, Popover, Tooltip |
| `slideInFromTop` | Translate from -100% + fade | Sheet (top) |
| `slideInFromBottom` | Translate from 100% + fade | Sheet (bottom) |
| `slideInFromLeft` | Translate from -100% + fade | Sheet (left) |
| `slideInFromRight` | Translate from 100% + fade | Sheet (right) |

---

## Rules for LLMs

1. **Default to 150ms + ease-in-out** for any state transition. Only deviate when
   the design explicitly specifies different timing.
2. **Use `transition-colors`** for hover/focus color changes, not `transition-all`.
   `transition-all` causes unnecessary layout recalculations.
3. **Enter = ease-out, exit = ease-in.** Things appearing should decelerate into
   rest (ease-out). Things disappearing should accelerate away (ease-in).
4. **No animation on first paint.** Components should not animate when the page
   loads — only on user interaction or state changes.
5. **Respect `prefers-reduced-motion`.** All transitions should be wrapped in
   `motion-safe:` or disabled when the user requests reduced motion. shadcn/ui
   handles this in its built-in animations.
6. **No custom keyframe animations.** Use the shadcn defaults listed above.
   If a design requires animation not covered here, flag it for review.

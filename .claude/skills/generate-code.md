# Compass — Generate Code from Figma

> **Skill type:** Code generation
> **Trigger:** Designer provides a Figma frame URL or screenshot and asks for code
> **Tools:** Cursor (with Figma MCP) or Claude Code
> **Output:** A React component file using only Compass tokens and shadcn/ui components

**Universal rule: Never silently substitute.** When Figma data doesn't cleanly map
to an existing token, component, or convention, flag it in Step 5's assumptions
list. This applies to colors, spacing, radius, font sizes, font weights, shadows,
breakpoints, icons, and component variants. Exception: trivial rounding within the
same token tier (e.g., 15px -> 16px `gap-4`) is acceptable, but must still be
surfaced in the assumptions list.

---

## Before you start

1. **Read these files first** (every session, no exceptions):
   - `.claude/specs/tokens/token-reference.md` — master map of Figma tokens -> code
   - `.claude/specs/foundations/color.md` — color rules and semantic token list
   - `.claude/specs/foundations/typography.md` — font, text sizes, heading presets
   - `.claude/specs/foundations/spacing.md` — spacing scale and layout tokens
   - `.claude/specs/foundations/radius.md` — border radius values
   - `.claude/specs/foundations/elevation.md` — shadow tokens
   - `CLAUDE.md` (repo root) — project-level rules

2. **Check if a component spec exists** for each component you plan to use:
   - Look in `.claude/specs/components/` for files like `button.md`, `input.md`, `card.md`
   - If a spec exists, follow it exactly — it overrides general foundation specs
   - If no spec exists, use the component's default shadcn/ui API with Compass tokens

3. **Identify available components** by scanning `components/ui/` directory.
   Only use components that exist in the repo. Never invent new component files.

---

## Step-by-step process

### Step 1 — Analyze the Figma frame

When given a Figma frame URL (via Figma MCP) or screenshot:

- Identify every component used (Button, Input, Card, etc.)
- Note the layout structure (flex, grid, stack direction, gaps)
- Note spacing values (padding, margin, gaps) — map to nearest Tailwind token
- Note color usage — identify which semantic tokens are in play
- Note text styles — identify size, weight, and any heading presets
- Note any states shown (hover, disabled, loading, error)

**Output a brief analysis before writing code.** Example:
> "I see a login form with: Card container, 2 Input fields, 1 Button (primary),
> vertical stack with gap-4, card padding p-6, heading-sm for the title."

### Step 2 — Map to Compass components

For each identified element, map to the exact Compass/shadcn component:

| What you see in Figma | What you use in code |
|-----------------------|---------------------|
| Button (any variant) | `@/components/ui/button` — use `variant` prop |
| Text input | `@/components/ui/input` |
| Dropdown/select | `@/components/ui/select` |
| Card with sections | `@/components/ui/card` (Card, CardHeader, CardContent, CardFooter) |
| Dialog/modal | `@/components/ui/dialog` |
| Toggle/switch | `@/components/ui/switch` |
| Checkbox | `@/components/ui/checkbox` |
| Table | `@/components/ui/table` |
| Tabs | `@/components/ui/tabs` |
| Any other shadcn component | Check `components/ui/` directory |

**If a Figma element doesn't map to any existing component:**

**STOP.** Before creating any new file in `components/ui/`, explicitly ask:
"This would create a new primitive component called [exact name]. It would handle
[specific responsibility]. Should I proceed, or should I compose this from existing
parts?"

You MUST wait for explicit confirmation. "Go ahead" without the designer naming
what they're approving is not consent — restate what you're about to create and
ask again.

### Step 3 — Write the code

Follow these rules strictly:

**Imports:**
```tsx
// Always import from @/components/ui/
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Icons from lucide-react (default icon set)
import { ArrowRight, Search } from "lucide-react"

// Utilities
import { cn } from "@/lib/utils"
```

**Token usage:**
```tsx
// CORRECT — semantic Tailwind classes mapped to Compass tokens
<div className="bg-background text-foreground p-6 rounded-lg shadow-sm">
<Button variant="default">Submit</Button>
<p className="text-muted-foreground text-sm">Helper text</p>

// WRONG — hardcoded values, raw hex, Tailwind color utilities
<div className="bg-[#FAFAFA] text-[#1A1A1A] p-[22px] rounded-[7px]">
<div className="bg-slate-100 text-gray-700">
<button className="bg-purple-600 text-white">
```

**Layout:**
```tsx
// CORRECT — Tailwind spacing utilities from the scale
<div className="flex flex-col gap-4 p-6">
<div className="grid grid-cols-2 gap-6">

// WRONG — arbitrary values
<div className="flex flex-col gap-[18px] p-[22px]">
```

**Responsive:**
```tsx
// CORRECT — mobile-first with breakpoint modifiers
<h1 className="text-4xl md:text-5xl font-semibold tracking-tighter">

// WRONG — desktop-only, no responsive consideration
<h1 className="text-5xl font-semibold">
```

### Step 4 — Self-audit before presenting

Before showing the code to the user, check every line against this list:

- [ ] **No hardcoded hex colors.** Every color references a semantic token.
- [ ] **No arbitrary spacing values.** Every `p-`, `m-`, `gap-` uses the scale.
- [ ] **No arbitrary radius values.** Every `rounded-` uses a named token.
- [ ] **No Tailwind color utilities.** No `bg-red-500`, `text-gray-700`, etc.
- [ ] **No invented components.** Every import resolves to a file in `components/ui/`.
- [ ] **Every imported component is used as a component, not reimplemented.**
      If I imported `<Button>`, I'm using `<Button>`, not `<button className="...">`
      with copied Tailwind classes. If I imported `<Input>`, I'm using `<Input>`,
      not a styled native input.
- [ ] **Composite components are used as composites — at every level.**
      This check has two parts:
      1. *Outer*: If using Card, I have CardHeader / CardContent / CardFooter — not
         raw divs replacing them.
      2. *Inner*: Inside CardHeader, I have `<CardTitle>` for any heading text and
         `<CardDescription>` for any subtitle — NOT `<div className="text-base font-medium">`.
         Using `CardHeader` without `CardTitle` inside it is still a structural drift.
      Same depth of check for: Dialog (DialogTitle inside DialogHeader, not a raw h2),
      Form (FormLabel inside FormItem, not a raw label), and any other composite where
      sub-components exist for heading/label slots.
- [ ] **No font-family overrides.** Uses Euclid Circular B via system default.
- [ ] **Icons from lucide-react only.** No other icon library.
- [ ] **Component APIs match shadcn/ui.** Correct prop names and values.
- [ ] **Responsive breakpoints present** for any layout or heading that changes on mobile.

If any check fails, fix it before presenting. Do not present code with a "TODO:
fix this later" comment.

### Step 5 — Present with explanation AND surfaced assumptions

Show the code and include two distinct sections in your response:

**What I did (confident):**
- Which Compass components were used
- Which tokens were applied
- The overall structure decisions

**What I assumed (please confirm):**
List every place where Figma data didn't map cleanly and you made a judgment call.
Present each as a question the designer can confirm quickly. Examples:
- "I used `variant='default'` based on the solid purple fill — confirm?"
- "Spacing between inputs was 14px in Figma; I used `gap-3` (12px) as the nearest
  token. Use `gap-4` (16px) instead?"
- "The heading used a font size that's between `text-2xl` and `text-3xl` in our
  scale. I used `text-2xl`. Correct?"
- "The Figma frame showed a Button with an icon on the right but no arrow icon is
  specified in the Lucide set — I used `<ArrowRight>`. Does that match?"

Never hide judgment calls inside the code. Every decision made without explicit
token/spec guidance must appear in this list.

---

## Handling edge cases

### Figma shows a component state not available in code
Example: "Loading" state on Button. Check the component spec in `.claude/specs/components/`.
If the spec defines how to handle it, follow it. If no spec exists, flag it:
"Loading state needs a decision — use a Spinner child or a loading prop?"

### Figma uses a color that doesn't match any token
Flag it: "This color (#XX) doesn't match any Compass semantic token. Nearest
match is [token name]. Should I use the nearest match, or does this need a new token?"
**Never silently substitute or hardcode.**

### Figma shows a custom/complex layout
Compose from existing primitives. Use `div` with Tailwind flex/grid for layout.
Do not create wrapper components for one-off layouts.

### Multiple variants of the same component on one page
Use the component's `variant` prop, not different components. Example: Button has
`default`, `secondary`, `destructive`, `outline`, `ghost`, `link` variants.

---

## What this skill does NOT do

- **Does not create new components.** Only composes from existing `components/ui/` files.
- **Does not modify existing components.** If a component needs a change (like adding
  a loading prop), that's a separate task requiring spec review.
- **Does not write backend logic.** Produces the visual/structural layer only.
- **Does not make design decisions.** When ambiguous, asks the designer.

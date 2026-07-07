# Compass — Designer Guide

> **Who this is for:** Designers at Acko working in the Compass Figma library.
> No code knowledge required. This guide tells you what Compass is, what it
> means for your Figma workflow, and how to hand off frames for code generation.

---

## First-time setup

Get Compass running in Claude Code in two steps. Total time: ~2 minutes.

### 1. Clone the repo

Open Terminal and run:

```bash
git clone https://github.com/ackotech/enterprise-compass-design-system.git
cd enterprise-compass-design-system
npm install
```

This downloads everything to your machine — all 55 components, all specs,
all skill files. You only need to do this once.

### 2. Open in Claude Code

Claude Code automatically reads `CLAUDE.md` at the project root, which
links to all the design system rules, skills, and specs. No extra setup
needed — just open the project folder and start prompting.

---

## What is Compass?

Compass is Acko's enterprise design system — the single source of truth for
every color, spacing value, component, and interaction pattern we use across
Acko products.

It lives in two places:
1. **Figma** — the visual library you design with
2. **This repository** — the code implementation that engineers (and AI tools)
   use to build what you designed

Both places speak the same language. A color called `primary` in Figma maps to
`bg-primary` in code. A spacing value of 16px in Figma maps to `p-4` in code.
When the two are in sync, hand-off is fast and accurate.

---

## What this means for your Figma workflow

### Use Compass components, not custom frames

When designing a screen, use components from the **Compass Figma library** —
Button, Card, Input, etc. — rather than drawing your own versions.

**Why this matters:** The code generator reads your Figma frame and maps what
it sees to components in the code library. If you use a Compass Button, the
generator produces a correct `<Button variant="default">`. If you draw a
custom rectangle with the right colors, it may still produce correct code —
but it may also guess wrong. Using library components removes that ambiguity.

### Use the Compass color styles, not local colors

All colors in the Compass library are semantic tokens — `primary`, `secondary`,
`muted`, `destructive`, etc. Use these styles, not Figma's color picker, for
fills and text colors.

**Why this matters:** The code generator is trained to refuse hardcoded hex
values. If your frame uses local Figma colors instead of Compass styles, the
generator will flag them as unmapped and ask for clarification rather than
silently substitute.

### Use the spacing scale

Compass uses an 8-point spacing grid. The named values are:
`4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px`

Design your padding, gaps, and margins to these values. The generator rounds
to the nearest step and flags the rounding in its assumptions list.

---

## How to hand off a frame for code generation

When you want code generated from a Figma frame:

1. **Frame it clearly.** The Figma frame should contain exactly the component
   or screen you want generated — no extra artboards, no helper notes on top
   of the design.

2. **Copy the Figma link.** Right-click the frame in Figma -> "Copy link to
   selection." This gives a URL like:
   `https://www.figma.com/design/[file-id]/[file-name]?node-id=1-2785`

3. **Give the link to the engineer or AI tool** (Claude Code or Cursor with
   Figma MCP) with the instruction: "Generate code for this frame using Compass."

4. **Review the output.** The generator will always produce two sections:
   - **"What I did"** — what it built with confidence
   - **"What I assumed"** — judgment calls it made that need your confirmation

   Review the assumptions list. Trivial items (spacing rounded from 14px -> 12px,
   placeholder text) need no reply. Structural decisions (a component it wasn't
   sure about, a color it couldn't map) need a quick "yes" or "use X instead."

---

## Figma Code Connect — what it is and why it matters

Compass uses **Figma Code Connect** to show real React component code in Dev Mode
instead of Figma's auto-generated CSS.

When an engineer selects a Button in a Compass frame in Dev Mode, they see:
```tsx
<Button variant="default">Label</Button>
```
...instead of a wall of CSS variables.

**For you as a designer, this means:**
- Dev Mode is more useful as a hand-off surface
- Engineers copy working code, not styling snippets
- The code is always up to date with the latest Compass implementation

You don't need to do anything to make this work — it's automatic once published.

---

## Component status

- **55 components** live in the code library (`components/ui/`)
- **33 components** have full code specs (`.claude/specs/components/`)
- **10 components** have Figma Code Connect mappings: Button, Card, Dialog,
  Field, Input, Select, Sheet, Sidebar, Table, Tabs

Every component is documented in the deployed Storybook:
**https://main--6a4c6bc7a7294c9b64f0b80e.chromatic.com**

Code specs and Code Connect mappings for remaining components are added on demand.

---

## How to request a new component

If you need a component that doesn't exist in the Compass library:

1. Design it using existing Compass tokens (colors, spacing, typography)
2. Flag it as "new component proposal" in the design file
3. Bring it to the next design system review — don't build one-offs in product files

**The rule:** No new component in `components/ui/` without owner review. This
protects the system from fragmentation.

---

## Questions?

Talk to Nikhil (design system owner) or raise it in the design system Slack channel.

# Interactive SOP — structure proposal (PROPOSED, build gated on owner approval)

Owner directive (2026-07-07): content approved; presentation rebuilt interactive
— scannable, decision-first, zero new content, incomplete branches flagged not
authored.

## Three reusable renderers (new, in stories/working-with-compass/, kebab-case, composed from Compass primitives)

1. **`decision-flow.tsx`** — data-driven branch walker. A flow is a typed data
   object: nodes = one question + 2–4 options; each option → next node or a LEAF.
   Leaf = component name + link to its Storybook page + the spec citation that
   decides it. Where no source decides a branch, the leaf renders as a visible
   "⚠ needs owner decision" card (the flagged-gaps list IS the UI). Rendered as
   clickable cards stepping through the tree, with a breadcrumb of choices made
   and a restart control. Data lives beside it in `decision-flows.ts` — every
   node carries a `source:` field; the renderer refuses nodes without one.
2. **`live-do-dont.tsx`** — side-by-side LIVE rendered wrong/right pair (same
   visual grammar as the component pages' do/don't strip, but rendering actual
   components instead of describing them). Only pairs whose spec contains BOTH
   sides as renderable code examples become live; prose-only rules stay as text
   rows. Each pair shows its citation.
3. **`task-picker.tsx`** — the "What do you want to do?" entry grid: task cards
   (Build a form · Ask for confirmation · Show feedback · Pick a selection
   control · Show data in a table · Lay out a page · Go from Figma to code ·
   Understand the AI guardrails) deep-linking to the right flow/section.

## Page-by-page treatment (titles unchanged)

- **Overview** → leads with the task-picker grid; working-rhythm rules stay as
  the existing short list (already scannable).
- **Choosing a Component** → the nine when-to-use tables become five decision
  flows: Selection control (checkbox/switch/radio/select/combobox/toggle-group) ·
  Overlay (dialog/alert-dialog/sheet/drawer/popover/tooltip/hover-card) ·
  Feedback (alert/sonner/badge/field-error/alert-dialog) · Text input
  (input/textarea/input-otp/native-select) · Compose-vs-request-new (principles
  + generate-code STOP rule + designers.md request path). Original tables remain
  below each flow inside a Collapsible ("show the source table").
- **Common Tasks** → Accordion per task (Forms, Dialogs, Tables, Charts, Layout
  density — dogfooding Accordion); inside each: live do/don't pairs where the
  spec provides both code sides, text rows otherwise.
- **Figma → Code Loop** → vertical stepper (numbered Cards) with copyable
  command blocks per step; content byte-identical to the approved draft.
- **Working with AI** → the six-layer constraint stack rendered as a stacked
  Card diagram; assumption-reading confirm/correct/escalate stays a table.

## Zero-new-content enforcement

Every flow node/leaf/pair maps 1:1 to a line in the approved SOP drafts (which
map to specs). The build step includes a self-check: grep the flow data for
`source:` on every node; any node without one fails the build task. Gaps render
as flagged leaves — visible to designers as "not yet decided" rather than
silently absent.

## Flagged-gaps list (the 10 standing + 3 the tree structure newly exposes)

Standing (from the approved draft): 1 Card-vs-Item distinction · 2 promotion
threshold · 3 chart conventions beyond tokens/container · 4 Card default shadow
(open fork) · 5 default density · 6 designer spacing list vs full scale ·
7 where generated files live · 8 who commits designer builds · 9 status truth
surface · 10 acceptable compliance score.

Newly exposed by decision-tree completion (would need owner decisions to render
as answers rather than flagged leaves):
11. **Button vs link-variant vs icon-button flow** — button.md decides
    navigation (render prop) and icon-buttons (size=icon + aria-label), but no
    source decides "when is an action a text link vs a ghost button" as a
    general rule.
12. **Feedback flow: success confirmation path** — alert.md's table routes
    transient confirmations to Toast/Sonner, but sonner has no spec; the leaf
    can cite only the alert.md table row (thin but citable — flagging per the
    hard rule rather than silently accepting).
13. **Chart-state flow (loading/error/empty)** — the roadmap S6 names
    standardized chart Skeleton/Error/Empty states as *future promotion
    candidates*; no current source defines them → the Charts accordion gets a
    flagged leaf, not a flow.

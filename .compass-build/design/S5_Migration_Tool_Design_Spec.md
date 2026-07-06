# S5 — Migration to Compass Tool — Build-Ready Design Spec

*Track: S5 (parallel, gates on S1 + S2/S3 — NOT on S4). Read alongside Compass_GA_Roadmap.md + STATE.md.*

> **What this is.** The design a sub-agent builds against so the novel parts aren't
> improvised. Goal: take any product on any system → Compass-native code, so
> designers and PMs (vibe-coding on Lovable/Replit/Cursor) can hand devs a clean
> Compass starting point instead of ungoverned output.
>
> **The core move:** reverse-engineer shadcn's `migrate-radix-to-base` skill's
> **architecture**, throw away its **content**. That skill swaps one primitive
> library for another *within the same design language*. Ours is harder — a
> re-token + re-skin + re-component against a fixed target (Compass). So the
> skeleton (preflight, strangler-fig, golden-pair diffing, per-unit reports,
> flag-don't-patch, honest reporting) transfers directly; the mapping tables get
> replaced by Compass resolution driven by `meta.ts`.

---

## Dependency gate (design now, build in this order)

| Part | Status |
|------|--------|
| A. Skeleton (preflight, strangler-fig orchestration, report format, CLI shell) | ✅ build now — no deps |
| C. "Migrate" UI shell (upload/URL, batch view, preview panes) as an isolated component | ✅ build now — wire into Storybook at S2 |
| B. Resolution layer (component matching, token mapping, gap list) | ⛔ gated on **S1 (meta.ts)** — it resolves against meta |
| C-integration. "Migrate" surfaced *in Storybook* | ⛔ gated on **S2** (Storybook exists) |
| Shipped as `compass migrate` / package feature | ⛔ gated on **S3** (package + CLI) |

So the sub-agent builds A + the C shell immediately, designs B now, and implements
B the moment S1 lands, then integrates into Storybook (S2) and ships via CLI (S3).

---

## Part A — Reuse the skeleton (borrow directly from shadcn's migrate skill)

These are proven patterns; copy the *approach*, not the Radix mappings.

- **Preflight (always):** require a clean git tree; work on a branch; detect the
  target's package manager from its lockfile and use it; run the target's
  typecheck/build **first** to record a baseline so pre-existing failures are never
  blamed on the migration.
- **Progressive strangler-fig mode (default):** migrate one flow/component at a
  time. The migrated version is written to a `-compass` variant so the original and
  new coexist and the project stays buildable at every step. Repoint consumers one
  at a time, typecheck each, then delete the original and rename `-compass` →
  original. Never a big-bang rewrite.
- **Golden-pair diffing (when the source library is identifiable):** if the target
  is on a known library (MUI, Chakra, Ant, stock shadcn), diff each component
  against that library's stock origin to separate *the team's customizations* from
  *the base component*. This makes customizations survive the swap. For bespoke /
  unknown systems there's no golden pair — fall back to pure role-based resolution
  (Part B).
- **Per-unit reports:** `.migration/<unit>.md`, one per flow/component, fixed
  structure: `Changed` / `Left alone` / `Behavior changes` / `Verify by hand`.
  Migration status is derived from disk (scan for un-migrated imports), not
  maintained in an index.
- **Flag behavior deltas, never silently patch.** If a Compass component behaves
  differently (activation, close-on-click, focus return), flag it in the report for
  human QA — don't invent a patch to force parity.
- **Honest reporting.** Skipped/reverted units are listed as flagged, never as
  migrated. Pre-existing failures are named as pre-existing.
- **Hard rule — presentation layer only.** Rewrite JSX, className/styling, and
  imports. Do NOT touch hooks logic, data fetching, routing, or state management.
  This is precisely how "design and context stay as-is, UX/UI moves to Compass."

---

## Part B — Replace the content (Compass resolution — gated on S1 meta.ts)

Three passes. This is the novel, fuzzy core — it needs `meta.ts` and a
**confidence score + human review of low-confidence calls**.

### B1 — Inventory pass
Read the target repo; for each foreign component, determine its **role** (button,
input, card, modal, tabs, select, table, chart, etc.) from: element/props
signature, ARIA roles, name heuristics, and usage context. Then match role →
Compass primitive using `meta.ts` (`category`, `purpose`, `aiHints.selectionCriteria`,
`aiHints.confusedWith`). Emit for each:

```
{ source: "src/components/StatCard.tsx",
  role: "card",
  compassTarget: "card",
  confidence: 0.92,
  candidates: ["card", "kpi-row(pattern)"],
  notes: "custom shadow — maps to Compass elevation token" }
```

- **High confidence** → map (still shown in the report).
- **Low confidence** → FLAG with top candidates for owner review. Never guess
  silently.
- **No Compass equivalent** → add to the **gap list** (what Compass lacks). The gap
  list is a feature, not a failure — it feeds S6 extensibility.

### B2 — Token remap
Parse the target's CSS vars / theme object / hardcoded values; cluster into
semantic buckets (bg, fg, primary, border, radius, spacing scale); map to Compass
semantic tokens. **The audit script (S4) is the acceptance test — 0 errors =
migrated.** Values that don't cluster cleanly → needs-decision item, never a
guessed token.

### B3 — Component swap
Replace foreign primitives with Compass imports, preserving structure, copy, and
behavior. Apply surviving customizations (from the golden-pair diff) as Compass
token overrides where legal; flag anything that would require a hardcoded value.

---

## Part C — The "Migrate" surface (in Storybook, gated on S2)

A first-class entry in the Storybook sidebar. Flow:

1. **Entry:** GitHub URL **or** zip upload.
2. **Unpack + run:** unpack locally, install, run the target so the user sees their
   real product; record the baseline.
3. **Batch breakdown:** split by route / flow / feature. Present the migration as
   batches, not one monolith.
4. **Per-batch live preview:** render the migrated batch beside the original —
   "here's your Settings flow, and here's how it looks and behaves in Compass."
   Owner approves the batch (or flags fixes) before the next.
5. **On completion:** write the Compass-native codebase → **publish** (to their
   repo/branch) **or download** (zip).
6. **PM handoff mode:** the headline use case. A PM vibe-codes a feature on
   Lovable/Replit/Cursor, runs this once before handoff, and hands the dev a clean
   Compass-native codebase as the starting point — turning ungoverned output into
   governed Compass code at the handoff boundary.

---

## Scoping & honesty

Arbitrary-system migration is genuinely fuzzy. Don't pretend otherwise:

- **Start constrained:** React + Tailwind targets first. Prove the whole loop on
  one internal repo end-to-end before widening to other stacks.
- **Confidence over coverage:** it's better to flag 20% for review than to silently
  mis-map 5%. Low-confidence mappings and unclustered tokens always go to the human.
- **The gap list is the product's memory:** every "Compass lacks this" becomes an
  S6 candidate. Migration and extensibility are the same flywheel.

---

## Guardrails (owner approves)

- Mapping heuristics and every low-confidence mapping → owner review. No invented
  component or token mappings.
- Behavior deltas → flagged for QA, never silently patched.
- Never touch logic / data / routing / state — presentation layer only.
- Plan-then-execute, per-batch, with the owner approving each batch.

---

## Packaging: the migration skill

`.claude/skills/compass-migrate/SKILL.md` (per S0's canonical layout):
- The Part A skeleton procedure (preflight → strangler-fig → reports)
- The Part B resolution procedure (inventory → token remap → component swap) with
  the confidence rubric and the opinion/gap firewall
- The `.migration/<batch>.md` report template
- Reference: shadcn's `migrate-radix-to-base` skill as the architectural ancestor
  (cite it; reuse the discipline, not the mappings)

---

## Sub-agent kickoff prompt (paste when S5 track starts)

```
You own the S5 Migration Tool track. Read Compass_GA_Roadmap.md,
.compass-build/STATE.md, and S5_Migration_Tool_Design_Spec.md fully before acting.
Log all progress to .compass-build/log/s5-migration.md.

Your gate is S1 (meta.ts) + S2/S3 (Storybook + package) — NOT S4. Start now.

BUILD NOW (no deps): Part A skeleton — the compass-migrate skill's preflight,
strangler-fig orchestration, and .migration/ report format; plus the Part C
"Migrate" UI shell as an isolated component (upload/URL entry, batch view, dual
preview panes) not yet wired into Storybook.

DESIGN NOW, BUILD AFTER S1: Part B resolution (component matching against meta.ts,
token remap, gap list) with the confidence rubric. Write the design to your log;
do not implement until STATE.md shows S1 exit criteria met.

INTEGRATE AFTER S2/S3: wire the Migrate UI into Storybook (S2); ship as
`compass migrate` via the CLI (S3).

HARD RULES:
- Presentation layer only — never touch logic, data, routing, or state.
- Low-confidence mappings and unclustered tokens go to Nikhil for review — never
  guess a component or token mapping.
- No Compass equivalent = gap list item (feeds S6), never an invented component.
- Flag behavior deltas for QA; never silently patch them. Honest reporting:
  skipped != migrated.
- Plan-then-execute. Explain commands in plain English. Ask before anything
  irreversible.

Start by proposing your build checklist for the "build now" items and STOP.
```

# S5 Part B — Compass Resolution Design (PROPOSED)

> **Status: PROPOSED — design only. Nothing here is implemented.** Implementation
> is gated on (a) STATE.md showing S1 exit criteria met, and (b) Nikhil approving
> this document (mapping heuristics are owner-approved by roadmap standing rule #1).
> On approval, the procedures move into `.claude/skills/compass-migrate/resolution.md`
> (currently a gated stub).
>
> Field names below follow `.compass-build/design/s1/_meta-schema.proposed.ts`,
> which is itself PROPOSED — if the approved S1 schema changes, this document
> re-aligns to it, not the other way round.

---

## B1 — Inventory: role detection and component matching

### Signals, strongest first (PROPOSED weights, tunable)

Every mapping decision must ship with its evidence list — the score is
explainable or it doesn't count.

| # | Signal | Weight | Notes |
|---|--------|--------|-------|
| 1 | **Import source / golden pair** | 0.5 | If the unit imports from an identified library (per `golden-pairs.md`), the foreign component's own identity is known exactly (e.g. `@mui/material` `Dialog` -> role "modal dialog"). This is near-deterministic. |
| 2 | **ARIA/semantic evidence** | 0.2 | `role=`, aria-* props, rendered element (`<button>`, `<table>`, `<dialog>`), focus-trap presence. |
| 3 | **Props signature** | 0.15 | Prop names/shapes vs the role's canonical API (`open`/`onOpenChange` -> overlay; `value`/`onValueChange` + list children -> select/tabs; `columns`/`data` -> table). |
| 4 | **Name heuristics** | 0.1 | Component/file name tokens ("Modal", "StatCard", "Picker"). Weakest trusted signal — names lie. |
| 5 | **Usage context** | 0.05 | Where it renders (inside a form, in a nav, portal usage), children shape. Tiebreaker only. |

### Matching role -> Compass target (resolves against meta.ts)

1. Candidate set = all meta entries where `category` fits the role's altitude
   (atom/molecule/organism) — never match a role to an invented name; only
   entries in `_meta-index.ts` are candidates.
2. Score each candidate against: `purpose` + `useCases` (role fit),
   `aiHints.selectionCriteria` (positive), `aiHints.confusedWith` (apply the
   disambiguation — if the evidence can't resolve the documented confusion,
   cap confidence at 0.6), `variants` (does the foreign API's variant surface
   map?), `childComponents` (composite anatomy compatibility).
3. Confidence = weighted signal agreement on the top candidate, minus
   penalties: unresolved `confusedWith` (cap 0.6), conflicting signals (-0.2),
   foreign features with no Compass variant equivalent (-0.1 each, floor 0).

### Thresholds (PROPOSED, tunable by Nikhil)

| Confidence | Action |
|---|---|
| **>= 0.85** | Map. Still listed in the unit report with score + evidence. |
| **0.60 – 0.84** | Provisional: written to the `-compass` variant BUT the batch cannot be approved while any provisional mapping is unconfirmed — each is listed in `_needs-decision.md` with candidates + evidence. |
| **< 0.60** | Do not map. `_needs-decision.md`; the unit is FLAGGED, not migrated. |
| **No candidate >= 0.30** | Gap list (`_gap-list.md`) — "no Compass equivalent" is a finding, never a license to invent or force a lookalike. |

Rationale: confidence over coverage — flagging 20% for review beats silently
mis-mapping 5%.

## B2 — Token remap

1. **Harvest:** CSS custom properties (`:root`/`.dark`), `tailwind.config`
   `theme.extend`, raw palette utilities (`bg-blue-600`), arbitrary values
   (`p-[13px]`, `#hex`), inline styles.
2. **Cluster by usage context, not by value:** for each harvested value,
   collect where it's used (interactive-primary bg, page bg, body text, muted
   text, border, destructive actions, radius, spacing steps). A cluster =
   one usage bucket with a dominant value.
3. **Map cluster -> Compass semantic token** (`primary`, `background`,
   `foreground`, `muted-foreground`, `border`, `destructive`, radius/spacing
   scale...). Near-scale spacing values snap to the nearest step ONLY within
   the same tier (the generate-code skill's trivial-rounding rule) and are
   still surfaced in the report.
4. **Unclustered = needs-decision.** A value used across conflicting buckets
   (the `--brand-warm` case: warnings AND chart fills) is never guessed — it
   goes to `_needs-decision.md` with its usage census.
5. **Acceptance test:** Compass token audit over migrated files = 0 errors
   (S4's compliance audit once it ships; `scripts/token-audit.mjs` until then).

## B3 — Component swap mechanics

1. Swap order within a unit: tokens first (so diffs are readable), then
   primitives leaf-up (atoms before the composites that contain them).
2. Golden-pair survivors (team customizations) re-expressed as: Compass
   variant props where one exists -> semantic token utility classes where
   legal -> otherwise `_needs-decision.md`. Never a hardcoded value, never a
   modification to `components/ui/` primitives.
3. Behavior deltas: consult `primitiveSource` in meta + the systemic
   Radix->Base list in `golden-pairs.md`; write each delta into the unit
   report's `Behavior changes`. Never patch for parity.
4. Everything runs inside the Part A skeleton: strangler-fig `-compass`
   variants, consumer-by-consumer repointing, per-unit reports, batch
   approval gates.

## Open questions for Nikhil (approve/adjust with this doc)

1. Threshold numbers (0.85 / 0.60 / 0.30) — starting defaults, tunable per run?
2. Provisional tier (0.60–0.84): OK to pre-write the `-compass` variant before
   your confirmation (it never replaces the original until batch approval), or
   should provisionals not be written at all?
3. Token snapping: is same-tier snap-to-scale acceptable silently-in-report
   (generate-code precedent), or does every snap go to `_needs-decision.md`?

# Compass Resolution (Part B) — GATED ON S1

> **STATUS: STUB. DO NOT EXECUTE.** This procedure resolves foreign components
> and tokens against `components/ui/` metadata (`meta.ts`), which does not
> exist until stage **S1** completes. Until `.compass-build/STATE.md` shows S1
> exit criteria met AND the owner has approved the resolution design, this
> skill may preflight and plan batches ([SKILL.md](SKILL.md) Steps 0–1) but
> must **not** map any component or token.
>
> The full design (role-detection signals, meta.ts matching fields, the
> confidence rubric with numeric thresholds, token clustering, gap-list
> criteria) lives at `.compass-build/design/s5/` as **PROPOSED** and moves
> here only after owner approval.

## What this file will contain (once ungated)

1. **B1 — Inventory:** per foreign component, detect its *role* (button, card,
   modal, tabs...) from element/props signature, ARIA roles, name heuristics,
   and usage context; match role -> Compass primitive via `meta.ts`; emit a
   scored candidate record.
2. **B2 — Token remap:** parse the target's CSS vars / theme / hardcoded
   values; cluster into semantic buckets; map to Compass semantic tokens.
   Token audit 0 errors = acceptance. Unclustered values -> `_needs-decision.md`.
3. **B3 — Component swap:** replace foreign primitives with Compass imports,
   preserving structure/copy/behavior; apply surviving golden-pair
   customizations as legal token overrides; flag anything requiring a
   hardcoded value.

## Invariants that will bind the ungated version (fixed now)

- Every mapping carries a confidence score; **low confidence -> owner review,
  never a silent guess.**
- **No Compass equivalent -> `_gap-list.md`** (S6 candidate), never an invented
  or lookalike component.
- Mapping heuristics themselves are owner-approved before first use
  (roadmap standing rule #1).

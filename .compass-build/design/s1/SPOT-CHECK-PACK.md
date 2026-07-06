# S1 Spot-Check Pack — Nikhil's gate before S1 exit

**How to review:** for each component below, open its `components/ui/<name>.meta.ts`
side-by-side with its spec, and verify the two invention-prone fields:
`antiPatterns` (does each entry's `source` citation actually say that?) and
`aiHints.confusedWith` (is each disambiguation stated in the spec, not inferred?).
Every entry carries a `source:` line — an entry whose citation doesn't hold is a
FAIL; report it and I regenerate that file.

## Recommended 8 (chosen for risk coverage)

| # | Component | Why this one | Extra attention |
|---|-----------|--------------|-----------------|
| 1 | **button** | Densest meta: decision record (no loading prop), 6 variants, code-connect | Its spec's sizes/styling tables have KNOWN drift (notes #2–3) — meta follows SOURCE, spec needs fixing |
| 2 | **card** | 10 antiPatterns — highest invention surface | Spec has known anatomy drift (notes #4) |
| 3 | **checkbox** | confusedWith from the "Checkbox vs Switch vs RadioGroup" table | Spec teaches Radix-era indeterminate API (notes #1) — verify meta reflects Base UI reality |
| 4 | **dialog** | Shared spec with AlertDialog — check the split was clean | alert-dialog.meta.ts cites the same spec; no overlap/contradiction |
| 5 | **drawer** | The vaul/asChild documented exception | Exception must read as scoped to Drawer, not license for asChild elsewhere |
| 6 | **combobox** | Two-modes composition rules | Spec's chips example doesn't type-check (notes #9) — meta must not encode it |
| 7 | **sidebar** | Largest: 22 childComponents, 5 variant axes | Spot-check childComponents against sidebar.tsx exports |
| 8 | **alert** | Orchestrator-verified reference example | Baseline for what "good" looks like |

## Also rule on (full detail in spot-check-notes.md)

1. **Category assignments** (all 55, orchestrator-proposed): 18 atom / 20 molecule / 17 organism. Odd one: `direction` (renders no UI — provider utility). Add a "utility" category, or leave as atom?
2. **14 spec-drift findings** from the compile-checks (notes #1–14) — each is a PROPOSED spec edit for your approval; the checkbox-indeterminate and input.md-Form-composite ones also touch CLAUDE.md.
3. **S4's schema request:** optional `primitiveElements?: string[]` field for the C2 provenance check (additive; small backfill pass if approved).
4. **primitiveSource judgment** on button-group/item ("base-ui" via utilities vs "composite").

## What passed mechanically (no action needed)

55/55 files; `_meta-index.ts` compiles; tsc 0 errors; audit 0 errors / 34
pre-existing warnings; lint clean; name↔file↔key consistency 55/55; specced
count 33 = spec files; mapped count 10 = code-connect/ files.

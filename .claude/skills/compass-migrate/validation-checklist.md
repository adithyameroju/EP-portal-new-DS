# Golden-Pair Pre-Production Validation Checklist

> **Status: PENDING — blocked on sample repos from Nikhil.** The identification
> signals and diffing notes in [`golden-pairs.md`](golden-pairs.md) are drawn
> from these libraries' public conventions; none has been validated against a
> real repo yet. **No library may be used in a production migration until its
> row below is checked off.** This procedure is designed and ready to run the
> moment a sample repo is provided.

## Per-library validation procedure (run once per library, ~30 min)

Given one real sample repo built on the library:

1. **Identification check.** Run only Step 0.5 of [SKILL.md](SKILL.md)
   (identification) against the sample. It must identify the correct library
   from the documented signals alone — record which signals fired and which
   documented signals were absent or wrong.
2. **Origin-pinning check.** Pin the stock origin at the sample's locked
   version (per `golden-pairs.md` procedure). Confirm the origin is actually
   obtainable (CLI scaffold / documented defaults) for that version.
3. **Diff-classification check.** Golden-pair diff THREE components of
   different complexity (one atom-ish, one composite, one the team clearly
   customized). Confirm every delta classifies cleanly into
   pristine / style / structure / behavior — any delta that doesn't fit the
   taxonomy is a finding.
4. **Dry inventory.** Run B1 resolution ([resolution.md](resolution.md)) on
   those three components only. Confirm the confidence scores are honest:
   spot-check the evidence lists; verify at least one known-ambiguous case
   routes to needs-decision rather than auto-mapping.
5. **Correct the reference file.** Fix every inaccurate signal/note in
   `golden-pairs.md` (cite the sample repo as provenance), then check the row
   off below. Corrections are part of validation — an unvalidated claim never
   survives into a checked row.
6. **Record** the run: sample repo used, date, findings, corrections made —
   append to the table below.

## Validation status (append findings, never delete rows)

| Library | Sample repo | Validated | Findings / corrections |
|---|---|---|---|
| Lovable output | — awaiting from owner (HIGHEST PRIORITY: PM-handoff headline path) | ☐ | |
| Replit output | — awaiting from owner | ☐ | |
| Stock shadcn/ui | — awaiting from owner (any internal shadcn project) | ☐ | |
| MUI | — awaiting from owner | ☐ | |
| Chakra UI | — awaiting from owner | ☐ | |
| Ant Design | — awaiting from owner | ☐ | |

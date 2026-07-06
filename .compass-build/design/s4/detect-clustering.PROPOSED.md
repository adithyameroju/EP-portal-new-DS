# PROPOSED — Detect step (drift clustering; build after S1)

*S4 track design doc. Status: PROPOSED — not implemented. Runs as a Claude Code
skill invocation (scheduled or "every N builds"), packaged inside the
`compass-audit` skill (see compass-audit-skill.PROPOSED.md).*

## Inputs

- Last **N** ledger entries from `drift-log/entries/` (default N=10; configurable;
  entries with `"demo": true` are ALWAYS excluded).
- Their compliance reports from `drift-log/reports/` — joined via the report's
  `entry` field (each entry-mode report records which ledger entry it scored).
  Entries without a report are listed as "logged but never scored" (a capture-
  discipline signal in itself).

## Aggregations (mechanical, scriptable)

1. **Component hotspots** — sum `perComponent` errors/warnings across the
   window; rank by errors desc, then warnings.
2. **Rule hotspots** — sum `totals.byRule`; rank by count × severity weight.
3. **{component, rule} clusters** — count distinct BUILDS (not raw findings)
   where the pair fired: `card / C3-missing-subparts: 4 builds` is 4 pieces of
   evidence, not 4 lines in one file. Cluster threshold: **≥3 builds in the
   window** promotes a cluster to "hotspot" (start value; tune in rubric.json
   as `detect.hotspotMinBuilds`).
4. **Assumption mining** — group `assumptions[]` across entries by `category`,
   then by normalized text overlap (lowercase, stopwords stripped, ≥2 shared
   content words = same theme; the skill run may use LLM judgment to merge
   themes, but every theme must list its verbatim source assumptions).
   A recurring assumption is a spec that failed to decide something — this
   feeds Prescribe directly.

## Output

`drift-log/detect/<ISO-timestamp>__window-<N>.json` + a human-readable
markdown twin:

```json
{
  "generatedAt": "...",
  "window": { "entries": ["<entry filenames>"], "n": 10 },
  "componentHotspots": [ { "component": "card", "errors": 6, "warnings": 2, "builds": 4 } ],
  "ruleHotspots":      [ { "ruleId": "C3-missing-subparts", "count": 6, "level": "error" } ],
  "clusters": [
    { "component": "card", "ruleId": "C3-missing-subparts", "builds": 4,
      "evidence": ["<entry file>", "<entry file>", "..."] }
  ],
  "assumptionThemes": [
    { "category": "styling", "theme": "Card border treatment", "count": 4,
      "assumptions": [ { "entry": "<file>", "text": "assumed Card border stays default" } ] }
  ],
  "unscoredEntries": ["<entry file>"]
}
```

Every hotspot/cluster/theme carries `evidence` — the exact ledger entry
filenames. **No evidence array, no hotspot.** The dashboard's priority matrix
and the Prescribe step both read this file.

## Cadence

Weekly to start, relaxing to monthly as the system stabilizes (per roadmap
S4/H-i-t-L cadence). Trigger: manual (`npm run detect` wrapper or the skill),
or the orchestrator invokes it when `entries/` has grown by N since the last
detect file.

# Compass tightening plan — <YYYY-MM-DD>   [PROPOSED — nothing applied]

Source: `drift-log/detect/<detect-report>.json` · hotspot threshold ≥<N> builds ·
rule: **the loop proposes, the owner approves — no spec edit happens from this
file; approved items are applied by a human-driven edit.**

## Hotspots (approve/reject each after skill-run completion)

### P1: `<component>` / `<ruleId>` — ambiguity-tightening candidate (Case A)
- Drifted in **<n> builds** (<m> findings)
- Evidence: `drift-log/entries/<entry>.json`, `drift-log/entries/<entry>.json`, …
- Governing doc: `<spec path>`
- Existing rule lines found (verbatim):
  - L<line>: > <quoted rule text>
- **Proposed edit:**
```diff
- <current spec line>
+ <tightened spec line — drafted by the skill run, citing the evidence above>
```

### D1: `<component>` / `<ruleId>` — **NEEDS OWNER DECISION** (Case B)
- Drifted in **<n> builds** (<m> findings)
- Evidence: `drift-log/entries/<entry>.json`, …
- Governing doc searched: `<path>` — **no existing rule found on this topic.**
- The decision: <one-paragraph description of the design choice Compass has not made>
- Options (trade-offs only — no recommendation phrased as a rule):
  - (a) <option> — <trade-off>
  - (b) <option> — <trade-off>

### D2: recurring assumption [<category>] "<theme>" — spec ambiguity
- Assumed **<n> times across <k> builds**
- Evidence + verbatim assumptions listed
- Case A if an existing rule should have decided it (draft disambiguation);
  Case B if the spec is silent (owner decision, options only)

## Watching, not acting (below threshold)
- `<component>` / `<ruleId>`: <n> build(s)

## Capture-discipline gap
- `<entry>.json` logged but never scored

---
_Approval flow: monthly Claude.ai tightening session. Approved diffs applied by
a human-driven edit + audit re-run — never by the loop. Rejected items noted
here so the loop does not re-propose them verbatim._

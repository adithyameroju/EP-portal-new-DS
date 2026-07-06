# Compass tightening plan — 2026-07-06   [PROPOSED — nothing applied]

> **SAMPLE PLAN — generated from demo-mode Detect output. The evidence below is synthetic fixture data, NOT real designer drift. Do not approve anything from this file; it exists to demonstrate the pipeline shape.**

Source: `drift-log/detect/2026-07-06T21-25-42-013Z__window-10__DEMO.json` · hotspot threshold ≥3 builds ·
rule: **the loop proposes, the owner approves — no spec edit happens from this file; approved items are applied by a human-driven edit.**

## Hotspots (approve/reject each after skill-run completion)

### P1: `card` / `C3-missing-subparts` — ambiguity-tightening candidate (Case A)
- Drifted in **3 builds** (3 findings)
- Evidence: `drift-log/entries/2026-07-06T21-25-18-595Z__demo-designer__demo-c.json`, `drift-log/entries/2026-07-06T21-25-17-462Z__demo-designer__demo-b.json`, `drift-log/entries/2026-07-06T21-25-16-369Z__demo-designer__demo-a.json`
- Governing doc: `.claude/specs/components/card.md`
- Existing rule lines found (verbatim — mechanical keyword match, verify relevance):
  - L17: > CardHeader,
  - L28: > Card is a **composite component** with 7 parts. Use the sub-components —
  - L29: > do not recreate their layout manually with divs.
  - L33: > │  CardHeader                          │
- **Proposed edit:** `[DRAFT REQUIRED — the compass-audit skill run drafts the exact diff here, citing the evidence above; the scaffold never drafts rules. Owner approves or rejects.]`

### D1: recurring assumption [styling] "border card enough" — spec ambiguity
- The LLM assumed this **4 times across 4 builds** — the spec failed to decide it.
- Evidence: `drift-log/entries/2026-07-06T21-25-18-595Z__demo-designer__demo-c.json`, `drift-log/entries/2026-07-06T21-25-17-462Z__demo-designer__demo-b.json`, `drift-log/entries/2026-07-06T21-25-16-369Z__demo-designer__demo-a.json`, `drift-log/entries/2026-07-06T16-03-29-094Z__nikhil__s4-demo.json`
- Verbatim assumptions:
  - "assumed default border on Card is enough" (`2026-07-06T21-25-18-595Z__demo-designer__demo-c.json`)
  - "assumed the Card border should be default" (`2026-07-06T21-25-17-462Z__demo-designer__demo-b.json`)
  - "assumed Card border stays default" (`2026-07-06T21-25-16-369Z__demo-designer__demo-a.json`)
  - "assumed default Card border" (`2026-07-06T16-03-29-094Z__nikhil__s4-demo.json`)
- `[Skill run: if a spec rule exists that should have decided this, treat as Case A and draft the disambiguation; if the spec is silent, this is Case B — NEEDS OWNER DECISION, options only.]`

## Watching, not acting (below threshold)
- assumption [spacing] "rounded- 7px matches figma": 1 build
- assumption [spacing] "gap-4 between fields": 1 build

---
_Approval flow: this plan feeds the monthly Claude.ai tightening session. Approved diffs are applied by a human-driven edit + audit re-run — never by this tool. Rejected items should be noted here so the loop does not re-propose them verbatim._

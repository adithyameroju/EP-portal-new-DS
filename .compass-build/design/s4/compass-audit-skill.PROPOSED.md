# PROPOSED — `compass-audit` skill outline (build after S1)

*S4 track design doc. Status: PROPOSED — not implemented. This is the third
skill the Phase 4 backlog earmarked ("Compass Review Code skill"). Target
location: `.claude/skills/compass-audit/SKILL.md` — NOTE: `.claude/skills/` is
currently locked to the S5 agent's `compass-migrate/` work; creating this
folder needs orchestrator clearance at build time. The existing 3 skills are
flat files; owner ruled (S5 decisions) that new skills use FOLDERS.*

## SKILL.md structure

1. **When to use** — after any AI-assisted build (score it), on the weekly/
   monthly cadence (detect + prescribe), before opening Compass to a new
   designer cohort (baseline the health dashboard).
2. **The rubric (C1–C7)** — one section per check: what it catches, ruleIds,
   severity, and the exact command. References `scripts/audit-rubric.json` for
   weights (never restates numbers — single source of truth).
3. **Score procedure** — `npm run log` → `npm run audit:compliance -- --entry …`
   → `npm run dashboard`; how to read the score and the report JSON.
4. **Detect procedure** — when to run, how the window works, demo-entry
   exclusion, where output lands (per detect-clustering.PROPOSED.md).
5. **Prescribe procedure + the opinion firewall** — verbatim the Case A /
   Case B rules from prescribe.PROPOSED.md, including: evidence trace
   mandatory; NEEDS OWNER DECISION items never contain a recommendation
   phrased as a rule; nothing is ever auto-applied.
6. **Report + dashboard templates** — the JSON shapes (entry, report, detect,
   plan) with one worked example each.
7. **Hard rules (top of file, non-negotiable)** — the loop proposes, the owner
   approves; never auto-write a rule; never invent an opinion; token-audit
   remains the commit gate, compliance-audit is advisory.

## Companion files in the folder

- `rubric-reference.md` — plain-English explanation of every ruleId (generated
  from the check table, kept in sync manually at first).
- `templates/tightening-plan.md` — the Prescribe output skeleton.

# COMPASS_ONBOARDING.md — cold-start guide for any future session

**Stamped at tag `s3-build-complete` · 2026-07-07.** For any agent (Claude
Code on any model, any account) or human joining this project with zero
context. Follow the read-order; do not act before finishing it.

## Current state, in one line

**Always defer to `.compass-build/STATE.md` — it is the single live truth.**
(At stamping time: S0–S3 built and verified; S4/S5 machinery complete;
everything remaining is owner-gated — but do not trust this sentence over
STATE.md.)

## The cold-start read-order

| # | Read | What it gives you |
|---|---|---|
| 1 | `../Compass_GA_Roadmap.md` (parent folder of the repo) | The strategy: stages S0–S6, standing rules, tooling model, the Shareable Gate. The source of truth for WHAT and WHY. |
| 2 | `.compass-build/STATE.md` — especially the **DECISION LOG** | Where the build actually is; every owner ruling ever made (append-only — NEVER re-ask a settled decision); open gates and the owner-decision queue. |
| 3 | `COMPASS_SYSTEM.md` (repo root) | The architecture handbook: what's built, how it connects, how to run and maintain every surface, the honesty ledger of what is NOT built. |
| 4 | `CLAUDE.md` (repo root, auto-loaded) | The binding working rules for any agent touching code. |
| 5 | `.compass-build/log/*.md` (latest entries) | Per-track history: critical-path, s2-storybook, s3-package, s4-audit, s5-migration. Append-only; how past sessions handed off. |
| 6 | On demand: `.claude/specs/**`, `.claude/skills/**`, `components/ui/_meta-schema.ts` | The content layer. Specs are binding; skills are the operating procedures; the schema is the meta contract. |

## The standing rules (non-negotiable, from the roadmap + owner)

1. **Propose, then approve.** No generative output (spec text, meta content,
   SOP wording, audit tightenings, migration mappings, semver policy) ships
   without the owner's approval. PROPOSED artifacts live in
   `.compass-build/design/` until ruled on.
2. **No invented opinions.** Every rule, anti-pattern, and decision-flow
   branch must cite an existing source. If no source decides something, flag
   it "needs owner decision" — an incomplete tree with honest flags beats a
   complete tree with invented answers.
3. **Evidence, not assertion.** "Done" means a passing audit, a green
   typecheck, a rendered screen, or a proven acceptance test. Paint-level
   verification over wiring-level claims (this project once shipped a font
   that "passed everything" while silently not rendering — see the critical-path
   log, session 4).
4. **The owner is a designer, not a developer.** Plain English, explain
   commands, explain failures before fixing them.
5. **Ask before anything irreversible.** Deletions, dependency installs,
   restructures, anything outward-facing. **git push requires explicit owner
   approval — there is deliberately no remote configured.**
6. **Strategy decisions escalate.** Real choices not covered by the roadmap
   or DECISION LOG go to the owner, never decided unilaterally.

## How work happens (multi-agent protocol)

- Every sub-agent reads roadmap + STATE.md before acting and logs to
  `.compass-build/log/<track>.md` (append-only). Agents share context ONLY
  through these files.
- Agents never run git; the orchestrator commits, batch-scoped, one commit per
  logical group, and updates STATE.md at every stage transition and gate.
- Keep the baseline green at all times: `npm run audit` 0 errors ·
  `npx tsc --noEmit` clean · `npm run lint` clean. Generated artifacts must be
  excluded from audit/eslint/git (see COMPASS_SYSTEM.md §6.4).
- Approaching a session limit: checkpoint-commit everything on disk (WIP
  commits are fine and labeled), write a resume script into STATE.md's
  "Current stage" section. This pattern has survived two session deaths with
  zero work lost.

## The owner's bootstrap ritual (expected on resume)

When the owner says "continue": confirm the read-order was followed, then
report (1) current stage, (2) next uncommitted action, (3) which approvals are
already on record — and wait for his confirmation before building, unless he
has explicitly said to proceed.

## Verification quick-reference

```bash
npm install                 # .npmrc routes @acko scope to Acko Nexus
npm run audit               # commit gate — 0 errors required (34 legacy warnings OK)
npx tsc --noEmit            # must be clean
npm run lint                # must be clean
npm run audit:compliance    # behavioral score (advisory)
npm run build-storybook     # must succeed; delete storybook-static/ after
npm run build:pkg           # package build → dist/
```

Baselines and pre-existing conditions are recorded in STATE.md — never
attribute the 34 legacy warnings (or anything in the "Baseline" section) to
new work.

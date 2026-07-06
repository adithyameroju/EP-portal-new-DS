# Compass Build — Current State

> Single live source of "where the build actually is." Every agent reads this
> (plus `Compass_GA_Roadmap.md`) before acting, and the orchestrator updates it
> after every stage transition, approval, or blocker. Last updated: **2026-07-06 (session 2)**.

## Current stage
**S0 — in progress.** PLAN.md APPROVED by Nikhil (2026-07-06). Git initialized
locally on `main`; baseline commit `f771c27`, tag `baseline-2026-07-06`.
S0 checklist proposed, awaiting Nikhil's go-ahead to execute item-by-item.

## Approvals received (2026-07-06)
1. **PLAN.md approved** — proceed under it.
2. **Canonical layout decided:** `.claude/specs/` stays canonical; top-level
   `stories/` added for Storybook. This is the layout going forward.
3. **git init approved & done** — local only; no push until per-stage approval.
4. **KPI branch: do NOT reconcile.** It's a feature built on Compass, not a
   competing system version. THIS tree is canonical. Its promotion candidates
   are pulled in deliberately at S6, per roadmap.
5. **Housekeeping approved:** trivial pre-existing tsc/lint fixes may fold into
   S0 to green the baseline — each fix shown to Nikhil before applying, no
   blanket suppression.
6. **Fonts:** licensed Euclid Circular B provided as **.ttf** (10 weights, at
   `~/Desktop/euclid-circular-b/`); Nikhil to supply .woff2 before S0.2
   executes. Do not block S0.1/non-font work on this.

## Baseline (2026-07-06) — pre-existing, never attribute to this build
- `npm install`: OK (967 pkgs; `@acko/enterprise-tokens` resolved from Acko Nexus). 21 dep vulnerabilities (untouched).
- `npm run audit`: PASS — 0 errors, 34 warnings / 17 files (arbitrary values inside `components/ui/` primitives).
- `npx tsc --noEmit`: 1 pre-existing error — `app/test/page.tsx` imports missing `@/components/blocks/sign-in-test` (folder has `sign-in-test-2.tsx`).
- `npm run lint`: 5 errors / 3 warnings — setState-in-effect (`carousel.tsx:98`, `use-mobile.ts:14`), `require()` in `token-audit.js`, unescaped `'` in `sign-in-test-2.tsx`, 3 unused vars.

## Repo facts
- 55 components in `components/ui/`; 33 specs in `.claude/specs/components/`; 3 skills in `.claude/skills/`.
- Layout: **late-June shape** — `.claude/specs/`, no `stories/`, no top-level `specs/`. KPI-feature branch NOT in this snapshot.
- Specs verified Base UI-clean (full sub-agent sweep 2026-07-06): zero Radix staleness → S0.3 is verification-only.
- `app/layout.tsx` still Geist + "Create Next App" metadata (S0.2 target). Tokens come from `@acko/enterprise-tokens` package via `globals.css` imports.
- Storybook 10 configured for `../stories/**` but no stories exist.
- **No `.git`** — git init required before any commit (approval pending).

## Open approval gates (all blocking)
1. S0 execution checklist (proposed session 2, awaiting go).
2. `.woff2` versions of Euclid fonts (or Nikhil OKs using the provided .ttf / local conversion) — blocks S0.2 only.
3. Each housekeeping fix shown before applying (rolling gate during S0).

## Stage ledger
| Stage | Status | Exit criterion met | Approved |
|---|---|---|---|
| S0 | **in progress** (git init done; checklist awaiting go) | — | — |
| S1 | not started | — | — |
| S2 | not started | — | — |
| S3 | not started | — | — |
| S4 | not started | — | — |
| S5 design | not started (may begin design-only after PLAN approval) | — | — |
| S6 design | not started (may begin design-only after PLAN approval) | — | — |

## Known blockers
- Fonts are .ttf not .woff2 (S0.2 only; three resolution options offered to Nikhil).
- No Compass favicon/logo asset yet (S0.2 metadata item; asked Nikhil).

## Protocol reminder for sub-agents
Read roadmap + this file first. Log to `.compass-build/log/<track>.md`
(append-only, timestamped). Design outputs → `.compass-build/design/<track>/`,
marked PROPOSED. Nothing implements past its gate (see PLAN.md §2).

# Compass Build — Current State

> Single live source of "where the build actually is." Every agent reads this
> (plus `Compass_GA_Roadmap.md`) before acting, and the orchestrator updates it
> after every stage transition, approval, or blocker. Last updated: **2026-07-06**.

## Current stage
**Pre-S0.** Grounding + baseline complete. PLAN.md written and **awaiting
Nikhil's approval**. No repo changes made beyond creating `.compass-build/`.

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
1. PLAN.md itself.
2. Canonical layout decision (recommend `.claude/specs/` + top-level `stories/`).
3. `git init` + baseline commit.
4. Euclid Circular B `.woff2` files from Nikhil.
5. KPI-feature branch access (or explicit "proceed on this tree").

## Stage ledger
| Stage | Status | Exit criterion met | Approved |
|---|---|---|---|
| S0 | not started (blocked on gates 1–4) | — | — |
| S1 | not started | — | — |
| S2 | not started | — | — |
| S3 | not started | — | — |
| S4 | not started | — | — |
| S5 design | not started (may begin design-only after PLAN approval) | — | — |
| S6 design | not started (may begin design-only after PLAN approval) | — | — |

## Known blockers
- No git repo (gate 3). No Euclid font files (gate 4). KPI branch absent (gate 5).

## Protocol reminder for sub-agents
Read roadmap + this file first. Log to `.compass-build/log/<track>.md`
(append-only, timestamped). Design outputs → `.compass-build/design/<track>/`,
marked PROPOSED. Nothing implements past its gate (see PLAN.md §2).

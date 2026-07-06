# Compass Build — Current State

> Single live source of "where the build actually is." Every agent reads this
> (plus `Compass_GA_Roadmap.md`) before acting, and the orchestrator updates it
> after every stage transition, approval, or blocker. Last updated: **2026-07-06 (session 2)**.

## Current stage
**S0 — COMPLETE, tagged `s0-complete`, AWAITING NIKHIL'S STAGE APPROVAL before S1.**
All 11 checklist items executed 2026-07-06 (session 3). Baseline now fully green:
audit 0 errors / 34 warnings (parity), tsc 0 errors, lint 0 problems,
`next build` succeeds, Euclid Circular B verified serving at runtime.

### S0 key facts for downstream agents
- Fonts: 10 Euclid .woff2 in `app/fonts/`, loaded via one `next/font/local` call
  in `app/layout.tsx` (`variable: "--font-sans"`, display swap); serif/mono alias
  to sans in `app/globals.css`. Geist fully removed.
- **Dependency change (PROPOSED, commit 19c0c3b):** `@acko/enterprise-tokens@1.0.0`
  now resolves from Acko Nexus. The snapshot's lockfile pointed at a dead local
  yalc link — the app could not build at all before this. FE dev must confirm
  published 1.0.0 matches their latest local copy.
- token-audit script is now `scripts/token-audit.mjs` (ESM); `npm run audit`
  unchanged in behavior (0 err / 34 warn parity verified).
- `app/test/page.tsx`: Test 1 artifact (sign-in-test.tsx) is absent from the
  snapshot; page documents this instead of rendering it. Do not recreate it.
- S0.3 verified: all 33 specs Base UI-accurate (zero Radix staleness; full
  sub-agent sweep). Spec example compile-checks fold into S1's loop.

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

## Open approval gates
1. **S0 stage approval** (exit criteria met; Nikhil reviews the 7 commits + tag).
2. Rolling items for Nikhil inside that review: metadata title/description text
   (PROPOSED, commit 41f6d7c); carousel targeted eslint-disable vs real refactor;
   tokens-package repoint (FE dev to confirm Nexus 1.0.0 is current).
3. S4 track build checklist (proposed in `.compass-build/log/s4-audit.md`).
4. S5 track build checklist (proposed in `.compass-build/log/s5-migration.md`).

## Stage ledger
| Stage | Status | Exit criterion met | Approved |
|---|---|---|---|
| S0 | **complete** (tag `s0-complete`) | ✅ 2026-07-06 | ⏳ pending |
| S1 | not started (blocked on S0 approval) | — | — |
| S2 | not started | — | — |
| S3 | not started | — | — |
| S4 | kickoff done; checklist PROPOSED | — | — |
| S5 | kickoff done; checklist PROPOSED | — | — |
| S6 design | not started | — | — |

## Known blockers / open items
- No Compass favicon asset yet — favicon left as Next default (open item; owner
  will supply; never invent a logo).
- FE dev confirmation that Nexus `@acko/enterprise-tokens@1.0.0` is current.
- Port 3000 occupied by another process on Nikhil's machine; use `PORT=3010 npm run dev`.

## Protocol reminder for sub-agents
Read roadmap + this file first. Log to `.compass-build/log/<track>.md`
(append-only, timestamped). Design outputs → `.compass-build/design/<track>/`,
marked PROPOSED. Nothing implements past its gate (see PLAN.md §2).

# Compass Build — Current State

> Single live source of "where the build actually is." Every agent reads this
> (plus `Compass_GA_Roadmap.md`) before acting, and the orchestrator updates it
> after every stage transition, approval, or blocker. Last updated: **2026-07-06 (session 2)**.

## Current stage
**S0 APPROVED by Nikhil (2026-07-06) with all four rulings. S1 starting: schema
PROPOSED, generation awaits schema approval.** Post-approval font fix applied
(see below); `s0-complete` tag moved to the fix commit. Baseline fully green:
audit 0 errors / 34 warnings (parity), tsc 0 errors, lint 0 problems,
`next build` succeeds, **Euclid verified at paint level** (10 faces registered,
3 weights actually loaded in browser; screenshot taken).

### S0 rulings (Nikhil, 2026-07-06)
1. Metadata text approved as proposed.
2. Carousel: keep targeted disable; do NOT refactor stock primitives.
3. Tokens repoint approved; FE-dev confirmation of Nexus 1.0.0 due before S2
   (does not block S1).
4. sign-in-test stays missing-and-stated; favicon stays open.

### S0 key facts for downstream agents
- Fonts (FIX v2 — supersedes the localFont approach): 10 Euclid .woff2 in
  `app/fonts/`, registered via classic `@font-face` in `app/fonts.css` under the
  exact family name `"Euclid Circular B"` that the tokens package declares
  (`@theme inline` in the package compiles font values into utilities at build
  time, so runtime variable overrides are never read; and Storybook imports
  globals.css without layout.tsx, so next/font could never cover S2).
  `font-display: swap`. layout.tsx has no font code. Geist fully removed.
  **Deviation from the original single-localFont instruction — flagged; same
  intent, working mechanism. Paint-level verified.**
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
1. **Font fix v2** (@font-face instead of localFont) — flagged deviation for
   Nikhil's visual sign-off (`PORT=3010 npm run dev`).
2. **S1 meta schema** — PROPOSED at `.compass-build/design/s1/_meta-schema.proposed.ts`;
   the 55-file generation does not start until Nikhil approves it.
3. FE-dev confirmation of tokens 1.0.0 (due before S2).

## Track approvals (Nikhil, 2026-07-06)
- **S4 checklist APPROVED** + 4 decisions: audit:compliance additive (token-audit
  untouched as commit gate); commit ledger entries / gitignore generated
  reports+dashboards; rubric 100 −5err −1warn as tunable default; components/ui/
  EXCLUDED from compliance scoring. Agent resumed to build.
- **S5 checklist APPROVED** + 3 decisions: skill FOLDER
  (.claude/skills/compass-migrate/SKILL.md — existing 3 skills stay flat);
  components/blocks/migrate/ approved now; golden-pair set = stock shadcn, MUI,
  Chakra, Ant, Lovable/Replit output (characterize Lovable/Replit well — PM
  handoff is the headline path). Agent resumed to build.

## Stage ledger
| Stage | Status | Exit criterion met | Approved |
|---|---|---|---|
| S0 | **complete + APPROVED** (tag `s0-complete`) | ✅ 2026-07-06 | ✅ 2026-07-06 |
| S1 | **generation COMPLETE — 55/55 meta + index compile clean. GATE: Nikhil's spot-check** (`.compass-build/design/s1/SPOT-CHECK-PACK.md`) | mechanical ✅; owner spot-check ⏳ | ⏳ |
| S2 | not started (next after S1 approval) | — | — |
| S3 | not started | — | — |
| S4 | **build-now scope COMPLETE + verified** (compass-log, compliance-audit C1/C5/C6 parity-proven, dashboard; C2–C4/Detect/Prescribe/C7-font = PROPOSED designs, gated on S1 exit) | build-now ✅ | checklist ✅ |
| S5 | **build-now scope COMPLETE + verified** (skill folder, UI shell; Part B = PROPOSED design, gated on S1 exit + rubric ruling) | build-now ✅ | checklist ✅ |
| S6 design | not started | — | — |

## S1 facts for downstream agents (usable once Nikhil approves S1)
- `components/ui/_meta-schema.ts` (contract), 55 × `components/ui/<name>.meta.ts`,
  `components/ui/_meta-index.ts` (named exports + `componentMetaIndex` record +
  `allComponentMeta` array). 33 specced / 22 lightweight / 10 code-connect mapped.
- Every antiPattern/aiHints entry carries `source:` provenance; uncitable = omitted.
- 14 spec-drift findings from generation compile-checks are PROPOSED spec fixes
  (see `.compass-build/design/s1/spot-check-notes.md`) — specs NOT edited.
- Note: Node cannot import the index extensionless (`--experimental-strip-types`
  quirk); bundlers (Next/Storybook/Vite) and tsc resolve it fine.

## Known blockers / open items
- No Compass favicon asset yet — favicon left as Next default (open item; owner
  will supply; never invent a logo).
- FE dev confirmation that Nexus `@acko/enterprise-tokens@1.0.0` is current.
- Port 3000 occupied by another process on Nikhil's machine; use `PORT=3010 npm run dev`.

## Protocol reminder for sub-agents
Read roadmap + this file first. Log to `.compass-build/log/<track>.md`
(append-only, timestamped). Design outputs → `.compass-build/design/<track>/`,
marked PROPOSED. Nothing implements past its gate (see PLAN.md §2).

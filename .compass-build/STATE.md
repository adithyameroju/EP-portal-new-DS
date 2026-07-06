# Compass Build — Current State

> Single live source of "where the build actually is." Every agent reads this
> (plus `Compass_GA_Roadmap.md`) before acting, and the orchestrator updates it
> after every stage transition, approval, or blocker. Last updated: **2026-07-07**.

## DECISION LOG (append-only — never re-ask a settled decision)
- 2026-07-06: PLAN.md approved; execute under it.
- 2026-07-06: Canonical layout = `.claude/specs/` + top-level `stories/`.
- 2026-07-06: git init + local commits approved; NO push without per-stage approval.
- 2026-07-06: KPI branch NOT reconciled — this tree canonical; promotion candidates deferred to S6.
- 2026-07-06: S0 checklist approved (fonts from owner's .woff2 zip; favicon left as-is, never invent; metadata text proposed-first; housekeeping incl. warnings).
- 2026-07-06: Tokens repoint to Nexus 1.0.0 approved; FE-dev confirmation due before S2 (doesn't block S1).
- 2026-07-06: S0 APPROVED with rulings: metadata text ✅; carousel targeted disable, NO refactor of stock primitives; sign-in-test stays missing-and-stated; favicon open.
- 2026-07-06: Font fix v2 (@font-face under exact family name) APPROVED; paint-level font check added to S4 backlog (→ C7 design).
- 2026-07-06: S1 ComponentMeta schema APPROVED incl. primitiveSource + per-entry source provenance ("uncitable = omitted").
- 2026-07-06: S1 checklist approved — batches of 5, per-batch tsc+commit, spot-check gate on antiPatterns/confusedWith.
- 2026-07-06: S4 checklist APPROVED + 4 decisions: audit:compliance additive (token-audit stays commit gate); commit ledger entries, gitignore generated reports/dashboards; rubric 100/−5/−1 as tunable default; components/ui/ EXCLUDED from compliance scoring.
- 2026-07-06: S5 checklist APPROVED + 3 decisions: skill FOLDER (compass-migrate/SKILL.md; existing 3 skills stay flat); components/blocks/migrate/ approved; golden-pair set = stock shadcn, MUI, Chakra, Ant, Lovable/Replit (characterize Lovable/Replit deepest — PM handoff is headline path).
- 2026-07-07: **S1 spot-check APPROVED** (65/65 citations verified, pack v2).
- 2026-07-07: **EXPANDED AUTONOMY granted.** Run freely on mechanical/derivable work: S2 meta-driven doc pages, token-driven foundation pages, variant galleries, sidebar taxonomy; S4 C2/C3/C4 + Detect + Prescribe scaffolding; S5 Part B build (writing `-compass` variants is fine). Commit per logical group; keep baseline green; no push.
- 2026-07-07: STANDING GATES (non-negotiable): authored prose (SOP, do/don't wording not quoted from spec) → propose-first; new design opinions → "needs owner decision"; each STAGE EXIT (S2/S3/S4/S5) → summarize+evidence+wait; any git PUSH; S5 consumer repointing or deletion of originals; S2 Foundations page flagged UNVERIFIED until FE-dev token confirmation arrives.
- 2026-07-07: Work order: finish S1 (14 spec fixes per mechanical/semantic split), then S2. STATE.md updated at every stage and gate.
- 2026-07-07: Read-back confirmed. S5 Part B rubric: thresholds 0.85/0.60/0.30 + spacing-snap = tunable proposed defaults; provisional pre-writing granted; guardrails: log every snap, never silent, NO repointing/deletion without owner confirmation.
- 2026-07-07: 14 fixes ruled: 11 mechanical approved run-freely; input.md Form→**check Field equivalence, then REPOINT to Field** (removal only if not equivalent), same for CLAUDE.md line; card.md shadow = owner will confirm default after orchestrator reports code+Figma reality (do NOT close without him); progress/navigation-menu = REWORD specs to match actual exports, do NOT remove exports (protected ui/, breaking change).
- 2026-07-07 PROVISIONAL (auto-resolved per owner grant; owner may revisit): **Field IS the Form equivalent** — evidence: field.md:7-9 states verbatim "This repo does not have a form.tsx (react-hook-form) component. Use Field + FieldError for all form field structure"; field.tsx exports Field/FieldLabel/FieldDescription/FieldError/FieldGroup/FieldSet/FieldLegend/FieldContent/FieldTitle, covering every Form-composite role. Repoint executed in input.md + CLAUDE.md.
- 2026-07-07 PROVISIONAL (auto-resolved, mechanical): button.md icon-size prose corrected to cva truth (base size-4; sm size-3.5; xs size-3; size-5 exists nowhere in source) — spot-check note #15.
- 2026-07-07 **CARD DEFAULT: STOPPED — REAL FORK, OWNER RULING REQUIRED.** Evidence: card.tsx renders NO shadow (ring-1 ring-foreground/10 only); card.md styling table + callout + rule 4 agree ("Shadow: none", "Do NOT add shadow-sm by default"); BUT elevation.md (foundation, Figma-token-derived) says the opposite in three places — shadow/sm usage column "Cards, dropdowns resting" (line 19), elevation ladder level 2 = shadow-sm for Cards (line 71), Rule 3 "Cards default to shadow-sm. Elevated on hover: hover:shadow-md" (line 82); card.md's cheat-sheet line 249 ("default shadow-sm is preferred") sides with elevation.md. Code and recorded design intent DISAGREE → per owner constraint this is his fork: (a) code wins → edit elevation.md rule 3 + card.md line 249; (b) Figma intent wins → change card.tsx (protected primitive, visible product-wide change) + card.md table. NOT auto-resolved.

## Current stage
**S1 EXIT: MET (2026-07-07, tag `s1-complete`). S2 mechanical build IN PROGRESS
under expanded autonomy. S4/S5 meta-gated halves: UNBLOCKED — S1 exit criteria
are met; gated agents may implement against components/ui/_meta-index.ts.**
13 of 14 spec fixes applied+verified; remaining owner items: card.md shadow
(code truth reported: NO shadow, ring-1 ring-foreground/10 is the border;
awaiting owner's Figma check), button icon-prose #15, outline bg cell #16.
Baseline fully green (tsc 0, audit 0/34, lint 0).

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
1. FE-dev confirmation of tokens 1.0.0 (due before S2 Foundations is called done;
   page may be BUILT but stays flagged UNVERIFIED).
2. Owner rulings pending: card.md shadow contradiction; "internal vs exported"
   policy (progress/navigation-menu); `primitiveElements` schema addition;
   `direction` category; S5 Part B rubric thresholds (proposed defaults in use
   as tunable, pending explicit confirmation).
3. All standing gates from the 2026-07-07 DECISION LOG entry.

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
| S1 | **COMPLETE (tag `s1-complete`)** — 55/55 meta + index; spot-check approved; 13/14 spec fixes applied (card-shadow held for owner) | ✅ 2026-07-07 | ✅ 2026-07-07 |
| S2 | **in progress** — mechanical build (foundations from tokens, meta-driven component docs, taxonomy); SOP + authored prose = propose-first; Foundations UNVERIFIED until FE-dev token confirmation | — | — |
| S3 | not started | — | — |
| S4 | **gated half building** — C2/C3/C4, Detect, Prescribe (run-freely grant); C7 stays design-only; primitiveElements schema addition still an owner ruling | build-now ✅ | checklist ✅ |
| S5 | **Part B building** — resolution engine vs meta index (rubric = tunable proposed defaults; log every snap; NO repointing/deletion without owner) | build-now ✅ | checklist ✅ |
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

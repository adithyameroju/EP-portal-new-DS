# S5 Migration Tool — Track Log

> Append-only, timestamped. Track owner: S5 sub-agent (Fable 5). Gate: S1 (meta.ts)
> for Part B implementation; S2 for Storybook integration; S3 for CLI shipping.
> NOT gated on S4. Per PLAN.md §2/§3 and S5_Migration_Tool_Design_Spec.md.

---

## 2026-07-06 — Session 1: docs read, build checklist PROPOSED

**Done this session:**
- Read in full: `Compass_GA_Roadmap.md`, `.compass-build/STATE.md`,
  `.compass-build/design/S5_Migration_Tool_Design_Spec.md`, `.compass-build/PLAN.md`,
  root `CLAUDE.md`.
- Studied repo: 55 primitives in `components/ui/` (incl. `resizable`, `tabs`,
  `empty`, `skeleton`, `input-group` — useful for the Migrate UI shell); existing
  skills are **flat files** (`.claude/skills/generate-code.md` etc.), not
  `<name>/SKILL.md` directories; `components/blocks/` exists (1 test file);
  Storybook configured but zero stories; S0 running concurrently in the same tree.
- No files created/modified other than this log (per session constraints).

**Status:** checklist below is PROPOSED — nothing executes until Nikhil approves
via the orchestrator.

---

### PROPOSED build checklist — "BUILD NOW" scope only (Part A + Part C shell)

#### Part A — `compass-migrate` skill skeleton (no dependencies)

- [ ] **A1. Create the skill file** at `.claude/skills/compass-migrate.md`
      (flat file, matching the 3 existing skills — see Open Question 1; the S5
      spec says `compass-migrate/SKILL.md`, which conflicts with current layout).
      Architecture reverse-engineered from shadcn's `migrate-radix-to-base` skill
      (cited as ancestor; discipline reused, mappings discarded).
- [ ] **A2. Preflight section** (procedure text in the skill): require clean git
      tree in the *target* repo; always work on a migration branch; detect package
      manager from lockfile and use it; run the target's typecheck/build FIRST and
      record the baseline to `.migration/_baseline.md` so pre-existing failures are
      never attributed to the migration.
- [ ] **A3. Strangler-fig orchestration section**: migrate one flow/component at a
      time; write migrated version as a `-compass` variant so original + new
      coexist and the target stays buildable at every step; repoint consumers one
      at a time with a typecheck after each; only then delete original and rename
      `-compass` → original. Explicitly forbid big-bang rewrites.
- [ ] **A4. Golden-pair diffing section**: when the source library is identifiable
      (MUI/Chakra/Ant/stock shadcn), diff each component against its stock origin
      to separate team customizations from base; customizations survive the swap.
      Bespoke/unknown source → fall back to role-based resolution (Part B —
      written as a stub section explicitly marked **GATED ON S1**, no mapping
      tables, no heuristics content yet).
- [ ] **A5. `.migration/` report format** — templates embedded in the skill (the
      real `.migration/` directory is created inside the *target* repo at run
      time, never in this repo):
      - `_baseline.md` — pre-existing typecheck/build/lint state, package manager,
        detected stack, source library (if identified).
      - `<unit>.md` — one per flow/component, fixed structure:
        **Changed / Left alone / Behavior changes (→ QA) / Verify by hand**.
      - `_gap-list.md` — "no Compass equivalent" items (feeds S6); schema stub.
      - `_needs-decision.md` — low-confidence mappings + unclustered tokens queued
        for Nikhil; schema stub.
      - Rule: migration status is **derived from disk** (scan for un-migrated
        imports), never maintained as a hand-edited index.
- [ ] **A6. Hard rules embedded verbatim in the skill**: presentation layer only
      (JSX / className / imports; never hooks logic, data fetching, routing,
      state); flag behavior deltas for QA, never silently patch; honest reporting
      (skipped ≠ migrated; flagged listed as flagged); low confidence / no
      equivalent → human review / gap list, never a guess; per-batch
      plan-then-execute with owner approval.
- [ ] **A7. Scope statement in the skill**: v1 targets React + Tailwind only;
      prove end-to-end on one internal repo before widening.

#### Part C — "Migrate" UI shell (isolated component, NOT wired into Storybook)

- [ ] **C1. Location** `components/blocks/migrate/` (blocks = Acko compositions
      per CLAUDE.md; NOT `components/ui/`, which is gated). Kebab-case files.
      *Sequencing note:* S0 is concurrently editing this tree — I will only start
      C1 when the orchestrator confirms no S0 collision (see Open Question 2).
- [ ] **C2. `migrate-entry.tsx`** — entry pane: GitHub URL input OR zip upload
      dropzone (Compass `input`, `input-group`, `button`, `card`, `empty`).
      Pure presentation: props + callbacks, static/mock state, **no network, no
      unzip, no execution logic**.
- [ ] **C3. `migrate-batch-list.tsx`** — batch breakdown view: batches by
      route/flow with status (pending / in review / approved / flagged / skipped),
      per-batch confidence summary and gap-list count (Compass `card`, `badge`,
      `table` or `item`, `progress`). Mock data via props.
- [ ] **C4. `migrate-preview.tsx`** — dual preview panes: original vs Compass
      side-by-side (Compass `resizable` split, `tabs` for look/report toggle,
      `skeleton` loading states, `separator`). Panes accept arbitrary children /
      mock frames; no live rendering of foreign code in this shell.
- [ ] **C5. `migrate-report.tsx`** — per-batch report view rendering the A5
      structure (Changed / Left alone / Behavior changes / Verify by hand) +
      gap-list and needs-decision sections, with approve / flag actions as
      callback props (no state management beyond local UI state).
- [ ] **C6. `index.ts`** barrel for the block + a `mock-data.ts` with one
      realistic sample migration (clearly marked SAMPLE).
- [ ] **C7. Compliance pass**: tokens-only styling (semantic classes, no hex, no
      arbitrary values), composite sub-components used correctly, lucide icons
      only, `npm run audit` 0 errors, `npx tsc --noEmit` no new errors vs
      baseline, no `data-figma-*` attrs. Not imported by any route or story yet.

#### Bookkeeping (every session)

- [ ] **D1.** Append timestamped entry to this log after each work session.
- [ ] **D2.** Commit(s) via orchestrator convention `S5.<task>: <what> [PROPOSED]`
      — I will not run git myself unless the orchestrator delegates it.

---

### DESIGN NOW / BUILD AFTER S1 (for visibility — not in this checklist's scope)

Part B resolution design (inventory role-detection signals, meta.ts matching
fields, confidence rubric with numeric thresholds, token clustering method, gap
list + needs-decision schemas) will be written to this log as PROPOSED in the
next session, after this checklist is approved. **No Part B implementation until
STATE.md shows S1 exit criteria met.** Storybook wiring waits for S2; `compass
migrate` CLI waits for S3.

---

### Open questions for Nikhil (via orchestrator)

1. **Skill file shape:** S5 spec says `.claude/skills/compass-migrate/SKILL.md`;
   the 3 existing skills are flat `.claude/skills/<name>.md`. I recommend the
   flat file to match the repo's current convention (and let a future S3 CLI
   restructure all skills at once if needed). Confirm?
2. **UI shell location/timing:** OK to create `components/blocks/migrate/` for
   the Part C shell? And should I wait for S0 to exit before touching
   `components/blocks/` (S0 is live in the same tree), or is a coordinated
   go-ahead enough?
3. **Golden-pair reference set:** for v1, which known libraries should the
   golden-pair procedure name explicitly? Proposed: stock shadcn/ui, MUI,
   Chakra, Ant (per spec) — plus Lovable/Replit default output (usually stock
   shadcn) since PM handoff is the headline use case.

**Blocked on:** Nikhil's approval of this checklist (relayed by orchestrator).
Nothing above executes until then.

---

## 2026-07-06 — Session 2: checklist APPROVED, Part A + Part C BUILT, Part B design PROPOSED

**Approvals received (via orchestrator):** full checklist A1–A7, C1–C7, with
Nikhil's three decisions: (1) skill FOLDER `.claude/skills/compass-migrate/SKILL.md`
(modular reference files will accumulate, like shadcn's migrate skill; existing
3 skills stay flat); (2) `components/blocks/migrate/` approved now; (3) golden-pair
v1 set = stock shadcn, MUI, Chakra, Ant, Lovable/Replit output — characterize
Lovable/Replit especially well (PM handoff = headline path).

**Re-read STATE.md before building:** S0 complete + approved; baseline fully
green (audit 0 err / 34 warn, tsc 0, lint 0) — hard requirement to keep it so.

### Part A — `compass-migrate` skill folder — DONE

- [x] **A1** `.claude/skills/compass-migrate/SKILL.md` created (folder form per
      ruling). Cites shadcn's `migrate-radix-to-base` as architectural ancestor.
- [x] **A2** Preflight: clean tree (git init for zip exports), migration branch,
      package-manager detection from lockfile, baseline recorded FIRST to
      `.migration/_baseline.md`, source-library identification.
- [x] **A3** Strangler-fig: `-compass` variant coexistence, consumer-by-consumer
      repointing with typecheck each, delete+rename only when green (ask first);
      big-bang explicitly forbidden.
- [x] **A4** Golden-pair diffing -> `golden-pairs.md`: procedure (pin origin,
      diff, classify pristine/style/structure/behavior) + identification signals
      for all 5 approved libraries. Lovable/Replit given the deepest treatment:
      stack shape, dep telltales, HSL-var token pattern, Radix-era shadcn basis,
      and the systemic Radix->Base behavior deltas to report per unit. Bespoke/
      unknown -> role-based resolution fallback (gated stub).
- [x] **A5** `report-templates.md`: `_baseline.md`, `<unit>.md` (fixed 4-section
      structure, mandatory even when empty), `_gap-list.md`, `_needs-decision.md`,
      `_summary.md`; status always derived from disk. `.migration/` is created
      in the TARGET repo only.
- [x] **A6** Hard rules embedded in SKILL.md, priority-ordered (presentation
      only; never guess; gap != invention; flag-don't-patch; honest reporting;
      plan-then-execute per batch).
- [x] **A7** Scope statement: React + Tailwind v1, prove on one internal repo.
- [x] `resolution.md` created as a GATED-ON-S1 stub — invariants fixed, zero
      mapping content.

### Part C — `components/blocks/migrate/` UI shell — DONE

- [x] **C1** `components/blocks/migrate/` created; all files kebab-case.
- [x] **C2** `migrate-entry.tsx` — Tabs (GitHub URL via InputGroup / zip via
      Empty dropzone); callbacks only, zero network/unzip/exec logic.
      Note: lucide-react no longer ships brand icons — used `FolderGit2`, not
      `Github` (caught by tsc).
- [x] **C3** `migrate-batch-list.tsx` — ItemGroup of batches with status badges
      (approved/in-review/flagged/pending/skipped), per-batch confidence, gap +
      needs-decision counts, overall Progress; `onSelectBatch` callback.
- [x] **C4** `migrate-preview.tsx` — ResizablePanelGroup dual panes
      (Original | Compass), ScrollArea content, Skeleton placeholders; panes
      take arbitrary children — never renders foreign code itself.
- [x] **C5** `migrate-report.tsx` — fixed 4 sections (empty renders "None"),
      gap list, needs-decision queue (Alert per item), Approve/Flag callbacks;
      Approve disabled while decisions are pending.
- [x] **C6** `index.ts` barrel + `types.ts` + `mock-data.ts` (fictitious
      Lovable-export sample, clearly marked SAMPLE; not an approved heuristic).
- [x] **C7** Compliance verified (see below). Not imported by any route or story.

### Part B design — PROPOSED (design only, per gate)

- [x] `.compass-build/design/s5/resolution-design.PROPOSED.md`: signal weights
      (import-source 0.5 / ARIA 0.2 / props 0.15 / name 0.1 / context 0.05),
      confidence thresholds (>=0.85 map / 0.60–0.84 provisional+review / <0.60
      flagged / <0.30 gap list), confusedWith cap at 0.6, token clustering by
      usage-context with unclustered -> needs-decision, swap mechanics.
      Aligned to the (itself PROPOSED) S1 meta schema. **No implementation.**
      3 open questions for Nikhil inside the doc.

### Verification (all commands run at repo root)

- `npm run audit` -> **0 errors**, 34 warnings (exact baseline parity; the 34
  are pre-existing in `components/ui/` primitives).
  During build the audit caught 2 errors in `mock-data.ts` — sample *strings*
  contained literal hex values; reworded to descriptions. Working as intended.
- `npx tsc --noEmit` -> **exit 0, no errors**.
- `npm run lint` -> **clean, no problems**.

### Flags for Nikhil

1. **Part B thresholds + 3 open questions** in
   `.compass-build/design/s5/resolution-design.PROPOSED.md` need his ruling
   before Part B can be built (in addition to the S1 gate).
2. **golden-pairs.md honesty note:** library identification signals are from
   public conventions; each must be validated against one real sample repo
   before first production use — stated in the file itself.
3. **Approve button UX opinion embedded in shell:** `migrate-report.tsx`
   disables batch approval while needs-decision items are pending — my
   inference from the hard rules, flag if unwanted.

**Not done / out of scope, correctly:** no Storybook wiring (S2), no CLI (S3),
no mapping engine (S1 gate), no git commands (orchestrator owns commits), no
touches to scripts/, package.json, .gitignore, or components/ui/.

---

## 2026-07-06 — Session 3: post-crash integrity verification (usage-limit kill)

Session was killed by the account usage limit; orchestrator checkpoint-committed
and resumed. Verified everything on disk rather than trusting session memory:

**Completeness check — PASS, nothing truncated or missing:**
- `.claude/skills/compass-migrate/` — all 4 files intact with correct endings:
  SKILL.md (150 lines, all 8 sections incl. reference-file table),
  golden-pairs.md (157 lines; Lovable/Replit characterization present and
  deepest of the 5 libraries), report-templates.md (126 lines, all 5
  templates), resolution.md (36 lines, gated stub intact).
- `components/blocks/migrate/` — all 7 files intact, every module closes with
  its export statement (entry 126, batch-list 140, preview 106, report 195,
  types 66, mock-data 113, index 21 lines).
- `.compass-build/design/s5/resolution-design.PROPOSED.md` — complete (B1/B2/B3
  + 3 open questions for Nikhil; ends cleanly).
- Session-2 log entry — present and complete.
- A1–A7 and C1–C7 each re-confirmed against the approved checklist: all present
  as approved (skill FOLDER form, blocks location, 5-library golden-pair set).

**Verification on the CURRENT tree** (now includes 29 in-progress
`components/ui/*.meta.ts` from the parallel S1 run — not touched by this track):
- `npm run audit` -> PASS, **0 errors** / 34 warnings (baseline parity).
- `npx tsc --noEmit` -> **exit 0**.
- `npm run lint` -> **exit 0, clean**.

**No new work was needed**: the crash happened after all session-2 deliverables
(including the Part B design doc and log entry) had already been written. No
files re-created; no re-writes.

**Flags for Nikhil — unchanged from session 2:** (1) Part B rubric + 3 open
questions in resolution-design.PROPOSED.md need his ruling (in addition to the
S1 gate); (2) golden-pair identification signals must be validated on one real
sample repo per library before first production use; (3) migrate-report.tsx
disables batch approval while needs-decision items are pending (embedded UX
inference — removable if unwanted).

**Track state:** BUILD-NOW scope complete and verified. Idle until S1 exit +
Part B design approval; then implement resolution.md, then S2 Storybook wiring,
then S3 CLI.

---

## 2026-07-07 — Session 4: Part B resolution engine BUILT (S1 exit met, run-freely autonomy)

**Gate verified before building:** STATE.md shows S1 COMPLETE (tag `s1-complete`,
55/55 meta + `_meta-index.ts`, spot-check approved 2026-07-07). Owner rulings on
my 3 open questions read from coordinator message + STATE.md decision log.

### Built

- [x] **`resolution-config.json`** (new, in skill folder) — owner-tunable
      weights/caps/thresholds/snap policy, mirroring `scripts/audit-rubric.json`
      ($comment-documented, edit-without-code-change). Contains a `guardrails`
      block explicitly marked NOT tunable (standing rulings: log every snap,
      provisional pre-write allowed, repointing/deletion require owner
      confirmation, needs-decision/gap routes).
- [x] **`resolution.md`** — gated stub REPLACED with the full ACTIVE procedure:
      B1 role detection (5 signals, config weights) → candidate scoring against
      the real meta fields (`purpose`/`useCases` disqualifiers,
      `aiHints.selectionCriteria` confirm/deny, MANDATORY `confusedWith`
      resolution with cap, `variants` surface mapping, `childComponents`
      anatomy, `primitiveSource` for behavior deltas) → threshold routing →
      `.migration/_inventory.json` records with evidence lists. B2 token remap
      (usage-context clustering, meta `tokens` cross-check, same-tier snapping
      with EVERY snap logged, unclustered → needs-decision, audit-0-errors
      acceptance). B3 swap (tokens first, leaf-up, compositionRules verbatim,
      re-expression ladder, STOP BOUNDARY).
      **New rubric rule added:** lightweight-meta cap — 21 of 55 metas are
      types-only (empty selectionCriteria); a types-only top candidate caps at
      0.84 (provisional at best, never auto-map) because no spec-backed
      confirmation exists.
- [x] **`SKILL.md` updated:** Part B marked ACTIVE; Step 1.3 un-gated (scores
      against `_meta-index.ts` + config); Step 2 restructured around the
      owner-confirmation boundary (unattended runs stop at `-compass` variants
      + reports; repointing/deletion only after batch confirmation); new hard
      rule 7 (stop boundary + never-silent snaps); reference table updated
      (+config, +validation-checklist).
- [x] **`report-templates.md`:** added `_snap-log.md` template (every snapped
      value, token or spacing; same-tier only; also mirrored in unit reports).
- [x] **`validation-checklist.md`** (new) — golden-pair pre-production
      validation procedure (6 steps: identification check, origin pinning,
      3-component diff classification, dry inventory with one known-ambiguous
      case, reference-file correction, recording) + per-library status table.
      **BLOCKED on sample repos from Nikhil; Lovable sample = highest priority.**
- [x] golden-pairs.md: unchanged (integration needed no edits; its validation
      note now points to a concrete checklist via SKILL.md table).

### Owner rulings — where each is encoded

1. Tunable defaults → `resolution-config.json` (thresholds 0.85/0.60/0.30,
   snap policy), cited at run start in `_baseline.md`.
2. Provisional pre-write allowed → resolution.md B1 Step 3 + SKILL.md Step 2.2.
3. Guardrails → SKILL.md hard rule 7 + Step 2.4 STOP; resolution.md B2.4/B3.5;
   config `guardrails` block (non-tunable) so engine output can cite them.

### Verified — dry-run: 5 hypothetical foreign components vs the REAL meta index

Procedure executed by hand against live meta entries (dialog, radio-group,
toggle-group, card, item, progress, tabs, alert-dialog, sheet):

| # | Foreign component | Evidence highlights | Top candidate (runner-up) | Score | Route |
|---|---|---|---|---|---|
| 1 | MUI `<Dialog>` (edit-profile form, closes on backdrop) | import identity 0.5; role=dialog; open/onClose; confusedWith(alert-dialog) RESOLVED — backdrop-click closes; −0.1 fullScreen/maxWidth unmappable | dialog (sheet 0.35, purpose conflict) | **0.90** | **MAP** |
| 2 | Lovable bespoke `PlanPicker.tsx` (divs+onClick, one-of-3 plans, no ARIA) | bespoke → weights renormalized; NO ARIA on interactive control = disagreeing evidence; props value/onChange agree | radio-group, specced (toggle-group 0.38 — types-only, view-control purpose) | **0.60** | **PROVISIONAL** — pre-write allowed, batch blocks until Nikhil confirms |
| 3 | Bespoke `StatCard.tsx` (heading + KPI + delta on elevated surface, dashboard grid) | static grouped content; anatomy fits CardHeader/Title/Content; card antiPatterns consulted (bg-card not bg-background); −0.1 custom shadow (documented: card has no default shadow) → shadow to token remap/decision | card (item 0.45 — list-row primitive, grid context resolves) | **0.90** | **MAP** |
| 4 | Bespoke `UsageMeter.tsx` (3-segment quota meter, threshold colors) | props segments[]/thresholds[] DISAGREE with progress value:number; compositionRules: single auto Track/Indicator can't express segments; 3 core capabilities missing | progress 0.20 — no candidate ≥ 0.30 | 0.20 | **GAP LIST** (S6; disposition: new molecule or compose-from-progress) |
| 5 | Chakra `<Tabs>` (in-page switcher, role=tablist, URL unchanged) | all 5 signals agree; tabs purpose disqualifier ("never page navigation") checked and PASSED; −0.1 Chakra variant surface | tabs (navigation-menu rejected via confusedWith) | **0.90** | **MAP** + Behavior changes: Base UI activation model vs Chakra manual/auto activation |

Token spot-case: `--brand-warm` in warning banners AND chart fills →
conflicting usage buckets → unclustered → `_needs-decision.md` (config route).

**Dry-run finding folded back into the engine:** with a bespoke source the
importSource signal bears no evidence, which artificially capped every bespoke
score at 0.50. Added weight RENORMALIZATION over evidence-bearing signals
(absence of expected evidence, e.g. no ARIA on an interactive control, still
counts as disagreement, not absence). Encoded in resolution.md B1 Step 2 and
flagged for Nikhil below.

### Verification (baseline green)

- `resolution-config.json` parses as valid JSON.
- `npm run audit` → **0 errors**; 37 warnings = 34 pre-existing in
  `components/ui/` + 3 in `stories/foundations/TypographyBlocks.tsx` (parallel
  S2 agent's in-flight file — NOT this track's; zero warnings in any S5 file).
- `npx tsc --noEmit` → **exit 0**.
- `npm run lint` → **clean, exit 0** (one earlier run during the session showed
  5 transient warnings that disappeared on re-run — parallel S2 edits moving
  under the linter; final state clean).
- Constraint compliance: no writes to `_meta-schema.ts`, `*.meta.ts`,
  `components/ui/`, `scripts/`, `package.json`; no git.

### Flags for Nikhil

1. **Renormalization rule** (dry-run-driven addition to the rubric, encoded in
   resolution.md): without it, bespoke components could never exceed 0.50.
   Sensible default; please confirm or tune.
2. **Lightweight-meta cap 0.84** (`caps.lightweightMeta`): 21/55 metas are
   types-only — any mapping onto those is provisional at best until their meta
   is enriched (S6 demand-driven). Tunable in config.
3. **Validation checklist is designed but BLOCKED on sample repos** — one per
   library; the Lovable sample is highest priority (PM-handoff headline path).
   Production migrations must not run on an unvalidated library.
4. Case 2 (PlanPicker, 0.60) landing exactly on the provisional threshold is a
   feature, not luck: boundary cases go to him either way.

**Track state:** Part A + B + C-shell complete. Next gates: S2 (wire Migrate UI
into Storybook — S2 is in progress now), S3 (`compass migrate` CLI).
